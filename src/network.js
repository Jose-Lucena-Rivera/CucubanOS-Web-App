import React from 'react';
import Layout from './Layout';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';

const Network = () => {
  return (
    <Layout>
      <div className="dashboard-content center-network-container">
      <button className="mdl-button-network mdl-button--colored mdl-js-button mdl-js-ripple-effect add-buoy" type="submit">
        <i class="material-icons">add</i>
        <span>Add a Buoy</span>
      </button>
        <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp custom-width-network">
          <thead>
            <tr>
              <th className="mdl-data-table__cell--non-numeric">ID</th>
              <th>Battery %</th>
              <th>Coordinates</th>
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
        <button className="mdl-button-network mdl-button--colored mdl-js-button mdl-js-ripple-effect remove-buoy" type="submit">
        <i class="material-icons">remove</i>
        <span>Remove a Buoy</span>
      </button>
      </div>
    </Layout>
  );
};

export default Network;
