import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import 'material-design-lite/material';
import 'material-design-lite/material.css';
import './styles.css';

const Network = () => {
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [networkId, setNetworkId] = useState('');
  const [buoyId, setBuoyId] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [newBuoyCoordinates, setNewBuoyCoordinates] = useState(null);
  const [appKey, setAppKey] = useState('');
  const [devEuiError, setDevEuiError] = useState('');
  const [appKeyError, setAppKeyError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showRemoveNotification, setShowRemoveNotification] = useState(false);




  const [selectedBuoys, setSelectedBuoys] = useState(() => {
    try {
      const storedBuoys = JSON.parse(localStorage.getItem('selectedBuoys'));
      if (Array.isArray(storedBuoys)) {
        return storedBuoys;
      }
      return [];
    } catch (error) {
      console.error('Error parsing selectedBuoys from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.history.pushState(null, '', '/');
      window.location.href = '/';
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timeout = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showNotification]);

  useEffect(() => {
    if (showRemoveNotification) {
      const timeout = setTimeout(() => {
        setShowRemoveNotification(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showRemoveNotification]);

  useEffect(() => {
    const handleTouchStart = (event) => {
      event.target.classList.add('touched');
    };
  
    const handleTouchEnd = (event) => {
      event.target.classList.remove('touched');
      event.target.click();
    };
  
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('touchstart', handleTouchStart);
      button.addEventListener('touchend', handleTouchEnd);
    });
  
    return () => {
      document.querySelectorAll('button').forEach((button) => {
        button.removeEventListener('touchstart', handleTouchStart);
        button.removeEventListener('touchend', handleTouchEnd);
      });
    };
  }, []);

  useEffect(() => {
    fetchBuoys();
  }, []);
  
  const handleRemoveBuoyClick = () => {
    setIsRemoveDialogOpen(true);
  };

  const handleCloseRemoveDialog = () => {
    setIsRemoveDialogOpen(false);
  };

  const handleSubmitRemoveDialog = async () => {
    const selectedBuoysToDelete = selectedBuoys.filter(buoy => buoy.isSelected);
    const requestBuoyData = {
      name: buoyId,
      eui: networkId,
    };
  
    try {
      for (const buoy of selectedBuoysToDelete) {
        const encodedBuoyId = encodeURIComponent(buoy.id);
        const response = await fetch(`https://boyaslacatalana-api.azurewebsites.net/delete-buoy/${encodedBuoyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBuoyData),
        });
  
        const responseBuoyData = await response.json();
  
        if (!response.ok) {
          console.error(`Error deleting buoy with ID ${buoy.id}`);
          return;
        }
      }
  
      setSelectedBuoys(selectedBuoys.filter(buoy => !buoy.isSelected));
  
      handleCloseRemoveDialog();
      setShowRemoveNotification(true); // Show the remove buoy notification
    } catch (error) {
      console.error('Error deleting buoys:', error);
    }
  };

  const handleAddBuoyClick = () => {
    setIsAddCardOpen(true);
  };

  const handleCloseAddCard = () => {
    setIsAddCardOpen(false);
    setNetworkId('');
    setBuoyId('');
    setAppKey('');
    setDevEuiError('');
    setAppKeyError('');
  };

  const handleSubmitAddCard = async (event) => {
    event.preventDefault();
  
    const devEUIPattern = /^[0-9A-Fa-f]{16}$/;
    if (!devEUIPattern.test(networkId)) {
      setDevEuiError('Dev EUI must be 16 hexadecimal characters');
      return;
    } else {
      setDevEuiError('');
    }

    const appKeyPattern = /^[0-9A-Fa-f]{32}$/;
    if (!appKeyPattern.test(appKey)) {
      setAppKeyError('App Key must be 32 hexadecimal characters');
      return;
    } else {
      setAppKeyError('');
    }
  
    const buoyData = {
      name: buoyId,
      eui: networkId,
      appKey: appKey
    };

    try {
      let response = await fetch('https://boyaslacatalana-api.azurewebsites.net/add-buoy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buoyData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSelectedBuoys([...selectedBuoys, { id: buoyId, coordinates, isSelected: false }]);
        setShowNotification(true);
        handleCloseAddCard();
      } else {
        if (response.status === 400 && data.error === 'Buoy with this eui already exists.') {
          setDevEuiError('Buoy with this EUI already exists');
        } else {
          console.error('Error creating buoy:', data.error);
        }
      }
    } catch (error) {
      console.error('Error creating buoy:', error);
    }
  }
  
  const handleNetworkIdChange = (event) => {
    setNetworkId(event.target.value);
    setDevEuiError('');
  };

  const handleBuoyIdChange = (event) => {
    setBuoyId(event.target.value);
  };

  const handleCoordinatesChange = (event) => {
    setCoordinates(event.target.value);
  };

  const handleAppKeyChange = (event) => {
    setAppKey(event.target.value);
    setAppKeyError('');
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

  const fetchBuoys = async () => {
    try {
      const response = await fetch('https://boyaslacatalana-api.azurewebsites.net/get-buoys');
      const data = await response.json();
  
      if (response.ok) {
        const mappedBuoys = data.map(buoyArray => ({
          id: buoyArray[0], 
          eui: buoyArray[4], 
          coordinates: buoyArray[1], 
          isSelected: false,
        }));
  
        setSelectedBuoys(mappedBuoys);
      } else {
        console.error('Error fetching buoys:', data.error);
      }
    } catch (error) {
      console.error('Error fetching buoys:', error);
    }
  };

  const handleSelectAll = () => {
    const allSelected = selectedBuoys.every(buoy => buoy.isSelected);
    const updatedBuoys = selectedBuoys.map(buoy => ({ ...buoy, isSelected: !allSelected }));
    setSelectedBuoys(updatedBuoys);
  
    // Simulate click event on each row's checkbox
    document.querySelectorAll('.custom-checkbox').forEach((checkbox) => {
      checkbox.checked = !allSelected;
      checkbox.dispatchEvent(new Event('change'));
    });
  };

  return (
    <Layout>
      <div className="dashboard-content center-network-container">
        <h3 className="table-title-network">Buoy Information</h3>
        {showNotification && (
          <div className="notification-container">
            <div className="notification-card">
              <div className="notification-text">You have successfully added a buoy to the network!</div>
            </div>
          </div>
        )}
        {showRemoveNotification && (
          <div className="notification-container">
            <div className="notification-card">
              <div className="notification-text">You have successfully removed a buoy from the network!</div>
            </div>
          </div>
        )}
        <button className="mdl-button-network mdl-button--colored mdl-js-button mdl-js-ripple-effect add-buoy" onClick={handleAddBuoyClick} type="submit">
          <i className="material-icons">add</i>
          <span>Add a Buoy</span>
        </button>
        <div className="refresh-container">
          <button className="mdl-js-button refresh-buoys" onClick={fetchBuoys}>
            <i className="material-icons">refresh</i>
          </button>
        </div>
        <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp custom-width-network">
          <thead>
            <tr>
              <th>
                <input type="checkbox" onChange={handleSelectAll} />
              </th>
              <th className="mdl-data-table__cell--non-numeric">ID</th>
              <th>EUI</th>
              <th>Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {selectedBuoys.map(buoy => buoy && (
              <tr key={buoy.id}>
                <td className="checkbox-cell">
                  <input type="checkbox" className="custom-checkbox" onChange={() => handleRowClick(buoy)} checked={buoy.isSelected} />
                </td>
                <td className="mdl-data-table__cell--non-numeric">{buoy.id}</td>
                <td>{buoy.eui}</td>
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
            <div className="custom-dialog remove-buoy-dialog" >
              <h3 style={{ margin: '10px 0' }}>Delete Buoy(s)?</h3>
              <div className="mdl-card__supporting-text-account" >
                You are about to delete buoy(s) from the network. This action cannot be undone.
              </div>
              <div className="dialog-content" style={{ maxHeight: '150px', overflowY: 'auto', padding: '0 10px' }}>
                <ul>
                  {selectedBuoys.map(buoy => buoy.isSelected && (
                    <li key={buoy.id}>
                      ID: {buoy.id}, EUI: {buoy.eui}, Coordinates: {buoy.coordinates}
                    </li>
                  ))}
                  {selectedBuoys.every(buoy => !buoy.isSelected) && (
                    <li>No buoys selected</li>
                  )}
                </ul>
              </div>
              <div className="dialog-actions" style={{ padding: '10px', textAlign: 'right' }}>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent dialog-close-button" onClick={handleCloseRemoveDialog}>
                  X
                </button>
                <div className="dialog-actions-submit-network" style={{ display: 'inline-block' }}>
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
                  To add a buoy you must place a name for the buoy, the Dev EUI and the App Key.
                </div>
                <form onSubmit={handleSubmitAddCard}>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input
                      className="mdl-textfield__input"
                      type="text"
                      id="buoyId"
                      value={buoyId}
                      onChange={handleBuoyIdChange}
                      maxLength={20}
                      required
                    />
                    <label className="mdl-textfield__label" htmlFor="buoyId">Buoy Name:</label>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input
                      className="mdl-textfield__input"
                      type="text"
                      id="networkId"
                      value={networkId}
                      onChange={handleNetworkIdChange}
                      maxLength={16}
                      required
                    />
                    <label className="mdl-textfield__label" htmlFor="networkId">Dev EUI:</label>
                    {devEuiError && <span className="error-message">{devEuiError}</span>}
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label custom-input-width">
                    <input
                      className="mdl-textfield__input"
                      type="text"
                      id="appkey"
                      value={appKey}
                      onChange={handleAppKeyChange}
                      maxLength={32}
                      required
                    />
                    <label className="mdl-textfield__label" htmlFor="appkey">App Key:</label>
                    {appKeyError && <span className="error-message">{appKeyError}</span>}
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
