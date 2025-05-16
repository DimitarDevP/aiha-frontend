import { IonContent, IonHeader, IonPage } from "@ionic/react";
import NavigationView from "../Navigation/NavigationView";

const Wrapper = ({ children }: any) => {
  return (
    <IonPage>
      {/* Remove IonToolbar from NavigationView */}
      <IonHeader className="z-[100000] relative">
        <NavigationView />
      </IonHeader>
      <IonContent fullscreen>
        {children}
      </IonContent>
    </IonPage>
  );
};

export default Wrapper;
