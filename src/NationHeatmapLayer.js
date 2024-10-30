// src/components/NationHeatmapLayer.js
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.awesome-markers";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

const nations = [
  {
    name: "Tsilhqot’in Nation",
    lat: 51.7021,
    lon: -124.6475,
    population: 3500,
    risk: 0.9,
  },
  {
    name: "Nuu-chah-nulth Tribal Council",
    lat: 49.2616,
    lon: -125.8784,
    population: 8500,
    risk: 0.8,
  },
  {
    name: "Carrier Sekani Tribal Council",
    lat: 53.7267,
    lon: -127.6476,
    population: 6000,
    risk: 0.6,
  },
  {
    name: "Katzie First Nation",
    lat: 49.105,
    lon: -122.8433,
    population: 1200,
    risk: 0.7,
  },
  {
    name: "Heiltsuk Nation",
    lat: 52.1285,
    lon: -128.1128,
    population: 1000,
    risk: 0.4,
  },
  {
    name: "Tsimshian First Nation",
    lat: 54.5589,
    lon: -128.6034,
    population: 1800,
    risk: 0.3,
  },
  {
    name: "Secwepemc Nation",
    lat: 50.7606,
    lon: -120.3408,
    population: 9000,
    risk: 0.8,
  },
  {
    name: "Squamish Nation",
    lat: 50.1163,
    lon: -122.9574,
    population: 3800,
    risk: 0.9,
  },
];

const NationHeatmapLayer = () => {
  const map = useMap();

  useEffect(() => {
    // 打印调试信息
    console.log("Rendering NationHeatmapLayer with markers only...");
    console.log("Nation data:", nations);

    // 添加每个原住民族的标记
    nations.forEach((nation) => {
      const marker = L.marker([nation.lat, nation.lon], {
        icon: L.AwesomeMarkers.icon({
          icon: "info-circle",
          markerColor: "blue",
          prefix: "fa",
        }),
      }).addTo(map);

      // 添加弹出窗口
      marker.bindPopup(`
        <strong>${nation.name}</strong><br>
        Population: ${nation.population}<br>
        Risk Level: ${(nation.risk * 100).toFixed(1)}%
      `);
    });

    // 清理图层
    return () => {
      console.log("Cleaning up NationHeatmapLayer markers...");
      // 使用 removeLayer 时需要遍历每个 marker，进行手动删除
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map]);

  return null;
};

export default NationHeatmapLayer;
