// App.js or index.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes
import Dashboard from './dashboard';
import Network from './network';
import Account from './account';
import Login from './Login';
import ForgotPassword from './forgotpassword';
import ChangePassword from './changepassword';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="forgot_password" element={<ForgotPassword/>}/>
        <Route path="change_password" element={<ChangePassword/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/network" element={<Network />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
};

export default App;
