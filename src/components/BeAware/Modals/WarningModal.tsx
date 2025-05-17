// components/WarningModal.tsx
import React from 'react';
import { WarningDetails } from '../Types/warnings';

interface WarningModalProps {
  isOpen: boolean;
  warning: WarningDetails | null;
  onClose: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, warning, onClose }) => {
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

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
      <div 
        className={`max-w-md w-full mt-[4rem] ${colors.bg} border-2 ${colors.border} rounded-lg shadow-xl transform ${isOpen ? 'scale-100' : 'scale-95'} transition-transform duration-300`}
        style={{ maxHeight: 'calc(100vh - 4rem)' }}
      >
        <div className="p-6 flex flex-col max-h-full">
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
          
          <div className="mt-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
            <p className="mb-4">{warning.details}</p>
            
            <div>
              <h3 className="font-semibold">Recommendations:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {warning.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;