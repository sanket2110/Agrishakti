import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, TrendingUp, Cpu, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 md:py-12 space-y-16 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-8 border border-green-200 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Multilingual Support Added
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Empowering Farmers with <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Artificial Intelligence</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          Agrishakti is your all-in-one digital agriculture platform. Detect crop diseases instantly, sell directly to buyers, and access live market prices.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="bg-green-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg shadow-green-600/30 hover:bg-green-700 hover:-translate-y-1 transition transform w-full sm:w-auto">
            Join the Network Free
          </Link>
          <Link to="/login" className="bg-white text-gray-800 border-2 border-gray-200 text-lg font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition w-full sm:w-auto">
            Login to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats/Trust Bar */}
      <div className="w-full max-w-6xl px-4 py-8 border-y border-gray-100 flex flex-col md:flex-row justify-around items-center gap-8 bg-white/50 rounded-3xl">
        <div className="text-center">
          <div className="text-4xl font-black text-gray-900 mb-1">98%</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">AI Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-gray-900 mb-1">0%</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Middleman Fees</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-gray-900 mb-1">10+</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Languages Supported</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition duration-300 group">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
            <Cpu size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Disease Scanner</h3>
          <p className="text-gray-600 leading-relaxed">Simply upload a photo of your paddy leaves from your phone. Our trained Neural Network will instantly diagnose diseases and recommend safe treatments.</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:blue-100 transition duration-300 group">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Direct Marketplace</h3>
          <p className="text-gray-600 leading-relaxed">Bypass all middlemen completely. List your crops securely on our platform and connect directly with verified wholesale buyers across the country.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition duration-300 group">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Farmer Services</h3>
          <p className="text-gray-600 leading-relaxed">Access everything a modern farmer needs: live local APMC mandi prices, daily weather forecasts, crop budget calculators, and government schemes.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
