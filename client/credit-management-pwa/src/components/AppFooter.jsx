// src/components/AppFooter.jsx

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Main Footer Section */}
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <div className="logo-circle-small">
                  <div className="rwanda-sun-small">
                    <div className="sun-core-small"></div>
                  </div>
                </div>
                <span className="footer-logo-text">CUNGA NEZA</span>
              </div>
              <p className="footer-tagline">TWIRINDE GUHOMBA</p>
              <p className="footer-description">
                Professional wealth management and debt tracking system designed 
                to help you manage your finances efficiently and avoid losses.
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#customers">Customers</a></li>
              <li><a href="#debts">Debts Management</a></li>
              <li><a href="#payments">Payments</a></li>
              <li><a href="#reports">Reports</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul className="footer-links">
              <li>Customer Management</li>
              <li>Debt Tracking</li>
              <li>Payment Processing</li>
              <li>Financial Reports</li>
              <li>Real-time Analytics</li>
            </ul>
          </div>

          <div className="footer-section">
  <h4>Contact Info</h4>
  <div className="contact-info">
    <div className="contact-item">
      <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="#00a3de">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
      <span>+250 791708309</span>
    </div>
    <div className="contact-item">
      <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="#11e634ff">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
      <span>info@cunganeza.rw</span>
    </div>
    <div className="contact-item">
      <svg className="contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="#f6be00">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <span>Kigali, Rwanda</span>
    </div>
  </div>
</div>
            
            <div className="social-links">
  <a href="#ishnolan" className="social-link" aria-label="Facebook">
    <svg className="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#00a3de"/>
      <path d="M16.671 15.543l.532-3.47h-3.328V9.823c0-.949.465-1.874 1.956-1.874h1.513V5.096s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.69H7.078v3.47h3.047v8.385c.38.059.77.09 1.167.09s.787-.031 1.167-.09v-8.385h2.796z" fill="#ffffff"/>
    </svg>
  </a>
  
  <a href="#nsanzimana jackson" className="social-link" aria-label="Twitter">
    <svg className="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" fill="#009247"/>
    </svg>
  </a>
  
  <a href="#nsanzimana jackson" className="social-link" aria-label="LinkedIn">
    <svg className="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#f6be00"/>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" fill="#ffffff"/>
    </svg>
  </a>
  
  <a href="#ishnolan" className="social-link" aria-label="Instagram">
    <svg className="social-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00a3de" />
        <stop offset="50%" stopColor="#009247" />
        <stop offset="100%" stopColor="#f6be00" />
      </linearGradient>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)"/>
      <circle cx="12" cy="12" r="3.5" fill="#ffffff"/>
    </svg>
  </a>
</div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} CUNGA NEZA. TWIRINDE GUHOMBA. All rights reserved.</p>
            </div>
            
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#support">Support</a>
            </div>
            
            <div className="footer-credits">
              <p>Made with ❤️ in Rwanda</p>
            </div>
          </div>
        </div>
      
    </footer>
  );
};

export default AppFooter;
