import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

const RegisterForm = ({ onToggleMode, onClose }) => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const userExists = existingUsers.some(user => 
      user.email === userData.email || user.phone === userData.phone
    );

    if (userExists) {
      setError('User with this email or phone already exists');
      return;
    }

    // Register new user
    const newUser = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      createdAt: new Date().toISOString()
    };

    register(newUser);
    onClose?.();
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            placeholder="Create a password (min. 6 characters)"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Create Account
        </button>
      </form>

      <div className="auth-links">
        <span>Already have an account? </span>
        <button 
          type="button" 
          className="btn-link"
          onClick={() => onToggleMode('login')}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;