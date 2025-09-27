import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

const ForgotPasswordForm = ({ onToggleMode, onClose }) => {
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Enter identifier, 2: Reset password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { recoverPassword, updatePassword } = useAuth();

  const handleFindAccount = (e) => {
    e.preventDefault();
    setError('');
    
    const user = recoverPassword(identifier);
    if (user) {
      setStep(2);
    } else {
      setError('No account found with this email or phone number');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    updatePassword(identifier, newPassword);
    setSuccess('Password reset successfully! You can now login with your new password.');
    setTimeout(() => {
      onToggleMode('login');
    }, 2000);
  };

  if (step === 1) {
    return (
      <div className="auth-form">
        <h2>Password Recovery</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleFindAccount}>
          <div className="form-group">
            <label>Email or Phone Number</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Enter your email or phone number"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Find My Account
          </button>
        </form>

        <div className="auth-links">
          <button 
            type="button" 
            className="btn-link"
            onClick={() => onToggleMode('login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>Reset Your Password</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password (min. 6 characters)"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Reset Password
        </button>
      </form>

      <div className="auth-links">
        <button 
          type="button" 
          className="btn-link"
          onClick={() => setStep(1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;