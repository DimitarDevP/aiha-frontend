import { useHistory } from "react-router-dom";
import NewsCard from "../NewsCard/NewsCard";

const cards = [
  {
    title: "Be Aware",
    image: "/src/assets/images/be-aware.png",
    text: "Get important health alerts and warnings for your local area",
    route: "/Be-Aware",
  },
  {
    title: "AIHA",
    image: "/src/assets/images/aiha.png",
    text: "Get personalized health advice from our AI assistant",
    route: "/Chat",
  },
  {
    title: "My Profile",
    image: "/src/assets/images/my-profile.png",
    text: "Manage your personal information and settings",
    route: "/Profile",
      },
      {
        title: "User Vault",
        image: "/src/assets/images/vault.png",
        text: "Securely store and manage your personal health records",
        route: "/Vault",
  },
];

const Home: React.FC = () => {
  const history = useHistory();

  const handleCardClick = (route: string) => {
    history.push(route);
  };

  return (
    <main className="flex flex-col items-center py-4 md:py-8 px-2 md:px-4 w-full">
      {/*<h1 className="text-2xl font-bold mb-4 md:mb-6 text-center">Home</h1>*/}

      <div className="grid grid-cols-2 gap-3 md:gap-5 w-full max-w-3xl px-2 mx-auto">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => handleCardClick(card.route)}
            className="cursor-pointer rounded-lg md:rounded-xl shadow-md md:shadow-lg bg-white hover:shadow-xl transition-shadow w-full flex flex-col h-full overflow-hidden"
          >
            {/* Image at top */}
            <div className="w-full h-[120px] md:h-[140px] bg-gray-100 overflow-hidden">
              <img
                src={card.image || `https://via.placeholder.com/400x300?text=${card.title}`}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content area with title and text */}
            <div className="p-2 md:p-3 flex flex-col">
              <h2 className="text-sm md:text-base font-semibold text-center mb-1 text-indigo-700">{card.title}</h2>
              <p className="text-xs text-indigo-500 text-center line-clamp-2">{card.text}</p>
            </div>
          </div>
        ))}
        

      </div>
    </main>
  );
};

export default Home;