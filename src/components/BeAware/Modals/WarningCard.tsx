// components/Modals/WarningCard.tsx
import React from 'react';
import { Card } from '../../../redux/beAware/beAwareSlice';

interface WarningCardProps {
  warning: Card;
  onClick: () => void;
}

const WarningCard: React.FC<WarningCardProps> = ({ warning, onClick }) => {
  const colorClasses = {
    yellow: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-500',
      text: 'text-yellow-600',
      hover: 'hover:bg-yellow-200'
    },
    red: {
      bg: 'bg-red-100',
      border: 'border-red-500',
      text: 'text-red-600',
      hover: 'hover:bg-red-200'
    },
    blue: {
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-200'
    },
    green: {
      bg: 'bg-green-100',
      border: 'border-green-500',
      text: 'text-green-600',
      hover: 'hover:bg-green-200'
    },
    purple: {
      bg: 'bg-purple-100',
      border: 'border-purple-500',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-200'
    },
    default: {
      bg: 'bg-gray-100',
      border: 'border-gray-500',
      text: 'text-gray-600',
      hover: 'hover:bg-gray-200'
    }
  };

  const colors = colorClasses[warning.color] || colorClasses.default;

  return (
    <div 
      className={`${colors.bg} border-l-4 ${colors.border} p-4 rounded shadow-sm cursor-pointer ${colors.hover} transition-colors flex items-start`}
      onClick={onClick}
    >
      {warning.icon && (
        <div className={`${colors.text} mr-3 flex-shrink-0 mt-1`}>
          {warning.icon}
        </div>
      )}
      <div>
        <h2 className="font-semibold text-lg">{warning.title}</h2>
        <p>{warning.summary}</p>
        <p className="text-sm text-gray-500 mt-1">Click for more information</p>
      </div>
    </div>
  );
};

export default WarningCard;