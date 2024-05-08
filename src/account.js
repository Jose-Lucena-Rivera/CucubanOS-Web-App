import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';
import logoCatalana from './images/logoCatalana-removebg-preview.png'; 




const Account = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Flag to track if passwords match
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // State variable for confirm password error
  const [showNotification, setShowNotification] = useState(false);
  



 

  useEffect(() => {
    // Check if the user is logged in (i.e., if there's a token in local storage)
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token found, redirect the user to the login page
      window.history.pushState(null, '', '/'); // Add new history entry
              window.location.href = '/'; // Redirect to the login page
              window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (showNotification) {
      // Set a timeout to hide the notification after 3 seconds
      const timeout = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      // Clear the timeout when the component unmounts or when showNotification changes
      return () => clearTimeout(timeout);
    }
  }, [showNotification]);


  useEffect(() => {
    // Retrieve email from localStorage
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
    }
  }, []);

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
    // Remove token from local storage
    localStorage.removeItem('token');
  
    window.history.pushState(null, '', '/'); // Add new history entry
    window.location.href = '/'; // Redirect to the login page
    window.location.reload();
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

  

  const handleSubmitChangePassword = async (event) => {
    event.preventDefault();
    try {
      // Fetch user information from local storage
      const email = localStorage.getItem('email');
  
      // Fetch user information from the backend
      const response = await fetch(`https://boyaslacatalana-api.azurewebsites.net/verify-password?email=${email}&currentPassword=${currentPassword}`);
  
      if (response.ok) {
        // Response status is in the range 200-299, indicating success
        const data = await response.json();
        if (data.success) {
          // Current password is correct, proceed to the Confirm Password dialog
          handleCloseChangePassword();
          setIsConfirmPasswordOpen(true);
          // Reset current password error
          setCurrentPasswordError('');
        } else {
          // Current password is incorrect, display an error message
          console.log('Incorrect current password');
          setCurrentPasswordError('Incorrect current password');
        }
      } else {
        // Server returned an error response
        console.error('Error verifying current password:', response.statusText);
        setCurrentPasswordError('Error verifying current password');
      }
    } catch (error) {
      setCurrentPasswordError('Error verifying current password');
      console.error('Error verifying current password:', error);
    }
  };
  
  const handleSubmitConfirmPassword = async (event) => {
    event.preventDefault();
  
    // Check if new password is the same as the current password
    if (newPassword === currentPassword) {
      // Display an error message to the user
      setConfirmPasswordError('New password cannot be the same as the current password');
      return;
    } else {
      setConfirmPasswordError(''); // Reset confirm password error
    }
  
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      // Display an error message to the user
      setConfirmPasswordError('Passwords do not match');
      return;
    } else {
      setConfirmPasswordError(''); // Reset confirm password error
    }
  
    // Check if the new password meets the criteria
    const passwordRegex = /^(?=.*[0-9]).{8,12}$/;
    if (!passwordRegex.test(newPassword)) {
      // Display an error message to the user
      setConfirmPasswordError('Password must be 8-12 characters long and contain at least 1 number');
      return;
    } else {
      setConfirmPasswordError(''); // Reset confirm password error
    }
  
    try {
      // Fetch user information from local storage
      const email = localStorage.getItem('email');
  
      // Send a request to update the password only if the new password is different
      if (newPassword !== currentPassword) {
        // Send a request to the backend to update the password
        const response = await fetch('https://boyaslacatalana-api.azurewebsites.net/update-password', {
          method: 'PUT', // Use PUT method
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            currentPassword,
            newPassword,
          }),
        });
        
        if (response.ok) {
          // Password updated successfully
          console.log('Password updated successfully');
          setShowNotification(true); // Show the notification
          handleCloseConfirmPassword(); // Close the dialog
        } else {
          // Failed to update password, display an error message
          console.log('Failed to update password');
          setConfirmPasswordError('New password cannot be the same as the current password');
        }
      } else {
        // New password is the same as the current password, display an error message
        console.error('New password cannot be the same as the current password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
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
          <h5>{localStorage.getItem('email')}</h5>
        </div>
      </div>
     
      <div className="dashboard-content center-account-container">
      <div className="image-container">
      <img src={logoCatalana} alt="Catalana Logo" />
        </div>
      {showNotification && (
        <div className="notification-container">
          <div className="notification-card">
            <div className="notification-text">Password updated successfully!</div>
          </div>
        </div>
      )}
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
                To change your password please enter your current password.
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
                {currentPasswordError && <div className="error-message">{currentPasswordError}</div>}
                {/* Close and submit buttons inside the Change Password dialog*/}
              <div className="dialog-actions">
                <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button-change" onClick={handleCloseChangePassword}>
                  X
                </button>
                <div className="dialog-actions-submit-change">
                  <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" onClick={handleSubmitChangePassword}>
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
              <h3 className="dialog-content-confirm">Confirm Password Change</h3>
              <div className="mdl-card__supporting-text-account">
                {/* Supporting text */}
                You are about to change your password please enter a new password and confirm it below.
                Your password must have 8-12 letters and a number.
              </div>
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
                {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
                {/*Close and submit buttons inside the Confirm Password dialog*/}
                <div className="dialog-actions">
                  <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button-confirm" onClick={handleCloseConfirmPassword}>
                    X
                  </button>
                  <div className="dialog-actions-submit-confirm">
                    <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" onClick={handleSubmitConfirmPassword}>
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
