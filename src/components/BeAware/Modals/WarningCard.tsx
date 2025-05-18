// components/Modals/WarningCard.tsx
import React from 'react';
import { Card } from '../../../redux/beAware/beAwareSlice';
import { IonIcon } from '@ionic/react';
import { chevronForwardOutline, timeOutline, locationOutline } from 'ionicons/icons';

interface WarningCardProps {
  warning: Card;
  onClick: () => void;
}

const WarningCard: React.FC<WarningCardProps> = ({ warning, onClick }) => {
  const colorClasses = {
    yellow: {
      bg: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      badge: 'bg-yellow-500',
      icon: 'bg-yellow-100 text-yellow-600',
      hover: 'hover:shadow-yellow-200'
    },
    red: {
      bg: 'bg-gradient-to-r from-red-50 to-red-100',
      border: 'border-red-400',
      text: 'text-red-700',
      badge: 'bg-red-500',
      icon: 'bg-red-100 text-red-600',
      hover: 'hover:shadow-red-200'
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-700',
      badge: 'bg-blue-500',
      icon: 'bg-blue-100 text-blue-600',
      hover: 'hover:shadow-blue-200'
    },
    green: {
      bg: 'bg-gradient-to-r from-green-50 to-green-100',
      border: 'border-green-400',
      text: 'text-green-700',
      badge: 'bg-green-500',
      icon: 'bg-green-100 text-green-600',
      hover: 'hover:shadow-green-200'
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-50 to-purple-100',
      border: 'border-purple-400',
      text: 'text-purple-700',
      badge: 'bg-purple-500',
      icon: 'bg-purple-100 text-purple-600',
      hover: 'hover:shadow-purple-200'
    },
    default: {
      bg: 'bg-gradient-to-r from-gray-50 to-gray-100',
      border: 'border-gray-400',
      text: 'text-gray-700',
      badge: 'bg-gray-500',
      icon: 'bg-gray-100 text-gray-600',
      hover: 'hover:shadow-gray-200'
    }
  };

  const colors = colorClasses[warning.color as keyof typeof colorClasses] || colorClasses.default;

  // Format date if it exists
  const formattedDate = warning.date 
    ? new Date(warning.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div 
      className={`${colors.bg} border ${colors.border} p-5 rounded-xl shadow-md cursor-pointer hover:shadow-lg ${colors.hover} transition-all duration-300 transform hover:scale-[1.01] flex items-start`}
      onClick={onClick}
    >
      {warning.icon && (
        <div className={`${colors.icon} p-3 rounded-full mr-4 flex-shrink-0`}>
          {warning.icon}
        </div>
      )}
      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`${colors.badge} text-white text-xs font-medium py-1 px-2 rounded-full`}>
            {warning.color === 'red' ? 'High Priority' : 
             warning.color === 'yellow' ? 'Medium Priority' : 
             warning.color === 'blue' ? 'Low Priority' : 'Notification'}
          </span>
          
          {formattedDate && (
            <span className="flex items-center text-xs text-gray-500">
              <IonIcon icon={timeOutline} className="mr-1" />
              {formattedDate}
            </span>
          )}
          
          {warning.location && (
            <span className="flex items-center text-xs text-gray-500">
              <IonIcon icon={locationOutline} className="mr-1" />
              {typeof warning.location === 'string' ? warning.location : 'Affected Area'}
            </span>
          )}
        </div>
        
        <h2 className={`font-bold text-lg ${colors.text}`}>{warning.title}</h2>
        <p className="text-gray-700 my-2">{warning.summary}</p>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm text-indigo-600 font-medium">View details and recommendations</p>
          <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
            <IonIcon icon={chevronForwardOutline} className="text-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningCard;