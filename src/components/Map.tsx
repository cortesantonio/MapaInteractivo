import { useState, useEffect } from "react";
import VerMarcador from "../components/VerMarcador";
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

const Map = ({ center = lugarCentrado, zoom = zoomPorDefecto }) => {

  const [mostrarMarcador, setmostrarMarcador] = useState(false);
  const [marcadorSeleccionadoId, setMarcadorSeleccionadoId] = useState<number | null>(null);
  const [marcadores, setMarcadores] = useState<any[]>([]);



  useEffect(() => {
    const fetchMarcador = async () => {
      const {data, error} = await supabase
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


  const marcadorSeleccionado = marcadores.find(m => m.id === marcadorSeleccionadoId);

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap defaultCenter={center} defaultZoom={zoom} style={{ height: "100%", width: "100%" }} colorScheme="DARK" mapId="7d3698ad84e7e9c3">
        <CustomMap marcadores={marcadores} 
          SeleccionMarcador={(id) => {
            setMarcadorSeleccionadoId(id); 
            setmostrarMarcador(true); 
            }} 
        />
        {mostrarMarcador && (
          <div style={{ position: "absolute", top: "150px", left: "50px" }}>
            <VerMarcador MarcadorSelectId={marcadorSeleccionado.id} CerrarMarcador={() => setmostrarMarcador(false)} />
          </div>
          
        )}
        


      </GoogleMap>
    </APIProvider>
  );
};

export default Map;