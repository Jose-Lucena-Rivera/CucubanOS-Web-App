import React, { useState } from 'react';
import Layout from './Layout';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';

const Network = () => {
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedBuoy, setSelectedBuoy] = useState(null); // Track selected buoy
  const [networkId, setNetworkId] = useState('');
  const [buoyId, setBuoyId] = useState('');

  const handleRemoveBuoyClick = () => {
    const selectedBuoyData = []; // Replace with logic to get selected buoy(s) information
    setSelectedBuoy(selectedBuoyData); // Set selected buoy data
    setIsRemoveDialogOpen(true); // Open the remove dialog
  };

  const handleAddBuoyClick = () => {
    setIsAddCardOpen(true); // Open the add card
  };

  const handleCloseRemoveDialog = () => {
    setIsRemoveDialogOpen(false);
  };

  const handleCloseAddCard = () => {
    setIsAddCardOpen(false);
  };

  const handleSubmitRemoveDialog = () => {
    console.log('Remove Buoy button clicked');
    handleCloseRemoveDialog();
  };

  const handleSubmitAddCard = (event) => {
    event.preventDefault();
    console.log('Add Buoy button clicked');
    console.log('Network ID:', networkId);
    console.log('Buoy ID:', buoyId);
    handleCloseAddCard();
  };

  const handleNetworkIdChange = (event) => {
    setNetworkId(event.target.value);
  };

  const handleBuoyIdChange = (event) => {
    setBuoyId(event.target.value);
  };

  return (
    <Layout>
      <div className="dashboard-content center-network-container">
      <h3 className="table-title-network">Buoy Information</h3>
        <button className="mdl-button-network mdl-button--colored mdl-js-button mdl-js-ripple-effect add-buoy" onClick={handleAddBuoyClick} type="submit">
          <i className="material-icons">add</i>
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
              <td className="mdl-data-table__cell--non-numeric">1</td>
              <td>80%</td>
              <td>18.273986, -66.651742</td>
            </tr>
            <tr>
              <td className="mdl-data-table__cell--non-numeric">2 </td>
              <td>85%</td>
              <td>18.267751, -66.656763</td>
            </tr>
            <tr>
              <td className="mdl-data-table__cell--non-numeric">3 </td>
              <td>73%</td>
              <td>18.264861, -66.656703</td>
            </tr>
          </tbody>
        </table>
        <button className="mdl-button-network mdl-button--colored mdl-js-button mdl-js-ripple-effect remove-buoy" onClick={handleRemoveBuoyClick} type="submit">
          <i className="material-icons">remove</i>
          <span>Remove a Buoy</span>
        </button>
        {isRemoveDialogOpen && (
          <>
            <div className="backdrop" onClick={handleCloseRemoveDialog}></div>
            <div className="custom-dialog" style={{ width: '50%' }}>
              <div className="dialog-content">
                <h3>Delete Buoy? </h3>
                <div className="mdl-card__supporting-text-account">
                  You are about to delete a buoy from the network. This action cannot be undone.</div>
                <ul>
                  {selectedBuoy && (
                    <li key={selectedBuoy.id}>
                      ID: {selectedBuoy.id}, Battery %: {selectedBuoy.battery}, Coordinates: {selectedBuoy.coordinates}
                    </li>
                  )}
                </ul>
              </div>
              <div className="dialog-actions">
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button" onClick={handleCloseRemoveDialog}>
                  X
                </button>
                <div className="dialog-actions-submit-network">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" onClick={handleSubmitRemoveDialog}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {isAddCardOpen && (
          <div className="backdrop" onClick={handleCloseAddCard}>
            <div className="custom-dialog add-buoy-dialog" onClick={(e) => e.stopPropagation()}>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button-network" onClick={handleCloseAddCard}>
                X
              </button>
              <div className="add-buoy-card">
                <h3 className="dialog-content-network"> Add a Buoy</h3>
                <div className="mdl-card__supporting-text-account">
                  To add a buoy you must place the network id and a id for the buoy you are adding.</div>
                <form onSubmit={handleSubmitAddCard}>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input
                      className="mdl-textfield__input"
                      type="text"
                      id="networkId"
                      value={networkId}
                      onChange={handleNetworkIdChange}
                      required
                    />
                    <label className="mdl-textfield__label" htmlFor="networkId">Network ID...</label>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input
                      className="mdl-textfield__input"
                      type="text"
                      id="buoyId"
                      value={buoyId}
                      onChange={handleBuoyIdChange}
                      required
                    />
                    <label className="mdl-textfield__label" htmlFor="buoyId">Buoy ID...</label>
                  </div>
                </form>
              </div>
              <div className="dialog-actions">
                <div className="dialog-actions-submit-network-add">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300" onClick={handleSubmitAddCard}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Network;