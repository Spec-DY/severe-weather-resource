import React from "react";

const ResourceSeverityLegend = () => (
  <div
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
      opacity: 0.85,
      zIndex: 1000,
    }}
  >
    <h4>Resource Severity</h4>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ width: "20px", height: "20px", backgroundColor: "red" }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Critical</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ width: "20px", height: "20px", backgroundColor: "orange" }}
      ></div>
      <span style={{ marginLeft: "5px" }}> High</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ width: "20px", height: "20px", backgroundColor: "#01579B" }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Medium</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ width: "20px", height: "20px", backgroundColor: "green" }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Low</span>
    </div>
  </div>
);

export default ResourceSeverityLegend;
