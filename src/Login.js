import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false); // State to control redirection

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(false); // Reset email error state when the user starts typing again
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false); // Reset password error state when the user starts typing again
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
    if (!email.endsWith('.com') ) {
      setEmailError(true);
      setEmailErrorMessage("The email address must end with '.com' or '.edu");  
      return;
    }

    // Validation for password
    if (!password) {
      setPasswordError(true);
      return;
    }

    // Assuming login is successful, set state to redirect to Dashboard
    setRedirectToDashboard(true);

    // Reset the form
    setEmail('');
    setPassword('');
  };

  // Redirect to Dashboard if redirectToDashboard state is true
  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
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
