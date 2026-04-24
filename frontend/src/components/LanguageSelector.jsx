import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LanguageSelector = ({ variant = 'navbar' }) => {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    // Cookie format is usually /en/hi
    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const parts = googtrans.split('/');
      if (parts.length >= 3) {
        setCurrentLang(parts[2]);
      }
    }
  }, []);

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    setCurrentLang(langCode);
    
    if (langCode === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
    }

    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  const isNavbar = variant === 'navbar';

  return (
    <div className={`relative flex items-center transition rounded-lg border px-2 py-1 ${isNavbar ? 'bg-white/10 hover:bg-white/20 border-white/30' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 w-full mb-4'}`}>
      <Globe size={18} className={`${isNavbar ? 'text-white' : 'text-gray-600'} mr-2`} />
      <select 
        value={currentLang}
        onChange={handleLanguageChange} 
        className={`appearance-none bg-transparent font-medium focus:outline-none cursor-pointer pr-8 w-full ${isNavbar ? 'text-white text-sm' : 'text-gray-800 text-base py-1'}`}
        style={isNavbar ? { textShadow: '0 1px 2px rgba(0,0,0,0.1)' } : {}}
      >
        <option value="en" className="text-gray-900">English</option>
        <option value="hi" className="text-gray-900">हिंदी (Hindi)</option>
        <option value="mr" className="text-gray-900">मराठी (Marathi)</option>
        <option value="ta" className="text-gray-900">தமிழ் (Tamil)</option>
        <option value="te" className="text-gray-900">తెలుగు (Telugu)</option>
        <option value="kn" className="text-gray-900">ಕನ್ನಡ (Kannada)</option>
        <option value="ml" className="text-gray-900">മലയാളം (Malayalam)</option>
        <option value="bn" className="text-gray-900">বাংলা (Bengali)</option>
        <option value="gu" className="text-gray-900">ગુજરાતી (Gujarati)</option>
        <option value="pa" className="text-gray-900">ਪੰਜਾਬੀ (Punjabi)</option>
        <option value="or" className="text-gray-900">ଓଡ଼ିଆ (Odia)</option>
      </select>
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isNavbar ? 'text-white' : 'text-gray-600'}`}>
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
