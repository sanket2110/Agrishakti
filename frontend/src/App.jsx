import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, Trash2, ChevronDown, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Services from './pages/Services';
import Landing from './pages/Landing';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import LanguageSelector from './components/LanguageSelector';
import { CartProvider, useCart } from './context/CartContext';

// Separate component so useCart can access CartProvider
function AppContent() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    window.dispatchEvent(new Event('auth-change'));
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and all your data (including product listings) will be permanently removed.")) {
      try {
        await axios.delete(`http://localhost:8080/api/auth/delete/${user.id}`);
        handleLogout();
        alert("Your account has been successfully deleted.");
      } catch (err) {
        alert("Failed to delete account. Please try again.");
        console.error(err);
      }
    }
  };

  const isFarmer = user && user.roles && user.roles.includes('ROLE_FARMER');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white p-1 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
              <img src="/logo.png" alt="Agrishakti Logo" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-wider hover:text-green-100 transition">Agrishakti</span>
          </Link>
          <nav className="space-x-6 flex items-center">
            <Link to="/" className="hover:text-green-200 transition">Dashboard</Link>
            <Link to="/marketplace" className="hover:text-green-200 transition">Marketplace</Link>
            {isFarmer && (
              <Link to="/services" className="hover:text-green-200 transition font-bold text-yellow-300 mr-2">Services</Link>
            )}
            
            {/* Cart Icon */}
            {user && !isFarmer && (
              <Link to="/cart" className="relative hover:text-green-200 transition p-1">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Hidden Google Translate Widget */}
            <div id="google_translate_element"></div>
            
            <div className="ml-2 mr-2 w-40 flex items-center">
              <LanguageSelector variant="navbar" />
            </div>

            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 bg-green-800 hover:bg-green-900 px-3 py-2 rounded-lg transition border border-green-600 shadow-inner group"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold group-hover:bg-white transition-colors">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold max-w-[100px] truncate">
                    {user.username}
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account Settings</p>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 transition"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>

                    <button 
                      onClick={handleDeleteAccount}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50 mt-1"
                    >
                      <Trash2 size={16} />
                      <span>Delete Account</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login" className="bg-white text-green-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 border border-white text-white px-4 py-2 rounded-md font-semibold hover:bg-green-500 transition">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/services" element={<Services />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
