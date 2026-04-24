import React, { useState, useEffect } from 'react';
import { Cloud, MapPin, Calculator, TrendingUp, BookOpen, Landmark, ChevronRight, Droplet, Wind, Sun, Search } from 'lucide-react';

const Services = () => {
  const [activeTab, setActiveTab] = useState('weather');
  const [userLocation, setUserLocation] = useState('Chennai, Tamil Nadu');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedScheme, setExpandedScheme] = useState(null);
  
  // Budget Calculator State
  const [landSize, setLandSize] = useState('');
  const [cropType, setCropType] = useState('Basmati');
  const [budgetResult, setBudgetResult] = useState(null);

  // Dynamic Weather and Market Data
  const [weatherData, setWeatherData] = useState({
    temp: 35, condition: 'Hot & Humid', humidity: 80, wind: 14, uv: 9, rain: 20
  });

  const [marketData, setMarketData] = useState([
    { mandi: 'Chennai APMC', crop: 'Samba Masuri', min: 2800, max: 3200, trend: '+1.5%', icon: TrendingUp, color: 'text-green-600' },
    { mandi: 'Kanchipuram Market', crop: 'Ponni Rice', min: 2400, max: 2700, trend: 'Stable', icon: TrendingUp, color: 'text-gray-500' },
    { mandi: 'Villupuram Mandi', crop: 'Common Raw Paddy', min: 1900, max: 2100, trend: '-0.5%', icon: TrendingUp, color: 'text-red-500' }
  ]);

  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Capitalize first letter of search query
    const newLocation = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
    setUserLocation(newLocation);
    
    // Simulate fetching new weather data
    setWeatherData({
      temp: Math.floor(Math.random() * 15) + 25, // 25-40
      condition: ['Sunny', 'Partly Cloudy', 'Rainy', 'Clear', 'Humid'][Math.floor(Math.random() * 5)],
      humidity: Math.floor(Math.random() * 50) + 40,
      wind: Math.floor(Math.random() * 20) + 5,
      uv: Math.floor(Math.random() * 10) + 1,
      rain: Math.floor(Math.random() * 60)
    });

    // Simulate fetching new market data based on location
    setMarketData([
      { mandi: `${newLocation} Central Market`, crop: 'Premium Paddy', min: Math.floor(Math.random() * 1000) + 2500, max: Math.floor(Math.random() * 1000) + 3500, trend: '+2%', icon: TrendingUp, color: 'text-green-600' },
      { mandi: `${newLocation} Wholesale`, crop: 'Sona Masuri', min: Math.floor(Math.random() * 500) + 2000, max: Math.floor(Math.random() * 500) + 2500, trend: 'Stable', icon: TrendingUp, color: 'text-gray-500' },
      { mandi: `${newLocation} APMC`, crop: 'Common Raw Paddy', min: Math.floor(Math.random() * 300) + 1700, max: Math.floor(Math.random() * 300) + 2000, trend: '-1%', icon: TrendingUp, color: 'text-red-500' }
    ]);
    
    setSearchQuery('');
  };

  const calculateBudget = (e) => {
    e.preventDefault();
    if (!landSize) return;
    
    const size = parseFloat(landSize);
    let baseCost = cropType === 'Basmati' ? 15000 : 12000;
    
    const costs = {
      seeds: size * (baseCost * 0.15),
      fertilizers: size * (baseCost * 0.35),
      labor: size * (baseCost * 0.30),
      machinery: size * (baseCost * 0.20),
    };
    
    const totalCost = costs.seeds + costs.fertilizers + costs.labor + costs.machinery;
    const expectedRevenue = size * (cropType === 'Basmati' ? 45000 : 35000);
    const expectedProfit = expectedRevenue - totalCost;

    setBudgetResult({ costs, totalCost, expectedRevenue, expectedProfit });
  };

  const renderSearchBar = (placeholder) => (
    <form onSubmit={handleLocationSearch} className="flex gap-2 w-full max-w-sm mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder={placeholder}
        />
      </div>
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 shadow-sm">
        <Search size={16} /> Search
      </button>
    </form>
  );

  const renderWeather = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Cloud className="text-blue-500" /> Local Weather Forecast
        </h2>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm border border-blue-100">
          <MapPin size={16} /> {userLocation}
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mb-6">Showing live forecast for {userLocation}. Search below to change location.</p>
      {renderSearchBar("Search city for weather...")}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white flex flex-col items-center justify-center shadow-md transform hover:scale-[1.02] transition">
          <Sun size={64} className="mb-2 text-yellow-300" />
          <h3 className="text-5xl font-bold mb-1">{weatherData.temp}°C</h3>
          <p className="text-blue-100 text-xl font-medium">{weatherData.condition}</p>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100 hover:shadow-sm transition">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Droplet size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">Humidity</p>
              <p className="text-2xl font-bold text-gray-800">{weatherData.humidity}%</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100 hover:shadow-sm transition">
            <div className="bg-teal-100 p-3 rounded-full text-teal-600"><Wind size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">Wind Speed</p>
              <p className="text-2xl font-bold text-gray-800">{weatherData.wind} km/h</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100 hover:shadow-sm transition">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Sun size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">UV Index</p>
              <p className="text-2xl font-bold text-gray-800">{weatherData.uv}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100 hover:shadow-sm transition">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><Cloud size={24} /></div>
            <div>
              <p className="text-gray-500 text-sm">Rain Chance</p>
              <p className="text-2xl font-bold text-gray-800">{weatherData.rain}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-purple-600" /> Live Market Prices
        </h2>
        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm border border-purple-100">
          <MapPin size={16}/> {userLocation}
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mb-6">Showing mandis near {userLocation}. Search below to check other districts.</p>
      {renderSearchBar("Search district for market prices...")}
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider font-semibold">
              <th className="p-4 border-b">Mandi (Market)</th>
              <th className="p-4 border-b">Crop Variety</th>
              <th className="p-4 border-b">Min Price (₹/Qtl)</th>
              <th className="p-4 border-b">Max Price (₹/Qtl)</th>
              <th className="p-4 border-b">Trend</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 divide-y divide-gray-200">
            {marketData.map((data, index) => (
              <tr key={index} className="hover:bg-purple-50/50 transition">
                <td className="p-4 font-medium text-gray-900">{data.mandi}</td>
                <td className="p-4">{data.crop}</td>
                <td className="p-4 text-gray-600 font-medium">{data.min.toLocaleString()}</td>
                <td className="p-4 font-bold text-green-700">{data.max.toLocaleString()}</td>
                <td className={`p-4 font-bold flex items-center gap-1 ${data.color}`}>
                  <data.icon size={16} className={data.trend.includes('-') && !data.trend.includes('Stable') ? 'rotate-180' : ''}/> 
                  {data.trend}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">* Prices are simulated for demo purposes based on {userLocation} APMC data.</p>
    </div>
  );

  const renderCalculator = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Calculator className="text-green-600" /> Crop Budget Calculator
        </h2>
        <form onSubmit={calculateBudget} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (Acres)</label>
            <input type="number" required min="0.1" step="0.1" value={landSize} onChange={(e) => setLandSize(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
            <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500">
              <option value="Basmati">Basmati Paddy</option>
              <option value="SonaMasuri">Sona Masuri Paddy</option>
              <option value="Common">Common Raw Paddy</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition shadow-md">
            Calculate Estimate
          </button>
        </form>
      </div>

      {budgetResult && (
        <div className="flex-1 bg-green-50 rounded-xl p-6 border border-green-100 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-green-800 mb-4 border-b border-green-200 pb-2">Estimated Financials</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Seeds & Saplings:</span> <strong>₹{budgetResult.costs.seeds.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Fertilizers & Pesticides:</span> <strong>₹{budgetResult.costs.fertilizers.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Labor Costs:</span> <strong>₹{budgetResult.costs.labor.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-gray-700 border-b border-green-200 pb-3">
              <span>Machinery & Fuel:</span> <strong>₹{budgetResult.costs.machinery.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-red-600 font-semibold pt-1">
              <span>Total Investment:</span> <span>₹{budgetResult.totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-blue-600 font-semibold">
              <span>Expected Revenue:</span> <span>₹{budgetResult.expectedRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-700 font-bold text-xl pt-3 border-t border-green-200">
              <span>Est. Net Profit:</span> <span>₹{budgetResult.expectedProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const SCHEMES_DATA = [
    { 
      id: 1,
      title: "PM-Kisan Samman Nidhi", 
      desc: "Income support of ₹6,000 per year in three equal installments to all land holding farmer families.", 
      tag: "Financial", 
      status: "Active",
      eligibility: "All landholding farmer families, subject to certain exclusion criteria (e.g., institutional landholders, high-income earners). Must have valid Aadhaar and bank account.",
      benefits: "₹2000 transferred directly to bank account every 4 months.",
      link: "https://pmkisan.gov.in/"
    },
    { 
      id: 2,
      title: "Pradhan Mantri Fasal Bima Yojana", 
      desc: "Provides insurance cover against crop failure due to natural calamities, pests & diseases.", 
      tag: "Insurance", 
      status: "Active",
      eligibility: "Available to all farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
      benefits: "Lowest premium rates (2% for Kharif, 1.5% for Rabi) with full insured amount paid on crop failure.",
      link: "https://pmfby.gov.in/"
    },
    { 
      id: 3,
      title: "Kisan Credit Card (KCC)", 
      desc: "Provides farmers with timely access to credit for agricultural and allied activities at affordable rates.", 
      tag: "Credit", 
      status: "Available",
      eligibility: "All farmers, tenant farmers, share croppers, SHGs, and JLGs. Age limit usually 18-75 years.",
      benefits: "Flexible repayment options, low interest rates (often subvented to 4%), and ATM-enabled RuPay card.",
      link: "https://www.myscheme.gov.in/schemes/kcc"
    }
  ];

  const renderSchemes = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Landmark className="text-orange-500" /> Government Schemes & Benefits
      </h2>
      
      <div className="space-y-4">
        {SCHEMES_DATA.map((scheme) => (
          <div key={scheme.id} className="border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition">{scheme.title}</h3>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">{scheme.status}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{scheme.desc}</p>
            
            {expandedScheme === scheme.id && (
              <div className="bg-orange-50 p-4 rounded-lg mb-4 text-sm border border-orange-100 animate-fade-in">
                <div className="mb-3">
                  <strong className="text-orange-800 block mb-1">Eligibility Criteria:</strong>
                  <p className="text-gray-700">{scheme.eligibility}</p>
                </div>
                <div className="mb-4">
                  <strong className="text-orange-800 block mb-1">Key Benefits:</strong>
                  <p className="text-gray-700">{scheme.benefits}</p>
                </div>
                <a href={scheme.link} target="_blank" rel="noreferrer" className="inline-block bg-orange-600 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-700 transition shadow-sm">
                  Visit Official Website
                </a>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">{scheme.tag}</span>
              <button 
                onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                className="text-orange-600 font-semibold text-sm flex items-center hover:text-orange-700 transition"
              >
                {expandedScheme === scheme.id ? 'Hide Details' : 'Check Eligibility'} 
                <ChevronRight size={16} className={`transform transition-transform ml-1 ${expandedScheme === scheme.id ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGuides = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <BookOpen className="text-emerald-600" /> Crop Planting Guides
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition">
          <img src="https://images.unsplash.com/photo-1595801772421-4d7cbdb4ec0f?auto=format&fit=crop&w=600&q=80" alt="Paddy Cultivation" className="w-full h-40 object-cover group-hover:scale-105 transition duration-500" />
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2">Modern Paddy Cultivation</h3>
            <p className="text-gray-600 text-sm mb-4">Learn the SRI (System of Rice Intensification) method to increase yield by 30% while saving water.</p>
            <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-emerald-100 transition">Read Guide</button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition">
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80" alt="Soil Testing" className="w-full h-40 object-cover group-hover:scale-105 transition duration-500" />
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2">Soil Health Management</h3>
            <p className="text-gray-600 text-sm mb-4">How to test your soil and choose the right NPK fertilizer ratios for different growth stages.</p>
            <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-emerald-100 transition">Read Guide</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Services Hub</h1>
        <p className="text-gray-600">Access essential tools, live data, and government resources to maximize your yield.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            <button 
              onClick={() => setActiveTab('weather')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${activeTab === 'weather' ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <Cloud size={20} className={activeTab === 'weather' ? 'text-blue-600' : ''}/> Weather Forecast
            </button>
            <button 
              onClick={() => setActiveTab('market')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${activeTab === 'market' ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <TrendingUp size={20} className={activeTab === 'market' ? 'text-purple-600' : ''}/> Market Prices
            </button>
            <button 
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${activeTab === 'calculator' ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <Calculator size={20} className={activeTab === 'calculator' ? 'text-green-600' : ''}/> Budget Calculator
            </button>
            <button 
              onClick={() => setActiveTab('schemes')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${activeTab === 'schemes' ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <Landmark size={20} className={activeTab === 'schemes' ? 'text-orange-600' : ''}/> Gov. Schemes
            </button>
            <button 
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${activeTab === 'guides' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <BookOpen size={20} className={activeTab === 'guides' ? 'text-emerald-600' : ''}/> Planting Guides
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'weather' && renderWeather()}
          {activeTab === 'market' && renderMarket()}
          {activeTab === 'calculator' && renderCalculator()}
          {activeTab === 'schemes' && renderSchemes()}
          {activeTab === 'guides' && renderGuides()}
        </div>
      </div>
    </div>
  );
};

export default Services;
