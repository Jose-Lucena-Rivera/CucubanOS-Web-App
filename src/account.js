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
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect change-password" type="submit">
            <span>Change Password</span>
          </button>
          {/* Dialog and backdrop */}
          {isDialogOpen && (
            <>
              <div className="backdrop" onClick={handleCloseDialog}></div>
              <div className="custom-dialog" style={{ width: '50%' }}>
                <div className="dialog-content">
                  <h4>Delete User? </h4>
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
                <button className="close-button" onClick={handleCloseAddCard}>
                  X
                </button>
                <div className="add-account-card">
                  <h2 className="add-account-card-title">Add an Account</h2>
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
                    <div className="center-btn">
                      <button className="mdl-button-account mdl-button mdl-js-button mdl-js-ripple-effect" type="submit">
                        Submit
                      </button>
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
