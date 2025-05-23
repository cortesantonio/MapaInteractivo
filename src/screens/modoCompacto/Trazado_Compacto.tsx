import styles from "./css/Trazado_Compacto.module.css";
import { APIProvider } from "@vis.gl/react-google-maps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faCar, faPersonBiking, faPersonWalking, faReply } from "@fortawesome/free-solid-svg-icons";
import { Marcador } from "../../interfaces/Marcador";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

type ModoViaje = 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT';

function TrazadoRutaInterno() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [modoViajeActual, setModoViajeActual] = useState<ModoViaje>('DRIVING');
    const [origen, setOrigen] = useState<{ lat: number; lng: number } | null>(null);
    const [marcadorDestino, setMarcadorDestino] = useState<Partial<Marcador> | null>(null);
    const [destino, setDestino] = useState<{ lat: number; lng: number } | null>(null);
    const [instrucciones, setInstrucciones] = useState<string[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setOrigen({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => console.error("No se pudo obtener la ubicación", err)
        );
    }, []);

    useEffect(() => {
    const fetchDestino = async () => {
        const { data, error } = await supabase
            .from("marcador")
            .select("nombre_recinto, direccion, latitud, longitud") 
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error al obtener destino:", error);
        } else {
            setMarcadorDestino(data);
            setDestino({ lat: data.latitud, lng: data.longitud });
        }
    };

    fetchDestino();
}, [id]);

    useEffect(() => {
        const obtenerRuta = () => {
            if (!origen || !destino || !window.google) return;

            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: new google.maps.LatLng(origen.lat, origen.lng),
                    destination: new google.maps.LatLng(destino.lat, destino.lng),
                    travelMode: google.maps.TravelMode[modoViajeActual],
                },
                (result, status) => {
                    if (status === "OK" && result?.routes[0]?.legs[0]?.steps) {
                        const pasos = result.routes[0].legs[0].steps.map((step) =>
                            step.instructions.replace(/<[^>]+>/g, "")
                        );
                        setInstrucciones(pasos);
                    } else {
                        console.error("Error al obtener ruta:", status);
                    }
                }
            );
        };

        obtenerRuta();
    }, [origen, destino, modoViajeActual]);

    const handleCambiarModoViaje = (modo: ModoViaje) => {
        setModoViajeActual(modo);
    };

    return (
        <div className={styles.container_principal}>
            <div style={{ marginBottom: "25px", marginRight: "10px", backgroundColor: "#000" }}>
                <button className={styles.botonatras} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon style={{ fontSize: "20px", margin: "3px" }} icon={faReply} />
                    <span style={{ width: "100px", fontSize: "25px" }}>Atrás</span>
                </button>
            </div>


            <div className={styles.Container_secundario}>

                <h3>Trazado ruta:</h3>

                <h3 >
                    <strong> Para llegar a </strong>{marcadorDestino?.nombre_recinto ?? "tu destino"},<strong> que se encuentra en </strong>{marcadorDestino?.direccion ?? "cargando la dirección..."}, <strong>tienes que pasar por los siguientes puntos para llegar al destino:</strong>
                </h3>
                <h3>Indicaciones de ruta:</h3>
                <div className={styles.direccion}>
                    {instrucciones.length > 0 ? (
                        <ol>
                            {instrucciones.map((inst, index) => (
                                <li style={{ margin: "5px " }} key={index}>{inst}</li>
                            ))}
                        </ol>
                    ) : (
                        <p>Cargando instrucciones...</p>
                    )}

                </div>


                <div className={styles.PositionIcons}>
                    <button className={styles.ButttonIcons} onClick={() => handleCambiarModoViaje('DRIVING')}>
                        <FontAwesomeIcon icon={faCar} size="lg" style={{
                            color: modoViajeActual === 'DRIVING' ? 'rgb(75, 127, 241)' : ""
                        }} />
                    </button>
                    <button className={styles.ButttonIcons}>
                        <FontAwesomeIcon icon={faBus} size="lg" style={{ color: "gray" }} />
                    </button>
                    <button className={styles.ButttonIcons} onClick={() => handleCambiarModoViaje('WALKING')}>
                        <FontAwesomeIcon icon={faPersonWalking} size="lg" style={{
                            color: modoViajeActual === 'WALKING' ? 'rgb(75, 127, 241)' : ""
                        }} />
                    </button>
                    <button className={styles.ButttonIcons} onClick={() => handleCambiarModoViaje('BICYCLING')}>
                        <FontAwesomeIcon icon={faPersonBiking} size="lg" style={{
                            color: modoViajeActual === 'BICYCLING' ? 'rgb(75, 127, 241)' : ""
                        }} />
                    </button>
                </div>
            </div>

        </div>

    );
}

function TrazadoRuta() {
    const apikey = import.meta.env.VITE_GOOGLE_APIKEY;

    return (
        <APIProvider apiKey={apikey}>
            <TrazadoRutaInterno />
        </APIProvider>
    );
}

export default TrazadoRuta;






