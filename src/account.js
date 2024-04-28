import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';

const Account = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Flag to track if passwords match
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);



  useEffect(() => {
    const handleTouchStart = (event) => {
      event.target.classList.add('touched'); // Add a class to indicate touch
    };

    const handleTouchEnd = (event) => {
      event.target.classList.remove('touched'); // Remove the touch class
      event.target.click(); // Trigger the button click
    };

    // Add touch event listeners to all buttons
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('touchstart', handleTouchStart);
      button.addEventListener('touchend', handleTouchEnd);
    });

    // Cleanup: Remove event listeners when the component unmounts
    return () => {
      document.querySelectorAll('button').forEach((button) => {
        button.removeEventListener('touchstart', handleTouchStart);
        button.removeEventListener('touchend', handleTouchEnd);
      });
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  const handleSignOut = () => {
    // Redirect to the login page ("/")
    window.location.href = '/';
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
      setIsChangePasswordOpen(false);
    // Reset input fields
    setCurrentPassword('');
    // Reset error message
    setPasswordsMatch(true);
  };

  const handleCloseConfirmPassword = () => {
    setIsConfirmPasswordOpen(false);
        // Reset input fields
      setNewPassword('');
      setConfirmPassword('');
      // Reset error message
      setPasswordsMatch(true);
  };

  const handleSubmitChangePassword = (event) => {
    event.preventDefault();
    // Add logic to handle password change
    console.log('Current Password:', currentPassword);
    // Close the Change Password dialog
    handleCloseChangePassword();
    // Open the Confirm Password dialog
    setIsConfirmPasswordOpen(true);
  };

  const handleSubmitConfirmPassword = (event) => {
    event.preventDefault();
    if (newPassword === confirmPassword) {
      // Passwords match, proceed with password change
      console.log('Password changed successfully.');
      handleCloseConfirmPassword();
    } else {
      // Passwords do not match, display error message
      setPasswordsMatch(false);
    }
  };

  // Function to toggle visibility of new password
  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  // Function to toggle visibility of confirm password
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <Layout>
      <div className="user-info">
        <div className="user-info-header">
          <h3>Account info</h3>
        </div>
        <div className="user-info-content">
          <h5>Email:</h5>
          <h5>jose.lucena@upr.edu</h5>
        </div>
      </div>
      <div className="dashboard-content center-account-container">
        {/* Sign out button */}
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect sign-out" type="submit" onClick={handleSignOut}>
          <span>Sign Out</span>
        </button>
        {/* Change password button */}
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect change-password" type="submit" onClick={() => setIsChangePasswordOpen(true)}>
          <span>Change Password</span>
        </button>
      </div>
      {/* Change Password Card */}
      {isChangePasswordOpen && (
        <div className="backdrop" onClick={handleCloseChangePassword}>
          <div className="custom-dialog change-password-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="change-password-card">
              <h3 className="dialog-content-change">Change Password</h3>
              <div className="mdl-card__supporting-text-account">
                {/* Supporting text */}
                Enter your current password.
              </div>
              <form onSubmit={handleSubmitChangePassword}>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input
                    className="mdl-textfield__input"
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <label className="mdl-textfield__label" htmlFor="currentPassword">Current Password</label>
                </div>
                {/* Add inputs for new password and confirmation if needed */}
                {/* Close and submit buttons */}
                <div className="dialog-actions">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button-change" onClick={handleCloseChangePassword}>
                    X
                  </button>
                  <div className="dialog-actions-submit-change">
                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Password Card */}
      {isConfirmPasswordOpen && (
        <div className="backdrop" onClick={handleCloseConfirmPassword}>
          <div className="custom-dialog confirm-password-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-password-card">
              <h3 className="dialog-content-confirm">Confirm Password</h3>
              <form onSubmit={handleSubmitConfirmPassword}>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label password-input">
                  <input
                    className="mdl-textfield__input"
                    type={isNewPasswordVisible ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <label className="mdl-textfield__label" htmlFor="newPassword">New Password</label>
                  <button type="button" className="mdl-button mdl-js-button mdl-button--icon password-visibility-button" onClick={toggleNewPasswordVisibility}>
                    <i className="material-icons">{isNewPasswordVisible ? "visibility_off" : "visibility"}</i>
                  </button>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label password-input">
                  <input
                    className="mdl-textfield__input"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label className="mdl-textfield__label" htmlFor="confirmPassword">Confirm Password</label>
                  <button type="button" className="mdl-button mdl-js-button mdl-button--icon password-visibility-button" onClick={toggleConfirmPasswordVisibility}>
                    <i className="material-icons">{isConfirmPasswordVisible ? "visibility_off" : "visibility"}</i>
                  </button>
                </div>
                {/* Add error message if passwords do not match */}
                {!passwordsMatch && <div className="error-message">Passwords do not match.</div>}
                <div className="dialog-actions">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button-confirm" onClick={handleCloseConfirmPassword}>
                    X
                  </button>
                  <div className="dialog-actions-submit-confirm">
                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Account;
