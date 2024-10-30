import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import EsriHeatmapLayer from "./EsriHeatmapLayer"; // 引入热力图组件
import { IoFastFoodOutline } from "react-icons/io5";
import L from "leaflet";
import "leaflet.heat";
import ReactDOMServer from "react-dom/server"; // 导入 ReactDOMServer
import "./MapStyles.css"; // 引入自定义样式
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from "react-bootstrap"; // 引入 Bootstrap 的手风琴组件

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

// 动态生成图标，根据严重程度设置颜色和大小
const createFoodIcon = (color) =>
  L.divIcon({
    html: ReactDOMServer.renderToString(
      <IoFastFoodOutline style={{ fontSize: "36px", color: color }} />
    ),
    className: "custom-div-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const ResourceAlert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    setAlerts([
      {
        community_name: "Tsilhqot'in Nation",
        lat: 52.1395,
        lon: -125.5963,
        shortages: [
          {
            resource: "Food",
            official_availability: 10,
            community_availability: -27,
            official_last_updated: "2024-10-29 11:00:00",
            community_last_updated: "2024-10-29 09:30:00",
            severity: "Critical",
          },
        ],
        capacity: {
          official: 511,
          community: 454,
          official_last_updated: "2024-10-28 17:00:00",
          community_last_updated: "2024-10-29 09:00:00",
        },
        predicted_demands: 370,
      },
      {
        community_name: "Nuu-chah-nulth Tribal Council",
        lat: 49.6784,
        lon: -125.0000,
        shortages: [
          {
            resource: "Food",
            official_availability: 213,
            community_availability: 180,
            official_last_updated: "2024-10-29 10:00:00",
            community_last_updated: "2024-10-29 09:45:00",
            severity: "Medium",
          },
        ],
        capacity: {
          official: 420,
          community: 385,
          official_last_updated: "2024-10-28 16:30:00",
          community_last_updated: "2024-10-29 08:30:00",
        },
        predicted_demands: 340,
      },
    ]);
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

      {alerts.map((alert, index) => (
        <Marker
          key={index}
          position={[alert.lat, alert.lon]}
          icon={createFoodIcon(getSeverityColor(alert.shortages[0].severity))}
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
                    <b>Official record:</b> {alert.shortages[0].official_availability} units <br />
                    <b>Last Updated:</b> {alert.shortages[0].official_last_updated}
                  </p>
                  <p>
                    <b>Community record:</b> {alert.shortages[0].community_availability} units <br />
                    <b>Last Updated:</b> {alert.shortages[0].community_last_updated}
                  </p>
                  <p><b>Predicted Demands:</b> {alert.predicted_demands} units</p>
                  <p style={{ color: getSeverityColor(alert.shortages[0].severity) }}>
                    <b>Severity:</b> {alert.shortages[0].severity}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Medical Availability</Accordion.Header>
                <Accordion.Body>
                  <b>Doctors</b>
                  <p>
                    <b>Official record:</b> {alert.shortages[0].official_availability} <br />
                    <b>Last Updated:</b> {alert.shortages[0].official_last_updated}
                  </p>
                  <p>
                    <b>Community record:</b> {alert.shortages[0].community_availability} <br />
                    <b>Last Updated:</b> {alert.shortages[0].community_last_updated}
                  </p>
                  <p><b>Predicted Demands:</b> {alert.predicted_demands}</p>
                  <p style={{ color: getSeverityColor(alert.shortages[0].severity) }}>
                    <b>Severity:</b> {alert.shortages[0].severity}
                  </p>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Housing Availability</Accordion.Header>
                <Accordion.Body>
                  <b>1 unit per person</b>
                  <p>
                    <b>Official record:</b> {alert.shortages[0].official_availability} units <br />
                    <b>Last Updated:</b> {alert.shortages[0].official_last_updated}
                  </p>
                  <p>
                    <b>Community record:</b> {alert.shortages[0].community_availability} units <br />
                    <b>Last Updated:</b> {alert.shortages[0].community_last_updated}
                  </p>
                  <p><b>Predicted Demands:</b> {alert.predicted_demands} units</p>
                  <p style={{ color: getSeverityColor(alert.shortages[0].severity) }}>
                    <b>Severity:</b> {alert.shortages[0].severity}
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ResourceAlert;
