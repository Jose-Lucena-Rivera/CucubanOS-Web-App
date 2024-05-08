import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';

const MAX_LOGIN_ATTEMPTS = 10; // Maximum number of login attempts allowed
const LOCKOUT_DURATION = 5 * 60 * 1000; // Lockout duration in milliseconds (5 minutes)
const LOCKOUT_STORAGE_KEY = 'loginLockout';

const RedirectIfAuthenticated = () => {
  const location = useLocation();
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Check if the user is authenticated and trying to access the dashboard page
    if (token && location.pathname !== '/') {
      setRedirectToDashboard(true);
    }
  }, [location]);

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }

  return null;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutActive, setLockoutActive] = useState(false);

  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem(LOCKOUT_STORAGE_KEY)) || 0;
    setLoginAttempts(storedAttempts);
  }, []);

  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem(LOCKOUT_STORAGE_KEY)) || 0;
    setLoginAttempts(storedAttempts);
    const lockoutTimestamp = parseInt(localStorage.getItem('lockoutTimestamp')) || 0;
    const timeElapsed = Date.now() - lockoutTimestamp;
    if (timeElapsed < LOCKOUT_DURATION) {
      setLockoutActive(true);
    } else {
      setLockoutActive(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCKOUT_STORAGE_KEY, loginAttempts);
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutTimestamp = Date.now();
      localStorage.setItem('lockoutTimestamp', lockoutTimestamp);
      setLockoutActive(true);
      setTimeout(() => {
        localStorage.removeItem('lockoutTimestamp');
        setLockoutActive(false);
        setLoginAttempts(0);
        localStorage.removeItem(LOCKOUT_STORAGE_KEY);
      }, LOCKOUT_DURATION);
    }
  }, [loginAttempts]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(false);
    setErrorMessage(''); // Clear error message when email changes
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
    setErrorMessage(''); // Clear error message when password changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (lockoutActive) {
      setErrorMessage(`You have reached the maximum number of login attempts. Please try again in ${Math.ceil((LOCKOUT_DURATION - (Date.now() - parseInt(localStorage.getItem('lockoutTimestamp')))) / (1000 * 60))} minutes.`);
      return;
    }

    try {
      const response = await fetch('https://boyaslacatalana-api.azurewebsites.net/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        console.log('Redirecting to dashboard...');
        window.location.href = '/dashboard';
      } else {
        const data = await response.json();
        if (response.status === 401 && data.message === 'You have been locked due to failed login attempts. Please try again in 5 minutes.') {
          setErrorMessage(data.message);
        } else {
          setLoginAttempts((prevAttempts) => prevAttempts + 1);
          setErrorMessage('Invalid email or password.');

          // Log the current value of loginAttempts
          console.log('Current login attempts:', loginAttempts);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="center-container-login">
      <RedirectIfAuthenticated />
      <div className="demo-card-square mdl-card mdl-shadow--3dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">Login</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <form onSubmit={handleSubmit}>
            <div className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${emailError ? 'is-invalid' : ''}`}>
              <input
                className="mdl-textfield__input"
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label className="mdl-textfield__label" htmlFor="email">Email:</label>
            </div>

            <div className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${passwordError ? 'is-invalid' : ''}`}>
              <input
                className="mdl-textfield__input"
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <label className="mdl-textfield__label" htmlFor="password">Password:</label>
            </div>
            <div className="error-message">{errorMessage}</div>
            <div className="center-btn">
              <button
                className="mdl-button-login mdl-button mdl-js-button mdl-js-ripple-effect"
                type="submit"
                disabled={lockoutActive || loginAttempts >= MAX_LOGIN_ATTEMPTS}
              >
                Submit
              </button>
            </div>
          </form>
          <div style={{ marginTop: '16px' }}>
            <Link to="/forgot_password" className="forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
