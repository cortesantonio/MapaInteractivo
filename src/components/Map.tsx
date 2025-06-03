import { useState, useEffect, useMemo } from "react";
import { supabase } from '../services/supabase';
import { APIProvider, Map as GoogleMap, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import Supercluster from "supercluster";
import { useTheme } from "./Footer/Modo_Nocturno";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";


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
  mapacentrado,
  setMapacentrado,
  onSeleccionFiltro
}: {
  marcadores: any[],
  SeleccionMarcador: (id: number) => void,
  ubicacionUsuario?: { lat: number, lng: number } | null
  destinoRuta?: { lat: number, lng: number } | null,
  onStreetViewChange?: (isActive: boolean) => void
  modoViaje: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT'
  onUbicacionActiva: (activa: boolean) => void,
  onIndicaciones: (instrucciones: string[]) => void,
  mapacentrado: boolean;
  setMapacentrado: (valor: boolean) => void;
  onSeleccionFiltro?: { nombre: string; tipo: string }[];

}) => {

  const map = useMap();
  const { modoNocturno } = useTheme();
  const [clusters, setClusters] = useState<any[]>([]);
  const [superclusterInstance, setSuperclusterInstance] = useState<Supercluster | null>(null);

  const coloresAccesibilidad: Record<string, string> = {
    "Arquitectónica": "#FB8C00",
    "Cognitiva": "#4FC3F7",
    "Sensorial": "#FFEB3B",
    "CA": "#66BB6A",
  };


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

  const marcadoresFiltrados = useMemo(() => {
    if (!onSeleccionFiltro || onSeleccionFiltro.length === 0) {
      return marcadores;
    }

    return marcadores.filter(marcador => {
      const accesibilidadesMarcador = marcador.accesibilidad_marcador || [];

      // Verificamos si el marcador tiene alguna accesibilidad que coincida con el filtro
      return accesibilidadesMarcador.some((a: any) => {
        const acc = a.accesibilidad;
        return onSeleccionFiltro.some(filtro =>
          acc?.nombre === filtro.nombre && acc?.tipo === filtro.tipo
        );
      });
    });
  }, [marcadores, onSeleccionFiltro]);


  const puntos = useMemo(() => marcadoresFiltrados.map(m => ({
    type: "Feature",
    properties: {
      cluster: false,
      marcadorId: m.id,
      nombre: m.nombre_recinto
    },
    geometry: {
      type: "Point",
      coordinates: [m.longitud, m.latitud]
    }
  })), [marcadoresFiltrados]);


  useEffect(() => {
    const supercluster = new Supercluster({
      radius: 60,
      maxZoom: 20,
    });
    supercluster.load(puntos as any);
    setSuperclusterInstance(supercluster);
  }, [puntos]);


  useEffect(() => {
    if (!map || !superclusterInstance) return;

    const updateClusters = () => {
      const bounds = map.getBounds();
      if (!bounds) return;

      const zoom = map.getZoom();
      if (zoom === undefined || !superclusterInstance) return;

      const clusters = superclusterInstance.getClusters(
        [
          bounds.getSouthWest().lng(),
          bounds.getSouthWest().lat(),
          bounds.getNorthEast().lng(),
          bounds.getNorthEast().lat()
        ],
        zoom
      );

      setClusters(clusters);
    };

    updateClusters();

    const listener = map.addListener('bounds_changed', updateClusters);
    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [map, superclusterInstance]);


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

  useEffect(() => {
    if (mapacentrado && map && ubicacionUsuario) {
      map.panTo(ubicacionUsuario);
    }
  }, [ubicacionUsuario, mapacentrado, map]);

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("dragstart", () => {
      if (mapacentrado) {
        setMapacentrado(false);
      }
    });

    return () => {
      listener.remove();
    };
  }, [map, mapacentrado]);

  return (
    <>

      {!destinoRuta && clusters.map((cluster: any, index: number) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = cluster.properties;

        if (isCluster) {
          return (
            <AdvancedMarker key={`cluster-${index}`} position={{ lat, lng }}>
              <div
                style={{
                  width: `${20 + (pointCount / marcadores.length) * 40}px`,
                  height: `${20 + (pointCount / marcadores.length) * 40}px`,
                  backgroundColor: modoNocturno ? 'rgba(255, 107, 107, 0.5)' : 'rgba(255, 107, 107, 0.8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (!map || !superclusterInstance) return;

                  const expansionZoom = Math.min(
                    superclusterInstance.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  map.setZoom(expansionZoom);
                  map.panTo({ lat, lng });
                }}

              >
                {pointCount}
              </div>
            </AdvancedMarker>
          );
        }

        return (
          <AdvancedMarker
            key={`marker-${cluster.properties.marcadorId}`}
            position={{ lat, lng }}
            onClick={() => SeleccionMarcador(cluster.properties.marcadorId)}
          >
            <div style={{ position: "relative", transform: "translate(-50%, -100%)" }}>
              <div style={{ position: "absolute", left: "50%", top: "100%", transform: "translate(-50%, -100%)" }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ color: "red" }} size="lg" />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "100%",
                  transform: "translate(8px, -50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  maxWidth: "220px"
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: modoNocturno ? "#F0F0F0" : "#565656",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cluster.properties.nombre}
                </span>

                {onSeleccionFiltro && onSeleccionFiltro.length > 0 && (() => {
                  const marcador = marcadores.find(m => m.id === cluster.properties.marcadorId);
                  const accesibilidadesMarcador = marcador?.accesibilidad_marcador || [];

                  const accesibilidadesFiltradas = accesibilidadesMarcador.filter((a: any) => {
                    const acc = a.accesibilidad;
                    return onSeleccionFiltro.some(filtro =>
                      acc?.nombre === filtro.nombre && acc?.tipo === filtro.tipo
                    );
                  });

                  const tiposUnicos: string[] = Array.from(new Set(accesibilidadesFiltradas.map((a: { accesibilidad: { tipo: string } }) => a.accesibilidad.tipo)));

                  const colores = tiposUnicos
                    .filter(tipo => tipo && coloresAccesibilidad.hasOwnProperty(tipo))
                    .map(tipo => coloresAccesibilidad[tipo]);

                  return colores.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: color,
                      }}
                    />
                  ));
                })()}
              </div>
            </div>
          </AdvancedMarker>


        );
      })}

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
  onIndicaciones,
  mapacentrado,
  setMapacentrado,
  onSeleccionFiltro

}: {
  center?: { lat: number, lng: number },
  zoom?: number,
  onSeleccionMarcador: (id: number) => void,
  onStreetViewChange?: (isActive: boolean) => void
  destinoRuta?: { lat: number, lng: number } | null,
  modoViaje: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT',
  onUbicacionActiva: (activa: boolean) => void,
  onIndicaciones: (instrucciones: string[]) => void,
  mapacentrado: boolean;
  setMapacentrado: (valor: boolean) => void;
  onSeleccionFiltro?: { nombre: string; tipo: string }[];


}) => {
  const [marcadores, setMarcadores] = useState<any[]>([]);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{ lat: number, lng: number } | null>(null);
  const { modoNocturno } = useTheme();


  useEffect(() => {
    const fetchMarcador = async () => {
      const { data, error } = await supabase
        .from("marcador")
        .select("id, nombre_recinto, latitud, longitud, accesibilidad_marcador(accesibilidad(tipo, nombre))")
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
      <GoogleMap defaultCenter={center} defaultZoom={zoom} style={{ height: "100%", width: "100%" }} colorScheme={modoNocturno ? "DARK" : "LIGHT"} mapId="e50cadbbb32f1efa">
        <CustomMap
          marcadores={marcadores}
          SeleccionMarcador={onSeleccionMarcador}
          ubicacionUsuario={ubicacionUsuario}
          onStreetViewChange={onStreetViewChange}
          modoViaje={modoViaje}
          destinoRuta={destinoRuta}
          onUbicacionActiva={onUbicacionActiva}
          onIndicaciones={onIndicaciones}
          mapacentrado={mapacentrado}
          setMapacentrado={setMapacentrado}
          onSeleccionFiltro={onSeleccionFiltro}
        />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;