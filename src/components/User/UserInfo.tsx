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

  const [formData, setFormData] = useState({
    date_of_birth: user.date_of_birth || '',
    height: user.height?.toString() || '',
    weight: user.weight?.toString() || '',
    illnesses: user.illnesses || '',
    allergies: user.allergies || '',
    addictions: user.addictions || '',
    family_history: user.family_history || '',
    location: '', // Will be auto-filled
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date_of_birth: user.date_of_birth || '',
      height: user.height?.toString() || '',
      weight: user.weight?.toString() || '',
      illnesses: user.illnesses || '',
      allergies: user.allergies || '',
      addictions: user.addictions || '',
      family_history: user.family_history || '',
    }));
  }, [user]);

  useEffect(() => {
    const fetchLocationFromCoords = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          {
            headers: {
              'User-Agent': 'your-app-name (your@email.com)',
            },
          }
        );

        const data = await response.json();
        const { city, town, village, country } = data.address;

        const locationName = [city || town || village, country].filter(Boolean).join(', ');
        setFormData((prev) => ({
          ...prev,
          location: locationName,
        }));
      } catch (err) {
        console.warn('Failed to reverse geocode:', err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchLocationFromCoords(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation failed or denied:', err);
        }
      );
    } else {
      console.warn('Geolocation not supported');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: null });

    const updatedUserData = {
      date_of_birth: formData.date_of_birth,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      illnesses: formData.illnesses,
      allergies: formData.allergies,
      addictions: formData.addictions,
      family_history: formData.family_history,
      location: formData.location,
    };

    try {
      const resultAction = await dispatch(updateUserData(updatedUserData) as any);

      if (updateUserData.fulfilled.match(resultAction)) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        dispatch(updateUserProfile(updatedUserData));
      } else {
        setMessage({
          text: resultAction.payload as string || 'Failed to update profile.',
          type: 'error',
        });
      }
    } catch {
      setMessage({ text: 'Unexpected error occurred.', type: 'error' });
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

        {message.text && (
          <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

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

        <div className="flex gap-4">
          <div className="space-y-1 w-1/2">
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              name="height"
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
              value={formData.weight}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg border-gray-300"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Illnesses</label>
          <textarea
            name="illnesses"
            value={formData.illnesses}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Family History</label>
          <textarea
            name="family_history"
            value={formData.family_history}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Addictions</label>
          <textarea
            name="addictions"
            value={formData.addictions}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg border-gray-300 min-h-24"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Location (Auto-detected)</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            readOnly
            className="w-full border p-2 rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed"
          />
        </div>

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
