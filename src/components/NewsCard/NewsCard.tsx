import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonImg } from '@ionic/react';
import './NewsCard.css';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  date: string;
}

const NewsCard: React.FC = () => {
  // Sample news data
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Health Advisory: Seasonal Flu',
      summary: 'Health officials are warning of an early flu season. Get your flu shot today.',
      imageUrl: '/static/news-card1.png',
      date: 'May 15, 2023'
    },
    {
      id: 2,
      title: 'New Clinic Opening',
      summary: 'A new community health center will open downtown next month.',
      imageUrl: '/static/newscard2.jpg',
      date: 'May 10, 2023'
    },
    {
      id: 3,
      title: 'COVID-19 Update',
      summary: 'Latest guidelines for COVID-19 prevention and treatment.',
      imageUrl: '/static/newscard3.jpg',
      date: 'May 5, 2023'
    }
  ];

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Health News & Updates</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 cursor-pointer">
        {newsItems.map((item) => (
          <IonCard key={item.id} className="rounded-lg overflow-hidden shadow-md">
            <IonImg src={item.imageUrl} alt={item.title} className="h-48 object-cover" />
            <IonCardHeader>
              <IonCardTitle className="text-lg font-semibold">{item.title}</IonCardTitle>
              <p className="text-sm text-gray-500">{item.date}</p>
            </IonCardHeader>
            <IonCardContent>
              <p className="text-gray-700">{item.summary}</p>
            </IonCardContent>
          </IonCard>
        ))}
      </div>
    </main>
  );
};

export default NewsCard;