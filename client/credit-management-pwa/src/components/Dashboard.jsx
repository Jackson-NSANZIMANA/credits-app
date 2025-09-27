// src/components/Dashboard.jsx
import { useState, useEffect } from 'react'
import { getDashboardData } from '../pages/localStorage'
import SpendingChart from './SpendingChart'
import CungaNezaLogo from './CungaNezaLogo'
import { useLanguage } from '../Contexts/LanguageContext' 

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDebts: 0,
    totalPaid: 0,
    remainingBalance: 0,
    recentTransactions: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { t, currentLanguage } = useLanguage()

  useEffect(() => {
    let isMounted = true
    
    const loadData = () => {
      try {
        setLoading(true)
        setError(null)
        const data = getDashboardData()
        
        if (isMounted) {
          setDashboardData(data)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load dashboard data:", err)
          setError("Failed to load dashboard data")
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  // Format date based on current language
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      const options = { day: 'numeric', month: 'short', year: 'numeric' }
      
      if (currentLanguage === 'rw') {
        // Kinyarwanda date formatting
        const months = {
          'Jan': 'Mut', 'Feb': 'Gas', 'Mar': 'Wer', 'Apr': 'Mat',
          'May': 'Gic', 'Jun': 'Kam', 'Jul': 'Nya', 'Aug': 'Kan',
          'Sep': 'Nze', 'Oct': 'Ukw', 'Nov': 'Ugu', 'Dec': 'Uku'
        }
        const formatted = date.toLocaleDateString('en-US', options)
        return formatted.replace(/\w+/g, (m) => months[m] || m)
      }
      
      return date.toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', options)
    } catch (error) {
      console.error("Date formatting error:", error)
      return dateString || "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="dashboard rwanda-gradient-bg">
        <div className="dashboard-content content-overlay">
          <header className="dashboard-header">
            <CungaNezaLogo />
          </header>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard rwanda-gradient-bg">
        <div className="dashboard-content content-overlay">
          <header className="dashboard-header">
            <CungaNezaLogo />
          </header>
          <div className="error-message">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard rwanda-gradient-bg">
      <div className="dashboard-content content-overlay">
        {/* CUNGA NEZA Logo Header */}
        <header className="dashboard-header">
          <CungaNezaLogo />
        </header>

        <h1 className="rwanda-blue-text"></h1>
        
        <div className="dashboard-grid">
          <div className="card balance-card rwanda-card">
            <h2>{t.availableBalance}</h2>
            <div className="balance-amount rwanda-green-text">{dashboardData.remainingBalance.toLocaleString()} RWF</div>
            <button className="see-details-btn">{t.seeDetails}</button>
          </div>

          <div className="card budget-card rwanda-card">
            <h2>{t.budgetFor} {new Date().toLocaleString(currentLanguage, { month: 'long' })}</h2>
            <div className="cash-available rwanda-green-text">{dashboardData.remainingBalance.toLocaleString()} RWF</div>
            <p>{t.cashAvailable}</p>
          </div>

          
          </div>

          <div className="card cash-card rwanda-card">
            <h2>{t.cash}</h2>
            <div className="cash-amount rwanda-green-text">{dashboardData.totalPaid.toLocaleString()} RWF</div>
            <div className="income-label">{t.income}</div>
            <div className="cash-actions">
              <button className="icon-btn"><i className="fas fa-plus"></i></button>
              <button className="icon-btn"><i className="fas fa-plus"></i></button>
            </div>
          </div>

          <div className="card spending-card rwanda-card">
            <h2>{t.mySpending}</h2>
            <SpendingChart />
          </div>

          <div className="card budget-breakdown-card rwanda-card">
            <h2>{t.budgetFor} {new Date().toLocaleString(currentLanguage, { month: 'long' })}</h2>
            <div className="budget-amount rwanda-green-text">{dashboardData.remainingBalance.toLocaleString()} RWF</div>
          </div>

         
              
             
              <>
                

                
                 
              </>
            
          </div>
        </div>
     
   
  )
}

export default Dashboard