import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useSelector } from 'react-redux';
import Chatbot from './components/Chatbot/Chatbot';
import Vault from './components/Vault/Vault';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './app.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import Wrapper from './components/Wrapper';
import UserInfo from './components/User/UserInfo';
import BeAware from './components/BeAware/BeAware';
import Home from './components/Home/Home';
import NewsCard from './components/NewsCard/NewsCard';
import About from './components/About/About';

// Define RootState type
interface RootState {
  userAuth: {
    isAuthenticated: boolean;
  };
}

setupIonicReact();

const App: React.FC = () => {
  // Get authentication status from Redux store
  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
          {/* Tabs */}
          <Route
            exact
            path="/Home"
            render={() => (
              <Wrapper>
                  <Home />
              </Wrapper>
            )}
          />
          <Route
            exact
            path="/Be-Aware"
            render={() => (
              <Wrapper>
                  <BeAware />
              </Wrapper>
            )}
          />
          <Route
            exact
            path="/Chat"
            render={() => (
              <Wrapper>
                <Chatbot />
              </Wrapper>
            )}
          />
          <Route
            exact
            path="/Profile"
            render={() => (
              <Wrapper>
                  <UserInfo />
              </Wrapper>
            )}
          />
          <Route
            exact
            path="/NewsCard"
            render={() => (
              <Wrapper>
                  <NewsCard />
              </Wrapper>
            )}
          />
          <Route
            exact
            path="/Vault"
            render={() => (
              <Wrapper>
                <Vault />
              </Wrapper>
              )}
            />
            <Route
            exact
            path="/about"
            render={() => (
              <Wrapper>
                <About />
              </Wrapper>
            )}
          />
            {/* Auth routes with redirect when authenticated */}
              <Route
                exact
                path="/login"
                render={() =>
                  isAuthenticated ? (
                    <Redirect to="/Home" />
                  ) : (
                    <Wrapper>
                      <Login />
                    </Wrapper>
                  )
                }
              />
              <Route
                exact
                path="/register"
                render={() =>
                  isAuthenticated ? (
                    <Redirect to="/Home" />
                  ) : (
                    <Wrapper>
                      <Register />
                    </Wrapper>
                  )
                }
              />

              {/* Redirect root to Home */}
              <Route exact path="/" render={() => <Redirect to="/Home" />} />

              {/* Catch-all route for non-existent paths */}
              <Route render={() => <Redirect to="/Home" />} />
            </Switch>
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;