import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [redirect, setRedirect] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!password) {
      setPasswordError(true);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    console.log('New Password:', password);
    setRedirect(true);

    setPassword('');
    setConfirmPassword('');
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="center-container-login">
      <div className="demo-card-square mdl-card-change mdl-shadow--2dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">Change Password</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <p>
            Please enter a new password for your account and confirm below. This action cannot be undone.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${passwordError ? 'is-invalid' : ''}`}>
              <input
                className="mdl-textfield__input"
                type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <label className="mdl-textfield__label" htmlFor="password">New Password:</label>
              <span className="material-icons password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
              {passwordError && <span className="error-message">Please enter your new password</span>}
            </div>
            <div className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${confirmPasswordError ? 'is-invalid' : ''}`}>
              <input
                className="mdl-textfield__input"
                type={showConfirmPassword ? "text" : "password"} // Toggle input type based on showConfirmPassword state
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <label className="mdl-textfield__label" htmlFor="confirmPassword">Confirm Password:</label>
              <span className="material-icons password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
              {confirmPasswordError && <span className="error-message">Passwords do not match</span>}
            </div>
            <div className="changepassword-button">
              <button className="mdl-button-login mdl-button mdl-js-button mdl-js-ripple-effect" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
