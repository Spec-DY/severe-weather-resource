// src/WeatherAlert.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import EsriHeatmapLayer from "./EsriHeatmapLayer";
import "leaflet.heat";
import "leaflet.awesome-markers";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import NationHeatmapLayer from "./NationHeatmapLayer";

// 清除默认的 Leaflet 图标设置
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const getMarkerIcon = (severity) => {
  if (severity === "Warning") {
    return L.AwesomeMarkers.icon({
      icon: "exclamation-triangle",
      markerColor: "orange",
      prefix: "fa",
    });
  } else if (severity === "Watch") {
    return L.AwesomeMarkers.icon({
      icon: "eye",
      markerColor: "blue",
      prefix: "fa",
    });
  } else {
    return L.AwesomeMarkers.icon({
      icon: "info-circle",
      markerColor: "green",
      prefix: "fa",
    });
  }
};

const TweedsmuirImpactLayer = () => {
  const map = useMap();

  useEffect(() => {
    const tweedsmuirLocation = [53.175, -126.5];
    const radiusInMeters = 70000;

    // 创建圆形覆盖层
    const circle = L.circle(tweedsmuirLocation, {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.3,
      radius: radiusInMeters,
    }).addTo(map);

    // 清理圆形覆盖层
    return () => {
      map.removeLayer(circle);
    };
  }, [map]);

  return null;
};

const WeatherAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const API_KEY = "";

  // faux data
  useEffect(() => {
    setAlerts([
      {
        city_name: "Victoria",
        country_code: "CA",
        lat: 48.43294,
        lon: -123.3693,
        state_code: "BC",
        timezone: "America/Vancouver",
        alerts: [
          {
            title: "wind warning in effect",
            description: "Strong winds that may cause damage are expected...",
            severity: "Watch",
            effective_local: "2024-10-29T16:26:47",
            expires_local: "2024-10-30T08:26:47",
            regions: ["Greater Victoria"],
            uri: "https://weather.gc.ca/",
          },
        ],
      },
      {
        city_name: "Kelowna",
        country_code: "CA",
        lat: 49.888,
        lon: -119.496,
        state_code: "BC",
        timezone: "America/Vancouver",
        alerts: [
          {
            title: "snowfall warning in effect",
            description: "Heavy snowfall expected...",
            severity: "Warning",
            effective_local: "2024-10-30T18:00:00",
            expires_local: "2024-10-31T15:00:00",
            regions: ["Kelowna"],
            uri: "https://weather.gc.ca/",
          },
        ],
      },
      {
        city_name: "Capilano - Lower Seymour",
        country_code: "CA",
        lat: 49.3839,
        lon: -123.0867,
        state_code: "BC",
        timezone: "America/Vancouver",
        alerts: [
          {
            title: "wildfire warning in effect",
            description: "Wildfire risk is high due to dry conditions...",
            severity: "Warning",
            effective_local: "2024-10-29T10:00:00",
            expires_local: "Until further notice",
            regions: ["Forested areas near Lower Seymour"],
            uri: "https://weather.gc.ca/",
          },
        ],
      },
      {
        city_name: "Tweedsmuir Provincial Park",
        country_code: "CA",
        lat: 53.175,
        lon: -126.5,
        state_code: "BC",
        timezone: "America/Vancouver",
        alerts: [
          {
            title: "wildfire warning in effect",
            description:
              "High wildfire risk due to dry and windy conditions...",
            severity: "Warning",
            effective_local: "2024-10-29T10:00:00",
            expires_local: "Until further notice",
            regions: ["Tweedsmuir Provincial Park"],
            uri: "https://weather.gc.ca/",
          },
        ],
      },
    ]);
  }, []);

  return (
    <MapContainer
      center={[53.175, -123.0]} // 将地图中心放在 Tweedsmuir 以展示
      zoom={6} // 适当的缩放级别
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <EsriHeatmapLayer />
      <NationHeatmapLayer />
      <TweedsmuirImpactLayer /> {/* 添加 Tweedsmuir 的影响范围层 */}
      {alerts.map((alert, index) => (
        <Marker
          key={index}
          position={[alert.lat, alert.lon]}
          icon={getMarkerIcon(alert.alerts[0]?.severity)}
        >
          <Popup>
            <h3>
              {alert.city} - {alert.alerts[0].title}
            </h3>
            <p>{alert.alerts[0].description}</p>
            <p>
              <b>Severity:</b> {alert.alerts[0].severity}
            </p>
            <p>
              <b>Effective:</b> {alert.alerts[0].effective_local}
            </p>
            <p>
              <b>Expires:</b> {alert.alerts[0].expires_local}
            </p>
            <a
              href={alert.alerts[0].uri}
              target="_blank"
              rel="noopener noreferrer"
            >
              More Info
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WeatherAlert;
