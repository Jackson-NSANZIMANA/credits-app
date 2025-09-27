// src/components/LandingAuth.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';

// Language configuration
const languages = {
  en: {
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signInToManage: 'Sign in to manage your wealth',
    joinUs: 'Join us to start your financial journey',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    enterFullName: 'Enter your full name',
    enterEmail: 'Enter your email',
    enterPhone: 'Enter your phone number',
    enterPassword: 'Enter your password',
    confirmYourPassword: 'Confirm your password',
    dontHaveAccount: "Don't have an account? ",
    alreadyHaveAccount: "Already have an account? ",
    forgotPassword: 'Forgot your password?',
    passwordRecovery: 'Password Recovery',
    verifyCode: 'Verify Code',
    resetPassword: 'Reset Password',
    recoveryInstructions: 'Enter your email or phone to recover your account',
    enterVerificationCode: 'Enter the verification code sent to your phone/email',
    setNewPassword: 'Enter your new password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    sendCode: 'Send Code',
    resendCode: 'Resend Code',
    verify: 'Verify',
    cancel: 'Cancel',
    passwordsDontMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    invalidCredentials: 'Invalid credentials',
    userExists: 'User already exists',
    loginSuccessful: 'Login successful!',
    accountCreated: 'Account created successfully!',
    codeSent: 'Verification code sent! Check your phone or email.',
    codeVerified: 'Code verified! Please set your new password.',
    passwordReset: 'Password reset successfully! You can now login with your new password.',
    invalidCode: 'Invalid verification code',
    noAccountFound: 'No account found with this email or phone number',
    companyName: 'CUNGA NEZA',
    tagline: 'TWIRINDE GUHOMBA',
    or: 'or' // Added the missing 'or' property
  },
  rw: {
    welcomeBack: 'Murakaza neza',
    createAccount: 'Kora Konti',
    signIn: 'Injira',
    signUp: 'Iyandike',
    signInToManage: 'Injira kugirango woroshe uceceko kwawe',
    joinUs: 'Twiyunge hamwe gutangira urugendo rwawe rw\'imari',
    fullName: 'Amazina yuzuye',
    email: 'Imeyili',
    phone: 'Numero ya Telefone',
    password: 'Ijambobanga',
    confirmPassword: 'Emeza Ijambobanga',
    enterFullName: 'Andika amazina yawe yuzuye',
    enterEmail: 'Andika imeyili yawe',
    enterPhone: 'Andika numero ya telefone yawe',
    enterPassword: 'Andika ijambobanga ryawe',
    confirmYourPassword: 'Emeza ijambobanga ryawe',
    dontHaveAccount: 'Ntugira konti? ',
    alreadyHaveAccount: 'Urafite konti? ',
    forgotPassword: 'Wibagiwe ijambobanga?',
    passwordRecovery: 'Kuraho ijambobanga',
    verifyCode: 'Emeza Code',
    resetPassword: 'Shiraho ijambobanga rishya',
    recoveryInstructions: 'Andika imeyili cyangwa numero ya telefone kugirango ukureho konti yawe',
    enterVerificationCode: 'Andika code yo gusaba woherejwe kuri telefone/imeyili yawe',
    setNewPassword: 'Andika ijambobanga rishya',
    newPassword: 'Ijambobanga Rishya',
    confirmNewPassword: 'Emeza Ijambobanga Rishya',
    sendCode: 'Ohereza Code',
    resendCode: 'Ohereza Code nanone',
    verify: 'Emeza',
    cancel: 'Hagarika',
    passwordsDontMatch: 'Ijambobanga ntibihuye',
    passwordTooShort: 'Ijambobanga rigomba kuba rifite imibare 6 byibura',
    invalidCredentials: 'Amakuru atari yo',
    userExists: 'Uko konti iriho',
    loginSuccessful: 'Winjiye neza!',
    accountCreated: 'Konti yashizweho neza!',
    codeSent: 'Code yo gusaba yoherejwe! Reba kuri telefone cyangwa imeyili yawe.',
    codeVerified: 'Code yemejwe! Giba wshiraho ijambobanga rishya.',
    passwordReset: 'Ijambobanga ryasubiwemo neza! Ushobora noneho kwinjira ukoresheje ijambobanga rishya.',
    invalidCode: 'Code yo gusaba ntibikwiye',
    noAccountFound: 'Nta konti yabonetse ihuza iyi meyili cyangwa numero ya telefone',
    companyName: 'CUNGA NEZA',
    tagline: 'TWIRINDE GUHOMBA',
    or: 'cyangwa' // Added the missing 'or' property
  },
  fr: {
    welcomeBack: 'Bon retour',
    createAccount: 'Créer un compte',
    signIn: 'Se connecter',
    signUp: "S'inscrire",
    signInToManage: 'Connectez-vous pour gérer votre richesse',
    joinUs: 'Rejoignez-nous pour commencer votre voyage financier',
    fullName: 'Nom complet',
    email: 'E-mail',
    phone: 'Numéro de téléphone',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    enterFullName: 'Entrez votre nom complet',
    enterEmail: 'Entrez votre e-mail',
    enterPhone: 'Entrez votre numéro de téléphone',
    enterPassword: 'Entrez votre mot de passe',
    confirmYourPassword: 'Confirmez votre mot de passe',
    dontHaveAccount: "Vous n'avez pas de compte? ",
    alreadyHaveAccount: 'Vous avez déjà un compte? ',
    forgotPassword: 'Mot de passe oublié?',
    passwordRecovery: 'Récupération de mot de passe',
    verifyCode: 'Vérifier le code',
    resetPassword: 'Réinitialiser le mot de passe',
    recoveryInstructions: 'Entrez votre e-mail ou téléphone pour récupérer votre compte',
    enterVerificationCode: 'Entrez le code de vérification envoyé à votre téléphone/e-mail',
    setNewPassword: 'Entrez votre nouveau mot de passe',
    newPassword: 'Nouveau mot de passe',
    confirmNewPassword: 'Confirmer le nouveau mot de passe',
    sendCode: 'Envoyer le code',
    resendCode: 'Renvoyer le code',
    verify: 'Vérifier',
    cancel: 'Annuler',
    passwordsDontMatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit comporter au moins 6 caractères',
    invalidCredentials: 'Identifiants invalides',
    userExists: 'Utilisateur existe déjà',
    loginSuccessful: 'Connexion réussie!',
    accountCreated: 'Compte créé avec succès!',
    codeSent: 'Code de vérification envoyé! Vérifiez votre téléphone ou e-mail.',
    codeVerified: 'Code vérifié! Veuillez définir votre nouveau mot de passe.',
    passwordReset: 'Mot de passe réinitialisé avec succès! Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
    invalidCode: 'Code de vérification invalide',
    noAccountFound: 'Aucun compte trouvé avec cet e-mail ou numéro de téléphone',
    companyName: 'CUNGA NEZA',
    tagline: 'TWIRINDE GUHOMBA',
    or: 'ou' // Added the missing 'or' property
  }
};

const LandingAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [animationStage, setAnimationStage] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [credentials, setCredentials] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    recoveryIdentifier: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, recoverPassword, updatePassword } = useAuth();

  // Get translations for current language
  const t = languages[currentLanguage];

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const animationSequence = setTimeout(() => {
      setAnimationStage(1); // Show names
    }, 500);

    const moneyAnimation = setTimeout(() => {
      setAnimationStage(2); // Show money transfer
    }, 2000);

    const handshakeAnimation = setTimeout(() => {
      setAnimationStage(3); // Show handshake
    }, 3500);

    const thankYouAnimation = setTimeout(() => {
      setAnimationStage(4); // Show thank you
    }, 4500);

    return () => {
      clearTimeout(animationSequence);
      clearTimeout(moneyAnimation);
      clearTimeout(handshakeAnimation);
      clearTimeout(thankYouAnimation);
    };
  }, []);

  const sendVerificationCode = (identifier) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCountdown(300);
    console.log(`Verification code sent to ${identifier}: ${code}`);
    return code;
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin) {
      if (credentials.password !== credentials.confirmPassword) {
        setError(t.passwordsDontMatch);
        return;
      }
      if (credentials.password.length < 6) {
        setError(t.passwordTooShort);
        return;
      }
    }

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
      const user = users.find(u => 
        (u.email === credentials.email || u.phone === credentials.email) && 
        u.password === credentials.password
      );
      
      if (user) {
        login(user);
        setSuccess(t.loginSuccessful);
      } else {
        setError(t.invalidCredentials);
      }
    } else {
      const existingUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
      const userExists = existingUsers.some(user => 
        user.email === credentials.email || user.phone === credentials.phone
      );

      if (userExists) {
        setError(t.userExists);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        fullName: credentials.fullName,
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
        createdAt: new Date().toISOString()
      };

      register(newUser);
      setSuccess(t.accountCreated);
    }
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (recoveryStep === 1) {
      const user = recoverPassword(credentials.recoveryIdentifier);
      if (user) {
        sendVerificationCode(credentials.recoveryIdentifier);
        setRecoveryStep(2);
        setSuccess(t.codeSent);
      } else {
        setError(t.noAccountFound);
      }
    } else if (recoveryStep === 2) {
      if (verificationCode === generatedCode) {
        setRecoveryStep(3);
        setSuccess(t.codeVerified);
      } else {
        setError(t.invalidCode);
      }
    } else {
      if (credentials.newPassword !== credentials.confirmNewPassword) {
        setError(t.passwordsDontMatch);
        return;
      }
      if (credentials.newPassword.length < 6) {
        setError(t.passwordTooShort);
        return;
      }

      updatePassword(credentials.recoveryIdentifier, credentials.newPassword);
      setSuccess(t.passwordReset);
      
      setTimeout(() => {
        setIsRecovery(false);
        setRecoveryStep(1);
        setIsLogin(true);
        setVerificationCode('');
        setGeneratedCode('');
      }, 2000);
    }
  };

  const resendCode = () => {
    if (countdown === 0) {
      sendVerificationCode(credentials.recoveryIdentifier);
      setSuccess(t.codeSent);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const startRecovery = () => {
    setIsRecovery(true);
    setRecoveryStep(1);
    setError('');
    setSuccess('');
    setVerificationCode('');
    setGeneratedCode('');
    setCountdown(0);
  };

  const cancelRecovery = () => {
    setIsRecovery(false);
    setRecoveryStep(1);
    setError('');
    setSuccess('');
    setIsLogin(true);
    setVerificationCode('');
    setGeneratedCode('');
    setCountdown(0);
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    setError('');
    setSuccess('');
  };

  if (isRecovery) {
    return (
      <div className="landing-auth-container">
        <header className="landing-header">
          <div className="logo-container">
            <div className="cunga-neza-logo-header">
              {/* Main Logo Circle */}
              <div className="logo-circle">
                <div className="rwanda-sun-logo">
                  <div className="sun-core-logo"></div>
                  <div className="sun-rays-logo">
                    <div className="ray-logo ray-1"></div>
                    <div className="ray-logo ray-2"></div>
                    <div className="ray-logo ray-3"></div>
                    <div className="ray-logo ray-4"></div>
                    <div className="ray-logo ray-5"></div>
                    <div className="ray-logo ray-6"></div>
                    <div className="ray-logo ray-7"></div>
                    <div className="ray-logo ray-8"></div>
                  </div>
                </div>
                <div className="partnership-hands-logo">🤝</div>
              </div>
              
              {/* Text Content */}
              <div className="logo-text-content">
                <div className="company-name">{t.companyName}</div>
                <div className="tagline">{t.tagline}</div>
              </div>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="language-selector">
            <button 
              className={currentLanguage === 'en' ? 'active' : ''} 
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button 
              className={currentLanguage === 'rw' ? 'active' : ''} 
              onClick={() => changeLanguage('rw')}
            >
              RW
            </button>
            <button 
              className={currentLanguage === 'fr' ? 'active' : ''} 
              onClick={() => changeLanguage('fr')}
            >
              FR
            </button>
          </div>
        </header>

        <div className="landing-content">
          <div className="partnership-section">
            <div className="partnership-art">
              <div className="customer-figure">
                <div className="figure-head"></div>
                <div className="figure-body"></div>
                <div className="connection-line"></div>
              </div>
              <div className="partnership-circle">
                <div className="rwanda-sun"></div>
                <div className="partnership-hands-icon"></div>
              </div>
              <div className="supplier-figure">
                <div className="figure-head"></div>
                <div className="figure-body"></div>
                <div className="connection-line"></div>
              </div>
            </div>
          </div>

          <div className="auth-section">
            <div className="auth-card">
              <h2>
                {recoveryStep === 1 ? t.passwordRecovery : 
                 recoveryStep === 2 ? t.verifyCode : t.resetPassword}
              </h2>
              <p className="auth-subtitle">
                {recoveryStep === 1 
                  ? t.recoveryInstructions
                  : recoveryStep === 2
                  ? t.enterVerificationCode
                  : t.setNewPassword
                }
              </p>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handleRecoverySubmit} className="auth-form">
                {recoveryStep === 1 && (
                  <div className="form-group">
                    <label>{t.email} {t.or.toLowerCase()} {t.phone}</label>
                    <input
                      type="text"
                      name="recoveryIdentifier"
                      value={credentials.recoveryIdentifier}
                      onChange={handleChange}
                      required
                      placeholder={`${t.enterEmail} ${t.or.toLowerCase()} ${t.enterPhone}`}
                    />
                  </div>
                )}

                {recoveryStep === 2 && (
                  <div className="form-group">
                    <label>{t.enterVerificationCode}</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      placeholder={t.enterVerificationCode}
                      maxLength={6}
                    />
                    <div className="code-actions">
                      <button
                        type="button"
                        className="resend-btn"
                        onClick={resendCode}
                        disabled={countdown > 0}
                      >
                        {t.resendCode} {countdown > 0 && `(${Math.floor(countdown/60)}:${(countdown%60).toString().padStart(2, '0')})`}
                      </button>
                    </div>
                  </div>
                )}

                {recoveryStep === 3 && (
                  <>
                    <div className="form-group">
                      <label>{t.newPassword}</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={credentials.newPassword}
                        onChange={handleChange}
                        required
                        placeholder={t.setNewPassword}
                      />
                    </div>

                    <div className="form-group">
                      <label>{t.confirmNewPassword}</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={credentials.confirmNewPassword}
                        onChange={handleChange}
                        required
                        placeholder={t.confirmNewPassword}
                      />
                    </div>
                  </>
                )}

                <div className="recovery-actions">
                  <button type="submit" className="auth-submit-btn">
                    {recoveryStep === 1 ? t.sendCode : 
                     recoveryStep === 2 ? t.verify : t.resetPassword}
                  </button>
                  
                  <button 
                    type="button" 
                    className="auth-cancel-btn"
                    onClick={cancelRecovery}
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN AUTH FORM (LOGIN/REGISTER)
  return (
    <div className="landing-auth-container">
      <header className="landing-header">
        <div className="logo-container">
          <div className="cunga-neza-logo-header">
            {/* Main Logo Circle */}
            <div className="logo-circle">
              <div className="rwanda-sun-logo">
                <div className="sun-core-logo"></div>
                <div className="sun-rays-logo">
                  <div className="ray-logo ray-1"></div>
                  <div className="ray-logo ray-2"></div>
                  <div className="ray-logo ray-3"></div>
                  <div className="ray-logo ray-4"></div>
                  <div className="ray-logo ray-5"></div>
                  <div className="ray-logo ray-6"></div>
                  <div className="ray-logo ray-7"></div>
                  <div className="ray-logo ray-8"></div>
                </div>
              </div>
              <div className="partnership-hands-logo">🤝</div>
            </div>
            
            {/* Text Content */}
            <div className="logo-text-content">
              <div className="company-name">{t.companyName}</div>
              <div className="tagline">{t.tagline}</div>
            </div>
          </div>
        </div>
        
        {/* Language Selector */}
        <div className="language-selector">
          <button 
            className={currentLanguage === 'en' ? 'active' : ''} 
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button 
            className={currentLanguage === 'rw' ? 'active' : ''} 
            onClick={() => changeLanguage('rw')}
          >
            RW
          </button>
          <button 
            className={currentLanguage === 'fr' ? 'active' : ''} 
            onClick={() => changeLanguage('fr')}
          >
            FR
          </button>
        </div>
      </header>

      <div className="landing-content">
        <div className="partnership-section">
          <div className={`partnership-art 
            ${animationStage >= 1 ? 'animate-names' : ''}
            ${animationStage >= 2 ? 'animate-money' : ''}
            ${animationStage >= 3 ? 'animate-handshake' : ''}
            ${animationStage >= 4 ? 'animate-thankyou' : ''}
          `}>
            {/* Customer */}
            <div className="customer-figure">
              <div className="customer-name">{currentLanguage === 'en' ? 'Customer' : currentLanguage === 'rw' ? 'Umukiriya' : 'Client'}</div>
              <div className="figure-head"></div>
              <div className="figure-body"></div>
              <div className="connection-line"></div>
            </div>
            
            {/* Animated Elements */}
            <div className="money-bag"></div>
            <div className="handshake">🤝</div>
            <div className="thank-you">{currentLanguage === 'en' ? 'Thank You!' : currentLanguage === 'rw' ? 'Murakoze!' : 'Merci!'}</div>
            
            {/* Partnership Circle */}
            <div className="partnership-circle">
              <div className="rwanda-sun"></div>
              <div className="partnership-hands-icon"></div>
            </div>
            
            {/* Supplier */}
            <div className="supplier-figure">
              <div className="supplier-name">{currentLanguage === 'en' ? 'Supplier' : currentLanguage === 'rw' ? 'Umushyuzi' : 'Fournisseur'}</div>
              <div className="figure-head"></div>
              <div className="figure-body"></div>
              <div className="connection-line"></div>
            </div>
          </div>
        </div>

        <div className="auth-section">
          <div className="auth-card">
            <h2>{isLogin ? t.welcomeBack : t.createAccount}</h2>
            <p className="auth-subtitle">
              {isLogin ? t.signInToManage : t.joinUs}
            </p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label>{t.fullName}</label>
                  <input
                    type="text"
                    name="fullName"
                    value={credentials.fullName}
                    onChange={handleChange}
                    required
                    placeholder={t.enterFullName}
                  />
                </div>
              )}

              <div className="form-group">
                <label>{isLogin ? `${t.email} ${t.or.toLowerCase()} ${t.phone}` : t.email}</label>
                <input
                  type="text"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  placeholder={isLogin ? `${t.enterEmail} ${t.or.toLowerCase()} ${t.enterPhone}` : t.enterEmail}
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>{t.phone}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={credentials.phone}
                    onChange={handleChange}
                    required
                    placeholder={t.enterPhone}
                  />
                </div>
              )}

              <div className="form-group">
                <label>{t.password}</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder={t.enterPassword}
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>{t.confirmPassword}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder={t.confirmYourPassword}
                  />
                </div>
              )}

              <button type="submit" className="auth-submit-btn">
                {isLogin ? t.signIn : t.signUp}
              </button>
            </form>

            {isLogin && (
              <div className="recovery-link">
                <button
                  type="button"
                  className="switch-btn"
                  onClick={startRecovery}
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}

            <div className="auth-switch">
              <p>
                {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
                <button
                  type="button"
                  className="switch-btn"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                >
                  {isLogin ? t.signUp : t.signIn}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAuth;