import React from 'react';
import { IonIcon } from '@ionic/react';
import { 
  timeOutline, 
  chevronForwardOutline, 
  newspaperOutline,
  informationCircleOutline
} from 'ionicons/icons';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  imageUrl?: string;
  date: string;
  category?: string;
}

const NewsCard: React.FC = () => {
  // Sample news data
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Health Advisory: Seasonal Flu',
      summary: 'Health officials are warning of an early flu season. Vaccination rates are lower than expected, raising concerns about increased risk of transmission. Get your flu shot today at any local pharmacy or clinic.',
      imageUrl: '',
      date: 'May 15, 2023',
      category: 'Advisory'
    },
    {
      id: 2,
      title: 'New Clinic Opening',
      summary: 'A new community health center will open downtown next month. The facility will offer primary care, preventive services, and specialized treatment options for residents in the area.',
      imageUrl: '',
      date: 'May 10, 2023',
      category: 'Community'
    },
    {
      id: 3,
      title: 'COVID-19 Update',
      summary: 'Latest guidelines for COVID-19 prevention and treatment have been released. Health officials recommend staying updated with boosters and continuing hygiene practices during peak respiratory illness seasons.',
      imageUrl: '',
      date: 'May 5, 2023',
      category: 'Update'
    }
  ];

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'advisory':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-yellow-500',
          icon: 'bg-yellow-100 text-yellow-600',
          hover: 'hover:shadow-yellow-200'
        };
      case 'update':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-700',
          badge: 'bg-blue-500',
          icon: 'bg-blue-100 text-blue-600',
          hover: 'hover:shadow-blue-200'
        };
      case 'alert':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-red-100',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-500',
          icon: 'bg-red-100 text-red-600',
          hover: 'hover:shadow-red-200'
        };
      case 'community':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-green-100',
          border: 'border-green-200',
          text: 'text-green-700',
          badge: 'bg-green-500',
          icon: 'bg-green-100 text-green-600',
          hover: 'hover:shadow-green-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
          border: 'border-indigo-200',
          text: 'text-indigo-700',
          badge: 'bg-indigo-500',
          icon: 'bg-indigo-100 text-indigo-600',
          hover: 'hover:shadow-indigo-200'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">Health News</h1>
          </div>
          
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md border border-indigo-100">
            <select 
              className="bg-transparent border-none text-indigo-700 font-medium focus:outline-none pr-8"
              defaultValue="all"
            >
              <option value="all">All News</option>
              <option value="advisory">Advisories</option>
              <option value="update">Updates</option>
              <option value="community">Community</option>
              <option value="alert">Alerts</option>
            </select>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start space-x-3">
          <div className="text-indigo-600 mt-1">
            <IonIcon icon={informationCircleOutline} className="text-xl" />
          </div>
          <div>
            <p className="text-indigo-800">
              Stay updated with the latest health news, community resources, and important updates. 
              Tap on any article for more details and related information.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {newsItems.map((item) => {
          const colors = getCategoryColor(item.category);
          
          return (
            <div 
              key={item.id}
              className={`${colors.bg} border ${colors.border} p-5 rounded-xl shadow-md cursor-pointer hover:shadow-lg ${colors.hover} transition-all duration-300 transform hover:scale-[1.01] flex items-start`}
            >
              <div className={`${colors.icon} p-3 rounded-full mr-4 flex-shrink-0`}>
                <IonIcon icon={newspaperOutline} className="text-xl" />
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {item.category && (
                    <span className={`${colors.badge} text-white text-xs font-medium py-1 px-2 rounded-full`}>
                      {item.category}
                    </span>
                  )}
                  
                  <span className="flex items-center text-xs text-gray-500">
                    <IonIcon icon={timeOutline} className="mr-1" />
                    {item.date}
                  </span>
                </div>
                
                <h2 className={`font-bold text-lg ${colors.text}`}>{item.title}</h2>
                <p className="text-gray-700 my-2">{item.summary}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-indigo-600 font-medium">Read full article</p>
                  <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <IonIcon icon={chevronForwardOutline} className="text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsCard;