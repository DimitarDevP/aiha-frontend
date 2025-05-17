// components/WarningModal.tsx
import React from 'react';
import { WarningDetails } from '../Types/warnings';
import Heatmap from '../../Heatmap/Heatmap';

interface WarningModalProps {
  isOpen: boolean;
  warning: WarningDetails | null;
  onClose: () => void;
  allWarnings?: WarningDetails[];
}

const WarningModal: React.FC<WarningModalProps> = ({ 
  isOpen, 
  warning, 
  onClose,
  allWarnings = [] 
}) => {
  if (!warning) return null;

  const modalClasses = {
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      button: 'bg-yellow-500 hover:bg-yellow-600',
      icon: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      button: 'bg-red-500 hover:bg-red-600',
      icon: 'text-red-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600',
      icon: 'text-blue-600'
    },
    default: {
      bg: 'bg-gray-50',
      border: 'border-gray-500',
      button: 'bg-gray-500 hover:bg-gray-600',
      icon: 'text-gray-600'
    }
  };

  const colors = modalClasses[warning.color as keyof typeof modalClasses] || modalClasses.default;

  // Prepare heatmap data with enhanced weather-like distribution
  const heatmapPoints = allWarnings
    .filter(w => w.location)
    .map(w => ({
      lat: w.location!.lat,
      lng: w.location!.lng,
      intensity: w.location!.intensity || 
        (warning.color === 'red' ? 0.9 : 
         warning.color === 'yellow' ? 0.7 : 
         warning.color === 'blue' ? 0.5 : 0.3)
    }));

  // Generate some artificial weather points around the main location
  const generateWeatherPoints = (center: { lat: number; lng: number }, count: number) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push({
        lat: center.lat + (Math.random() * 2 - 1) * 0.5,
        lng: center.lng + (Math.random() * 2 - 1) * 1,
        intensity: Math.max(0.1, Math.random() * 0.7)
      });
    }
    return points;
  };

  // Add artificial weather points if we have a location
  if (warning.location) {
    heatmapPoints.push(...generateWeatherPoints(warning.location, 15));
    // Add the main point with higher intensity
    heatmapPoints.push({
      lat: warning.location.lat,
      lng: warning.location.lng,
      intensity: 0.9
    });
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
      <div 
        className={`max-w-4xl w-full mt-[4rem] max-h-[80vh] ${colors.bg} border-2 ${colors.border} rounded-lg shadow-xl transform ${isOpen ? 'scale-100' : 'scale-95'} transition-transform duration-300 flex flex-col`}
      >
        {/* Header section - fixed at top */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className={`${colors.icon}`}>
                {warning.icon}
              </div>
              <h2 className="text-xl font-bold">{warning.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 font-semibold">{warning.summary}</p>
        </div>
        
        {/* Scrollable content section */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Details:</h3>
              <p className="mt-2 text-gray-700">{warning.details}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Recommendations:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                {warning.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200">
          <h3 className="font-semibold mb-2">Impact Area:</h3>
          <div className="relative">
            <Heatmap 
              points={heatmapPoints} 
              height="250px"
              center={warning.location ? 
                [warning.location.lat, warning.location.lng] : 
                [48.8566, 2.3522]}
              zoom={warning.location ? 6 : 4}
              locked={true}
            />
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded-md shadow-sm">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>Low</span>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span>Medium</span>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Heatmap section - fixed at bottom */}
        
      </div>
    </div>
  );
};

export default WarningModal;