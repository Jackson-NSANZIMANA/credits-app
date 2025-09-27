// src/utils/localStorage.js

// Customer Functions
export const getCustomers = () => {
  const customers = localStorage.getItem('customers');
  return customers ? JSON.parse(customers) : [];
}

export const saveCustomer = (customer) => {
  const customers = getCustomers();
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));
}

export const deleteCustomer = (customerId) => {
  const customers = getCustomers();
  const updatedCustomers = customers.filter(customer => customer.id !== customerId);
  localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  return updatedCustomers;
}

// Debt Functions
export const getDebts = () => {
  const debts = localStorage.getItem('debts');
  return debts ? JSON.parse(debts) : [];
}

export const saveDebt = (debt) => {
  const debts = getDebts();
  // Ensure products array exists and calculate total amount
  const debtWithProducts = {
    ...debt,
    products: debt.products || [],
    totalAmount: debt.totalAmount || calculateTotalAmount(debt.products || [])
  };
  debts.push(debtWithProducts);
  localStorage.setItem('debts', JSON.stringify(debts));
}

export const updateDebt = (updatedDebt) => {
  const debts = getDebts();
  const updatedDebts = debts.map(debt => 
    debt.id === updatedDebt.id ? {
      ...updatedDebt,
      products: updatedDebt.products || [],
      totalAmount: updatedDebt.totalAmount || calculateTotalAmount(updatedDebt.products || [])
    } : debt
  );
  localStorage.setItem('debts', JSON.stringify(updatedDebts));
  return updatedDebts;
}

export const deleteDebt = (debtId) => {
  const debts = getDebts();
  const updatedDebts = debts.filter(debt => debt.id !== debtId);
  localStorage.setItem('debts', JSON.stringify(updatedDebts));
  return updatedDebts;
}

// Payment Functions
export const getPayments = () => {
  const payments = localStorage.getItem('payments');
  return payments ? JSON.parse(payments) : [];
}

export const savePayment = (payment) => {
  const payments = getPayments();
  payments.push(payment);
  localStorage.setItem('payments', JSON.stringify(payments));
  
  // Update the corresponding debt's balance
  updateDebtBalance(payment.debtId, payment.amount);
}

export const deletePayment = (paymentId) => {
  const payments = getPayments();
  const paymentToDelete = payments.find(p => p.id === paymentId);
  const updatedPayments = payments.filter(payment => payment.id !== paymentId);
  localStorage.setItem('payments', JSON.stringify(updatedPayments));
  
  // Restore the debt balance if payment is deleted
  if (paymentToDelete) {
    restoreDebtBalance(paymentToDelete.debtId, paymentToDelete.amount);
  }
  return updatedPayments;
}

// Dashboard Data
export const getDashboardData = () => {
  const debts = getDebts();
  const payments = getPayments();
  
  const totalDebts = debts.reduce((sum, debt) => sum + (debt.totalAmount || 0), 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = totalDebts - totalPaid;
  
  // Get recent transactions (last 5 payments)
  const recentTransactions = payments.slice(-5);
  
  return {
    totalDebts,
    totalPaid,
    remainingBalance,
    recentTransactions
  };
}

// Helper Functions
const calculateTotalAmount = (products) => {
  return products.reduce((total, product) => total + (product.total || 0), 0);
}

const updateDebtBalance = (debtId, paymentAmount) => {
  const debts = getDebts();
  const updatedDebts = debts.map(debt => {
    if (debt.id === debtId) {
      const newBalance = debt.totalAmount - paymentAmount;
      return {
        ...debt,
        totalAmount: newBalance >= 0 ? newBalance : 0,
        status: newBalance <= 0 ? 'paid' : (debt.status === 'paid' ? 'pending' : debt.status)
      };
    }
    return debt;
  });
  localStorage.setItem('debts', JSON.stringify(updatedDebts));
}

const restoreDebtBalance = (debtId, paymentAmount) => {
  const debts = getDebts();
  const updatedDebts = debts.map(debt => {
    if (debt.id === debtId) {
      const newBalance = debt.totalAmount + paymentAmount;
      return {
        ...debt,
        totalAmount: newBalance,
        status: newBalance > 0 ? 'pending' : debt.status
      };
    }
    return debt;
  });
  localStorage.setItem('debts', JSON.stringify(updatedDebts));
}

// Utility Functions for specific data retrieval
export const getCustomerDebts = (customerId) => {
  const debts = getDebts();
  return debts.filter(debt => debt.customerId === customerId);
}

export const getDebtPayments = (debtId) => {
  const payments = getPayments();
  return payments.filter(payment => payment.debtId === debtId);
}

export const getCustomerPayments = (customerId) => {
  const payments = getPayments();
  return payments.filter(payment => payment.customerId === customerId);
}

// Initialize default data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem('customers')) {
    localStorage.setItem('customers', JSON.stringify([]));
  }
  if (!localStorage.getItem('debts')) {
    localStorage.setItem('debts', JSON.stringify([]));
  }
  if (!localStorage.getItem('payments')) {
    localStorage.setItem('payments', JSON.stringify([]));
  }
}

// Clear all data (for testing/development)
export const clearAllData = () => {
  localStorage.removeItem('customers');
  localStorage.removeItem('debts');
  localStorage.removeItem('payments');
}

// Export all functions
export default {
  // Customer functions
  getCustomers,
  saveCustomer,
  deleteCustomer,
  
  // Debt functions
  getDebts,
  saveDebt,
  updateDebt,
  deleteDebt,
  getCustomerDebts,
  
  // Payment functions
  getPayments,
  savePayment,
  deletePayment,
  getDebtPayments,
  getCustomerPayments,
  
  // Dashboard
  getDashboardData,
  
  // Utility functions
  initializeStorage,
  clearAllData
};
// Add this to your localStorage utility
export const migrateDebtsData = () => {
  const debts = getDebts()
  const updatedDebts = debts.map(debt => ({
    ...debt,
    totalAmount: debt.totalAmount || 0,
    status: debt.status || 'pending',
    products: debt.products || []
  }))
  localStorage.setItem('debts', JSON.stringify(updatedDebts))
}

// Call this on app startup
migrateDebtsData()