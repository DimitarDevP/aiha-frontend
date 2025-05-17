import { useHistory } from "react-router-dom";

const cards = [
  {
    title: "Be Aware",
    image: "/src/assets/images/be-aware.png",
    route: "/Be-Aware",
  },
  {
    title: "Chat with AI",
    image: "/src/assets/images/aiha.png",
    route: "/Chat",
  },
  {
    title: "My Profile",
    image: "",
    route: "/monitoring",
  },
  {
    title: "Something",
    image: "",
    route: "/something",
  },
];

const Home: React.FC = () => {
  const history = useHistory();

  const handleCardClick = (route: string) => {
    history.push(route);
  };

  return (
    <main className="flex flex-col items-center py-16 px-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => handleCardClick(card.route)}
            className="cursor-pointer rounded-2xl shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow w-[420px]"
          >
            <img
              src={card.image || `https://via.placeholder.com/400x300?text=${card.title}`}
              alt={card.title}
              className="w-full h-[280px] object-cover rounded-xl mb-6"
            />
            <h2 className="text-2xl font-semibold text-center">{card.title}</h2>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
