import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const register = (userData) => {
    // In a real app, you would hash the password before saving
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Also save user to users list for password recovery
    const existingUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const updatedUsers = [...existingUsers, userData];
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const recoverPassword = (identifier) => {
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    return users.find(user => 
      user.email === identifier || user.phone === identifier
    );
  };

  const updatePassword = (identifier, newPassword) => {
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const updatedUsers = users.map(user => {
      if (user.email === identifier || user.phone === identifier) {
        return { ...user, password: newPassword };
      }
      return user;
    });
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
    
    // Also update current user if they're changing their own password
    if (currentUser && (currentUser.email === identifier || currentUser.phone === identifier)) {
      login({ ...currentUser, password: newPassword });
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    recoverPassword,
    updatePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;