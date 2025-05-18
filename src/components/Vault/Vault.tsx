import React, { useState, useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { camera, cloud, close, document as documentIcon, image, add } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

interface UploadModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onUpload: (file: File) => void;
  onTakePhoto: () => Promise<void>;
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
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 border border-indigo-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-indigo-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-indigo-500 hover:text-indigo-700"
          >
            <IonIcon icon={close} className="text-2xl" />
          </button>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={onTakePhoto}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <IonIcon icon={camera} className="mr-2 text-xl" />
            Take a Photo
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

interface Document {
  id: string;
  name: string;
  date: string;
  url: string;
}

interface DocumentSection {
  id: string;
  title: string;
  description: string;
  documents: Document[];
}

const Vault: React.FC = () => {
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

  const handleUpload = async (file: File | Blob, fileName: string) => {
    if (!activeSection) return;
    
    // Convert to proper File if it's a Blob
    const uploadFile = file instanceof Blob ? new File([file], fileName, { type: file.type }) : file;
    
    const newSections = sections.map(section => {
      if (section.id === activeSection) {
        return {
          ...section,
          documents: [
            ...section.documents,
            {
              id: Date.now().toString(),
              name: fileName,
              date: new Date().toLocaleDateString(),
              url: URL.createObjectURL(uploadFile)
            }
          ]
        };
      }
      return section;
    });
    
    setSections(newSections);
  };

  const handleTakePhoto = async () => {
    try {
      // Check if running on a native platform
      if (Capacitor.isNativePlatform()) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          saveToGallery: true, // Save to device gallery
          promptLabelHeader: 'Photo Permission',
          promptLabelPhoto: 'Select from gallery',
          promptLabelPicture: 'Take photo'
        });

        if (image.webPath) {
          // Fetch the photo from filesystem
          const response = await fetch(image.webPath);
          const blob = await response.blob();
          
          // Generate a filename with timestamp
          const fileName = `photo_${new Date().getTime()}.jpg`;
          await handleUpload(blob, fileName);
        }
      } else {
        // Fallback for web browser
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (file) {
            handleUpload(file, file.name);
          }
        };
        
        input.click();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      // Handle error (e.g., show toast notification)
    } finally {
      closeModal();
    }
  };

  const handleDocumentClick = (url: string) => {
    // Open the document in a new tab
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-indigo-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-indigo-900">User Vault</h1>
        <p className="text-indigo-700">
          Your secure storage for all your important health documents and records.
        </p>
      </div>
      
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl shadow-md p-5 mb-5 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-2 text-indigo-900">{section.title}</h2>
          <p className="text-indigo-600 mb-4">
            {section.description}
          </p>
          
          {section.documents.length > 0 ? (
            <div className="space-y-3">
              {section.documents.map(doc => (
                <div 
                  key={doc.id} 
                  className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 border border-indigo-100 cursor-pointer"
                  onClick={() => handleDocumentClick(doc.url)}
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <IonIcon icon={documentIcon} className="text-indigo-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-indigo-800">{doc.name}</p>
                    <p className="text-xs text-indigo-500">{doc.date}</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <IonIcon icon={image} className="text-xl" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => openModal(section.id)}
                className="flex items-center justify-center w-full p-2 border border-dashed border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors text-sm"
              >
                <IonIcon icon={add} className="mr-1" />
                Add Another Document
              </button>
            </div>
          ) : (
            <div 
              onClick={() => openModal(section.id)}
              className="flex flex-col justify-center items-center h-32 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200 text-indigo-600 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              <IonIcon icon={cloud} className="text-3xl mb-2 text-indigo-400" />
              <p className="text-sm">Click to upload or take a photo</p>
            </div>
          )}
        </div>
      ))}

      <UploadModal 
        isOpen={modalOpen}
        title={`Add to ${sections.find(s => s.id === activeSection)?.title || ''}`}
        onClose={closeModal}
        onUpload={(file) => handleUpload(file, file.name)}
        onTakePhoto={handleTakePhoto}
      />
    </div>
  );
};

export default Vault;