// src/utils/reportGenerator.js
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

// Generate report data
export const generateReport = (type, dateRange, debts, payments, customers) => {
  const filteredPayments = filterDataByDateRange(payments, type, dateRange)
  const filteredDebts = filterDataByDateRange(debts, type, dateRange)

  const revenueVsDebts = calculateRevenueVsDebts(filteredPayments, filteredDebts, type)
  const paymentMethods = calculatePaymentMethods(filteredPayments)
  const customerDetails = calculateCustomerDetails(customers, payments, debts)
  const recentTransactions = getRecentTransactions(filteredPayments)

  return {
    title: getReportTitle(type, dateRange),
    period: getReportPeriod(type, dateRange),
    summary: {
      totalRevenue: calculateTotalRevenue(filteredPayments),
      totalDebts: calculateTotalDebts(filteredDebts),
      totalCustomers: customers.length,
      totalTransactions: filteredPayments.length
    },
    charts: {
      revenueVsDebts,
      paymentMethods
    },
    customerDetails, // Add customer details to the report
    recentTransactions: recentTransactions.slice(0, 10)
  }
}

// Filter data by date range
const filterDataByDateRange = (data, type, dateRange) => {
  const now = new Date()
  let startDate, endDate

  switch (type) {
    case 'daily':
      startDate = new Date(now.setHours(0, 0, 0, 0))
      endDate = new Date(now.setHours(23, 59, 59, 999))
      break
    case 'weekly':
      startDate = new Date(now.setDate(now.getDate() - 7))
      endDate = new Date()
      break
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      break
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31)
      break
    case 'custom':
      startDate = new Date(dateRange.start)
      endDate = new Date(dateRange.end)
      break
    default:
      return data
  }

  return data.filter(item => {
    const itemDate = new Date(item.paymentDate || item.createdAt || item.date)
    return itemDate >= startDate && itemDate <= endDate
  })
}

// Calculate revenue vs debts for chart
const calculateRevenueVsDebts = (payments, debts, type) => {
  const periods = getPeriods(type)
  return periods.map(period => ({
    name: period.label,
    revenue: payments
      .filter(p => isInPeriod(new Date(p.paymentDate || p.createdAt || p.date), period, type))
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    debts: debts
      .filter(d => isInPeriod(new Date(d.createdAt || d.date), period, type))
      .reduce((sum, d) => sum + (d.totalAmount || d.amount || 0), 0)
  }))
}

// Calculate payment methods distribution
const calculatePaymentMethods = (payments) => {
  const methods = {}
  payments.forEach(payment => {
    const method = payment.paymentMethod || 'unknown'
    methods[method] = (methods[method] || 0) + (payment.amount || 0)
  })

  return Object.entries(methods).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))
}

// Calculate customer details with payment and debt information
const calculateCustomerDetails = (customers, allPayments, allDebts) => {
  return customers.map(customer => {
    // Get all payments for this customer
    const customerPayments = allPayments.filter(p => 
      p.customerId === customer.id || p.customerName === customer.name
    )
    
    // Get all debts for this customer
    const customerDebts = allDebts.filter(d => 
      d.customerId === customer.id || d.customerName === customer.name
    )

    // Calculate totals
    const totalPurchases = customerDebts.reduce((sum, d) => sum + (d.totalAmount || d.amount || 0), 0)
    const totalPayments = customerPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const balance = totalPurchases - totalPayments

    // Find last payment date
    const lastPayment = customerPayments.sort((a, b) => 
      new Date(b.paymentDate || b.date || b.createdAt) - new Date(a.paymentDate || a.date || a.createdAt)
    )[0]

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
    }
  }).sort((a, b) => b.totalPurchases - a.totalPurchases) // Sort by highest purchases first
}

// Get recent transactions
const getRecentTransactions = (payments) => {
  return payments
    .sort((a, b) => new Date(b.paymentDate || b.date || b.createdAt) - new Date(a.paymentDate || a.date || a.createdAt))
    .map(payment => ({
      date: payment.paymentDate || payment.date || payment.createdAt,
      customer: payment.customerName || 'Unknown Customer',
      amount: payment.amount || 0,
      method: payment.paymentMethod || 'cash'
    }))
}

// Helper functions
const getReportTitle = (type, dateRange) => {
  const titles = {
    daily: 'Daily Financial Report',
    weekly: 'Weekly Financial Report',
    monthly: 'Monthly Financial Report',
    yearly: 'Yearly Financial Report',
    custom: `Custom Report (${dateRange.start} to ${dateRange.end})`
  }
  return titles[type] || 'Financial Report'
}

const getReportPeriod = (type, dateRange) => {
  const now = new Date()
  const periods = {
    daily: `For ${now.toLocaleDateString()}`,
    weekly: `This Week (${new Date(now.setDate(now.getDate() - 7)).toLocaleDateString()} - ${new Date().toLocaleDateString()})`,
    monthly: `This Month (${new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString()} - ${new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString()})`,
    yearly: `This Year (${new Date(now.getFullYear(), 0, 1).toLocaleDateString()} - ${new Date(now.getFullYear(), 11, 31).toLocaleDateString()})`,
    custom: `From ${dateRange.start} to ${dateRange.end}`
  }
  return periods[type] || ''
}

const calculateTotalRevenue = (payments) => {
  return payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
}

const calculateTotalDebts = (debts) => {
  return debts.reduce((sum, debt) => sum + (debt.totalAmount || debt.amount || 0), 0)
}

const getPeriods = (type) => {
  const now = new Date()
  switch (type) {
    case 'daily':
      return Array.from({ length: 24 }, (_, i) => ({
        label: `${i}:00`,
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 0, 0, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 59, 59, 999)
      }))
    case 'weekly':
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - 6 + i)
        return {
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
          end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
        }
      })
    case 'monthly':
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      return Array.from({ length: Math.ceil(daysInMonth / 7) }, (_, i) => ({
        label: `Week ${i + 1}`,
        start: new Date(now.getFullYear(), now.getMonth(), i * 7 + 1),
        end: new Date(now.getFullYear(), now.getMonth(), Math.min((i + 1) * 7, daysInMonth))
      }))
    case 'yearly':
      return Array.from({ length: 12 }, (_, i) => ({
        label: new Date(now.getFullYear(), i, 1).toLocaleDateString('en-US', { month: 'short' }),
        start: new Date(now.getFullYear(), i, 1),
        end: new Date(now.getFullYear(), i + 1, 0)
      }))
    default:
      return []
  }
}

const isInPeriod = (date, period, type) => {
  return date >= period.start && date <= period.end
}

// Export functions
export const exportToPDF = async (reportData, element, filename) => {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text(reportData.title, 14, 22)
  doc.setFontSize(12)
  doc.text(reportData.period, 14, 30)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38)

  // Summary Table
  doc.autoTable({
    startY: 45,
    head: [['Metric', 'Value']],
    body: [
      ['Total Revenue', `${reportData.summary.totalRevenue.toLocaleString()} RWF`],
      ['Total Debts', `${reportData.summary.totalDebts.toLocaleString()} RWF`],
      ['Total Customers', reportData.summary.totalCustomers],
      ['Total Transactions', reportData.summary.totalTransactions]
    ]
  })

  // Customer Details Table
  if (reportData.customerDetails && reportData.customerDetails.length > 0) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Customer Name', 'Phone', 'Total Purchases', 'Total Payments', 'Balance', 'Last Payment']],
      body: reportData.customerDetails.map(customer => [
        customer.name,
        customer.phone,
        `${customer.totalPurchases.toLocaleString()} RWF`,
        `${customer.totalPayments.toLocaleString()} RWF`,
        `${customer.balance.toLocaleString()} RWF`,
        customer.lastPaymentDate
      ])
    })
  }

  // Recent Transactions Table
  if (reportData.recentTransactions && reportData.recentTransactions.length > 0) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Date', 'Customer', 'Amount', 'Method']],
      body: reportData.recentTransactions.map(transaction => [
        new Date(transaction.date).toLocaleDateString(),
        transaction.customer,
        `${transaction.amount.toLocaleString()} RWF`,
        transaction.method
      ])
    })
  }

  doc.save(`${filename}.pdf`)
}

export const exportToExcel = (reportData, filename) => {
  const workbook = XLSX.utils.book_new()

  // Summary Sheet
  const summaryData = [
    ['Metric', 'Value'],
    ['Total Revenue', reportData.summary.totalRevenue],
    ['Total Debts', reportData.summary.totalDebts],
    ['Total Customers', reportData.summary.totalCustomers],
    ['Total Transactions', reportData.summary.totalTransactions]
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  // Customer Details Sheet
  if (reportData.customerDetails && reportData.customerDetails.length > 0) {
    const customersData = [
      ['Customer Name', 'Phone', 'Total Purchases', 'Total Payments', 'Balance', 'Last Payment'],
      ...reportData.customerDetails.map(customer => [
        customer.name,
        customer.phone,
        customer.totalPurchases,
        customer.totalPayments,
        customer.balance,
        customer.lastPaymentDate
      ])
    ]
    const customersSheet = XLSX.utils.aoa_to_sheet(customersData)
    XLSX.utils.book_append_sheet(workbook, customersSheet, 'Customer Details')
  }

  // Transactions Sheet
  if (reportData.recentTransactions && reportData.recentTransactions.length > 0) {
    const transactionsData = [
      ['Date', 'Customer', 'Amount', 'Method'],
      ...reportData.recentTransactions.map(transaction => [
        new Date(transaction.date),
        transaction.customer,
        transaction.amount,
        transaction.method
      ])
    ]
    const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData)
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions')
  }

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export const exportToCSV = (reportData, filename) => {
  // Create CSV content for customer details
  if (reportData.customerDetails && reportData.customerDetails.length > 0) {
    const headers = ['Customer Name', 'Phone', 'Total Purchases', 'Total Payments', 'Balance', 'Last Payment']
    const rows = reportData.customerDetails.map(customer => [
      customer.name,
      customer.phone,
      customer.totalPurchases,
      customer.totalPayments,
      customer.balance,
      customer.lastPaymentDate
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_customers.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
}

export const exportToImage = async (element, filename) => {
  const canvas = await html2canvas(element)
  const image = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = image
  link.download = `${filename}.png`
  link.click()
}