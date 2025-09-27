// src/components/Sidebar.jsx
import { useLanguage } from '../Contexts/LanguageContext';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, closeSidebar }) => {
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'dashboard', label: t.dashboard, },
    { id: 'customers', label: t.customers },
    { id: 'debts', label: t.debts },
    { id: 'payments', label: t.payments },
    { id: 'reports', label: t.reports },
    { id: 'settings', label: t.settings }
  ];

  const handleMenuItemClick = (pageId) => {
    setActivePage(pageId);
    if (closeSidebar) closeSidebar();
  }

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        {/* CUNGA NEZA Logo Header */}
        <div className="sidebar-header">
          <div className="cunga-neza-logo-header sidebar-logo">
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
            
            {/* Text Content */}
            <div className="logo-text-content">
              <div className="company-name">CUNGA NEZA</div>
              <div className="tagline">TWIRINDE GUHOMBA</div>
            </div>
          </div>
        </div>

        <div className="menu-section">
          <p className="menu-title">Main Navigation</p>
          <nav className="menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`menu-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="upgrade-section">
          <h3>UMUMARO WIYI SYSTEM</h3>
          <div className="plan-card">
            <h4>IFASHA ABACUZI NABACURUZI</h4>
            <p>GUKORA IBARURA MARI NEZE</p>
            <div className="price">MUBURYO BUGEZWEHO</div>
          </div>
          <div className="plan-card recommended">
            <h4>NTAKIGUZI</h4>
            <p>NUBUNTU GUKORESHA IYI SYSTEM</p>
            <div className="price">KUMUNYARWANDA WESE</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;