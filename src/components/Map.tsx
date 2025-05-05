import { useState, useEffect } from "react";
import { supabase } from '../services/supabase';
import { APIProvider, Map as GoogleMap, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;
const lugarCentrado = { lat: -34.985378, lng: -71.239395 };
const zoomPorDefecto = 15;

const CustomMap = ({
  marcadores,
  SeleccionMarcador,
  ubicacionUsuario,
  onStreetViewChange
}: {
  marcadores: any[],
  SeleccionMarcador: (id: number) => void,
  ubicacionUsuario?: { lat: number, lng: number } | null
  onStreetViewChange?: (isActive: boolean) => void
}) => {

  const map = useMap();

  useEffect(() => {
    if (map) {

      map.setOptions({
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        streetViewControl: true,
        fullscreenControl: false,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        gestureHandling: "greedy"
      });

      const streetView = map.getStreetView();
      const handleStreetViewChange = () => {

        const visible = streetView.getVisible();

        if (onStreetViewChange) {
          requestAnimationFrame(() => {
            onStreetViewChange(visible);
          });
        }

      };
      streetView.addListener('visible_changed', handleStreetViewChange);
    }

  }, [map, onStreetViewChange]);

  
  return (
    <>
      {marcadores.map((m, index) => (
        <AdvancedMarker
          key={index}
          position={{ lat: m.latitud, lng: m.longitud }}
          onClick={() => SeleccionMarcador(m.id)}
        />
      ))}

      {ubicacionUsuario && (
        <AdvancedMarker 
        position={ubicacionUsuario} 
        >
        <div style={{ position: "relative", width: "30px", height: "30px" }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: "50%",
            backgroundColor: "#4285F4",
            animation: "pulse 2s infinite",
            opacity: 0.4
          }} />
          <div style={{
            position: "absolute",
            top: "7px", left: "7px",
            width: "16px",
            height: "16px",
            backgroundColor: "#4285F4",
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 0 4px rgba(66, 133, 244, 0.8)"
          }} />
          <style>{`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(2); opacity: 0; }
              100% { transform: scale(1); opacity: 0.4; }
            }
          `}</style>
        </div>
      </AdvancedMarker>
      )}
    </>
  );
};

const Map = ({
  center = lugarCentrado,
  zoom = zoomPorDefecto,
  onSeleccionMarcador,
  onStreetViewChange
}: {
  center?: { lat: number, lng: number },
  zoom?: number,
  onSeleccionMarcador: (id: number) => void,
  onStreetViewChange?: (isActive: boolean) => void
}) => {
  const [marcadores, setMarcadores] = useState<any[]>([]);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    const fetchMarcador = async () => {
      const { data, error } = await supabase
        .from("marcador")
        .select("id, latitud, longitud");

      if (error) {
        console.error("Error al obtener los marcadores:", error);
      } else {
        setMarcadores(data);
      }
    };

    fetchMarcador();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacionUsuario({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error al obtener geolocalización:", error);
        }
      );
    }
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap defaultCenter={center} defaultZoom={zoom} style={{ height: "100%", width: "100%" }} colorScheme="DARK" mapId="7d3698ad84e7e9c3">
        <CustomMap
          marcadores={marcadores}
          SeleccionMarcador={onSeleccionMarcador}
          ubicacionUsuario={ubicacionUsuario}
          onStreetViewChange={onStreetViewChange}
        />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;