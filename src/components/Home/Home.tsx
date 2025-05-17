import { useHistory } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { alertCircleOutline, chatbubbleOutline, personOutline, newspaperOutline, lockClosedOutline } from 'ionicons/icons';

const cards = [
  {
    title: "Be Aware",
    icon: alertCircleOutline,
    color: "bg-amber-100 text-amber-600",
    text: "Get important health alerts and warnings for your local area",
    route: "/Be-Aware",
  },
  {
    title: "AIHA",
    icon: chatbubbleOutline,
    color: "bg-purple-100 text-purple-600",
    text: "Get personalized health advice from our AI assistant",
    route: "/Chat",
  },
  {
    title: "My Profile",
    icon: personOutline,
    color: "bg-teal-100 text-teal-600",
    text: "Manage your personal information and settings",
    route: "/Profile",
  },
  {
    title: "News",
    icon: newspaperOutline,
    color: "bg-blue-100 text-blue-600",
    text: "Get the latest health news and updates",
    route: "/NewsCard",
  },
  {
    title: "User Vault",
    icon: lockClosedOutline,
    color: "bg-indigo-100 text-indigo-600",
    text: "Securely store your personal health records",
    route: "/Vault",
  },
];

const Home: React.FC = () => {
  const history = useHistory();

  const handleCardClick = (route: string) => {
    history.push(route);
  };

  return (
    <main className="flex flex-col items-center py-4 md:py-6 px-4 w-full bg-indigo-50 min-h-screen">
      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => handleCardClick(card.route)}
            className="cursor-pointer rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden border border-indigo-100 hover:border-indigo-200"
          >
            {/* Icon with colored background */}
            <div className={`w-full flex items-center justify-center p-4 ${card.color}`}>
              <IonIcon icon={card.icon} className="text-3xl" />
            </div>
            
            {/* Content area */}
            <div className="p-3 md:p-4 flex flex-col items-center text-center">
              <h2 className="text-sm md:text-base font-semibold mb-1 text-indigo-900">{card.title}</h2>
              <p className="text-xs text-indigo-600 line-clamp-2">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;