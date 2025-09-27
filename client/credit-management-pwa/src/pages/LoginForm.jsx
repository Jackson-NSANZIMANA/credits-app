import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

const LoginForm = ({ onToggleMode, onClose }) => {
  const [credentials, setCredentials] = useState({ 
    identifier: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Get all registered users
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    
    // Find user by email or phone
    const user = users.find(u => 
      (u.email === credentials.identifier || u.phone === credentials.identifier) && 
      u.password === credentials.password
    );

    if (user) {
      login(user);
      onClose?.();
    } else {
      setError('Invalid login credentials');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email or Phone Number</label>
          <input
            type="text"
            name="identifier"
            value={credentials.identifier}
            onChange={handleChange}
            required
            placeholder="Enter your email or phone number"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Login
        </button>
      </form>

      <div className="auth-links">
        <button 
          type="button" 
          className="btn-link"
          onClick={() => onToggleMode('forgot')}
        >
          Forgot Password?
        </button>
        <span>Don't have an account? </span>
        <button 
          type="button" 
          className="btn-link"
          onClick={() => onToggleMode('register')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;