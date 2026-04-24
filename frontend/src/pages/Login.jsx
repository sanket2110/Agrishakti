import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Assuming backend is running on 8080
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        username,
        password
      });

      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        // Simple auth state management for demo purposes
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your Agrishakti account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-green-600 hover:text-green-500">Register here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
