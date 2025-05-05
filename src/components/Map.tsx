import { useState, useEffect } from "react";
import { supabase } from '../services/supabase';
import { APIProvider, Map as GoogleMap, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;
const lugarCentrado = { lat: -34.985378, lng: -71.239395 };
const zoomPorDefecto = 15;

const CustomMap = ({ marcadores, SeleccionMarcador }: { marcadores: any[], SeleccionMarcador: (id: number) => void}) => {
  const map = useMap(); 

  useEffect(() => {
    if (map) {
      map.setOptions({
        disableDefaultUI: true,
        
      });
    }
  }, [map]);

  return (
    <>
      {marcadores.map((m, index) => (
        <AdvancedMarker           
        key={index}
        position={{ lat: m.latitud, lng: m.longitud }}
        onClick={() => {
          SeleccionMarcador(m.id);
        }}
        >
        </AdvancedMarker>

      ))}
    </>
  );
};

const Map = ({
  center = lugarCentrado,
  zoom = zoomPorDefecto,
  onSeleccionMarcador
}: {
  center?: { lat: number, lng: number },
  zoom?: number,
  onSeleccionMarcador: (id: number) => void
}) => {
  const [marcadores, setMarcadores] = useState<any[]>([]);

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
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap defaultCenter={center} defaultZoom={zoom} style={{ height: "100%", width: "100%" }} colorScheme="DARK" mapId="e50cadbbb32f1efa">
        <CustomMap
          marcadores={marcadores}
          SeleccionMarcador={onSeleccionMarcador}
        />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
