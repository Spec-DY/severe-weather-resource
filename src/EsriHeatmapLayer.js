import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import * as esri from "esri-leaflet";
import "leaflet.heat";

const EsriHeatmapLayer = () => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    // 从 ESRI 服务中获取数据
    const featureLayer = esri.featureLayer({
      url: "https://maps-cartes.services.geo.ca/server_serveur/rest/services/NRCan/indigenous_population_2016_en/MapServer/0",
    });

    featureLayer
      .query()
      .where("1=1")
      .limit(1000)
      .run((error, featureCollection) => {
        if (error) {
          console.error("Error fetching ESRI data:", error);
          return;
        }

        // 将数据转换为热力图格式
        const heatPoints = featureCollection.features.map((feature) => {
          const [lon, lat] = feature.geometry.coordinates;
          return [lat, lon, 0.5]; // 第三个参数是强度，可以根据需要调整
        });

        // 检查是否已经有热力图层，如果没有，则创建
        if (!heatLayerRef.current) {
          heatLayerRef.current = L.heatLayer(heatPoints, {
            radius: 80,
            blur: 60,
            maxZoom: 10,
            minOpacity: 0.3,
            maxIntensity: 1.5,
          }).addTo(map);
        } else {
          // 如果热力图层已经存在，则更新数据
          heatLayerRef.current.setLatLngs(heatPoints);
        }
      });

    return () => {
      // 清理热力图层
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map]);

  return null;
};

export default EsriHeatmapLayer;
