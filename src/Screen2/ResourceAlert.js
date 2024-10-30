import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import EsriHeatmapLayer from "./EsriHeatmapLayer";
import { GiBarracksTent } from "react-icons/gi";
import L from "leaflet";
import "leaflet.heat";
import ReactDOMServer from "react-dom/server";
import "./MapStyles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from "react-bootstrap";
import data from "./alertsData.json";
import ResourceSeverityLegend from "./ResourceSeverityLegend";

// 根据严重程度返回颜色
const getSeverityColor = (severity) => {
  switch (severity) {
    case "Critical":
      return "red";
    case "High":
      return "orange";
    case "Medium":
      return "#01579B";
    case "Low":
      return "green";
    default:
      return "black";
  }
};

// 根据 predicted_demands 和 official_availability 自动确定 severity
const calculateSeverity = (predicted, official) => {
  const percentageDifference = ((predicted - official) / official) * 100;
  
  if (percentageDifference >= 50) return "Critical";
  if (percentageDifference >= 20) return "High";
  if (percentageDifference >= 10) return "Medium";
  return "Low";
};

// 计算最严重的 `severity` 级别
const calculateOverallSeverity = (alert) => {
  const severities = [
    calculateSeverity(alert.food_availability.predicted_demands, alert.food_availability.official_availability),
    calculateSeverity(alert.medical_availability.predicted_demands, alert.medical_availability.official_availability),
    calculateSeverity(alert.housing_availability.predicted_demands, alert.housing_availability.official_availability),
  ];

  if (severities.includes("Critical")) return "Critical";
  if (severities.includes("High")) return "High";
  if (severities.includes("Medium")) return "Medium";
  return "Low";
};

// 动态生成图标，根据严重程度设置颜色和大小
const createFoodIcon = (color) =>
  L.divIcon({
    html: ReactDOMServer.renderToString(
      <GiBarracksTent style={{ fontSize: "36px", color: color }} />
    ),
    className: "custom-div-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const ResourceAlert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // 将 JSON 数据设置为组件的状态
    setAlerts(data);
  }, []);

  return (
    <MapContainer
      center={[51.0, -124.0]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <EsriHeatmapLayer />

      {alerts.map((alert, index) => {
        const overallSeverity = calculateOverallSeverity(alert);
        return (
          <Marker
            key={index}
            position={[alert.lat, alert.lon]}
            icon={createFoodIcon(getSeverityColor(overallSeverity))}
          >
            <Popup className="custom-popup">
              <div className="center-text">
                <h2>{alert.community_name}</h2>
                <h4>Resources Wiki</h4>
              </div>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Food Availability</Accordion.Header>
                  <Accordion.Body>
                    <b>One unit per person</b>
                    <p>
                      <b>Official record:</b> {alert.food_availability.official_availability} units <br />
                      <b>Last Updated:</b> {alert.food_availability.official_last_updated}
                    </p>
                    <p>
                      <b>Community record:</b> {alert.food_availability.community_availability} units <br />
                      <b>Last Updated:</b> {alert.food_availability.community_last_updated}
                    </p>
                    <p><b>Predicted Demands:</b> {alert.food_availability.predicted_demands} units</p>
                    <p style={{ color: getSeverityColor(calculateSeverity(alert.food_availability.predicted_demands, alert.food_availability.official_availability)) }}>
                      <b>Severity:</b> {calculateSeverity(alert.food_availability.predicted_demands, alert.food_availability.official_availability)}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Medical Availability</Accordion.Header>
                  <Accordion.Body>
                    <b>Doctors available</b>
                    <p>
                      <b>Official record:</b> {alert.medical_availability.official_availability} doctors <br />
                      <b>Last Updated:</b> {alert.medical_availability.official_last_updated}
                    </p>
                    <p>
                      <b>Community record:</b> {alert.medical_availability.community_availability} doctors <br />
                      <b>Last Updated:</b> {alert.medical_availability.community_last_updated}
                    </p>
                    <p><b>Predicted Demands:</b> {alert.medical_availability.predicted_demands} doctors</p>
                    <p style={{ color: getSeverityColor(calculateSeverity(alert.medical_availability.predicted_demands, alert.medical_availability.official_availability)) }}>
                      <b>Severity:</b> {calculateSeverity(alert.medical_availability.predicted_demands, alert.medical_availability.official_availability)}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Housing Availability</Accordion.Header>
                  <Accordion.Body>
                    <b>Housing units per person</b>
                    <p>
                      <b>Official record:</b> {alert.housing_availability.official_availability} units <br />
                      <b>Last Updated:</b> {alert.housing_availability.official_last_updated}
                    </p>
                    <p>
                      <b>Community record:</b> {alert.housing_availability.community_availability} units <br />
                      <b>Last Updated:</b> {alert.housing_availability.community_last_updated}
                    </p>
                    <p><b>Predicted Demands:</b> {alert.housing_availability.predicted_demands} units</p>
                    <p style={{ color: getSeverityColor(calculateSeverity(alert.housing_availability.predicted_demands, alert.housing_availability.official_availability)) }}>
                      <b>Severity:</b> {calculateSeverity(alert.housing_availability.predicted_demands, alert.housing_availability.official_availability)}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Popup>
          </Marker>
        );
      })}
      <ResourceSeverityLegend />
    </MapContainer>
    
  );
};

export default ResourceAlert;
