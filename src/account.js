import React, { useState } from 'react';
import Layout from './Layout';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';
import './styles.css';

const Account = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); 
  const [currentPassword, setCurrentPassword] = useState(''); 

  const handleRemoveAccountClick = () => {
    const selectedAccountData = []; // Replace with logic to get selected user(s) information
    setSelectedUsers(selectedAccountData);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    // Add logic to initiate the process to remove the account
    console.log('Submit button clicked');
    // Close the dialog after submission
    handleCloseDialog();
  };

  const handleAddAccountClick = () => {
    setIsAddCardOpen(true);
  };

  const handleCloseAddCard = () => {
    setIsAddCardOpen(false);
  };

  const handleSubmitAddCard = (event) => {
    event.preventDefault();
    // Add logic to submit new account
    console.log('New User Name:', newUserName);
    console.log('New User Email:', newUserEmail);
    handleCloseAddCard();
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  const handleSubmitChangePassword = (event) => {
    event.preventDefault();
    // Add logic to handle password change
    console.log('Current Password:', currentPassword);
    handleCloseChangePassword();
  };
  

  return (
    <Layout>
      <div className="dashboard-content center-account-container">
        <div className="table-title">
          <h3>Accounts with access</h3>
        </div>
        <div className="table-container">
          <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp custom-width-account">
            <thead>
              <tr>
                <th className="mdl-data-table__cell--non-numeric">Name</th>
                <th>Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mdl-data-table__cell--non-numeric">Jonathan</td>
                <td>%</td>
                <td>#</td>
              </tr>
              <tr>
                <td className="mdl-data-table__cell--non-numeric"># </td>
                <td>%</td>
                <td>#</td>
              </tr>
              <tr>
                <td className="mdl-data-table__cell--non-numeric"># </td>
                <td>%</td>
                <td>#</td>
              </tr>
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
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect sign-out" type="submit">
            <span>Sign Out</span>
          </button>
          {/* Change password button */}
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect change-password" type="submit" onClick={() => setIsChangePasswordOpen(true)}>
            <span>Change Password</span>
          </button>
          {/* Dialog and backdrop */}
          {isDialogOpen && (
            <>
              <div className="backdrop" onClick={handleCloseDialog}></div>
              <div className="custom-dialog" style={{ width: '50%' }}>
                <div className="dialog-content">
                  <h4>Delete User? </h4>
                  <div className="mdl-card__supporting-text-account-remove">
                  You are about to remove the following accounts, this action cannot be undone. </div>
                  <ul>
                    {selectedUsers.map(account => (
                      <li key={account.id}>
                        Name: {account.name}, Email: {account.email}, Password: {account.password}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dialog-actions">
                  {/* X button */}
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button" onClick={handleCloseDialog}>
                    X
                  </button>
                  {/* Submit button */}
                  <div className="dialog-actions-submit">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" onClick={handleSubmit}>
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
                  To add an account please place a Name and Email that will be associated with the account. A one time use password will be generated for the user, they will be prompted to change once they login.</div>
                  <form onSubmit={handleSubmitAddCard}>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                      <input
                        className="mdl-textfield__input"
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
                        className="mdl-textfield__input"
                        type="email"
                        id="newUserEmail"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required
                      />
                      <label className="mdl-textfield__label" htmlFor="newUserEmail">Email...</label>
                    </div>
                    <div className="dialog-actions">
                      <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button" onClick={handleCloseAddCard}>
                        X
                      </button>
                      <div className="dialog-actions-submit-add">
                      <button className= "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" type="submit">
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
        </div>
      </div>
    </Layout>
  );
};

export default Account;
