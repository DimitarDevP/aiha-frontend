// components/BeAware.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import WarningCard from './Modals/WarningCard';
import WarningModal from './Modals/WarningModal';
import { RootState } from '../../store';

const BeAware = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarningId, setSelectedWarningId] = useState<string | null>(null);
  
  const warnings = useSelector((state: RootState) => state.card.warnings);
  const selectedWarning = warnings.find(warning => warning.id === selectedWarningId) || null;

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
    <div className="max-w-xl mx-auto p-4 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">Be Aware</h1>

      <div className="space-y-4">
        {warnings.map((warning) => (
          <WarningCard
            key={warning.id}
            warning={warning}
            onClick={() => handleCardClick(warning.id)}
          />
        ))}
      </div>

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