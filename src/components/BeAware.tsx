import React from 'react';

const BeAware: React.FC = () => {
  // Placeholder data – replace with real data from an API if needed
  const pollution = "Moderate (PM2.5 at 62 µg/m³)";
  const heatWarning = "High temperatures expected above 35°C.";
  const severeWeather = "Thunderstorm watch in effect from 3PM to 9PM.";

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Be Aware</h1>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
        <h2 className="font-semibold">Air Pollution</h2>
        <p>{pollution}</p>
      </div>

      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <h2 className="font-semibold">Heat Warning</h2>
        <p>{heatWarning}</p>
      </div>

      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
        <h2 className="font-semibold">Severe Weather</h2>
        <p>{severeWeather}</p>
      </div>
    </div>
  );
};

export default BeAware;
