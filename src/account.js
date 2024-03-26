import React, { useState } from 'react';
import Layout from './Layout';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';

const Account = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleRemoveAccountClick = () => {
    const selectedAccountData = []; // Replace with logic to get selected user(s) information
    setSelectedUsers(selectedAccountData);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect add-account" type="submit">
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
          {/* Dialog */}
          {isDialogOpen && (
            <div className="custom-dialog">
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
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={handleCloseDialog}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Account;
