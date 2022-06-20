import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapEffect = ({ activeStore, storeLocations }) => {
  const map = useMap();

  useEffect(() => {
    if (!activeStore || !map) return;

    const { location } = storeLocations.find(({ id }) => id === activeStore);

    map.setView([location.latitude, location.longitude], 14);
  }, [activeStore, storeLocations, map]);

  return null;
};

export default MapEffect;
