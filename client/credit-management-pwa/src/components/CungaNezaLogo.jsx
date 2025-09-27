// src/components/CungaNezaLogo.jsx


const CungaNezaLogo = ({ size = 'medium', showTagline = true }) => {
  return (
    <div className={`cunga-neza-logo-header ${size}`}>
      {/* Main Logo Circle */}
      <div className="logo-circle">
        <div className="rwanda-sun-logo">
          <div className="sun-core-logo"></div>
          <div className="sun-rays-logo">
            <div className="ray-logo ray-1"></div>
            <div className="ray-logo ray-2"></div>
            <div className="ray-logo ray-3"></div>
            <div className="ray-logo ray-4"></div>
            <div className="ray-logo ray-5"></div>
            <div className="ray-logo ray-6"></div>
            <div className="ray-logo ray-7"></div>
            <div className="ray-logo ray-8"></div>
          </div>
        </div>
        <div className="partnership-hands-logo">🤝</div>
      </div>
       <div className="cunga-neza-logo-header">
      {/* Your existing logo code */}
      
      {/* Add language selector */}
      
    </div>
      {/* Text Content */}
      <div className="logo-text-content">
        <div className="company-name">CUNGA NEZA</div>
        {showTagline && <div className="tagline">Manage Your Wealth Wisely</div>}
      </div>
    </div>
  );
};

export default CungaNezaLogo;