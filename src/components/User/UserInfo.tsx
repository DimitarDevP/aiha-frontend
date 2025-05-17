// src/pages/UserProfileForm.tsx
import React, { useState } from 'react';

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    illnesses: '',
    familyHistory: '',
    allergies: '',
    isSmoker: false,
    weight: '',
    height: '',
    location: '',
  });

  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold mb-4">User Health Profile</h2>

      <textarea
        name="illnesses"
        placeholder="Past illnesses"
        value={formData.illnesses}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="familyHistory"
        placeholder="Family medical history"
        value={formData.familyHistory}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="allergies"
        placeholder="Allergies"
        value={formData.allergies}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isSmoker"
          checked={formData.isSmoker}
          onChange={handleChange}
        />
        <span>Smoker</span>
      </label>

      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <select
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default UserProfileForm;
