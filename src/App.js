import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import Network from './network';
import Account from './account';
import Login from './Login';
import ForgotPassword from './forgotpassword';
import ChangePassword from './changepassword';

const App = () => {
  const [selectedBuoys, setSelectedBuoys] = useState([]);
  const [newBuoyCoordinates, setNewBuoyCoordinates] = useState(null);

  // You should implement a proper authentication check here
  const isAuthenticated = localStorage.getItem('token') !== null;

  // Function to render the component or redirect to login
  const renderComponentOrLogin = (Component, props) => {
    return isAuthenticated ? <Component {...props} /> : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="forgot_password" element={<ForgotPassword />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route
          path="/dashboard"
          element={renderComponentOrLogin(Dashboard, { buoys: selectedBuoys, newBuoyCoordinates })}
        />
        <Route
          path="/network"
          element={renderComponentOrLogin(Network, { selectedBuoys, setSelectedBuoys, setNewBuoyCoordinates })}
        />
        <Route
          path="/account"
          element={renderComponentOrLogin(Account, {})}
        />
      </Routes>
    </Router>
  );
};

export default App;
