
import React, { useState, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { camera, cloud, close, document, image, add } from 'ionicons/icons';

interface UploadModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onUpload: (file: File) => void;
  onTakePhoto: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, title, onClose, onUpload, onTakePhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IonIcon icon={close} className="text-2xl" />
          </button>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={onTakePhoto}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
          >
            <IonIcon icon={camera} className="mr-2 text-xl" />
            Take a Photo
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <IonIcon icon={image} className="mr-2 text-xl" />
            Upload from Device
          </button>
          
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

interface DocumentSection {
  id: string;
  title: string;
  description: string;
  documents: { id: string; name: string; date: string; url: string }[];
}

const Tab3: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<DocumentSection[]>([
    {
      id: 'health-records',
      title: 'Health Records',
      description: 'Store and access your medical history, test results, and doctor\'s notes.',
      documents: []
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Keep track of your current medications, dosages, and schedules.',
      documents: []
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Manage your upcoming doctor appointments and reminders.',
      documents: []
    }
  ]);

  const openModal = (sectionId: string) => {
    setActiveSection(sectionId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveSection(null), 300);
  };

  const handleUpload = (file: File) => {
    if (!activeSection) return;
    
    const newSections = sections.map(section => {
      if (section.id === activeSection) {
        return {
          ...section,
          documents: [
            ...section.documents,
            {
              id: Date.now().toString(),
              name: file.name,
              date: new Date().toLocaleDateString(),
              url: URL.createObjectURL(file)
            }
          ]
        };
      }
      return section;
    });
    
    setSections(newSections);
  };

  const handleTakePhoto = () => {
    // This would trigger the device camera if used in a mobile app context
    // For browser, it will fall back to the file input with camera source
    if (activeSection) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          handleUpload(file);
        }
      };
      input.click();
    }
    closeModal();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">User Vault</h1>
        <p className="text-gray-600">
          Your secure storage for all your important health documents and records.
        </p>
      </div>
      
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-lg shadow p-6 mb-5">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <p className="text-gray-600 mb-4">
            {section.description}
          </p>
          
          {section.documents.length > 0 ? (
            <div className="space-y-3">
              {section.documents.map(doc => (
                <div key={doc.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <IonIcon icon={document} className="text-indigo-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.date}</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <IonIcon icon={image} className="text-xl" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => openModal(section.id)}
                className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <IonIcon icon={add} className="mr-1" />
                Add Another Document
              </button>
            </div>
          ) : (
            <div 
              onClick={() => openModal(section.id)}
              className="flex flex-col justify-center items-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <IonIcon icon={cloud} className="text-3xl mb-2 text-gray-400" />
              <p className="text-sm">Click to upload or take a photo</p>
            </div>
          )}
        </div>
      ))}

      <UploadModal 
        isOpen={modalOpen}
        title={`Add to ${sections.find(s => s.id === activeSection)?.title || ''}`}
        onClose={closeModal}
        onUpload={handleUpload}
        onTakePhoto={handleTakePhoto}
      />
    </div>
  );
};

export default Tab3;
