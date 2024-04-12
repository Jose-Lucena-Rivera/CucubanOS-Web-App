import React, { useState } from 'react';
import Layout from './Layout';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';

const Account = () => {
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Flag to track if passwords match
  const [emailError, setEmailError] = useState(''); // Error message for invalid email
  const [accounts, setAccounts] = useState([]); // Step 1: State variable to store accounts
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);




  const handleRemoveAccountClick = () => {
    // Filter out the selected accounts from the accounts array
    const selectedAccountData = accounts.filter(account => selectedUsers.includes(account));
    setSelectedUsers(selectedAccountData); // Update selectedUsers state
    setIsRemoveOpen(true); // Open the remove dialog
  };

  const handleCloseRemoveDialog = () => {
    setIsRemoveOpen(false); // Close the remove dialog
  };

    const handleSubmitRemove = () => {
    // Logic to remove the selected account(s) from the table
    const updatedAccounts = accounts.filter(account => !selectedUsers.includes(account));
    setAccounts(updatedAccounts);
    setSelectedUsers([]); // Clear selected users
    handleCloseRemoveDialog(); // Close the dialog
  };

  const handleAddAccountClick = () => {
    setIsAddCardOpen(true);
  };

  const handleCloseAddCard = () => {
    setIsAddCardOpen(false);
  };

  const [newAccounts, setNewAccounts] = useState([]);

  const handleSubmitAddCard = (event) => {
    event.preventDefault();
    const allowedDomains = ['.com', '.edu', '.org', '.net'];
    const isValidDomain = allowedDomains.some(domain => newUserEmail.toLowerCase().endsWith(domain));
    if (!isValidDomain) {
      setEmailError('Email must end with a valid domain (.com, .edu, .org, .net)');
      return;
    }
    setEmailError(''); // Reset email error if domain is valid
  
    // Construct the new account object
    const newAccount = { name: newUserName, email: newUserEmail, password: 'Generated Password' };
  
    // Insert the new account at the end of the accounts array
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
  
    // Add the new account to the newAccounts array
    setNewAccounts(prevNewAccounts => [...prevNewAccounts, newAccount]);
  
    // Clear input fields
    setNewUserName('');
    setNewUserEmail('');
  
    // Close the dialog after submission
    handleCloseAddCard();
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  const handleSubmitChangePassword = (event) => {
    event.preventDefault();
  // Add logic to handle password change
  console.log('Current Password:', currentPassword);
    // Close the Change Password dialog
    handleCloseChangePassword();
    // Open the Confirm Password dialog
    setIsConfirmPasswordOpen(true);
    // Reset passwordsMatch flag
    setPasswordsMatch(true);
    // Reset password fields
    resetPasswordFields();
  };

const handleSubmitConfirmPassword = (event) => {
  event.preventDefault();
  if (newPassword === confirmPassword) {
    // Passwords match, proceed with password change
    console.log('Password changed successfully.');
    handleCloseConfirmPassword(); // Close the Confirm Password dialog
    resetPasswordFields(); // Reset password fields
  } else {
    // Passwords do not match, display error message
    setPasswordsMatch(false);
  }
};

  const handleCloseConfirmPassword = () => {
    setIsConfirmPasswordOpen(false);
    // Reset passwordsMatch flag when Confirm Password dialog is closed
    setPasswordsMatch(true);
  };

    // Function to reset password fields
  const resetPasswordFields = () => {
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    // Check if the email ends with ".com"
    setNewUserEmail(value);
  };

  const handleSignOut = () => {
    // Redirect to the login page ("/")
    window.location.href = '/';
  };

  // Function to toggle visibility of new password
const toggleNewPasswordVisibility = () => {
  setIsNewPasswordVisible(!isNewPasswordVisible);
};

// Function to toggle visibility of confirm password
const toggleConfirmPasswordVisibility = () => {
  setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
};

// Function to handle checkbox click and update selectedUsers state
const handleCheckboxChange = (account) => {
  const isSelected = selectedUsers.some(selectedAccount => selectedAccount === account);
  if (isSelected) {
    // If account is already selected, remove it
    setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(selectedAccount => selectedAccount !== account));
  } else {
    // If account is not selected, add it
    setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, account]);
  }
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
        <div className="table-title">
          <h3>Accounts with access</h3>
        </div>
        <div className="table-container">
        <table className="mdl-data-table mdl-js-data-table mdl-data-table mdl-shadow--2dp custom-width-account">
          <thead>
            <tr>
              <th class="mdl-data-table-name">Name</th>
              <th class="mdl-data-table-email">Email</th>
              <th class="mdl-data-table-password">Password</th>
            </tr>
          </thead>
          <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <td className="mdl-data-table__cell--non-numeric account-name">
                <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                  <input
                    type="checkbox"
                    className="mdl-checkbox__input"
                    onChange={() => handleCheckboxChange(account)}
                  />
                </label>
                {account.name}
              </td>
              <td className="email-cell">{account.email}</td>
              <td className="password-cell">{account.password}</td>
            </tr>
          ))}
        </tbody>
        </table>
          {/* Add an account button */}
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect add-account" onClick={handleAddAccountClick} type="submit">
            <i className="material-icons">add</i>
            <span>Add an account</span>
          </button>
          {/* Remove an account button */}
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect remove-account" onClick={handleRemoveAccountClick} type="submit">
            <i className="material-icons">remove</i>
            <span>Remove an account</span>
          </button>
          {/* Sign out button */}
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect sign-out" type="submit" onClick={handleSignOut}>
            <span>Sign Out</span>
          </button>
          {/* Change password button */}
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect change-password" type="submit" onClick={() => setIsChangePasswordOpen(true)}>
            <span>Change Password</span>
          </button>
        </div>
      </div>
        {/* Remove Account Dialog */}
      {isRemoveOpen && (
        <>
          <div className="backdrop" onClick={handleCloseRemoveDialog}></div>
          <div className="custom-dialog" style={{ width: '50%' }}>
            <div className="dialog-content">
              <h4>Delete User?</h4>
              <div className="mdl-card__supporting-text-account-remove">
                You are about to remove the following accounts, this action cannot be undone.
              </div>
              <ul>
                {selectedUsers.map((account, index) => (
                  <li key={index}>
                    Name: {account.name}, Email: {account.email}, Password: {account.password}
                  </li>
                ))}
              </ul>
            </div>
            <div className="dialog-actions">
              {/* Close button */}
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button" onClick={handleCloseRemoveDialog}>
                X
              </button>
              {/* Submit button */}
              <div className="dialog-actions-submit">
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" onClick={handleSubmitRemove}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Add Account Card */}
      {isAddCardOpen && (
        <div className="backdrop" onClick={handleCloseAddCard}>
          <div className="custom-dialog add-account-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="add-account-card">
              <h3 className="dialog-content-add">Add an Account</h3>
              <div className="mdl-card__supporting-text-account">
                To add an account please place a Name and Email that will be associated with the account. A one time use password will be generated for the user, they will be prompted to change once they login.
              </div>
              <form onSubmit={handleSubmitAddCard}>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input
                    className={`mdl-textfield__input ${emailError ? 'invalid' : ''}`}
                    type="text"
                    id="newUserName"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    required
                  />
                  <label className="mdl-textfield__label" htmlFor="newUserName">Name...</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input
                    className={`mdl-textfield__input ${emailError ? 'invalid' : ''}`}
                    type="email"
                    id="newUserEmail"
                    value={newUserEmail}
                    onChange={handleEmailChange}
                    required
                  />
                  <label className="mdl-textfield__label" htmlFor="newUserEmail">Email...</label>
                  {/* Error message if email is invalid */}
                  {emailError && <div className="error-message">{emailError}</div>}
                </div>
                <div className="dialog-actions">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button" onClick={handleCloseAddCard}>
                    X
                  </button>
                  <div className="dialog-actions-submit-add">
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
