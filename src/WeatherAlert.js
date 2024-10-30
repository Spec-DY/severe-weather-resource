// src/WeatherAlert.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import EsriHeatmapLayer from "./EsriHeatmapLayer";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const cities = [
  {
    name: "Abbotsford",
    lat: 49.0504,
    lon: -122.3045,
  },
  {
    name: "Armstrong",
    lat: 50.4487,
    lon: -119.1962,
  },
  {
    name: "Burnaby",
    lat: 49.2664,
    lon: -122.9526,
  },
  {
    name: "Campbell River",
    lat: 50.0321,
    lon: -125.2725,
  },
  {
    name: "Castlegar",
    lat: 49.3257,
    lon: -117.6594,
  },
  {
    name: "Chilliwack",
    lat: 49.1579,
    lon: -121.9514,
  },
  {
    name: "Colwood",
    lat: 48.4236,
    lon: -123.4958,
  },
  {
    name: "Coquitlam",
    lat: 49.2838,
    lon: -122.7932,
  },
  {
    name: "Courtenay",
    lat: 49.6877,
    lon: -124.9994,
  },
  {
    name: "Cranbrook",
    lat: 49.5129,
    lon: -115.7686,
  },
  {
    name: "Dawson Creek",
    lat: 55.7596,
    lon: -120.2377,
  },
  {
    name: "Delta",
    lat: 49.0847,
    lon: -123.0587,
  },
  {
    name: "Duncan",
    lat: 48.7787,
    lon: -123.7079,
  },
  {
    name: "Enderby",
    lat: 50.5508,
    lon: -119.1397,
  },
  {
    name: "Fernie",
    lat: 49.504,
    lon: -115.0634,
  },
  {
    name: "Fort St. John",
    lat: 56.2464,
    lon: -120.8476,
  },
  {
    name: "Grand Forks",
    lat: 49.0333,
    lon: -118.44,
  },
  {
    name: "Greenwood",
    lat: 49.0908,
    lon: -118.678,
  },
  {
    name: "Kamloops",
    lat: 50.6745,
    lon: -120.3273,
  },
  {
    name: "Kelowna",
    lat: 49.888,
    lon: -119.496,
  },
  {
    name: "Kimberley",
    lat: 49.6697,
    lon: -115.9775,
  },
  {
    name: "Langford",
    lat: 48.4474,
    lon: -123.5046,
  },
  {
    name: "Langley",
    lat: 49.1044,
    lon: -122.6594,
  },
  {
    name: "Maple Ridge",
    lat: 49.2193,
    lon: -122.5984,
  },
  {
    name: "Merritt",
    lat: 50.1113,
    lon: -120.7862,
  },
  {
    name: "Mission",
    lat: 49.1337,
    lon: -122.3093,
  },
  {
    name: "Nanaimo",
    lat: 49.1659,
    lon: -123.9401,
  },
  {
    name: "Nelson",
    lat: 49.4928,
    lon: -117.2948,
  },
  {
    name: "New Westminster",
    lat: 49.2057,
    lon: -122.911,
  },
  {
    name: "North Vancouver",
    lat: 49.32,
    lon: -123.0724,
  },
  {
    name: "Parksville",
    lat: 49.3192,
    lon: -124.3157,
  },
  {
    name: "Penticton",
    lat: 49.4991,
    lon: -119.5937,
  },
  {
    name: "Pitt Meadows",
    lat: 49.231,
    lon: -122.6894,
  },
  {
    name: "Port Alberni",
    lat: 49.2339,
    lon: -124.8055,
  },
  {
    name: "Port Coquitlam",
    lat: 49.2626,
    lon: -122.781,
  },
  {
    name: "Port Moody",
    lat: 49.2849,
    lon: -122.8268,
  },
  {
    name: "Prince George",
    lat: 53.9171,
    lon: -122.7497,
  },
  {
    name: "Prince Rupert",
    lat: 54.315,
    lon: -130.3208,
  },
  {
    name: "Quesnel",
    lat: 52.9784,
    lon: -122.4927,
  },
  {
    name: "Revelstoke",
    lat: 50.9981,
    lon: -118.1957,
  },
  {
    name: "Richmond",
    lat: 49.1666,
    lon: -123.1336,
  },
  {
    name: "Rossland",
    lat: 49.0781,
    lon: -117.8021,
  },
  {
    name: "Salmon Arm",
    lat: 50.7001,
    lon: -119.2838,
  },
  {
    name: "Surrey",
    lat: 49.1044,
    lon: -122.8011,
  },
  {
    name: "Terrace",
    lat: 54.5182,
    lon: -128.6032,
  },
  {
    name: "Trail",
    lat: 49.0966,
    lon: -117.7117,
  },
  {
    name: "Vancouver",
    lat: 49.2827,
    lon: -123.1207,
  },
  {
    name: "Vernon",
    lat: 50.2615,
    lon: -119.272,
  },
  {
    name: "Victoria",
    lat: 48.4284,
    lon: -123.3656,
  },
  {
    name: "West Kelowna",
    lat: 49.8625,
    lon: -119.5833,
  },
  {
    name: "White Rock",
    lat: 49.0253,
    lon: -122.8029,
  },
  {
    name: "Williams Lake",
    lat: 52.1417,
    lon: -122.1417,
  },
];

const WeatherAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const API_KEY = "";

  useEffect(() => {
    const fetchWeatherData = async () => {
      const cachedData = localStorage.getItem("weatherAlerts");
      if (cachedData) {
        setAlerts(JSON.parse(cachedData));
      } else {
        const requests = cities.map((city) =>
          axios.get(`https://api.weatherbit.io/v2.0/alerts`, {
            params: {
              city: city.name,
              country: "CA",
              key: API_KEY,
            },
          })
        );

        try {
          const responses = await Promise.all(requests);
          const alertData = responses
            .map((response, index) => {
              const data = response.data;
              if (data.alerts && data.alerts.length > 0) {
                return {
                  city: cities[index].name,
                  lat: cities[index].lat,
                  lon: cities[index].lon,
                  alerts: data.alerts,
                };
              }
              return null;
            })
            .filter((alert) => alert !== null);

          setAlerts(alertData);
          localStorage.setItem("weatherAlerts", JSON.stringify(alertData));
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <MapContainer
      center={[49.0847, -123.3]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <EsriHeatmapLayer />

      {alerts.map((alert, index) => (
        <Marker key={index} position={[alert.lat, alert.lon]}>
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
