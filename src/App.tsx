import { Redirect, Route } from 'react-router-dom';
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
import Tab2 from './pages/Tab2';
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
                  <Tab2 />
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
            {/* Redirect root to tab1 */}
            <Route exact path="/" render={() => <Redirect to="/Home" />} />
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;