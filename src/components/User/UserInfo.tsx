import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateUserProfile } from '../../redux/userAuth/userAuthSlice';
import { updateUserData } from '../../redux/userAuth/userAuthThunk';

const UserProfileForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null,
  });

  // Form state initialized with user data from Redux
  const [formData, setFormData] = useState({
    date_of_birth: user.date_of_birth || '',
    height: user.height?.toString() || '',
    weight: user.weight?.toString() || '',
    illnesses: user.illnesses || '',
    allergies: user.allergies || '',
    addictions: user.addictions || '',
    family_history: user.family_history || '',
    location: '',  // Will be populated from lat/lng
  });

  // Populate locations based on user data
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];
  
  // Update form when user data changes in Redux
  useEffect(() => {
    setFormData({
      date_of_birth: user.date_of_birth || '',
      height: user.height?.toString() || '',
      weight: user.weight?.toString() || '',
      illnesses: user.illnesses || '',
      allergies: user.allergies || '',
      addictions: user.addictions || '',
      family_history: user.family_history || '',
      location: '', // You would need a map from lat/lng to location name
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: null });

    // Convert string values to appropriate types
    const updatedUserData = {
      date_of_birth: formData.date_of_birth,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      illnesses: formData.illnesses,
      allergies: formData.allergies,
      addictions: formData.addictions,
      family_history: formData.family_history,
      // Add location handling if needed
    };

    try {
      // Dispatch the async thunk action for API update
      const resultAction = await dispatch(updateUserData(updatedUserData) as any);
      
      if (updateUserData.fulfilled.match(resultAction)) {
        // Update successful
        setMessage({
          text: 'Profile updated successfully!',
          type: 'success',
        });
        
        // Update local Redux state with the latest user data
        dispatch(updateUserProfile(updatedUserData));
      } else {
        // Update failed
        setMessage({
          text: resultAction.payload as string || 'Failed to update profile. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'An unexpected error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form 
        onSubmit={handleSubmit} 
        className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">Update Your Health Profile</h2>

        {/* Display messages */}
        {message.text && (
          <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}


        {/* Date of Birth field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300"
          />
        </div>

        {/* Height and Weight in a flex container */}
        <div className="flex gap-4">
          <div className="space-y-1 w-1/2">
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              name="height"
              placeholder="Height in cm"
              value={formData.height}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg border-gray-300"
            />
          </div>
          <div className="space-y-1 w-1/2">
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="Weight in kg"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg border-gray-300"
            />
          </div>
        </div>

        {/* Medical information fields */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Past Illnesses</label>
          <textarea
            name="illnesses"
            placeholder="List any past or current illnesses"
            value={formData.illnesses}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Family Medical History</label>
          <textarea
            name="family_history"
            placeholder="Describe your family's medical history"
            value={formData.family_history}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <textarea
            name="allergies"
            placeholder="List any allergies"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Addictions</label>
          <textarea
            name="addictions"
            placeholder="List any addictions or dependencies"
            value={formData.addictions}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        {/* Location selector */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Location</label>
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
        </div>

        {/* Submit button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full text-white px-4 py-2 rounded-lg transition-colors ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;