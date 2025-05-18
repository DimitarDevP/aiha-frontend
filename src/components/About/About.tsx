import React from 'react';
import { IonIcon } from '@ionic/react';
import { planetOutline, informationCircleOutline, peopleOutline, rocketOutline } from 'ionicons/icons';

const About: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <IonIcon icon={planetOutline} className="text-3xl text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Space Health Navigator</h1>
        <p className="text-indigo-600">Your AI-powered health companion</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <IonIcon icon={informationCircleOutline} className="text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-800">About</h3>
            <p className="mt-1 text-gray-600">
              Space Health Navigator is an innovative platform that combines AI technology with health monitoring 
              to provide personalized health insights and recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 bg-teal-100 p-2 rounded-lg text-teal-600">
            <IonIcon icon={peopleOutline} className="text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-800">Our Mission</h3>
            <p className="mt-1 text-gray-600">
              To empower individuals with accessible, reliable health information and AI-powered tools 
              to make informed decisions about their wellbeing.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 bg-purple-100 p-2 rounded-lg text-purple-600">
            <IonIcon icon={rocketOutline} className="text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-800">Features</h3>
            <ul className="mt-1 text-gray-600 list-disc list-inside space-y-1">
              <li>AI Health Assistant (AIHA)</li>
              <li>Personalized health insights</li>
              <li>Environmental health alerts</li>
              <li>Secure profile management</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Version 1.0.0 • © {new Date().getFullYear()} Space Health Navigator
        </p>
      </div>
    </div>
  );
};

export default About;