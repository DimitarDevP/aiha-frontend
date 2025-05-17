import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/userAuth/userAuthThunk';
import { useHistory, Link } from 'react-router-dom';
import { RootState } from '../../store';

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { error, status } = useSelector((state: RootState) => state.userAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch<any>(loginUser({ email, password })).then((res: any) => {
      if (res.meta.requestStatus === 'fulfilled') history.push('/');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {status === 'loading' && <p className="text-sm text-gray-500">Logging in...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?
          <Link to="/register" className="text-blue-500 hover:underline ml-1">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
