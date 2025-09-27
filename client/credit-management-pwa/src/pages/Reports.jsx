// src/pages/Reports.jsx
import { useState, useEffect, useRef } from 'react';
import { getDebts, getPayments, getCustomers } from '../pages/localStorage';

// SVG Icons (inline to avoid dependency issues)
const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const FileSpreadsheetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const FileCodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="10 13 8 15 10 17" />
    <polyline points="14 13 16 15 14 17" />
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M16 8h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
    <path d="M12 8V6" />
    <path d="M12 13v-2" />
    <path d="M12 18v-2" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

// Report Generator Functions
const generateReport = (type, dateRange, debts, payments, customers) => {
  const filteredPayments = filterDataByDateRange(payments, type, dateRange);
  const filteredDebts = filterDataByDateRange(debts, type, dateRange);

  const customerDetails = calculateCustomerDetails(customers, payments, debts);
  const recentTransactions = getRecentTransactions(filteredPayments);
  const paymentMethods = calculatePaymentMethods(filteredPayments);

  return {
    title: getReportTitle(type, dateRange),
    period: getReportPeriod(type, dateRange),
    summary: {
      totalRevenue: calculateTotalRevenue(filteredPayments),
      totalDebts: calculateTotalDebts(filteredDebts),
      totalCustomers: customers.length,
      totalTransactions: filteredPayments.length
    },
    customerDetails,
    recentTransactions,
    paymentMethods
  };
};

const filterDataByDateRange = (data, type, dateRange) => {
  const now = new Date();
  let startDate, endDate;

  switch (type) {
    case 'daily':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case 'weekly':
      startDate = new Date(now.setDate(now.getDate() - 7));
      endDate = new Date();
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    case 'custom':
      startDate = new Date(dateRange.start);
      endDate = new Date(dateRange.end);
      break;
    default:
      return data;
  }

  return data.filter(item => {
    const itemDate = new Date(item.paymentDate || item.date || item.createdAt);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

const calculateCustomerDetails = (customers, allPayments, allDebts) => {
  return customers.map(customer => {
    // Get all payments for this customer
    const customerPayments = allPayments.filter(p => 
      p.customerId === customer.id || p.customerName === customer.name
    );
    
    // Get all debts for this customer
    const customerDebts = allDebts.filter(d => 
      d.customerId === customer.id || d.customerName === customer.name
    );

    // Calculate totals
    const totalPurchases = customerDebts.reduce((sum, d) => sum + (d.totalAmount || d.amount || 0), 0);
    const totalPayments = customerPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const balance = totalPurchases - totalPayments;

    // Find last payment date
    const lastPayment = customerPayments.sort((a, b) => 
      new Date(b.paymentDate || b.date || b.createdAt) - new Date(a.paymentDate || a.date || a.createdAt)
    )[0];

    return {
      id: customer.id,
      name: customer.name || 'Unknown Customer',
      phone: customer.phone || customer.phoneNumber || 'N/A',
      totalPurchases,
      totalPayments,
      balance,
      lastPaymentDate: lastPayment ? 
        new Date(lastPayment.paymentDate || lastPayment.date || lastPayment.createdAt).toLocaleDateString() : 
        'Never'
    };
  }).sort((a, b) => b.totalPurchases - a.totalPurchases); // Sort by highest purchases first
};

const getRecentTransactions = (payments) => {
  return payments
    .sort((a, b) => new Date(b.paymentDate || b.date || b.createdAt) - new Date(a.paymentDate || a.date || a.createdAt))
    .map(payment => ({
      date: payment.paymentDate || payment.date || payment.createdAt,
      customer: payment.customerName || 'Unknown Customer',
      amount: payment.amount || 0,
      method: payment.paymentMethod || 'cash'
    }));
};

const calculatePaymentMethods = (payments) => {
  const methods = {};
  payments.forEach(payment => {
    const method = payment.paymentMethod || 'unknown';
    methods[method] = (methods[method] || 0) + (payment.amount || 0);
  });

  return Object.entries(methods).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));
};

const getReportTitle = (type, dateRange) => {
  const titles = {
    daily: 'Daily Financial Report',
    weekly: 'Weekly Financial Report',
    monthly: 'Monthly Financial Report',
    yearly: 'Yearly Financial Report',
    custom: `Custom Report (${dateRange.start} to ${dateRange.end})`
  };
  return titles[type] || 'Financial Report';
};

const getReportPeriod = (type, dateRange) => {
  const now = new Date();
  const periods = {
    daily: `For ${now.toLocaleDateString()}`,
    weekly: `This Week (${new Date(now.setDate(now.getDate() - 7)).toLocaleDateString()} - ${new Date().toLocaleDateString()})`,
    monthly: `This Month (${new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString()} - ${new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString()})`,
    yearly: `This Year (${new Date(now.getFullYear(), 0, 1).toLocaleDateString()} - ${new Date(now.getFullYear(), 11, 31).toLocaleDateString()})`,
    custom: `From ${dateRange.start} to ${dateRange.end}`
  };
  return periods[type] || '';
};

const calculateTotalRevenue = (payments) => {
  return payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
};

const calculateTotalDebts = (debts) => {
  return debts.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0);
};

// Mock export functions (replace with your actual implementations)
const exportToPDF = async (reportData, element, filename) => {
  alert(`PDF export for ${filename} would happen here`);
};

const exportToExcel = (reportData, filename) => {
  alert(`Excel export for ${filename} would happen here`);
};

const exportToCSV = (reportData, filename) => {
  alert(`CSV export for ${filename} would happen here`);
};

const exportToImage = async (element, filename) => {
  alert(`Image export for ${filename} would happen here`);
};

const Reports = () => {
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const reportRef = useRef();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const debtsData = getDebts() || [];
      const paymentsData = getPayments() || [];
      const customersData = getCustomers() || [];
      
      setDebts(debtsData);
      setPayments(paymentsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with empty arrays if data loading fails
      setDebts([]);
      setPayments([]);
      setCustomers([]);
    }
  };

  const generateReportData = () => {
    setLoading(true);
    try {
      // Use setTimeout to simulate async operation
      setTimeout(() => {
        const data = generateReport(reportType, dateRange, debts, payments, customers);
        setReportData(data);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please check your data.');
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async (format) => {
    if (!reportData) return;

    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(reportData, reportRef.current, `${reportType}_report`);
          break;
        case 'excel':
          exportToExcel(reportData, `${reportType}_report`);
          break;
        case 'csv':
          exportToCSV(reportData, `${reportType}_report`);
          break;
        case 'image':
          await exportToImage(reportRef.current, `${reportType}_report`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString()} RWF`;
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="reports-content">
          <div className="loading-spinner">
            <LoaderIcon />
            <p>Generating report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-content">
        {/* Header */}
        <header className="reports-header">
          <h1 className="page-title">Financial Reports</h1>
          <div className="header-actions">
            <div className="export-buttons">
              <button className="btn btn-outline" onClick={() => handleExport('pdf')}>
                <FileTextIcon /> PDF
              </button>
              <button className="btn btn-outline" onClick={() => handleExport('excel')}>
                <FileSpreadsheetIcon /> Excel
              </button>
              <button className="btn btn-outline" onClick={() => handleExport('csv')}>
                <FileCodeIcon /> CSV
              </button>
              <button className="btn btn-outline" onClick={() => handleExport('image')}>
                <ImageIcon /> Image
              </button>
            </div>
          </div>
        </header>

        {/* Report Controls */}
        <div className="report-controls">
          <div className="control-group">
            <div className="form-group">
              <label htmlFor="reportType">Report Type</label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
                <option value="yearly">Yearly Report</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {reportType === 'custom' && (
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                />
              </div>
            )}

            {reportType === 'custom' && (
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                />
              </div>
            )}

            <button className="btn btn-primary" onClick={generateReportData}>
              <RefreshIcon /> Generate Report
            </button>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="report-tabs">
          <button 
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Customer Details
          </button>
          <button 
            className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>

        {reportData ? (
          <div className="report-content" ref={reportRef}>
            {/* Report Header */}
            <div className="report-header">
              <h2>{reportData.title}</h2>
              <p className="report-period">{reportData.period}</p>
              <p className="report-generated">Generated on: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Summary View */}
            {activeTab === 'summary' && (
              <div className="summary-cards-grid">
                <div className="summary-card">
                  <div className="summary-icon total-revenue">
                    <WalletIcon />
                  </div>
                  <div className="summary-content">
                    <h3>{formatCurrency(reportData.summary.totalRevenue)}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon total-debts">
                    <TrendingDownIcon />
                  </div>
                  <div className="summary-content">
                    <h3>{formatCurrency(reportData.summary.totalDebts)}</h3>
                    <p>Total Debts</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon customers">
                    <UsersIcon />
                  </div>
                  <div className="summary-content">
                    <h3>{reportData.summary.totalCustomers}</h3>
                    <p>Total Customers</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon transactions">
                    <ReceiptIcon />
                  </div>
                  <div className="summary-content">
                    <h3>{reportData.summary.totalTransactions}</h3>
                    <p>Total Transactions</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Details View */}
            {activeTab === 'customers' && (
              <div className="customer-details-table-container">
                <h3>Customer Payment & Debt Details</h3>
                <div className="table-responsive">
                  <table className="customer-details-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Phone Number</th>
                        <th>Total Purchases</th>
                        <th>Total Payments</th>
                        <th>Current Balance</th>
                        <th>Last Payment Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.customerDetails && reportData.customerDetails.length > 0 ? (
                        reportData.customerDetails.map((customer, index) => (
                          <tr key={index}>
                            <td>{customer.name}</td>
                            <td>{customer.phone}</td>
                            <td>{formatCurrency(customer.totalPurchases)}</td>
                            <td>{formatCurrency(customer.totalPayments)}</td>
                            <td>
                              <span className={customer.balance > 0 ? 'text-danger' : 'text-success'}>
                                {formatCurrency(customer.balance)}
                              </span>
                            </td>
                            <td>{customer.lastPaymentDate}</td>
                            <td>
                              <span className={`status-badge ${customer.balance > 0 ? 'overdue' : 'paid'}`}>
                                {customer.balance > 0 ? 'Has Debt' : 'Paid'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">No customer data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions View */}
            {activeTab === 'transactions' && (
              <div className="transactions-table-container">
                <h3>Recent Transactions</h3>
                <div className="table-responsive">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.recentTransactions && reportData.recentTransactions.length > 0 ? (
                        reportData.recentTransactions.map((transaction, index) => (
                          <tr key={index}>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.customer}</td>
                            <td>{formatCurrency(transaction.amount)}</td>
                            <td>{transaction.method}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No transaction data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <BarChartIcon />
            <p>Select a report type and generate to view data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;