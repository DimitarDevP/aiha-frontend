import React, { useState } from 'react';

type WarningType = 'pollution' | 'heat' | 'weather';

interface WarningDetails {
  title: string;
  summary: string;
  details: string;
  recommendations: string[];
  color: string;
}

const BeAware: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<WarningType | null>(null);

  // Warning data with detailed information
  const warningData: Record<WarningType, WarningDetails> = {
    pollution: {
      title: "Air Pollution",
      summary: "Moderate (PM2.5 at 62 µg/m³)",
      details: "Current air quality index shows moderate pollution levels. Particulate matter (PM2.5) concentration is at 62 µg/m³, which exceeds the WHO recommended daily limit of 25 µg/m³.",
      recommendations: [
        "Consider limiting outdoor activities if you have respiratory conditions",
        "Keep windows closed during peak traffic hours",
        "Use air purifiers indoors if available"
      ],
      color: "yellow"
    },
    heat: {
      title: "Heat Warning",
      summary: "High temperatures expected above 35°C.",
      details: "A heat wave is affecting the region with temperatures expected to reach above 35°C (95°F) during the next 48 hours. This poses a significant risk of heat-related illnesses.",
      recommendations: [
        "Stay hydrated by drinking plenty of water",
        "Avoid outdoor activities during peak heat hours (11am-3pm)",
        "Use fans or air conditioning if available",
        "Check on elderly neighbors and vulnerable people"
      ],
      color: "red"
    },
    weather: {
      title: "Severe Weather",
      summary: "Thunderstorm watch in effect from 3PM to 9PM.",
      details: "The National Weather Service has issued a thunderstorm watch for your area. Strong winds, heavy rain, and lightning are possible during this period. There is a moderate risk of flash flooding in low-lying areas.",
      recommendations: [
        "Secure outdoor furniture and items that could be blown away",
        "Avoid driving through flooded areas",
        "Stay indoors and away from windows during the storm",
        "Have emergency supplies ready in case of power outages"
      ],
      color: "blue"
    }
  };

  const handleCardClick = (type: WarningType) => {
    setSelectedWarning(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWarning(null);
  };

  const renderModal = () => {
    if (!isModalOpen || !selectedWarning) return null;

    const warning = warningData[selectedWarning];
    
    // Get the appropriate background and border classes based on warning type
    let modalClasses = {
      bgColor: 'bg-white', // default fallback
      borderColor: 'border-gray-500', // default fallback
      buttonBg: 'bg-gray-500',
      buttonHover: 'hover:bg-gray-600'
    };
    
    if (selectedWarning === 'pollution') {
      modalClasses = {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        buttonBg: 'bg-yellow-500',
        buttonHover: 'hover:bg-yellow-600'
      };
    } else if (selectedWarning === 'heat') {
      modalClasses = {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        buttonBg: 'bg-red-500',
        buttonHover: 'hover:bg-red-600'
      };
    } else if (selectedWarning === 'weather') {
      modalClasses = {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        buttonBg: 'bg-blue-500',
        buttonHover: 'hover:bg-blue-600'
      };
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`max-w-lg w-full ${modalClasses.bgColor} border ${modalClasses.borderColor} rounded-lg shadow-lg`}>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{warning.title}</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mt-2 font-semibold">{warning.summary}</p>
            <p className="mt-4">{warning.details}</p>
            
            <div className="mt-4">
              <h3 className="font-semibold">Recommendations:</h3>
              <ul className="list-disc pl-5 mt-2">
                {warning.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={closeModal}
                className={`${modalClasses.buttonBg} ${modalClasses.buttonHover} text-white px-4 py-2 rounded`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Be Aware</h1>

      <div 
        className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded cursor-pointer hover:bg-yellow-200 transition-colors"
        onClick={() => handleCardClick('pollution')}
      >
        <h2 className="font-semibold">Air Pollution</h2>
        <p>{warningData.pollution.summary}</p>
        <p className="text-sm text-gray-500 mt-1">Click for more information</p>
      </div>

      <div 
        className="bg-red-100 border-l-4 border-red-500 p-4 rounded cursor-pointer hover:bg-red-200 transition-colors"
        onClick={() => handleCardClick('heat')}
      >
        <h2 className="font-semibold">Heat Warning</h2>
        <p>{warningData.heat.summary}</p>
        <p className="text-sm text-gray-500 mt-1">Click for more information</p>
      </div>

      <div 
        className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded cursor-pointer hover:bg-blue-200 transition-colors"
        onClick={() => handleCardClick('weather')}
      >
        <h2 className="font-semibold">Severe Weather</h2>
        <p>{warningData.weather.summary}</p>
        <p className="text-sm text-gray-500 mt-1">Click for more information</p>
      </div>

      {renderModal()}
    </div>
  );
};

export default BeAware;
