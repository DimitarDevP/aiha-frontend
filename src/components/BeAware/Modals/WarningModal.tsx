// components/WarningModal.tsx
import React from 'react';
import { WarningDetails } from '../Types/warnings';
import Heatmap from '../../Heatmap/Heatmap';
import { IonIcon } from '@ionic/react';
import { 
  closeOutline, 
  warningOutline, 
  informationCircleOutline, 
  shieldOutline, 
  medkitOutline,
  navigateOutline
} from 'ionicons/icons';

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
      bg: 'bg-gradient-to-b from-yellow-50 to-white',
      border: 'border-yellow-400',
      button: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600',
      icon: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      iconBg: 'bg-yellow-500'
    },
    red: {
      bg: 'bg-gradient-to-b from-red-50 to-white',
      border: 'border-red-400',
      button: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-800 border border-red-300',
      iconBg: 'bg-red-500'
    },
    blue: {
      bg: 'bg-gradient-to-b from-blue-50 to-white',
      border: 'border-blue-400',
      button: 'bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800 border border-blue-300',
      iconBg: 'bg-blue-500'
    },
    default: {
      bg: 'bg-gradient-to-b from-gray-50 to-white',
      border: 'border-gray-400',
      button: 'bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600',
      icon: 'text-gray-600',
      badge: 'bg-gray-100 text-gray-800 border border-gray-300',
      iconBg: 'bg-gray-500'
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

  const getPriorityText = (color: string) => {
    switch(color) {
      case 'red': return 'High Priority Alert';
      case 'yellow': return 'Medium Priority Alert';
      case 'blue': return 'Low Priority Alert';
      default: return 'Information Alert';
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
      <div 
        className={`max-w-4xl w-full max-h-[78vh] mt-[2rem] ${colors.bg} border ${colors.border} rounded-2xl shadow-2xl transform ${isOpen ? 'scale-100' : 'scale-95'} transition-transform duration-300 flex flex-col overflow-hidden`}
      >
        {/* Header section - fixed at top */}
        <div className="relative p-6 border-b border-gray-200">
          <div className="absolute right-6 top-6">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Close"
            >
              <IonIcon icon={closeOutline} className="text-xl" />
            </button>
          </div>
          
          <div className="flex items-start space-x-4 pr-12">
            <div className={`${colors.iconBg} text-white p-3 rounded-xl shadow-lg`}>
              {warning.icon || <IonIcon icon={warningOutline} className="text-2xl" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`${colors.badge} py-1 px-3 rounded-full text-xs font-medium`}>
                  {getPriorityText(warning.color)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{warning.title}</h2>
              <p className="mt-2 font-medium text-gray-700">{warning.summary}</p>
            </div>
          </div>
        </div>
        
        {/* Scrollable content section */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="text-indigo-600 mt-1">
                  <IonIcon icon={informationCircleOutline} className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">Details:</h3>
                  <p className="text-gray-700">{warning.details}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="text-teal-600 mt-1">
                  <IonIcon icon={medkitOutline} className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-2">Recommendations:</h3>
                  <ul className="space-y-3">
                    {warning.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="p-1 rounded-full bg-teal-100 text-teal-600 flex-shrink-0 mt-0.5">
                          <IonIcon icon={shieldOutline} className="text-sm" />
                        </div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3 mb-4">
                <div className="text-purple-600 mt-1">
                  <IonIcon icon={navigateOutline} className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Impact Area:</h3>
                </div>
              </div>
              
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <Heatmap 
                  points={heatmapPoints} 
                  height="300px"
                  center={warning.location ? 
                    [warning.location.lat, warning.location.lng] : 
                    [48.8566, 2.3522]}
                  zoom={warning.location ? 6 : 4}
                  locked={true}
                />
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span>Low</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer section with action buttons */}
        <div className="p-6 pt-[0px] border-t border-gray-200 bg-gray-50">

        </div>
      </div>
    </div>
  );
};

export default WarningModal;