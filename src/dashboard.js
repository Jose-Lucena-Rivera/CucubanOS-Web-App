// dashboard.js
import React from 'react';
import Layout from './Layout';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';

const Dashboard = () => {
  return (
    <Layout>
      <div className="dashboard-content">
        {/* Your dashboard content here */}
        <h1>Welcome to the Dashboard!</h1>
        <p>This is your dashboard content.</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
