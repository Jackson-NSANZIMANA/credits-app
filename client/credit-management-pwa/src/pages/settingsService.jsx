// src/utils/settingsService.js
// Default settings
const DEFAULT_SETTINGS = {
  // General
  businessName: 'Credit Management System',
  currency: 'RWF',
  dateFormat: 'dd/mm/yyyy',
  defaultPaymentMethod: 'cash',
  
  // Notifications
  emailNotifications: true,
  smsNotifications: false,
  paymentReminders: true,
  reminderDays: 3,
  smtpServer: '',
  smsApiKey: '',
  
  // Appearance
  theme: 'light',
  primaryColor: '#4361ee',
  compactMode: false,
  animations: true,
  
  // Advanced
  autoBackup: false,
  backupRetention: 30,
  offlineMode: true,
  cacheDuration: '1hour',
  apiTimeout: 10000,
  debugMode: false
}

// Get settings from localStorage
export const getSettings = async () => {
  try {
    const savedSettings = localStorage.getItem('appSettings')
    return savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS
  } catch (error) {
    console.error('Error loading settings:', error)
    return DEFAULT_SETTINGS
  }
}

// Save settings to localStorage
export const saveSettings = async (settings) => {
  try {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    
    // Apply theme immediately
    if (settings.theme) {
      applyTheme(settings.theme)
    }
    
    // Apply primary color
    if (settings.primaryColor) {
      applyPrimaryColor(settings.primaryColor)
    }
    
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    throw error
  }
}

// Reset all data
export const resetAllData = async () => {
  try {
    localStorage.removeItem('customers')
    localStorage.removeItem('debts')
    localStorage.removeItem('payments')
    localStorage.removeItem('appSettings')
    
    // Reinitialize with default settings
    localStorage.setItem('appSettings', JSON.stringify(DEFAULT_SETTINGS))
    applyTheme(DEFAULT_SETTINGS.theme)
    applyPrimaryColor(DEFAULT_SETTINGS.primaryColor)
    
    return true
  } catch (error) {
    console.error('Error resetting data:', error)
    throw error
  }
}

// Export all data
export const exportAllData = async () => {
  try {
    const data = {
      customers: JSON.parse(localStorage.getItem('customers') || '[]'),
      debts: JSON.parse(localStorage.getItem('debts') || '[]'),
      payments: JSON.parse(localStorage.getItem('payments') || '[]'),
      settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `credit-management-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(link.href)
    return true
  } catch (error) {
    console.error('Error exporting data:', error)
    throw error
  }
}

// Import data
export const importData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validate imported data
        if (!data.customers || !data.debts || !data.payments) {
          throw new Error('Invalid backup file format')
        }
        
        // Save imported data
        localStorage.setItem('customers', JSON.stringify(data.customers))
        localStorage.setItem('debts', JSON.stringify(data.debts))
        localStorage.setItem('payments', JSON.stringify(data.payments))
        
        if (data.settings) {
          localStorage.setItem('appSettings', JSON.stringify(data.settings))
          applyTheme(data.settings.theme || DEFAULT_SETTINGS.theme)
          applyPrimaryColor(data.settings.primaryColor || DEFAULT_SETTINGS.primaryColor)
        }
        
        resolve(true)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

// Apply theme
const applyTheme = (theme) => {
  const root = document.documentElement
  
  if (theme === 'dark') {
    root.style.setProperty('--primary', '#6366f1')
    root.style.setProperty('--secondary', '#4f46e5')
    root.style.setProperty('--light', '#1f2937')
    root.style.setProperty('--dark', '#f9fafb')
    root.style.setProperty('--gray', '#9ca3af')
    root.style.setProperty('--light-gray', '#374151')
    root.style.setProperty('--white', '#111827')
  } else {
    root.style.setProperty('--primary', '#4361ee')
    root.style.setProperty('--secondary', '#3f37c9')
    root.style.setProperty('--light', '#f8f9fa')
    root.style.setProperty('--dark', '#212529')
    root.style.setProperty('--gray', '#6c757d')
    root.style.setProperty('--light-gray', '#e9ecef')
    root.style.setProperty('--white', '#ffffff')
  }
}

// Apply primary color
const applyPrimaryColor = (color) => {
  document.documentElement.style.setProperty('--primary', color)
  
  // Generate darker shade for secondary
  const darkerColor = adjustColorBrightness(color, -20)
  document.documentElement.style.setProperty('--secondary', darkerColor)
}

// Helper function to adjust color brightness
const adjustColorBrightness = (hex, percent) => {
  // Remove # if present
  hex = hex.replace(/^#/, '')
  
  // Parse r, g, b values
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  
  // Adjust brightness
  r = Math.max(0, Math.min(255, r + percent))
  g = Math.max(0, Math.min(255, g + percent))
  b = Math.max(0, Math.min(255, b + percent))
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Initialize settings on app load
export const initializeSettings = async () => {
  const settings = await getSettings()
  applyTheme(settings.theme)
  applyPrimaryColor(settings.primaryColor)
  return settings
}

export default {
  getSettings,
  saveSettings,
  resetAllData,
  exportAllData,
  importData,
  initializeSettings
}