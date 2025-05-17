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
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import './app.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import Wrapper from './components/Wrapper';
import UserInfo from './components/User/UserInfo';
import BeAware from './components/BeAware';


setupIonicReact();

const App: React.FC = () => (
  
  <IonApp>
    <IonReactRouter>
      <IonTabs>
       <IonRouterOutlet>
        <Route
          exact
          path="/tab1"
          render={() => (
            <Wrapper>
              <BeAware />
              <Tab1 />
            </Wrapper>
          )}
        />

        <Route
          exact
          path="/tab2"
          render={() => (
            <Wrapper>
              <Tab2 />
            </Wrapper>
          )}
        />

        <Route
          exact
          path="/tab3"
          render={() => (
            <Wrapper>
              <UserInfo />
              <Tab3 />
            </Wrapper>
          )}
        />

    <Route exact path="/" 
    render={() => 
    <Redirect to="/tab1" />} />
  </IonRouterOutlet>

        
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
