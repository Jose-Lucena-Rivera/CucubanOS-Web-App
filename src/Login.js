import React, { useState } from 'react';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can add your login logic, for example, making a request to your backend with the email and password
    console.log('Email:', email);
    console.log('Password:', password);
    // Reset the form
    setEmail('');
    setPassword('');
  };

  const handleForgotPassword = () => {
    // Add logic for handling forgot password functionality, such as showing a modal or navigating to a forgot password page
    console.log('Forgot password clicked');
  };

  return (
    <div className="center-container-login">
      <div className="demo-card-square mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">Login</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <form onSubmit={handleSubmit}>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
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
           
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input
                className="mdl-textfield__input"
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <label className="mdl-textfield__label" htmlFor="password">Password...</label>
            </div>
            <div style={{ marginBottom: '16px' }}> {/* Add margin-bottom style */}
              <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
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
