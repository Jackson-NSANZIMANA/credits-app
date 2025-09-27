// src/components/Navbar.jsx
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useLanguage } from '../Contexts/LanguageContext';

// SVG Flag Components
const USFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" className="flag-icon">
    <rect width="20" height="15" fill="#b22234" />
    <rect width="20" height="1" y="1" fill="#ffffff" />
    <rect width="20" height="1" y="3" fill="#ffffff" />
    <rect width="20" height="1" y="5" fill="#ffffff" />
    <rect width="20" height="1" y="7" fill="#ffffff" />
    <rect width="20" height="1" y="9" fill="#ffffff" />
    <rect width="20" height="1" y="11" fill="#ffffff" />
    <rect width="20" height="1" y="13" fill="#ffffff" />
    <rect width="8" height="8" fill="#3c3b6e" />
    <g fill="#ffffff">
      <circle cx="1.5" cy="1.5" r="0.5" />
      <circle cx="3.5" cy="1.5" r="0.5" />
      <circle cx="5.5" cy="1.5" r="0.5" />
      <circle cx="1.5" cy="3.5" r="0.5" />
      <circle cx="3.5" cy="3.5" r="0.5" />
      <circle cx="5.5" cy="3.5" r="0.5" />
      <circle cx="1.5" cy="5.5" r="0.5" />
      <circle cx="3.5" cy="5.5" r="0.5" />
      <circle cx="5.5" cy="5.5" r="0.5" />
    </g>
  </svg>
);

const RwandaFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" className="flag-icon">
    <rect width="20" height="5" fill="#20603d" /> {/* Green */}
    <rect width="20" height="5" y="5" fill="#fad201" /> {/* Yellow */}
    <rect width="20" height="5" y="10" fill="#00a3de" /> {/* Blue */}
    <circle cx="10" cy="7.5" r="2.5" fill="#e5be01" /> {/* Sun */}
    <g fill="#20603d" stroke="#20603d" strokeWidth="0.5"> {/* Sun rays */}
      <line x1="10" y1="2.5" x2="10" y2="1" />
      <line x1="13" y1="3.5" x2="14.5" y2="2.5" />
      <line x1="15.5" y1="7.5" x2="17.5" y2="7.5" />
      <line x1="13" y1="11.5" x2="14.5" y2="12.5" />
      <line x1="10" y1="12.5" x2="10" y2="14" />
      <line x1="7" y1="11.5" x2="5.5" y2="12.5" />
      <line x1="4.5" y1="7.5" x2="2.5" y2="7.5" />
      <line x1="7" y1="3.5" x2="5.5" y2="2.5" />
    </g>
  </svg>
);

const FranceFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" className="flag-icon">
    <rect width="6.66" height="15" fill="#0055a4" /> {/* Blue */}
    <rect width="6.66" height="15" x="6.67" fill="#ffffff" /> {/* White */}
    <rect width="6.66" height="15" x="13.33" fill="#ef4135" /> {/* Red */}
  </svg>
);

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: <USFlag />, 
      title: 'English',
      colors: ['#b22234', '#ffffff', '#3c3b6e'] // Red, White, Blue
    },
    { 
      code: 'rw', 
      name: 'Kinyarwanda', 
      flag: <RwandaFlag />, 
      title: 'Kinyarwanda',
      colors: ['#20603d', '#fad201', '#00a3de', '#e5be01'] // Green, Yellow, Blue, Gold
    },
    { 
      code: 'fr', 
      name: 'Français', 
      flag: <FranceFlag />, 
      title: 'French',
      colors: ['#0055a4', '#ffffff', '#ef4135'] // Blue, White, Red
    }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <header className="navbar">
      <header className="navbar alternative"></header>
      <header className="navbar vibrant"></header>
      <header className="navbar glass"></header>
      <header className="navbar pattern"></header>
      <header className="navbar stripes"></header>
      <header className="navbar diagonal-split"></header>
      <div className="navbar-left">
        <button 
          className="nav-icon hamburger-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      <div className="navbar-right">
        {/* Language Selector Dropdown */}
        <div className="language-selector-dropdown">
          <button 
            className="language-trigger"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            aria-expanded={showLanguageDropdown}
            aria-haspopup="true"
            style={{
              background: `linear-gradient(135deg, ${currentLang.colors[0]} 0%, ${currentLang.colors[1] || currentLang.colors[0]} 50%, ${currentLang.colors[2] || currentLang.colors[0]} 100%)`
            }}
          >
            <span className="current-flag">{currentLang.flag}</span>
            <span className="current-language">{currentLang.code.toUpperCase()}</span>
            <i className={`fas fa-chevron-${showLanguageDropdown ? 'up' : 'down'}`}></i>
          </button>
          
          {showLanguageDropdown && (
            <div className="language-dropdown-content">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                  title={language.title}
                  style={{
                    '--flag-color-1': language.colors[0],
                    '--flag-color-2': language.colors[1] || language.colors[0],
                    '--flag-color-3': language.colors[2] || language.colors[0]
                  }}
                >
                  <span className="language-flag">{language.flag}</span>
                  <span className="language-name">{language.name}</span>
                  {currentLanguage === language.code && (
                    <i className="fas fa-check"></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="nav-icon" aria-label="Notifications">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        
        {/* User Menu */}
        <div className="user-menu">
          <div className="user-info">
            <span className="user-name">{currentUser?.fullName || 'User'}</span>
            <span className="user-email">{currentUser?.email || currentUser?.phone}</span>
          </div>
          
          <div className="dropdown">
            <button className="nav-icon user-avatar" aria-label="User menu">
              <i className="fas fa-user-circle"></i>
            </button>
            
            <div className="dropdown-content">
              <div className="dropdown-user-info">
                <strong>{currentUser?.fullName || 'User'}</strong>
                <span>{currentUser?.email || currentUser?.phone}</span>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item">
                <i className="fas fa-user"></i>
                {t.profile || 'Profile'}
              </button>
              
              <button className="dropdown-item">
                <i className="fas fa-cog"></i>
                {t.settings || 'Settings'}
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout-btn"
                onClick={logout}
              >
                <i className="fas fa-sign-out-alt"></i>
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close language dropdown */}
      {showLanguageDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowLanguageDropdown(false)}
        />
      )}
    </header>
  );
};

export default Navbar;