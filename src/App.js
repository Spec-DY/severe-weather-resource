// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WeatherAlert from './Screen1/WeatherAlert';
import ResourceAlert from './Screen2/ResourceAlert';
import './App.css';
import CustomSidebar from './CustomSidebar';

const App = () => {
  return (
    <Router>
      <div className="app">
        <CustomSidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/WeatherAlert" />} />
            <Route path="/WeatherAlert" element={<WeatherAlert />} />
            <Route path="/ResourceAlert" element={<ResourceAlert />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
