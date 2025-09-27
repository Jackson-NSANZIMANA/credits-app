// src/pages/Debts.jsx
import { useState, useEffect } from 'react'
import { getDebts, saveDebt, deleteDebt, updateDebt, getCustomers } from '../pages/localStorage'
import CungaNezaLogo from '../components/CungaNezaLogo'
import { useLanguage } from '../Contexts/LanguageContext'

const Debts = ({ customer }) => {
  const [debts, setDebts] = useState([])
  const [allCustomers, setAllCustomers] = useState([])
  const [filteredDebts, setFilteredDebts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentDebt, setCurrentDebt] = useState(null)
  const [products, setProducts] = useState([{ name: '', quantity: '', price: '', total: 0 }])
  const [formData, setFormData] = useState({
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    totalAmount: 0
  })

  const { t, currentLanguage } = useLanguage()

  useEffect(() => {
    loadDebts()
    loadCustomers()
  }, [customer])

  useEffect(() => {
    // Filter debts based on search query
    if (searchQuery.trim() === '') {
      setFilteredDebts(debts)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = debts.filter(debt => {
        const customerName = getCustomerName(debt.customerId).toLowerCase()
        return customerName.includes(query)
      })
      setFilteredDebts(filtered)
    }
  }, [searchQuery, debts])

  const loadDebts = () => {
    const debtsData = getDebts()
    const customerDebts = customer 
      ? debtsData.filter(debt => debt.customerId === customer.id)
      : debtsData
    setDebts(customerDebts)
    setFilteredDebts(customerDebts)
  }

  const loadCustomers = () => {
    const customersData = getCustomers()
    setAllCustomers(customersData)
  }

  const getCustomerName = (customerId) => {
    if (!customerId) return t.unknownCustomer
    const customer = allCustomers.find(c => c.id === customerId)
    return customer ? customer.name : t.unknownCustomer
  }

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products]
    updatedProducts[index][field] = value
    
    // Calculate total if quantity or price changes
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(updatedProducts[index].quantity) || 0
      const price = parseFloat(updatedProducts[index].price) || 0
      updatedProducts[index].total = quantity * price
    }
    
    setProducts(updatedProducts)
    
    // Update total amount
    const totalAmount = updatedProducts.reduce((sum, product) => sum + product.total, 0)
    setFormData(prev => ({ ...prev, totalAmount }))
  }

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '', price: '', total: 0 }])
  }

  const removeProduct = (index) => {
    if (products.length > 1) {
      const updatedProducts = products.filter((_, i) => i !== index)
      setProducts(updatedProducts)
      
      const totalAmount = updatedProducts.reduce((sum, product) => sum + product.total, 0)
      setFormData(prev => ({ ...prev, totalAmount }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const debtData = {
      id: editMode && currentDebt ? currentDebt.id : Date.now(),
      customerId: customer ? customer.id : null,
      customerName: customer ? customer.name : t.unknownCustomer,
      ...formData,
      products: products.filter(p => p.name && p.quantity && p.price),
      createdAt: editMode && currentDebt ? currentDebt.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editMode && currentDebt) {
      updateDebt(debtData)
    } else {
      saveDebt(debtData)
    }
    
    resetForm()
    loadDebts()
  }

  const handleEdit = (debt) => {
    setFormData({
      description: debt.description || '',
      date: debt.date || new Date().toISOString().split('T')[0],
      status: debt.status || 'pending',
      totalAmount: debt.totalAmount || 0
    })
    setProducts(debt.products || [{ name: '', quantity: '', price: '', total: 0 }])
    setCurrentDebt(debt)
    setEditMode(true)
    setShowForm(true)
  }

  const handleDelete = (debtId) => {
    if (window.confirm(t.confirmDeleteDebt)) {
      deleteDebt(debtId)
      loadDebts()
    }
  }

  const handleStatusChange = (debtId, newStatus) => {
    const debt = debts.find(d => d.id === debtId)
    if (debt) {
      const updatedDebt = { ...debt, status: newStatus, updatedAt: new Date().toISOString() }
      updateDebt(updatedDebt)
      loadDebts()
    }
  }

  const resetForm = () => {
    setFormData({
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      totalAmount: 0
    })
    setProducts([{ name: '', quantity: '', price: '', total: 0 }])
    setShowForm(false)
    setEditMode(false)
    setCurrentDebt(null)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const calculateTotalDebts = () => {
    return filteredDebts.reduce((total, debt) => total + (debt.totalAmount || 0), 0)
  }

  const calculateTotalByStatus = (status) => {
    return filteredDebts
      .filter(debt => debt.status === status)
      .reduce((total, debt) => total + (debt.totalAmount || 0), 0)
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

  const formatProductList = (debtProducts) => {
    return debtProducts.map((product, index) => (
      <div key={index} className="product-item">
        <span className="product-number">{index + 1}.</span>
        <span className="product-details">
          {product.name} {product.quantity} {getUnitType(product.name)} × {product.price} = {product.total} RWF
        </span>
      </div>
    ))
  }

  const getUnitType = (productName) => {
    const product = productName.toLowerCase()
    if (product.includes('rice') || product.includes('sugar') || product.includes('flour')) return 'kg'
    if (product.includes('oil') || product.includes('water') || product.includes('juice')) return 'L'
    if (product.includes('egg') || product.includes('banana') || product.includes('orange')) return 'pcs'
    return 'units'
  }

  return (
    <div className="debts-container rwanda-gradient-bg">
      <div className="debts-content content-overlay">
        {/* CUNGA NEZA Logo Header */}
        <header className="debts-header">
          <CungaNezaLogo />
        </header>

        <div className="page-header">
          <h1 className="page-title rwanda-blue-text">
            {customer ? `${t.debtsFor} ${customer.name}` : t.allDebts}
          </h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={!customer}
          >
            <svg className="icon-plus" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {t.addDebt}
          </button>
        </div>

        {!customer && (
          <div className="alert alert-info rwanda-card">
            <svg className="icon-info" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            {t.selectCustomerFromCustomers}
          </div>
        )}

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card rwanda-card">
            <div className="summary-value rwanda-green-text">{calculateTotalDebts().toLocaleString()} RWF</div>
            <div className="summary-label">{t.totalDebt}</div>
          </div>
          <div className="summary-card rwanda-card">
            <div className="summary-value rwanda-yellow-text">{calculateTotalByStatus('pending').toLocaleString()} RWF</div>
            <div className="summary-label">{t.pendingAmount}</div>
          </div>
          <div className="summary-card rwanda-card">
            <div className="summary-value rwanda-green-text">{calculateTotalByStatus('paid').toLocaleString()} RWF</div>
            <div className="summary-label">{t.paidAmount}</div>
          </div>
          <div className="summary-card rwanda-card">
            <div className="summary-value rwanda-blue-text">
              {filteredDebts.filter(d => d.status === 'pending').length}
            </div>
            <div className="summary-label">{t.pendingDebts}</div>
          </div>
        </div>

        {/* Search Bar - Only show when viewing all debts (no specific customer) */}
        {!customer && (
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
        )}

        {/* Debt form modal */}
        {showForm && (
          <div className="modal-overlay active">
            <div className="modal-content rwanda-card">
              <div className="modal-header">
                <h2 className="rwanda-blue-text">{editMode ? t.editDebt : t.addNewDebt} {customer?.name}</h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="description">{t.description}</label>
                  <input
                    id="description"
                    type="text"
                    placeholder={t.enterDebtDescription}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>{t.products}</label>
                  {products.map((product, index) => (
                    <div key={index} className="product-input-group">
                      <input
                        type="text"
                        placeholder={t.productName}
                        value={product.name}
                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                        className="product-name"
                      />
                      <input
                        type="number"
                        placeholder={t.quantity}
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        className="product-quantity"
                        min="0"
                        step="0.1"
                      />
                      <input
                        type="number"
                        placeholder={t.price}
                        value={product.price}
                        onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                        className="product-price"
                        min="0"
                      />
                      <span className="product-total">{product.total} RWF</span>
                      {products.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeProduct(index)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-outline" onClick={addProduct}>
                    <svg className="icon-plus" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    {t.addProduct}
                  </button>
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">{t.date}</label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">{t.status}</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">{t.pending}</option>
                    <option value="paid">{t.paid}</option>
                    <option value="overdue">{t.overdue}</option>
                  </select>
                </div>
                
                <div className="form-total">
                  <strong>{t.totalAmount}: {formData.totalAmount.toLocaleString()} RWF</strong>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    {t.cancel}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? t.update : t.save} {t.debt}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Debts list */}
        <div className="card rwanda-card">
          <div className="card-header">
            <h3>{t.debtRecords}</h3>
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
                    <svg className="icon-debt" width="48" height="48" viewBox="0 0 24 24" fill="#718096">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-5 0h-2V4h2v4zm-8 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-7-5H4V4h5v10zm10 0h-3V9h.17L19 12.17V14z"/>
                    </svg>
                    <p>{t.noDebtRecordsFound}</p>
                    {customer && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                      >
                        {t.addYourFirstDebt}
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      {!customer && <th>{t.customer}</th>}
                      <th>{t.products}</th>
                      <th>{t.totalAmount}</th>
                      <th>{t.status}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDebts.map(debt => (
                      <tr key={debt.id} className={`debt-row debt-${debt.status}`}>
                        <td data-label={t.date}>
                          {new Date(debt.date || debt.createdAt).toLocaleDateString()}
                        </td>
                        
                        {!customer && (
                          <td data-label={t.customer}>
                            <div className="customer-info">
                              <span className="customer-avatar">
                                {getCustomerName(debt.customerId).charAt(0).toUpperCase()}
                              </span>
                              <span className="customer-name">
                                {getCustomerName(debt.customerId)}
                              </span>
                            </div>
                          </td>
                        )}
                        
                        <td data-label={t.products}>
                          <div className="debt-products">
                            {debt.products && debt.products.length > 0 ? (
                              formatProductList(debt.products)
                            ) : (
                              <span className="no-products">{t.noProductsListed}</span>
                            )}
                          </div>
                        </td>
                        
                        <td data-label={t.totalAmount} className="debt-amount">
                          {debt.totalAmount ? `${debt.totalAmount.toLocaleString()} RWF` : '0 RWF'}
                        </td>
                        
                        <td data-label={t.status}>
                          {getStatusBadge(debt.status)}
                        </td>
                        
                        <td data-label={t.actions}>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline"
                              onClick={() => handleEdit(debt)}
                              title={t.editDebt}
                            >
                              <svg className="icon-edit" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                              {t.edit}
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(debt.id)}
                              title={t.deleteDebt}
                            >
                              <svg className="icon-delete" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                              {t.delete}
                            </button>
                            {debt.status !== 'paid' && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleStatusChange(debt.id, 'paid')}
                                title={t.markAsPaid}
                              >
                                <svg className="icon-check" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                                {t.paid}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={customer ? 2 : 3} className="text-end">
                        <strong>{t.total}:</strong>
                      </td>
                      <td><strong>{calculateTotalDebts().toLocaleString()} RWF</strong></td>
                      <td colSpan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debts