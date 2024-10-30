// src/Sidebar.js
import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { TiWeatherCloudy } from "react-icons/ti";
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaTent } from "react-icons/fa6";
import { FaArrowLeft } from 'react-icons/fa';


const CustomSidebar = () => {
  const navigate = useNavigate();

  return (
    <Sidebar breakPoint="lg" backgroundColor="white" className="custom-sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <Menu iconShape="circle">
        <MenuItem icon={<TiWeatherCloudy />} component={<Link to="/WeatherAlert" />}>
          Predictions
        </MenuItem>
        <MenuItem icon={<FaTent />} component={<Link to="/ResourceAlert" />}>
          Resources
        </MenuItem>
        <MenuItem icon={<FaArrowLeft />} onClick={() => navigate(-1)}>
          Back
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default CustomSidebar;
