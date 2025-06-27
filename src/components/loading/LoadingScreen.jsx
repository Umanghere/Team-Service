import React from 'react';
import './LoadingScreen.css'; // Import styles

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingScreen;