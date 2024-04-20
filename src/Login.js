import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false); // State to control redirection
  const AAD_B2C_CLIENT_ID = '3a70932b-93dd-4960-9188-3a2e3a15c9f1';

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(false); // Reset email error state when the user starts typing again
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false); // Reset password error state when the user starts typing again
  };

  const handleAzureLogin = async () => {
    const nonce = uuidv4();
    const redirectUri = encodeURIComponent(window.location.origin + '/dashboard');
    const azureLoginUrl = `https://CucubanosAuth.b2clogin.com/CucubanosAuth.onmicrosoft.com/B2C_1_login/oauth2/v2.0/authorize?client_id=${AAD_B2C_CLIENT_ID}&response_type=id_token&redirect_uri=${redirectUri}&response_mode=form_post&scope=openid&nonce=${nonce}&p=B2C_1_login`;
    window.location.href = azureLoginUrl;

    
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation for email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !emailRegex.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("The email address must have a '.'");
      return;
    }

    // Additional validation for email domain
    const allowedDomains = ['.com', '.edu', '.org', '.net'];
    const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));
    if (!isValidDomain) {
      setEmailError(true);
      setEmailErrorMessage("The email must end with a valid domain");  
      return;
    }

    // Validation for password
    if (!password) {
      setPasswordError(true);
      return;
    }

    // Redirect to Azure AD B2C login
    handleAzureLogin();
  };
  
  // Function to send the id_token to the backend
  const sendTokenToBackend = async (idToken) => {
    const response = await fetch('/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await response.json();
  
    if (data.success) {
      // Navigate to the dashboard or set session or do other things as needed
      window.location.href = '/dashboard';
    } else {
      // Handle the error
      console.error('Authentication failed:', data.message);
    }
  };

  // Check if there's an id_token in the URL (after redirection from Azure AD B2C)
  const urlParams = new URLSearchParams(window.location.search);
  const idToken = urlParams.get('id_token');

  if (idToken) {
    // If id_token is present, send it to the backend for validation
    sendTokenToBackend(idToken);
  }




  return (
    <div className="center-container-login">
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
              <label className="mdl-textfield__label" htmlFor="email">Email...</label>
              {emailError && <span className="error-message">{emailErrorMessage}</span>}
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
              <label className="mdl-textfield__label" htmlFor="password">Password...</label>
              {passwordError && <span className="error-message">Please enter your password</span>}
            </div>
            <div style={{ marginBottom: '16px' }}> {/* Add margin-bottom style */}
              {/* Use Link component to navigate to Forgot Password page */}
              <Link to="/forgot_password" className="forgot-password">Forgot Password?</Link>
            </div>
            <div className="center-btn">
              <button className="mdl-button-login mdl-button mdl-js-button mdl-js-ripple-effect" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
