import React, { useState } from 'react';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';
import './styles.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can add your logic for handling forgot password functionality, for example, sending a reset password link to the provided email
    console.log('Email:', email);
    // Reset the form
    setEmail('');
  };

  return (
    <div className="center-container-login">
      <div className="demo-card-square mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">Forgot Password?</h2>
        </div>
        <div className="mdl-card__supporting-text">
            After submiting your email you will receive a one-time use link to chage your password.
          <form onSubmit={handleSubmit}>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label forgotpassword-input-container">
              <input
                className="mdl-textfield__input"
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label className="mdl-textfield__label" htmlFor="email">Email...</label>
            </div>
            <div className="forgotpassword-button">
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

export default ForgotPassword;
