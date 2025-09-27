// src/pages/Customers.jsx
import { useState, useEffect } from 'react'
import { getCustomers, saveCustomer, deleteCustomer } from '../pages/localStorage'
import CungaNezaLogo from '../components/CungaNezaLogo'
import { useLanguage } from '../Contexts/LanguageContext';

const Customers = ({ onNavigateToDebts, onSelectCustomer }) => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    const customerData = getCustomers()
    setCustomers(customerData)
    setFilteredCustomers(customerData)
  }, [])

  // Filter customers based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)) ||
        (customer.address && customer.address.toLowerCase().includes(query))
      )
      setFilteredCustomers(filtered)
    }
  }, [searchQuery, customers])

  const handleSubmit = (e) => {
    e.preventDefault()
    let newCustomer
    
    if (editMode && currentCustomer) {
      // Update existing customer
      const updatedCustomers = customers.map(customer => 
        customer.id === currentCustomer.id 
          ? { ...customer, ...formData, updatedAt: new Date().toISOString() }
          : customer
      )
      localStorage.setItem('customers', JSON.stringify(updatedCustomers))
      setCustomers(updatedCustomers)
      setEditMode(false)
      setCurrentCustomer(null)
    } else {
      // Add new customer
      newCustomer = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      saveCustomer(newCustomer)
      const updatedCustomers = [...customers, newCustomer]
      setCustomers(updatedCustomers)
      
      // After saving, navigate to debts page and pass the customer data
      if (onNavigateToDebts && newCustomer) {
        if (onSelectCustomer) {
          onSelectCustomer(newCustomer);
        }
        onNavigateToDebts(newCustomer);
      }
    }
    
    setFormData({ name: '', email: '', phone: '', address: '' })
    setShowForm(false)
  }

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    })
    setCurrentCustomer(customer)
    setEditMode(true)
    setShowForm(true)
  }

  const handleAddDebt = (customer) => {
    if (onNavigateToDebts) {
      if (onSelectCustomer) {
        onSelectCustomer(customer);
      }
      onNavigateToDebts(customer);
    }
  }

  const handleDelete = (customerId) => {
    if (window.confirm(t.confirmDeleteCustomer || 'Are you sure you want to delete this customer?')) {
      const updatedCustomers = customers.filter(customer => customer.id !== customerId)
      localStorage.setItem('customers', JSON.stringify(updatedCustomers))
      setCustomers(updatedCustomers)
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', email: '', phone: '', address: '' })
    setShowForm(false)
    setEditMode(false)
    setCurrentCustomer(null)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="customers-container rwanda-gradient-bg">
      <div className="customers-content content-overlay">
        {/* CUNGA NEZA Logo Header */}
        <header className="customers-header">
          <CungaNezaLogo />
        </header>

        <div className="page-header">
          <h1 className="page-title rwanda-blue-text">{t.customers}</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <svg className="icon-plus" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {t.addCustomer}
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay active">
            <div className="modal-content rwanda-card">
              <div className="modal-header">
                <h2>{editMode ? t.editCustomer : t.addCustomer}</h2>
                <button className="close-btn" onClick={handleCancel}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="name">{t.name} *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder={t.enterCustomerName}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">{t.email}</label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t.enterEmailAddress}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">{t.phone}</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder={t.enterPhoneNumber}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">{t.address}</label>
                  <textarea
                    id="address"
                    placeholder={t.enterAddress}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    {t.cancel}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? t.update : t.save} {t.customer}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card rwanda-card">
          <div className="card-header">
            <h3>{t.customerList}</h3>
            <span className="badge">{filteredCustomers.length} {t.customers}</span>
          </div>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-group">
              <svg className="icon-search" width="20" height="20" viewBox="0 0 24 24" fill="#718096">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
              </svg>
              <input
                type="text"
                placeholder={t.searchCustomersPlaceholder || "Search customers by name, email, phone or address..."}
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
          
          <div className="card-body">
            {filteredCustomers.length === 0 ? (
              <div className="empty-state">
                {searchQuery ? (
                  <>
                    <svg className="icon-search" width="48" height="48" viewBox="0 0 24 24" fill="#718096">
                      <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
                    </svg>
                    <p>{t.noCustomersMatchQuery || "No customers match your search criteria."}</p>
                    <button 
                      className="btn btn-outline"
                      onClick={clearSearch}
                    >
                      {t.clearSearch || "Clear search"}
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="icon-users" width="48" height="48" viewBox="0 0 24 24" fill="#718096">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63C19.68 7.55 18.92 7 18.06 7h-.12c-.86 0-1.63.55-1.9 1.37l-.86 2.58c1.08.6 1.82 1.73 1.82 3.05v8h3zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM9 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6.5 11v-6H9v-2c0-1.1.9-2 2-2h5c1.1 0 2 .9 2 2v8h-4.5z"/>
                    </svg>
                    <p>{t.noCustomersFound}</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowForm(true)}
                    >
                      {t.addYourFirstCustomer}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>NAMES</th>
                      <th>PHONE NUMBER</th>
                      <th>ADDRESS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(customer => (
                      <tr key={customer.id}>
                        <td>
                          <div className="customer-name">
                            <span className="avatar">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                            {customer.name}
                          </div>
                        </td>
                        <td>{customer.name || '-'}</td>
                        <td>{customer.phone || '-'}</td>
                        <td>{customer.address || '-'}</td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleEdit(customer)}
                            >
                              <svg className="icon-edit" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                              {t.edit}
                            </button>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleAddDebt(customer)}
                            >
                              <svg className="icon-debt" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-5 0h-2V4h2v4zm-8 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-7-5H4V4h5v10zm10 0h-3V9h.17L19 12.17V14z"/>
                              </svg>
                              {t.addDebt}
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(customer.id)}
                            >
                              <svg className="icon-delete" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                              {t.delete}
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
      </div>
    </div>
  )
}

export default Customers