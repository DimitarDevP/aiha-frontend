
import React from 'react';

const Tab3: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">User Vault</h1>
        <p className="text-gray-600">
          Your secure storage for all your important health documents and records.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-5">
        <h2 className="text-xl font-semibold mb-4">Health Records</h2>
        <p className="text-gray-600 mb-4">
          Store and access your medical history, test results, and doctor's notes.
        </p>
        <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
          Upload or create new health records
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-5">
        <h2 className="text-xl font-semibold mb-4">Medications</h2>
        <p className="text-gray-600 mb-4">
          Keep track of your current medications, dosages, and schedules.
        </p>
        <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
          No medications added yet
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Appointments</h2>
        <p className="text-gray-600 mb-4">
          Manage your upcoming doctor appointments and reminders.
        </p>
        <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
          No upcoming appointments
        </div>
      </div>
    </div>
  );
};

export default Tab3;
