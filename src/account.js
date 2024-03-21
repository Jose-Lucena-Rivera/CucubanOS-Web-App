// dashboard.js
import React from 'react';
import Layout from './Layout';
import 'material-design-lite/material'; 
import 'material-design-lite/material.css';

const network = () => {
  return (
    <Layout>
      <div className="dashboard-content">
        {/* Your dashboard content here */}
        <h1>Welcome to your Account!</h1>
        <p>This is your Account content.</p>
      </div>
    </Layout>
  );
};

export default network;
