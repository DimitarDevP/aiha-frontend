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
    <div className="w-[100%] mx-auto p-6"> {/* 10% more width container */}
      <form 
        onSubmit={handleSubmit} 
        className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md space-y-4" /* Added rounded-xl and border-2 */
      >
        <h2 className="text-xl font-bold mb-4">User Health Profile</h2>

        <textarea
          name="illnesses"
          placeholder="Past illnesses"
          value={formData.illnesses}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg border-gray-300" /* Added rounded-lg */
        />

        <textarea
          name="familyHistory"
          placeholder="Family medical history"
          value={formData.familyHistory}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg border-gray-300"
        />

        <textarea
          name="allergies"
          placeholder="Allergies"
          value={formData.allergies}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg border-gray-300"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isSmoker"
            checked={formData.isSmoker}
            onChange={handleChange}
            className="rounded border-gray-300" /* Added rounded */
          />
          <span>Smoker</span>
        </label>

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg border-gray-300"
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg border-gray-300"
        />

        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg border-gray-300"
        >
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;