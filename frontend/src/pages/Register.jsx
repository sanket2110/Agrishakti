import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LanguageSelector from '../components/LanguageSelector';
import { API_BASE_URL } from '../config';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'farmer',
    upiId: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFarmerRole = formData.role === 'farmer';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: [formData.role]
      };
      
      // Include payment details only for farmers
      if (isFarmerRole) {
        payload.upiId = formData.upiId;
        payload.bankAccountNumber = formData.bankAccountNumber;
        payload.bankIfscCode = formData.bankIfscCode;
        payload.bankName = formData.bankName;
      }

      await axios.post(`${API_BASE_URL}/api/auth/signup`, payload);
      
      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        username: formData.username,
        password: formData.password
      });
      
      if (loginResponse.data.token) {
        localStorage.setItem('user', JSON.stringify(loginResponse.data));
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join the Agrishakti network</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Language Preference</label>
          <LanguageSelector variant="default" />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white"
            >
              <option value="farmer">Farmer (Sell crops & get insights)</option>
              <option value="buyer">Buyer (Purchase crops directly)</option>
            </select>
          </div>

          {/* Farmer Payment Details Section */}
          {isFarmerRole && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1">
                💰 Payment Receiving Details
              </h3>
              <p className="text-xs text-amber-600 mb-2">Add your UPI or bank details so buyers can pay you directly for your crops.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (Recommended)</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="yourname@upi"
                />
              </div>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amber-200"></div></div>
                <div className="relative flex justify-center text-xs"><span className="bg-amber-50 px-2 text-amber-500 font-semibold">OR Bank Details</span></div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  placeholder="State Bank of India"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="bankIfscCode"
                    value={formData.bankIfscCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    placeholder="SBIN0001234"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-green-600 hover:text-green-500">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
