import React, { useState, useEffect } from 'react';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';
import './styles.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Clear error message when email changes
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`https://boyaslacatalana-api.azurewebsites.net/get-user?email=${email}`);
  
      if (response.ok) {
        // User found, show notification
        setNotification('You have been sent an email to change your password');
        setError('');

         // Store email in localStorage
         localStorage.setItem('forgotPasswordEmail', email);
  
        // Make a POST request to the forgot password route with the email
        const postResponse = await fetch('https://boyaslacatalana-api.azurewebsites.net/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email })
        });
  
        if (postResponse.ok) {
          // Password reset email sent successfully
          console.log('Password reset email sent successfully');
        } else {
          // Failed to send password reset email
          console.error('Failed to send password reset email');
        }
  
      } else {
        // User not found, display error message
        setError('User email not in system');
        setNotification('');
      }
    } catch (error) {
      console.error('Error:', error.message); // Log the error message
      setError('Failed to perform operation'); // Update the error state
    }
  
    // Reset the form
    setEmail('');
  };

  useEffect(() => {
    if (notification) {
      // Set a timeout to hide the notification after 3 seconds
      const timeout = setTimeout(() => {
        setNotification('');
      }, 3000);
  
      // Clear the timeout when the component unmounts or when notification changes
      return () => clearTimeout(timeout);
    }
  }, [notification]);



  return (
    <div className="center-container-login">
      <div className="demo-card-square mdl-card-forgot mdl-shadow--3dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">Forgot Password?</h2>
        </div>
        <div className="mdl-card__supporting-text">
          After submitting your email you will receive a one-time use link to change your password.
          <form onSubmit={handleSubmit}>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label forgotpassword-input-container">
              <input
                className={`mdl-textfield__input ${error ? 'is-invalid' : ''}`}
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label className="mdl-textfield__label" htmlFor="email">Email:</label>
              {error && <span className="error-message">{error}</span>}
            </div>
            <div className="forgotpassword-button">
              <button className="mdl-button-login mdl-button mdl-js-button mdl-js-ripple-effect" type="submit">
                Submit
              </button>
            </div>
          </form>
          {/* Notification */}
          {notification && (
            <div className="notification-container">
              <div className="notification-card">
                <div className="notification-text">{notification}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
