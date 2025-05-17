import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateUserProfile } from '../../redux/userAuth/userAuthSlice';
import { updateUserData } from '../../redux/userAuth/userAuthThunk';
import { IonIcon } from '@ionic/react';
import { 
  saveOutline, 
  calendarOutline, 
  pulseOutline, 
  fitnessOutline,
  alertCircleOutline,
  medkitOutline,
  flaskOutline,
  peopleOutline,
  locationOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  refreshOutline
} from 'ionicons/icons';

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
    <div className="max-w-3xl mx-auto p-6">
      <form 
        onSubmit={handleSubmit} 
        className="p-8 bg-gradient-to-b from-white to-indigo-50 rounded-2xl border border-indigo-100 shadow-xl space-y-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-1 bg-indigo-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-indigo-900">Space Health Profile</h2>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <IonIcon 
              icon={message.type === 'success' ? checkmarkCircleOutline : closeCircleOutline} 
              className={`text-2xl ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} 
            />
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
            <IonIcon icon={calendarOutline} className="text-indigo-600" />
            <span>Date of Birth</span>
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full border-2 p-3 rounded-xl border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
              <IonIcon icon={pulseOutline} className="text-indigo-600" />
              <span>Height (cm)</span>
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-xl border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
              <IonIcon icon={fitnessOutline} className="text-indigo-600" />
              <span>Weight (kg)</span>
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-xl border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
            <IonIcon icon={medkitOutline} className="text-indigo-600" />
            <span>Current Medical Conditions</span>
          </label>
          <textarea
            name="illnesses"
            value={formData.illnesses}
            onChange={handleChange}
            placeholder="List any current illnesses or medical conditions..."
            className="w-full border-2 p-3 rounded-xl border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all min-h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
            <IonIcon icon={peopleOutline} className="text-indigo-600" />
            <span>Family Medical History</span>
          </label>
          <textarea
            name="family_history"
            value={formData.family_history}
            onChange={handleChange}
            placeholder="Note any significant medical conditions in your family..."
            className="w-full border-2 p-3 rounded-xl border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all min-h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
            <IonIcon icon={alertCircleOutline} className="text-indigo-600" />
            <span>Allergies</span>
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="List any allergies to medications, foods, or substances..."
            className="w-full border-2 p-3 rounded-xl border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all min-h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
            <IonIcon icon={flaskOutline} className="text-indigo-600" />
            <span>Substance Use</span>
          </label>
          <textarea
            name="addictions"
            value={formData.addictions}
            onChange={handleChange}
            placeholder="Information about tobacco, alcohol, or other substance use..."
            className="w-full border-2 p-3 rounded-xl border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all min-h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-indigo-800">
            <IonIcon icon={locationOutline} className="text-indigo-600" />
            <span>Location (Auto-detected)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="location"
              value={formData.location}
              readOnly
              className="w-full border-2 p-3 rounded-xl bg-blue-50 border-blue-100 text-blue-800 cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <IonIcon icon={refreshOutline} className="text-blue-500 animate-spin-slow" />
            </div>
          </div>
          <p className="text-xs text-gray-500 italic">Your location helps us provide regionally appropriate health recommendations</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center space-x-3 text-white px-6 py-4 rounded-xl transition-all duration-300 transform ${
            isLoading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:scale-105'
          }`}
        >
          <IonIcon icon={saveOutline} className="text-xl" />
          <span className="font-medium text-lg">{isLoading ? 'Updating...' : 'Save Health Profile'}</span>
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-indigo-600">Your health data is stored securely with space-grade encryption</p>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;