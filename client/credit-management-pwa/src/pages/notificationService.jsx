// src/utils/notificationService.js
// Mock notification service - replace with actual SMS/Email API integration

export const sendPaymentConfirmation = async (customer, payment, remainingBalance) => {
  try {
    // Check if customer has contact information
    const hasEmail = customer.email && isValidEmail(customer.email)
    const hasPhone = customer.phone && isValidPhoneNumber(customer.phone)

    if (!hasEmail && !hasPhone) {
      return {
        success: false,
        message: 'No valid contact information found',
        method: 'none'
      }
    }

    // Prepare message content
    const message = generatePaymentMessage(customer, payment, remainingBalance)
    
    // Try to send via multiple channels
    let result = { success: false, message: 'All notification methods failed', method: 'none' }

    // Priority 1: Send SMS if phone number exists
    if (hasPhone) {
      result = await sendSMS(customer.phone, message)
      if (result.success) return result
    }

    // Priority 2: Send Email if email exists
    if (hasEmail) {
      result = await sendEmail(customer.email, 'Payment Confirmation', message)
      if (result.success) return result
    }

    return result

  } catch (error) {
    console.error('Notification error:', error)
    return {
      success: false,
      message: error.message,
      method: 'unknown'
    }
  }
}

// SMS Service (Mock - Replace with actual SMS API)
const sendSMS = async (phoneNumber, message) => {
  try {
    // Replace this with actual SMS API integration
    // Example: Twilio, Africa's Talking, etc.
    console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate success (90% success rate for demo)
    const success = Math.random() > 0.1
    
    return {
      success,
      message: success ? 'SMS sent successfully' : 'SMS delivery failed',
      method: 'sms'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      method: 'sms'
    }
  }
}

// Email Service (Mock - Replace with actual Email API)
const sendEmail = async (email, subject, message) => {
  try {
    // Replace this with actual Email API integration
    // Example: SendGrid, Mailchimp, etc.
    console.log(`[EMAIL] To: ${email}, Subject: ${subject}, Message: ${message}`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simulate success (95% success rate for demo)
    const success = Math.random() > 0.05
    
    return {
      success,
      message: success ? 'Email sent successfully' : 'Email delivery failed',
      method: 'email'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      method: 'email'
    }
  }
}

// Message Template
const generatePaymentMessage = (customer, payment, remainingBalance) => {
  return `
Dear ${customer.name},

Thank you for your payment!

Payment Details:
- Amount: ${payment.amount.toLocaleString()} RWF
- Date: ${new Date(payment.paymentDate).toLocaleDateString()}
- Method: ${payment.paymentMethod}
- Previous Balance: ${payment.previousBalance.toLocaleString()} RWF
- New Balance: ${remainingBalance.toLocaleString()} RWF
- Reference: #${payment.id}

${remainingBalance > 0 ? 
  `Your remaining balance is ${remainingBalance.toLocaleString()} RWF. Thank you for your continued business!` :
  'Your account is now fully paid. Thank you for your business!'
}

For any questions, please contact us.

Best regards,
Your Company Name
  `.trim()
}

// Validation functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhoneNumber = (phone) => {
  // Basic phone validation - adjust for your country's format
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
  return phoneRegex.test(phone) && phone.length >= 8
}

// Export for testing
export default {
  sendPaymentConfirmation,
  sendSMS,
  sendEmail,
  generatePaymentMessage,
  isValidEmail,
  isValidPhoneNumber
}