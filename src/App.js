import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import Network from './network';
import Account from './account';
import Login from './Login';
import ForgotPassword from './forgotpassword';
import ChangePassword from './changepassword';


const App = () => {
  const [selectedBuoys, setSelectedBuoys] = useState([]);
  const [newBuoyCoordinates, setNewBuoyCoordinates] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="forgot_password" element={<ForgotPassword />} />
        <Route path="change_password" element={<ChangePassword />} />
        <Route 
          path="/dashboard" 
          element={<Dashboard buoys={selectedBuoys} newBuoyCoordinates={newBuoyCoordinates} />} 
        />
        <Route 
          path="/network" 
          element={<Network selectedBuoys={selectedBuoys} setSelectedBuoys={setSelectedBuoys} setNewBuoyCoordinates={setNewBuoyCoordinates} />} 
        />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
};

export default App;
