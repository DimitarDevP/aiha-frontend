import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/userAuth/userAuthThunk';
import { useHistory, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { IonIcon } from '@ionic/react';
import { logInOutline, alertCircleOutline } from 'ionicons/icons';

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { error, status } = useSelector((state: RootState) => state.userAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{email?: string, password?: string}>({});

  const validateForm = () => {
    const errors: {email?: string, password?: string} = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    dispatch<any>(loginUser({ email, password })).then((res: any) => {
      if (res.meta.requestStatus === 'fulfilled') history.push('/');
    });
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-indigo-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-500 to-teal-500">
          <div className="flex items-center justify-center space-x-2">
            <IonIcon icon={logInOutline} className="text-2xl text-white" />
            <h2 className="text-2xl font-bold text-center text-white">Welcome Back</h2>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-indigo-900 mb-1">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  formErrors.email ? 'border-red-500' : 'border-indigo-200'
                }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) setFormErrors({...formErrors, email: undefined});
                }}
                placeholder="your@email.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-900 mb-1">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  formErrors.password ? 'border-red-500' : 'border-indigo-200'
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors({...formErrors, password: undefined});
                }}
                placeholder="••••••••"
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
            
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-indigo-700">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;