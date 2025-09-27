// src/App.jsx
import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Customers from './pages/Customers'
import Debts from './pages/Debts'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ErrorBoundary from './components/ErrorBoundary'
import LandingAuth from './components/LandingAuth'
import { initializeSettings } from './pages/settingsService'
import { AuthProvider, useAuth } from './components/AuthContext'
import AppFooter from './components/AppFooter'
import { LanguageProvider } from './Contexts/LanguageContext' // Fixed path
import './App.css'

// Main app content that requires authentication
function AppContent() {
  const { currentUser, loading: authLoading } = useAuth()
  const [activePage, setActivePage] = useState(() => {
    const savedPage = localStorage.getItem('activePage')
    return savedPage ? savedPage : 'dashboard'
  })
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [settingsInitialized, setSettingsInitialized] = useState(false)

  // Initialize settings on app load
  useEffect(() => {
    const initSettings = async () => {
      try {
        await initializeSettings()
        setSettingsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize settings:', error)
        setSettingsInitialized(true) // Continue anyway
      }
    }

    initSettings()
  }, [])

  // Save active page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activePage', activePage)
  }, [activePage])

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleNavigateToDebts = (customer) => {
    setSelectedCustomer(customer)
    setActivePage('debts')
  }

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
  }

  const renderPage = () => {
    // Show loading while checking authentication
    if (authLoading || !settingsInitialized) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="icon-spinner"></i>
            <p>Loading application...</p>
          </div>
        </div>
      )
    }

    // Show the beautiful landing page with auth form if not logged in
    if (!currentUser) {
      return <LandingAuth />
    }

    // Render the actual app content for logged-in users
    switch(activePage) {
      case 'dashboard': 
        return (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        )
      case 'customers': 
        return (
          <ErrorBoundary>
            <Customers 
              onNavigateToDebts={handleNavigateToDebts}
              onSelectCustomer={handleSelectCustomer}
            />
          </ErrorBoundary>
        )
      case 'debts': 
        return (
          <ErrorBoundary>
            <Debts customer={selectedCustomer} />
          </ErrorBoundary>
        )
      case 'payments': 
        return (
          <ErrorBoundary>
            <Payments />
          </ErrorBoundary>
        )
      case 'reports': 
        return (
          <ErrorBoundary>
            <Reports />
          </ErrorBoundary>
        )
      case 'settings': 
        return (
          <ErrorBoundary>
            <Settings />
          </ErrorBoundary>
        )
      default: 
        return (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        )
    }
  }

  return (
    <div className="app">
      {/* Only show navbar and sidebar if user is logged in */}
      {currentUser && (
        <>
          <Navbar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          <div className="app-body">
            <Sidebar 
              activePage={activePage} 
              setActivePage={setActivePage} 
              sidebarOpen={sidebarOpen} 
              closeSidebar={closeSidebar}
            />
            {/* Overlay for mobile */}
            <div 
              className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
              onClick={closeSidebar}
            ></div>
          </div>
        </>
      )}
      
      <main className={`main-content ${!currentUser ? 'full-page' : ''}`}>
        {renderPage()}
      </main>
      
      {/* Footer only for authenticated users */}
      {currentUser && <AppFooter />}
    </div>
  )
}

// Main App component that wraps everything with providers
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App