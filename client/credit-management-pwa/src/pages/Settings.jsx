// src/pages/Settings.jsx
import { useState, useEffect } from 'react'
import { getSettings, saveSettings, resetAllData, exportAllData, importData } from '../pages/settingsService'

// SVG Icons (inline to avoid dependency issues)
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.17.1a2 2 0 0 1-2 0l-.15-.1a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2h-.22a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.17.1a2 2 0 0 1-2 0l-.15-.1a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.17.1a2 2 0 0 1-2 0l-.15-.1a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.17.1a2 2 0 0 1-2 0l-.15-.1a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2H2" />
    <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
  </svg>
)

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const PaletteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
)

const DatabaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

const CpuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M9 1v3" />
    <path d="M15 1v3" />
    <path d="M9 20v3" />
    <path d="M15 20v3" />
    <path d="M20 9h3" />
    <path d="M20 14h3" />
    <path d="M1 9h3" />
    <path d="M1 14h3" />
  </svg>
)

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const MessageSquareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ServerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
)

const KeyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const LayoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
)

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const CloudIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
)

const HardDriveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="12" x2="2" y2="12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    <line x1="6" y1="16" x2="6.01" y2="16" />
    <line x1="10" y1="16" x2="10.01" y2="16" />
  </svg>
)

const Settings = () => {
  const [settings, setSettings] = useState({})
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const savedSettings = await getSettings()
    setSettings(savedSettings)
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      await saveSettings(settings)
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings.' })
    }
    setLoading(false)
  }

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setLoading(true)
      try {
        await resetAllData()
        setMessage({ type: 'success', text: 'All data has been reset successfully!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to reset data.' })
      }
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      await exportAllData()
      setMessage({ type: 'success', text: 'Data exported successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data.' })
    }
    setLoading(false)
  }

  const handleImportData = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      await importData(file)
      setMessage({ type: 'success', text: 'Data imported successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      // Reload settings after import
      loadSettings()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import data. Please check the file format.' })
    }
    setLoading(false)
    event.target.value = '' // Reset file input
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
    { id: 'appearance', label: 'Appearance', icon: <PaletteIcon /> },
    { id: 'backup', label: 'Backup & Reset', icon: <DatabaseIcon /> },
    { id: 'advanced', label: 'Advanced', icon: <CpuIcon /> }
  ]

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        {message.text && (
          <div className={`settings-message ${message.type}`}>
            {message.type === 'success' ? <CheckIcon /> : <XIcon />}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      <div className="settings-layout">
        {/* Settings Tabs */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3 className="section-title">General Settings</h3>
              
              <div className="setting-group">
                <label className="setting-label">
                  <span>Business Name</span>
                  <input
                    type="text"
                    value={settings.businessName || ''}
                    onChange={(e) => handleSettingChange('businessName', e.target.value)}
                    placeholder="Enter your business name"
                  />
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><DollarIcon /> Currency</span>
                  <select
                    value={settings.currency || 'RWF'}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                  >
                    <option value="RWF">Rwandan Franc (RWF)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><CalendarIcon /> Date Format</span>
                  <select
                    value={settings.dateFormat || 'dd/mm/yyyy'}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><CreditCardIcon /> Default Payment Method</span>
                  <select
                    value={settings.defaultPaymentMethod || 'cash'}
                    onChange={(e) => handleSettingChange('defaultPaymentMethod', e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3 className="section-title">Notification Settings</h3>
              
              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications !== false}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <span><MailIcon /> Enable Email Notifications</span>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications === true}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  />
                  <span><MessageSquareIcon /> Enable SMS Notifications</span>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.paymentReminders === true}
                    onChange={(e) => handleSettingChange('paymentReminders', e.target.checked)}
                  />
                  <span><BellIcon /> Send Payment Reminders</span>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><ClockIcon /> Reminder Days Before Due</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.reminderDays || 3}
                    onChange={(e) => handleSettingChange('reminderDays', parseInt(e.target.value))}
                  />
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><ServerIcon /> SMTP Server</span>
                  <input
                    type="text"
                    value={settings.smtpServer || ''}
                    onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
                    placeholder="smtp.yourdomain.com"
                  />
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><KeyIcon /> SMS API Key</span>
                  <input
                    type="password"
                    value={settings.smsApiKey || ''}
                    onChange={(e) => handleSettingChange('smsApiKey', e.target.value)}
                    placeholder="Your SMS API key"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3 className="section-title">Appearance Settings</h3>
              
              <div className="setting-group">
                <label className="setting-label">
                  <span><EyeIcon /> Theme</span>
                  <select
                    value={settings.theme || 'light'}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label color-picker-label">
                  <span><PaletteIcon /> Primary Color</span>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={settings.primaryColor || '#4361ee'}
                      onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    />
                    <span className="color-value">{settings.primaryColor || '#4361ee'}</span>
                  </div>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.compactMode === true}
                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                  />
                  <span><LayoutIcon /> Compact Mode</span>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.animations !== false}
                    onChange={(e) => handleSettingChange('animations', e.target.checked)}
                  />
                  <span><ZapIcon /> Enable Animations</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="settings-section">
              <h3 className="section-title">Backup & Reset</h3>
              
              <div className="setting-group">
                <h4><DownloadIcon /> Data Backup</h4>
                <p>Export all your data for backup or migration purposes.</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleExportData}
                  disabled={loading}
                >
                  <DownloadIcon /> {loading ? 'Exporting...' : 'Export All Data'}
                </button>
              </div>

              <div className="setting-group">
                <h4><UploadIcon /> Data Import</h4>
                <p>Import data from a previous backup.</p>
                <label className="file-input-btn btn btn-secondary">
                  <UploadIcon />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    disabled={loading}
                  />
                  {loading ? 'Importing...' : 'Import Data'}
                </label>
              </div>

              <div className="setting-group danger-zone">
                <h4><TrashIcon /> Danger Zone</h4>
                <p>Permanently delete all data and reset the application to its initial state.</p>
                <button 
                  className="btn btn-danger"
                  onClick={handleResetData}
                  disabled={loading}
                >
                  <TrashIcon /> {loading ? 'Resetting...' : 'Reset All Data'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="settings-section">
              <h3 className="section-title">Advanced Settings</h3>
              
              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup === true}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  />
                  <span><CloudIcon /> Automatic Backups</span>
                </label>
                <p className="setting-description">Automatically create backups daily</p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><HardDriveIcon /> Backup Retention Days</span>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.backupRetention || 30}
                    onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))}
                  />
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.offlineMode === true}
                    onChange={(e) => handleSettingChange('offlineMode', e.target.checked)}
                  />
                  <span><CloudIcon /> Offline Mode</span>
                </label>
                <p className="setting-description">Enable offline functionality</p>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><ClockIcon /> Cache Duration</span>
                  <select
                    value={settings.cacheDuration || '1hour'}
                    onChange={(e) => handleSettingChange('cacheDuration', e.target.value)}
                  >
                    <option value="15min">15 Minutes</option>
                    <option value="1hour">1 Hour</option>
                    <option value="6hours">6 Hours</option>
                    <option value="1day">1 Day</option>
                  </select>
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-label">
                  <span><CpuIcon /> API Timeout (ms)</span>
                  <input
                    type="number"
                    min="1000"
                    max="30000"
                    step="1000"
                    value={settings.apiTimeout || 10000}
                    onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                  />
                </label>
              </div>

              <div className="setting-group">
                <label className="setting-toggle">
                  <input
                    type="checkbox"
                    checked={settings.debugMode === true}
                    onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                  />
                  <span><CpuIcon /> Debug Mode</span>
                </label>
                <p className="setting-description">Enable detailed logging and debugging tools</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="settings-actions">
            <button 
              className="btn btn-primary btn-save"
              onClick={handleSaveSettings}
              disabled={loading}
            >
              <SaveIcon /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings