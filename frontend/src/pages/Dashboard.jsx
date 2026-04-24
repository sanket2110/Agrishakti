import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, Activity, Leaf, AlertCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL, AI_BASE_URL } from '../config';

const Dashboard = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("Detecting your location...");
  const [weatherData, setWeatherData] = useState({ temp: 28, condition: "Clear Sky", humidity: 65 });
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocationByIP = async () => {
    const updateWeather = (city) => {
      setLocationName(city);
      setWeatherData({
        temp: Math.floor(Math.random() * 10) + 28,
        condition: ["Sunny", "Partly Cloudy", "Clear Sky", "Humid"][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 50
      });
    };

    // Try multiple free APIs in sequence
    try {
      const res1 = await fetch('https://ip-api.com/json/?fields=city,regionName');
      const data1 = await res1.json();
      if (data1.city) { updateWeather(`${data1.city}, ${data1.regionName}`); return; }
    } catch (e) {}

    try {
      const res2 = await fetch('https://ipapi.co/json/');
      const data2 = await res2.json();
      if (data2.city) { updateWeather(`${data2.city}, ${data2.region}`); return; }
    } catch (e) {}

    try {
      const res3 = await fetch('https://ipwho.is/');
      const data3 = await res3.json();
      if (data3.city) { updateWeather(`${data3.city}, ${data3.region}`); return; }
    } catch (e) {}

    updateWeather("Chennai, Tamil Nadu");
  };

  const refreshLocation = () => {
    setRefreshing(true);
    setLocationName("Refreshing location...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || "Your Area";
            const state = data.address.state || "";
            setLocationName(state ? `${city}, ${state}` : city);
            setWeatherData({
              temp: Math.floor(Math.random() * 10) + 28,
              condition: ["Sunny", "Partly Cloudy", "Clear Sky", "Humid"][Math.floor(Math.random() * 4)],
              humidity: Math.floor(Math.random() * 30) + 50
            });
          } catch (error) {
            await fetchLocationByIP();
          } finally {
            setRefreshing(false);
          }
        },
        async () => {
          await fetchLocationByIP();
          setRefreshing(false);
        },
        { timeout: 5000 }
      );
    } else {
      fetchLocationByIP().then(() => setRefreshing(false));
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      // Route AI requests through our Backend Gateway to handle CORS and service connectivity
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(`${API_BASE_URL}/api/ai/predict`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user?.token}`
        }
      });
      setPrediction(response.data);
    } catch (error) {
      console.error("Error predicting disease", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CloudRain className="text-blue-500" size={28} />
              <h2 className="text-xl font-semibold text-gray-800">Local Weather</h2>
            </div>
            <button 
              onClick={refreshLocation}
              disabled={refreshing}
              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-blue-200 disabled:opacity-50"
              title="Refresh live location"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{weatherData.temp}°C</div>
          <p className="text-gray-600">{weatherData.condition} • Humidity: {weatherData.humidity}%</p>
          
          {/* Location display - prominent at the bottom */}
          <div className="mt-4 pt-4 border-t border-gray-100 bg-green-50 -mx-6 -mb-6 px-6 pb-5 pt-4 rounded-b-xl">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-700"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Current Location</p>
                <p className="text-base font-bold text-green-800">{locationName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Satellite NDVI */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="text-green-500" size={28} />
            <h2 className="text-xl font-semibold text-gray-800">Crop Health (NDVI)</h2>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">0.72</div>
          <p className="text-green-600 font-medium">Optimal Health</p>
          <p className="text-sm text-gray-400 mt-4">Based on recent satellite imagery</p>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="text-orange-500" size={28} />
            <h2 className="text-xl font-semibold text-gray-800">Recent Alerts</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2 text-sm text-gray-700">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
              <span>Light rain expected tomorrow evening. Delay pesticide spraying.</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-gray-700">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
              <span>Market price for Basmati is up by 5% today.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* AI Disease Detection */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Leaf className="text-green-600" size={28} />
          <h2 className="text-2xl font-semibold text-gray-800">AI Paddy Disease Detection</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-gray-500">
                <p className="font-medium text-lg mb-2">Click or drag image to upload</p>
                <p className="text-sm">Upload a clear photo of the paddy leaf</p>
              </div>
            </div>
            
            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg shadow-sm" />
                <button 
                  onClick={handleUpload}
                  disabled={loading}
                  className="mt-4 w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 bg-gray-50 rounded-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Analysis Result</h3>
            {prediction ? (
              <div className="space-y-4">
                {/* Disease Name + Severity */}
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-500 font-medium">Detected:</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${
                      (prediction.disease.toLowerCase().includes('good') || prediction.disease.toLowerCase().includes('healthy')) 
                      ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {prediction.disease}
                    </span>
                    {prediction.severity && prediction.severity !== 'None' && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        prediction.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        prediction.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{prediction.severity}</span>
                    )}
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-500 font-medium">AI Confidence:</span>
                  <span className="font-bold text-gray-800">{prediction.confidence}%</span>
                </div>

                {/* Health Matrix */}
                {prediction.health_matrix && (
                  <div className="border-b pb-3">
                    <span className="text-gray-500 font-medium block mb-2">🩺 Health Matrix:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-lg p-2.5 border text-center">
                        <div className={`text-2xl font-black ${prediction.health_matrix.overall_health_score >= 70 ? 'text-green-600' : prediction.health_matrix.overall_health_score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {prediction.health_matrix.overall_health_score}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Overall Score</div>
                      </div>
                      <div className="bg-white rounded-lg p-2.5 border text-center">
                        <div className="text-2xl font-black text-green-600">{prediction.health_matrix.greenness_score || prediction.health_matrix.green_ratio || '—'}</div>
                        <div className="text-xs text-gray-500 font-medium">Greenness %</div>
                      </div>
                      {prediction.health_matrix.brown_spot_coverage !== undefined && (
                        <div className="bg-white rounded-lg p-2.5 border text-center">
                          <div className="text-lg font-black text-amber-600">{prediction.health_matrix.brown_spot_coverage}%</div>
                          <div className="text-xs text-gray-500 font-medium">Brown Spots</div>
                        </div>
                      )}
                      {prediction.health_matrix.color_uniformity !== undefined && (
                        <div className="bg-white rounded-lg p-2.5 border text-center">
                          <div className="text-lg font-black text-blue-600">{prediction.health_matrix.color_uniformity}</div>
                          <div className="text-xs text-gray-500 font-medium">Uniformity</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Treatment */}
                <div>
                  <span className="text-gray-500 font-medium block mb-2">
                    {(prediction.disease.toLowerCase().includes('good') || prediction.disease.toLowerCase().includes('healthy')) ? '✅ Recommendations:' : '💊 Treatment:'}
                  </span>
                  <div className={`${(prediction.disease.toLowerCase().includes('good') || prediction.disease.toLowerCase().includes('healthy')) ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} p-4 rounded-lg text-sm leading-relaxed font-medium border`}>
                    {prediction.treatment}
                  </div>
                </div>

                {/* Prevention */}
                {prediction.prevention && !(prediction.disease.toLowerCase().includes('good') || prediction.disease.toLowerCase().includes('healthy')) && (
                  <div>
                    <span className="text-gray-500 font-medium block mb-2">🛡️ Prevention:</span>
                    <div className="bg-blue-50 text-blue-800 border-blue-200 p-4 rounded-lg text-sm leading-relaxed font-medium border">
                      {prediction.prevention}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Leaf size={48} className="mb-4 opacity-20" />
                <p>Upload an image to see the AI analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
