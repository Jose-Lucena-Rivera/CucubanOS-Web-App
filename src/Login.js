import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';
import Account from './account';

const RedirectIfAuthenticated = () => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Check if the user is authenticated and trying to access the dashboard page
    if (token && location.pathname !== '/') {
      window.location.href = '/dashboard';
    }
  }, [location]);

  return null;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);



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

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // Save token and email to local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', email);
            // Redirect to dashboard
            setRedirectToDashboard(true);
        } else {
            const data = await response.json();
            setErrorMessage(data.message || 'Authentication failed. Please try again.');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        setErrorMessage('An error occurred. Please try again later.');
    }
};
 

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }
  

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
              <button className="mdl-button-login mdl-button mdl-js-button mdl-js-ripple-effect" type="submit">
                Login
              </button>
            </div>
          </form>
          <div style={{ marginTop: '16px' }}> {/* Add margin-top style */}
            {/* Use Link component to navigate to Forgot Password page */}
            <Link to="/forgot_password" className="forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
