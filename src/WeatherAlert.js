// src/WeatherAlert.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import EsriHeatmapLayer from "./EsriHeatmapLayer";
import "leaflet.heat";
import "leaflet.awesome-markers";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

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
      icon: "exclamation-triangle", // 使用 FontAwesome 的图标
      markerColor: "orange", // Warning 使用橙色图标
      prefix: "fa",
    });
  } else if (severity === "Watch") {
    return L.AwesomeMarkers.icon({
      icon: "eye", // 使用 eye 图标来表示 Watch
      markerColor: "blue", // Watch 使用蓝色图标
      prefix: "fa",
    });
  } else {
    return L.AwesomeMarkers.icon({
      icon: "info-circle", // 默认图标
      markerColor: "green",
      prefix: "fa",
    });
  }
};

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

const WeatherAlertLegend = () => (
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
    <h4>Severe Weather Alerts</h4>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ width: "20px", height: "20px", backgroundColor: "orange" }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Warning</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ width: "20px", height: "20px", backgroundColor: "blue" }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Watch</span>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{ width: "20px", height: "20px", backgroundColor: "green" }}
      ></div>
      <span style={{ marginLeft: "5px" }}> Info</span>
    </div>
  </div>
);

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

const WeatherAlertHeatmapLayer = ({ alerts }) => {
  const map = useMap();

  useEffect(() => {
    if (!alerts || alerts.length === 0) return;

    const alertPoints = alerts.map((alert) => [
      alert.lat,
      alert.lon,
      alert.alerts[0]?.severity === "Warning" ? 0.8 : 0.4,
    ]);

    const heatLayer = L.heatLayer(alertPoints, {
      radius: 40, // 增大半径
      blur: 20, // 控制模糊度
      maxZoom: 10,
      gradient: {
        0.0: "green",
        0.5: "yellow",
        1.0: "red",
      }, // 自定义颜色渐变
    }).addTo(map);

    return () => {
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [alerts, map]);

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
            description:
              "\nStrong winds that may cause damage are expected or occurring.\n\nWhere: East Vancouver Island - Nanoose Bay to Campbell River, Greater Victoria.\n\nWhen: Wednesday morning to afternoon.\n\nExpected peak winds: Southeast 70 km/h gusting to 90 over exposed coastal areas, and near Haro Strait.\n\nRemarks: A Pacific frontal system approaching Vancouver Island will produce strong southeasterly winds. The strong winds will develop Wednesday morning then ease in the afternoon when the front weakens.\n\n###\n\nLoose objects may be tossed by the wind and cause injury or damage. High winds may result in power outages and fallen tree branches.\n\nPlease continue to monitor alerts and forecasts issued by Environment Canada. To report severe weather, send an email to BCstorm@ec.gc.ca or tweet reports using #BCStorm.\n",
            severity: "Watch",
            effective_local: "2024-10-29T16:26:47",
            expires_local: "2024-10-30T08:26:47",
            regions: ["Greater Victoria"],
            uri: "https://weather.gc.ca/",
          },
          {
            title: "avertissement de vent en vigueur",
            description:
              "\nDes vents forts pouvant causer des dommages soufflent ou souffleront.\n\nOù : l'île de Vancouver-Est - de Nanoose Bay à Campbell River, le grand Victoria.\n\nQuand : mercredi matin et mercredi après-midi.\n\nVents maximums prévus : du sud-est de 70 km/h avec des rafales à 90 km/h sur les secteurs côtiers à découvert et près du détroit de Haro.\n\nRemarques : un système frontal du Pacifique qui s'approche de l'île de Vancouver produira des vents forts du sud-est. Les vents forts se lèveront mercredi matin, puis faibliront en après-midi lorsque le front faiblira.\n\n###\n\nLe vent pourrait emporter les objets non fixés à une surface et causer des blessures ou des dommages. Les vents violents pourraient causer des pannes d'électricité et casser des branches d'arbres.\n\nVeuillez continuer à surveiller les alertes et les prévisions émises par Environnement Canada. Pour signaler du temps violent, envoyez un courriel à meteoBC@ec.gc.ca ou publiez un gazouillis en utilisant le mot-clic #BCMeteo.\n",
            severity: "Watch",
            effective_local: "2024-10-29T16:26:47",
            expires_local: "2024-10-30T08:26:47",
            regions: ["Grand Victoria"],
            uri: "https://meteo.gc.ca/",
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
            description:
              "\nHeavy snowfall expected. Accumulation of 20 cm is likely.\n\nWhere: Kelowna and surrounding areas.\n\nWhen: Thursday night through Friday afternoon.\n\nRemarks: A cold front will bring heavy snow to the region. Be prepared for significant reductions in visibility in heavy snow.\n\n###\n\nTravel may be hazardous due to sudden changes in the weather. Continue to monitor alerts and forecasts issued by Environment Canada.\n",
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
            description:
              "\nWildfire risk is high due to dry conditions.\n\nWhere: Forested areas near Lower Seymour.\n\nWhen: Until further notice.\n\nRemarks: Extreme fire risk is anticipated as dry and windy conditions persist. Residents are advised to avoid any open flames or activities that may spark fires.\n\n###\n\nStay informed and be ready to evacuate if conditions worsen.\n\nPlease continue to monitor alerts and forecasts issued by local authorities. Report fires immediately by calling emergency services.\n",
            severity: "Warning",
            effective_local: "2024-10-29T10:00:00",
            expires_local: "Until further notice",
            regions: ["Forested areas near Lower Seymour"],
            uri: "https://weather.gc.ca/",
          },
        ],
      },
    ]);
  }, []);

  // useEffect(() => {
  //   const fetchWeatherData = async () => {
  //     const cachedData = localStorage.getItem("weatherAlerts");
  //     if (cachedData) {
  //       setAlerts(JSON.parse(cachedData));
  //     } else {
  //       const requests = cities.map((city) =>
  //         axios.get(`https://api.weatherbit.io/v2.0/alerts`, {
  //           params: { city: city.name, country: "CA", key: API_KEY },
  //         })
  //       );

  //       try {
  //         const responses = await Promise.all(requests);
  //         const alertData = responses
  //           .map((response, index) => {
  //             const data = response.data;
  //             if (data.alerts && data.alerts.length > 0) {
  //               return {
  //                 city: cities[index].name,
  //                 lat: cities[index].lat,
  //                 lon: cities[index].lon,
  //                 alerts: data.alerts,
  //               };
  //             }
  //             return null;
  //           })
  //           .filter((alert) => alert !== null);

  //         setAlerts(alertData);
  //         localStorage.setItem("weatherAlerts", JSON.stringify(alertData));
  //       } catch (error) {
  //         console.error("Error fetching weather data:", error);
  //       }
  //     }
  //   };

  //   fetchWeatherData();
  // }, []);

  return (
    <MapContainer
      center={[49.25, -123.1]}
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <EsriHeatmapLayer />
      <WeatherAlertHeatmapLayer alerts={alerts} />
      <WeatherAlertLegend />
      <PopulationDensityLegend />

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
