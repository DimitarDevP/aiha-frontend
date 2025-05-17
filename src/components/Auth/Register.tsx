import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/userAuth/userAuthThunk';
import { useHistory, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { getUserLocation } from '../../utils/Location';

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { error, status } = useSelector((state: RootState) => state.userAuth);

  const [form, setForm] = useState({
    name: '',
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!form.name.trim()) errors.name = 'Name is required';
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
    
    // Clear error when user starts typing
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
      
      if (status === 'succeeded') {
        history.push('/login');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Failed to get your location. Using default location instead.');
      
      // Proceed with fallback location
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center text-blue-600">Create Your Account</h2>
        </div>
        
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={form.name}
                  onChange={handleChange}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={form.email}
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  name="password"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={form.password}
                  onChange={handleChange}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={form.date_of_birth}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  min="100"
                  max="250"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={form.height}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="30"
                  max="200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={form.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {/* Health Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Illnesses (if any)</label>
              <textarea
                name="illnesses"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={form.illnesses}
                onChange={handleChange}
                placeholder="e.g., Diabetes, Hypertension"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (if any)</label>
              <textarea
                name="allergies"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={form.allergies}
                onChange={handleChange}
                placeholder="e.g., Peanuts, Penicillin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Addictions (if any)</label>
              <input
                type="text"
                name="addictions"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={form.addictions}
                onChange={handleChange}
                placeholder="e.g., Smoking, Alcohol"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Family Medical History</label>
              <textarea
                name="family_history"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={form.family_history}
                onChange={handleChange}
                placeholder="e.g., Heart disease in family, Cancer history"
              />
            </div>
            
            {/* Location and Errors */}
            <div className="text-sm text-gray-600">
              <p>We'll try to detect your location for better services. You can update it later.</p>
              {locationError && <p className="text-yellow-600 mt-1">{locationError}</p>}
            </div>
            
            {/* API Error */}
            {status === 'failed' && error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;