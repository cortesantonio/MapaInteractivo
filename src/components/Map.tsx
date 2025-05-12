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
  destinoRuta,
  onStreetViewChange,
  modoViaje,
  onUbicacionActiva,
  onIndicaciones,
}: {
  marcadores: any[],
  SeleccionMarcador: (id: number) => void,
  ubicacionUsuario?: { lat: number, lng: number } | null
  destinoRuta?: { lat: number, lng: number } | null,
  onStreetViewChange?: (isActive: boolean) => void
  modoViaje: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT'
  onUbicacionActiva: (activa: boolean) => void,
  onIndicaciones: (instrucciones: string[]) => void

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
        gestureHandling: "greedy",
        clickableIcons: false,
        keyboardShortcuts: false
        
      });

    }

  }, [map]);


  useEffect(() => {
    if (map) {
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


  useEffect(() => {
    if (!map || !ubicacionUsuario) return;
  
    if (!destinoRuta) {
      onIndicaciones([]); 
      return;
    }
  
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#4285F4",
        strokeOpacity: 0.9,
        strokeWeight: 5
      }
    });

    directionsRenderer.setMap(map);
  
    directionsService.route(
      {
        origin: ubicacionUsuario,
        destination: destinoRuta,
        travelMode: google.maps.TravelMode[modoViaje],
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
  
          const steps = result.routes[0].legs[0].steps;
          const instrucciones = steps.map(step => step.instructions);
          onIndicaciones(instrucciones);

        } else {
          console.error("Error al calcular la ruta:", status);
        }
      }
    );
  
    return () => {
      directionsRenderer.setMap(null);

    };
  }, [map, modoViaje, ubicacionUsuario, destinoRuta]);
  

  useEffect(() => {
    if (ubicacionUsuario) {
      onUbicacionActiva(true); 
    } else {
      onUbicacionActiva(false); 
    }
  }, [ubicacionUsuario, onUbicacionActiva]);


  return (
    <>
      {!destinoRuta && marcadores.map((m, index) => (
        <AdvancedMarker
          key={index}
          position={{ lat: m.latitud, lng: m.longitud }}
          onClick={() => SeleccionMarcador(m.id)}
        />
      ))}

      {destinoRuta && (
        <AdvancedMarker position={destinoRuta} title="Destino">
          <div style={{ width: "32px", height: "32px" }}>
            <svg
              viewBox="0 0 24 24"
              width="100%"
              height="100%"
              fill="#d62828"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 2C8 2 5 5.5 5 9.5C5 14.28 12 22 12 22C12 22 19 14.28 19 9.5C19 5.5 16 2 12 2Z" />
              <circle cx="12" cy="9.5" r="2.5" fill="white" />
            </svg>
          </div>
        </AdvancedMarker>
      )}

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
  onStreetViewChange,
  modoViaje,
  destinoRuta,
  onUbicacionActiva,
  onIndicaciones

}: {
  center?: { lat: number, lng: number },
  zoom?: number,
  onSeleccionMarcador: (id: number) => void,
  onStreetViewChange?: (isActive: boolean) => void
  destinoRuta?: { lat: number, lng: number } | null,
  modoViaje: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT',
  onUbicacionActiva: (activa: boolean) => void,
  onIndicaciones: (instrucciones: string[]) => void

}) => {
  const [marcadores, setMarcadores] = useState<any[]>([]);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number, lng: number } | null>(null);
  

  useEffect(() => {
    const fetchMarcador = async () => {
      const { data, error } = await supabase
        .from("marcador")
        .select("id, latitud, longitud")
        .eq("activo", true); 
  
      if (error) {
        console.error("Error al obtener los marcadores:", error);
      } else {
        setMarcadores(data);
      }
    };
    
  
    fetchMarcador();
  
    let watchId: number;
  
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacionUsuario({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error al obtener geolocalización:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000, 
          timeout: 10000
        }
      );
    }
  
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap defaultCenter={center} defaultZoom={zoom} style={{ height: "100%", width: "100%" }} colorScheme="DARK" mapId="e50cadbbb32f1efa">
        <CustomMap
          marcadores={marcadores}
          SeleccionMarcador={onSeleccionMarcador}
          ubicacionUsuario={ubicacionUsuario}
          onStreetViewChange={onStreetViewChange}
          modoViaje={modoViaje}
          destinoRuta={destinoRuta}
          onUbicacionActiva={onUbicacionActiva}
          onIndicaciones={onIndicaciones} 

        />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;