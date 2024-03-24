import React from 'react';
import Layout from './Layout';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';

const Network = () => {
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
                <td className="mdl-data-table__cell--non-numeric">#</td>
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
          <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect add-account" type="submit">
          <i class="material-icons">add</i>
            <span>Add an account</span>
           </button>
           <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect remove-account" type="submit">
          <i class="material-icons">remove</i>
          <span>Remove an account</span>
      </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect sign-out" type="submit">
          <span>Sign Out</span>
        </button>
        <button className="mdl-button-account mdl-button--colored mdl-js-button mdl-js-ripple-effect change-password" type="submit">
          <span>Change Password</span>
      </button>
        </div>
      </div>
    </Layout>
  );
};

export default Network;
