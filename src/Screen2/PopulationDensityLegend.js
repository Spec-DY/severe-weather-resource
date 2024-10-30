// src/PopulationDensityLegend.js
import React from "react";

const PopulationDensityLegend = () => (
  <div
    style={{
      position: "absolute",
      bottom: "10px",
      left: "10px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
      zIndex: 1000,
      opacity: 0.85,
    }}
  >
    <h4>Indigenous Population Density</h4>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "blue",
          opacity: 0.3,
        }}
      ></div>
      <span style={{ marginLeft: "5px" }}>Low</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "blue",
          opacity: 0.5,
        }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Medium-Low</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "yellow",
          opacity: 0.7,
        }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Medium</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "orange",
          opacity: 0.9,
        }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Medium-High</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "red",
          opacity: 1,
        }}
      ></div>
      <span style={{ marginLeft: "5px" }}> High</span>
    </div>
  </div>
);

export default PopulationDensityLegend;
