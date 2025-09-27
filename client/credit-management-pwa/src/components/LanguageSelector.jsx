// src/components/LanguageSelector.jsx
import { useLanguage } from '../Contexts/LanguageContext';
import { useLanguage } from '../components/LandingAuth';
const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <button 
        className={currentLanguage === 'en' ? 'active' : ''} 
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button 
        className={currentLanguage === 'rw' ? 'active' : ''} 
        onClick={() => changeLanguage('rw')}
      >
        RW
      </button>
      <button 
        className={currentLanguage === 'fr' ? 'active' : ''} 
        onClick={() => changeLanguage('fr')}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSelector;