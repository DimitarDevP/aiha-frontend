import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/userAuth/userAuthThunk';
import { useHistory, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { getUserLocation } from '../../utils/Location';
import { IonIcon } from '@ionic/react';
import { personCircleOutline, alertCircleOutline, informationCircleOutline } from 'ionicons/icons';

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { error, status } = useSelector((state: RootState) => state.userAuth);
  
  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);

  const [form, setForm] = useState({
    email: '',
    password: '',
    date_of_birth: '',
    height: '',
    weight: '',
    illnesses: '',
    allergies: '',
    addictions: '',
    family_history: ''
  });

  const [locationError, setLocationError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect to login after successful registration
  useEffect(() => {
    if (status === 'succeeded' && !isAuthenticated) {
      history.push('/login');
    }
  }, [status, history, isAuthenticated]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLocationError(null);
      const location = await getUserLocation();
      const userData = {
        ...form,
        height: form.height ? parseInt(form.height) : undefined,
        weight: form.weight ? parseInt(form.weight) : undefined,
        location_lat: location.lat,
        location_lng: location.lng
      };

      await dispatch<any>(registerUser(userData));
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Failed to get your location. Using default location instead.');
      
      const userData = {
        ...form,
        height: form.height ? parseInt(form.height) : undefined,
        weight: form.weight ? parseInt(form.weight) : undefined,
        location_lat: 37.7749 + (Math.random() - 0.5) * 0.1,
        location_lng: -122.4194 + (Math.random() - 0.5) * 0.1
      };
      
      await dispatch<any>(registerUser(userData));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-indigo-50 p-4">
      <div className="w-full max-w-2xl flex flex-col" style={{ maxHeight: '80vh' }}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 flex flex-col flex-1">
          {/* Header */}
          <div className="p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-500 to-teal-500">
            <div className="flex items-center justify-center space-x-2">
              <IonIcon icon={personCircleOutline} className="text-xl text-white" />
              <h2 className="text-xl font-bold text-center text-white m-0 pt-[2px]">Create Your Account</h2>
            </div>
          </div>
          
          {/* Scrollable Form Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.email ? 'border-red-500' : 'border-indigo-200'
                    }`}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">Password*</label>
                  <input
                    type="password"
                    name="password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.password ? 'border-red-500' : 'border-indigo-200'
                    }`}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={form.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Health Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    min="100"
                    max="250"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={form.height}
                    onChange={handleChange}
                    placeholder="170"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-indigo-900 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    min="30"
                    max="200"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="70"
                  />
                </div>
              </div>
              
              {/* Health Information */}
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-1">Current Illnesses (if any)</label>
                <textarea
                  name="illnesses"
                  rows={2}
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.illnesses}
                  onChange={handleChange}
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-1">Allergies (if any)</label>
                <textarea
                  name="allergies"
                  rows={2}
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Peanuts, Penicillin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-1">Addictions (if any)</label>
                <input
                  type="text"
                  name="addictions"
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.addictions}
                  onChange={handleChange}
                  placeholder="e.g., Smoking, Alcohol"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-1">Family Medical History</label>
                <textarea
                  name="family_history"
                  rows={3}
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.family_history}
                  onChange={handleChange}
                  placeholder="e.g., Heart disease in family, Cancer history"
                />
              </div>
              
              {/* Location and Info */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start space-x-3">
                <IonIcon icon={informationCircleOutline} className="text-indigo-600 text-xl mt-0.5" />
                <div>
                  <p className="text-indigo-800 text-sm">
                    We'll try to detect your location for better services. You can update it later.
                  </p>
                  {locationError && (
                    <p className="mt-1 text-sm text-amber-600">{locationError}</p>
                  )}
                </div>
              </div>
              
              {/* API Error */}
              {status === 'failed' && error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <IonIcon icon={alertCircleOutline} className="text-red-500 text-lg mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-indigo-100 bg-indigo-50">
            <p className="text-sm text-center text-indigo-700">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;