import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';

const Network = () => {
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedBuoys, setSelectedBuoys] = useState(JSON.parse(localStorage.getItem('selectedBuoys')) || []); 
  const [networkId, setNetworkId] = useState('');
  const [buoyId, setBuoyId] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [newBuoyCoordinates, setNewBuoyCoordinates] = useState(null);


  useEffect(() => {
    const handleTouchStart = (event) => {
      event.target.classList.add('touched'); // Add a class to indicate touch
    };

    const handleTouchEnd = (event) => {
      event.target.classList.remove('touched'); // Remove the touch class
      event.target.click(); // Trigger the button click
    };

    // Add touch event listeners to all buttons
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('touchstart', handleTouchStart);
      button.addEventListener('touchend', handleTouchEnd);
    });

    // Cleanup: Remove event listeners when the component unmounts
    return () => {
      document.querySelectorAll('button').forEach((button) => {
        button.removeEventListener('touchstart', handleTouchStart);
        button.removeEventListener('touchend', handleTouchEnd);
      });
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts


  

  useEffect(() => {
    localStorage.setItem('selectedBuoys', JSON.stringify(selectedBuoys));
  }, [selectedBuoys]);

  const handleRemoveBuoyClick = () => {
    setIsRemoveDialogOpen(true);
  };

  const handleCloseRemoveDialog = () => {
    setIsRemoveDialogOpen(false);
  };

  const handleSubmitRemoveDialog = () => {
    const selectedBuoysToDelete = selectedBuoys.filter(buoy => buoy.isSelected);
    setSelectedBuoys(selectedBuoys.filter(buoy => !buoy.isSelected)); // Keep only unselected buoys
    handleCloseRemoveDialog();
  };

  const handleAddBuoyClick = () => {
    setIsAddCardOpen(true);
  };

  const handleCloseAddCard = () => {
    setIsAddCardOpen(false);
  };

  const handleSubmitAddCard = (event) => {
    event.preventDefault();
  console.log('Submitting form...');
  
    const lat = parseFloat(coordinates.split(',')[0].trim());
    const lng = parseFloat(coordinates.split(',')[1].trim());

  console.log('Parsed Lat:', lat);
  console.log('Parsed Lng:', lng);
    const batteryPercentage = `${Math.floor(Math.random() * 100)}%`;
  
    setSelectedBuoys([...selectedBuoys, { id: buoyId, battery: batteryPercentage, coordinates, isSelected: false }]);
    setNewBuoyCoordinates({ lat, lng });
  
    console.log('New Buoy Coordinates:', newBuoyCoordinates);
  
    handleCloseAddCard();
  };
  const handleNetworkIdChange = (event) => {
    setNetworkId(event.target.value);
  };

  const handleBuoyIdChange = (event) => {
    setBuoyId(event.target.value);
  };

  const handleCoordinatesChange = (event) => {
    setCoordinates(event.target.value);
  };

  const handleRowClick = (buoy) => {
    const isAlreadySelected = selectedBuoys.some(selectedBuoy => selectedBuoy.id === buoy.id);
  
    if (isAlreadySelected) {
      const updatedBuoys = selectedBuoys.map(selectedBuoy =>
        selectedBuoy.id === buoy.id ? { ...selectedBuoy, isSelected: !selectedBuoy.isSelected } : selectedBuoy
      );
      setSelectedBuoys(updatedBuoys);
    } else {
      setSelectedBuoys([...selectedBuoys, { ...buoy, isSelected: true }]);
    }
  };

  

  return (
    <Layout>
      <div className="dashboard-content center-network-container">
        <h3 className="table-title-network">Buoy Information</h3>
        <button className="mdl-button-network mdl-button--colored mdl-js-button mdl-js-ripple-effect add-buoy" onClick={handleAddBuoyClick} type="submit">
          <i className="material-icons">add</i>
          <span>Add a Buoy</span>
        </button>
        <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp custom-width-network">
          <thead>
            <tr>
              <th></th>
              <th className="mdl-data-table__cell--non-numeric">ID</th>
              <th>Battery %</th>
              <th>Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {selectedBuoys.map(buoy => (
              <tr key={buoy.id}>
                <td>
                  <input type="checkbox" onChange={() => handleRowClick(buoy)} />
                </td>
                <td className="mdl-data-table__cell--non-numeric">{buoy.id}</td>
                <td>{buoy.battery}</td>
                <td>{buoy.coordinates}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mdl-button-network mdl-button--colored mdl-js-button mdl-js-ripple-effect remove-buoy" onClick={handleRemoveBuoyClick} type="submit">
          <i className="material-icons">remove</i>
          <span>Remove a Buoy</span>
        </button>
        {isRemoveDialogOpen && (
          <>
            <div className="backdrop" onClick={handleCloseRemoveDialog}></div>
            <div className="custom-dialog remove-buoy-dialog" style={{ width: '50%' }}>
              <div className="dialog-content">
                <h3>Delete Buoy(s)?</h3>
                <div className="mdl-card__supporting-text-account">
                  You are about to delete buoy(s) from the network. This action cannot be undone.
                </div>
                <ul>
                  {selectedBuoys.map(buoy => buoy.isSelected && (
                    <li key={buoy.id}>
                      ID: {buoy.id}, Battery %: {buoy.battery}, Coordinates: {buoy.coordinates}
                    </li>
                  ))}
                  {selectedBuoys.every(buoy => !buoy.isSelected) && (
                    <li>No buoys selected</li>
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
                  To add a buoy you must place the network id, an id for the buoy, and its coordinates.
                </div>
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
                    <label className="mdl-textfield__label" htmlFor="networkId">Dev ID:</label>
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
                    <label className="mdl-textfield__label" htmlFor="buoyId">Buoy Name:</label>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input
                      className="mdl-textfield__input"
                      type="text"
                      id="coordinates"
                      value={coordinates}
                      onChange={handleCoordinatesChange}
                      required
                    />
                    <label className="mdl-textfield__label" htmlFor="coordinates">Coordinates:</label>
                  </div>
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--light-blue-300 add-submit" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </Layout>
  );
};

export default Network;
