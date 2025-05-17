// components/BeAware.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import WarningCard from './Modals/WarningCard';
import WarningModal from './Modals/WarningModal';
import { RootState } from '../../store';
import { IonIcon } from '@ionic/react';
import { alertCircleOutline, filterOutline, informationCircleOutline } from 'ionicons/icons';

const BeAware = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarningId, setSelectedWarningId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  
  const warnings = useSelector((state: RootState) => state.card.warnings);
  const selectedWarning = warnings.find(warning => warning.id === selectedWarningId) || null;

  const filteredWarnings = filter === 'all' 
    ? warnings 
    : warnings.filter(warning => warning.color === filter);

  const handleCardClick = (id: string) => {
    setSelectedWarningId(id);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      setSelectedWarningId(null);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className="max-w-4xl mx-auto p-6 mb-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">Be Aware</h1>
          </div>
          
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md border border-indigo-100">
            <IonIcon icon={filterOutline} className="text-indigo-500 text-lg" />
            <select 
              className="bg-transparent border-none text-indigo-700 font-medium focus:outline-none pr-8"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Alerts</option>
              <option value="red">High Priority</option>
              <option value="yellow">Medium Priority</option>
              <option value="blue">Low Priority</option>
            </select>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start space-x-3">
          <div className="text-indigo-600 mt-1">
            <IonIcon icon={informationCircleOutline} className="text-xl" />
          </div>
          <div>
            <p className="text-indigo-800">
              Stay informed about important health alerts and environmental factors that might affect your well-being. 
              Tap on any alert for detailed information and recommendations.
            </p>
          </div>
        </div>
      </div>

      {filteredWarnings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
          <div className="text-gray-400 text-5xl mb-4 flex justify-center">
            <IonIcon icon={alertCircleOutline} />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Alerts Found</h3>
          <p className="text-gray-500">There are currently no health alerts matching your selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWarnings.map((warning) => (
            <WarningCard
              key={warning.id}
              warning={warning}
              onClick={() => handleCardClick(warning.id)}
            />
          ))}
        </div>
      )}

      {selectedWarning && (
        <WarningModal
          isOpen={isModalOpen}
          warning={selectedWarning}
          onClose={closeModal}
          allWarnings={warnings} // Pass all warnings to the modal
        />
      )}
    </div>
  );
};

export default BeAware;