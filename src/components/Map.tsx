import { useEffect } from "react";
import { APIProvider, Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";

const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;
const lugarCentrado = { lat: -34.985378, lng: -71.239395 };
const zoomPorDefecto = 15;

const CustomMap = () => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setOptions({
        disableDefaultUI: true,

      });
    }
  }, [map]);

  return null;
};

const Map = ({ center = lugarCentrado, zoom = zoomPorDefecto }) => {
  const mapStyles = { height: "100%", width: "100%" };

  return (
    <APIProvider apiKey={apiKey} >
      <GoogleMap defaultCenter={center} defaultZoom={zoom} style={mapStyles}>
        <CustomMap />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;