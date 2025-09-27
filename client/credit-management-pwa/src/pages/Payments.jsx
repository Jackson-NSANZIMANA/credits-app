// src/pages/Payments.jsx
import { useState, useEffect } from 'react'
import { getDebts, getPayments, savePayment, getCustomers, updateDebt, deleteDebt } from '../pages/localStorage'
import { sendPaymentConfirmation } from '../pages/notificationService'
import CungaNezaLogo from '../components/CungaNezaLogo'
import { useLanguage } from '../Contexts/LanguageContext'

const Payments = () => {
  const [debts, setDebts] = useState([])
  const [payments, setPayments] = useState([])
  const [customers, setCustomers] = useState([])
  const [selectedDebt, setSelectedDebt] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showPaymentHistory, setShowPaymentHistory] = useState(false)
  const [filterCustomer, setFilterCustomer] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    notes: ''
  })
  const [sendingNotification, setSendingNotification] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState(null)

  const { t, currentLanguage } = useLanguage()

  useEffect(() => {
    loadData()
  }, [])

  // Define getCustomerName before it's used in filteredDebts
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId)
    return customer ? customer.name : t.unknownCustomer
  }

  const loadData = () => {
    const debtsData = getDebts()
    const paymentsData = getPayments()
    const customersData = getCustomers()
    
    setDebts(debtsData)
    setPayments(paymentsData)
    setCustomers(customersData)
  }

  const filteredDebts = debts.filter(debt => {
    // Safely access totalAmount with fallback to 0
    const totalAmount = debt.totalAmount || 0
    const matchesCustomer = filterCustomer ? debt.customerId === parseInt(filterCustomer) : true
    const matchesStatus = filterStatus === 'all' ? true : debt.status === filterStatus
    const matchesSearch = searchQuery ? getCustomerName(debt.customerId).toLowerCase().includes(searchQuery.toLowerCase()) : true
    
    return matchesCustomer && matchesStatus && matchesSearch && (totalAmount > 0 || debt.status !== 'paid')
  })

  const customerPayments = selectedCustomer 
    ? payments.filter(payment => payment.customerId === selectedCustomer.id)
    : []

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedDebt) return

    // Safely get totalAmount with fallback
    const debtTotalAmount = selectedDebt.totalAmount || 0
    const paymentAmount = parseFloat(paymentData.amount)
    
    if (paymentAmount <= 0 || paymentAmount > debtTotalAmount) {
      alert(t.invalidPaymentAmount)
      return
    }

    const newPayment = {
      id: Date.now(),
      debtId: selectedDebt.id,
      customerId: selectedDebt.customerId,
      customerName: selectedDebt.customerName || t.unknownCustomer,
      amount: paymentAmount,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      notes: paymentData.notes,
      previousBalance: debtTotalAmount,
      newBalance: debtTotalAmount - paymentAmount,
      createdAt: new Date().toISOString()
    }

    // Save payment
    savePayment(newPayment)

    // Update debt status if fully paid
    const updatedDebts = debts.map(debt => {
      if (debt.id === selectedDebt.id) {
        const currentTotal = debt.totalAmount || 0
        const newBalance = currentTotal - paymentAmount
        return {
          ...debt,
          totalAmount: newBalance,
          status: newBalance <= 0 ? 'paid' : (debt.status || 'pending'),
          updatedAt: new Date().toISOString()
        }
      }
      return debt
    })

    // Update localStorage
    localStorage.setItem('debts', JSON.stringify(updatedDebts))
    setDebts(updatedDebts)

    // Send payment confirmation
    setSendingNotification(true)
    setNotificationStatus(null)
    
    try {
      const customer = customers.find(c => c.id === selectedDebt.customerId)
      if (customer) {
        const notificationResult = await sendPaymentConfirmation(
          customer,
          newPayment,
          debtTotalAmount - paymentAmount
        )
        
        setNotificationStatus({
          success: notificationResult.success,
          message: notificationResult.message,
          method: notificationResult.method
        })
        
        if (notificationResult.success) {
          alert(`${t.paymentSuccessful} ${t.confirmationSentVia} ${notificationResult.method}.`)
        } else {
          alert(`${t.paymentSuccessful} ${t.couldNotSendConfirmation}: ${notificationResult.message}`)
        }
      } else {
        alert(`${t.paymentSuccessful} (${t.noCustomerContactInfo})`)
      }
    } catch (error) {
      console.error('Notification error:', error)
      alert(`${t.paymentSuccessful} ${t.errorSendingConfirmation}.`)
      setNotificationStatus({
        success: false,
        message: error.message,
        method: 'unknown'
      })
    } finally {
      setSendingNotification(false)
    }

    // Reset form and reload data
    setPaymentData({
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      notes: ''
    })
    setSelectedDebt(null)
    setShowPaymentForm(false)
    loadData()
  }

  const handlePaymentClick = (debt) => {
    setSelectedDebt(debt)
    // Safely get totalAmount with fallback to 0
    const debtTotalAmount = debt.totalAmount || 0
    setPaymentData({
      amount: Math.min(debtTotalAmount, debtTotalAmount).toString(),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      notes: ''
    })
    setShowPaymentForm(true)
  }

  const handleCustomerClick = (customerId) => {
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      setSelectedCustomer(customer)
      setShowPaymentHistory(true)
    }
  }

  const handleClosePaymentHistory = () => {
    setSelectedCustomer(null)
    setShowPaymentHistory(false)
  }

  const handleDeleteDebt = (debtId) => {
    if (window.confirm(t.confirmDeleteDebt || 'Are you sure you want to delete this debt?')) {
      deleteDebt(debtId)
      loadData()
    }
  }

  const getCustomerContact = (customerId) => {
    const customer = customers.find(c => c.id === customerId)
    return customer ? { email: customer.email, phone: customer.phone } : {}
  }

  const getTotalOutstanding = () => {
    return filteredDebts.reduce((total, debt) => total + (debt.totalAmount || 0), 0)
  }

  const getTotalPaid = () => {
    return payments.reduce((total, payment) => total + (payment.amount || 0), 0)
  }

  const getCustomerTotalPaid = (customerId) => {
    return payments
      .filter(payment => payment.customerId === customerId)
      .reduce((total, payment) => total + (payment.amount || 0), 0)
  }

  const getCustomerTotalDebt = (customerId) => {
    return debts
      .filter(debt => debt.customerId === customerId && debt.status !== 'paid')
      .reduce((total, debt) => total + (debt.totalAmount || 0), 0)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      paid: 'badge-success',
      overdue: 'badge-danger'
    }
    
    const statusLabels = {
      pending: t.pending,
      paid: t.paid,
      overdue: t.overdue
    }
    
    return (
      <span className={`badge ${statusClasses[status] || 'badge-secondary'}`}>
        {statusLabels[status] || status}
      </span>
    )
  }

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString()} RWF`
  }
  return (
    <div className="payments-container rwanda-gradient-bg">
      <div className="payments-content content-overlay">
        {/* CUNGA NEZA Logo Header */}
        <header className="payments-header">
          <CungaNezaLogo />
        </header>

        <div className="page-header">
          <h1 className="page-title rwanda-blue-text">{t.payments}</h1>
          <div className="header-stats">
            <div className="stat-item rwanda-card">
              <span className="stat-value rwanda-green-text">{formatCurrency(getTotalOutstanding())}</span>
              <span className="stat-label">{t.outstanding}</span>
            </div>
            <div className="stat-item rwanda-card">
              <span className="stat-value rwanda-green-text">{formatCurrency(getTotalPaid())}</span>
              <span className="stat-label">{t.totalPaid}</span>
            </div>
            <div className="stat-item rwanda-card">
              <span className="stat-value rwanda-blue-text">{filteredDebts.length}</span>
              <span className="stat-label">{t.pendingDebts}</span>
            </div>
          </div>
        </div>

        {/* Notification Status */}
        {notificationStatus && (
          <div className={`notification-alert ${notificationStatus.success ? 'success' : 'error'} rwanda-card`}>
            <svg className={`icon-${notificationStatus.success ? 'success' : 'error'}`} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {notificationStatus.success ? (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              ) : (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              )}
            </svg>
            <span>
              {notificationStatus.success 
                ? `${t.confirmationSentVia} ${notificationStatus.method}`
                : `${t.notificationFailed}: ${notificationStatus.message}`
              }
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="filters-card rwanda-card">
          <h3>{t.filterDebts}</h3>
          <div className="filter-group">
            <div className="form-group">
              <label htmlFor="customerFilter">{t.customer}</label>
              <select
                id="customerFilter"
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
              >
                <option value="">{t.allCustomers}</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="statusFilter">{t.status}</label>
              <select
                id="statusFilter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">{t.allStatus}</option>
                <option value="pending">{t.pending}</option>
                <option value="overdue">{t.overdue}</option>
                <option value="paid">{t.paid}</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-group">
              <svg className="icon-search" width="20" height="20" viewBox="0 0 24 24" fill="#718096">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
              </svg>
              <input
                type="text"
                placeholder={t.searchDebtsByCustomer || "Search debts by customer name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="search-clear" onClick={clearSearch}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#718096">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Outstanding Debts List */}
        <div className="card rwanda-card">
          <div className="card-header">
            <h3>{t.outstandingDebts}</h3>
            <span className="badge">{filteredDebts.length} {t.debts}</span>
          </div>
          
          <div className="card-body">
            {filteredDebts.length === 0 ? (
              <div className="empty-state">
                {searchQuery ? (
                  <>
                    <svg className="icon-search" width="48" height="48" viewBox="0 0 24 24" fill="#718096">
                      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
                    </svg>
                    <p>{t.noDebtsMatchQuery || "No debts match your search criteria."}</p>
                    <button 
                      className="btn btn-outline"
                      onClick={clearSearch}
                    >
                      {t.clearSearch || "Clear search"}
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="icon-money" width="48" height="48" viewBox="0 0 24 24" fill="#718096">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12L3 13.5V15.5L9 14V16H15V14L21 15.5V13.5L15 12V10.5L21 9Z"/>
                    </svg>
                    <p>{t.noOutstandingDebtsFound}</p>
                  </>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t.customer}</th>
                      <th>{t.description}</th>
                      <th>{t.totalAmount}</th>
                      <th>{t.status}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDebts.map(debt => (
                      <tr key={debt.id} className={`debt-row debt-${debt.status || 'pending'}`}>
                        <td>
                          <div className="customer-info">
                            <span className="customer-avatar">
                              {getCustomerName(debt.customerId).charAt(0).toUpperCase()}
                            </span>
                            <button 
                              className="customer-name-link"
                              onClick={() => handleCustomerClick(debt.customerId)}
                              title={t.viewPaymentHistory}
                            >
                              {getCustomerName(debt.customerId)}
                            </button>
                          </div>
                        </td>
                        
                        <td>
                          <div className="debt-description">
                            {debt.description || t.noDescription}
                          </div>
                        </td>
                        
                        <td className="debt-amount">
                          {formatCurrency(debt.totalAmount)}
                        </td>
                        
                        <td>
                          {getStatusBadge(debt.status)}
                        </td>
                        
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handlePaymentClick(debt)}
                              disabled={debt.status === 'paid' || (debt.totalAmount || 0) <= 0}
                              title={t.makePayment}
                            >
                              <svg className="icon-payment" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                              </svg>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteDebt(debt.id)}
                              title={t.deleteDebt}
                            >
                              <svg className="icon-delete" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && selectedDebt && (
          <div className="modal-overlay active">
            <div className="modal-content rwanda-card">
              <div className="modal-header">
                <h2 className="rwanda-blue-text">{t.makePayment}</h2>
                <button className="close-btn" onClick={() => setShowPaymentForm(false)}>×</button>
              </div>
              
              <div className="payment-summary">
                <h4>{t.paymentSummary}</h4>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>{t.customer}:</span>
                    <span>{getCustomerName(selectedDebt.customerId)}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t.contact}:</span>
                    <span>
                      {(() => {
                        const contact = getCustomerContact(selectedDebt.customerId)
                        return contact.phone || contact.email || t.noContactInfo
                      })()}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>{t.outstandingBalance}:</span>
                    <span>{formatCurrency(selectedDebt.totalAmount)}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t.description}:</span>
                    <span>{selectedDebt.description || t.noDescription}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="amount">{t.paymentAmount} (RWF) *</label>
                  <input
                    id="amount"
                    type="number"
                    step="100"
                    min="100"
                    max={selectedDebt.totalAmount || 0}
                    placeholder={t.enterPaymentAmount}
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    required
                  />
                  <div className="amount-slider">
                    <input
                      type="range"
                      min="100"
                      max={selectedDebt.totalAmount || 0}
                      step="100"
                      value={paymentData.amount || 0}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="paymentDate">{t.paymentDate}</label>
                  <input
                    id="paymentDate"
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="paymentMethod">{t.paymentMethod}</label>
                  <select
                    id="paymentMethod"
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                  >
                    <option value="cash">{t.cash}</option>
                    <option value="mobile_money">{t.mobileMoney}</option>
                    <option value="bank_transfer">{t.bankTransfer}</option>
                    <option value="card">{t.card}</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">{t.notes} ({t.optional})</label>
                  <textarea
                    id="notes"
                    placeholder={t.addPaymentNotes}
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    rows="3"
              />
            </div>
            
            <div className="payment-preview">
              <h4>{t.paymentPreview}</h4>
              <div className="preview-details">
                <div className="preview-row">
                  <span>{t.amountToPay}:</span>
                  <span>{formatCurrency(parseFloat(paymentData.amount) || 0)}</span>
                </div>
                <div className="preview-row">
                  <span>{t.remainingBalance}:</span>
                  <span>{formatCurrency((selectedDebt.totalAmount || 0) - (parseFloat(paymentData.amount) || 0))}</span>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentForm(false)}>
                {t.cancel}
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={sendingNotification}
              >
                {sendingNotification ? (
                  <>
                    <svg className="icon-spinner" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97-.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                    {t.sending}...
                  </>
                ) : (
                  t.processPayment
                )}
              </button>
            </div>

            {sendingNotification && (
              <div className="notification-progress">
                <p>{t.sendingPaymentConfirmation}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    )}

    {/* Payment History Modal */}
    {showPaymentHistory && selectedCustomer && (
      <div className="modal-overlay active">
        <div className="modal-content rwanda-card">
          <div className="modal-header">
            <h2 className="rwanda-blue-text">
              {t.paymentHistoryFor} {selectedCustomer.name}
            </h2>
            <button className="close-btn" onClick={handleClosePaymentHistory}>×</button>
          </div>
          
          <div className="customer-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">{t.totalDebt}</span>
                <span className="summary-value rwanda-red-text">
                  {formatCurrency(getCustomerTotalDebt(selectedCustomer.id))}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.totalPaid}</span>
                <span className="summary-value rwanda-green-text">
                  {formatCurrency(getCustomerTotalPaid(selectedCustomer.id))}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.totalPayments}</span>
                <span className="summary-value">
                  {customerPayments.length}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-body">
            {customerPayments.length === 0 ? (
              <div className="empty-state">
                <svg className="icon-history" width="48" height="48" viewBox="0 0 24 24" fill="#718096">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
                <p>{t.noPaymentsForCustomer}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>{t.amount}</th>
                      <th>{t.method}</th>
                      <th>{t.notes}</th>
                      <th>{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerPayments.slice().reverse().map(payment => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</td>
                        <td className="payment-amount">{formatCurrency(payment.amount)}</td>
                        <td>
                          <span className="payment-method">{payment.paymentMethod || t.cash}</span>
                        </td>
                        <td>{payment.notes || '-'}</td>
                        <td>
                          <span className="status-badge status-completed">{t.completed}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>
)
}

export default Payments