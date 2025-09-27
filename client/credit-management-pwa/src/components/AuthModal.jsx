import { useState } from 'react';
import LoginForm from '../pages/LoginForm';
import RegisterForm from '../pages/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'

  if (!isOpen) return null;

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return <LoginForm onToggleMode={setMode} onClose={onClose} />;
      case 'register':
        return <RegisterForm onToggleMode={setMode} onClose={onClose} />;
      case 'forgot':
        return <ForgotPasswordForm onToggleMode={setMode} onClose={onClose} />;
      default:
        return <LoginForm onToggleMode={setMode} onClose={onClose} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {renderForm()}
      </div>
    </div>
  );
};

export default AuthModal;