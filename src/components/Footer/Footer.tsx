import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMapLocation, faUser, faMicrophone, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "./Modo_Nocturno";
import styles from "./css/Footer.module.css";
import TrazadoRuta from './TrazadoRuta';
import User from './User';
import Microfono from "./Microfono";
import { useFontSize } from "./Modificador_Letras";

interface Props {
    onSeleccionMarcador: (id: number) => void;
    cambiarModoViaje: (modo: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT') => void;
    establecerDestino: (lat: number | null, lng: number | null) => void;
    ubicacionActiva: boolean
    Idrutamarcador: number | null;
    limpiarRutaMarcador: () => void;
    InformacionDestino?: any; 
    onIndicaciones?: string[]; 
}

export default function Footer({ 
    onSeleccionMarcador, 
    cambiarModoViaje, 
    establecerDestino, 
    ubicacionActiva, 
    Idrutamarcador, 
    limpiarRutaMarcador, 
    InformacionDestino,
    onIndicaciones
}: Props) {
    const navigate = useNavigate()
    const { user } = useAuth();
    const { modoNocturno } = useTheme(); // Usar el contexto del tema
    const [panelActivo, setPanelActivo] = useState<"map" | "user" | "microphone" | null>(null);
    const setHeight = useState("0px")[1];
    const [Isdisplay, setIsdisplay] = useState("none");
    const [activarReconocimiento, setactivarReconocimiento] = useState(false);
    const {fontSize} = useFontSize ();


    const togglePanel = (panel: "map" | "user" | "microphone") => {
        if (panelActivo === panel) {
            closePanel();
        } else {
            establecerDestino(null, null);
            setPanelActivo(panel);
            setTimeout(() => {
                setIsdisplay("block");
                setHeight("350px");
            }, 10);
        }
    };

    useEffect(() => {
        if (Idrutamarcador !== null && panelActivo !== "map") {
            setPanelActivo("map");
            setTimeout(() => {
                setIsdisplay("block");
                setHeight("350px");
            }, 10);
        }
    }, [Idrutamarcador, panelActivo]);

    useEffect(() => {
        if (panelActivo !== "map") {
            establecerDestino(null, null);
            limpiarRutaMarcador
        }
    }, [panelActivo, Idrutamarcador]);

    useEffect(() => {
        if (panelActivo === "microphone") {
            setactivarReconocimiento(true);
        } else {
            setactivarReconocimiento(false);
        }
    }, [panelActivo]);

    const closePanel = () => {
        setHeight("0px");
        setIsdisplay("none");
        setactivarReconocimiento(false);
        if (Idrutamarcador !== null) {
            limpiarRutaMarcador(); 
        }
        setTimeout(() => {
            setPanelActivo(null);
        }, 300);
    };

    
    return (
        <div className={`${styles.ContenPrin} ${modoNocturno ? styles.darkMode : ''}`}
            style={{ fontSize: `${fontSize}rem`, width: window.innerWidth <= 768 ? "98%" : "300px" }}>

            <div className={styles.ContenButton}>
                <button onClick={() => togglePanel("map")} className={styles.Button}>
                    <FontAwesomeIcon icon={panelActivo === "map" ? faChevronDown : faMapLocation}
                        size="xl"
                        style={{ color: panelActivo === "map" ? "blue" : (modoNocturno ? "#fff" : "gray") }} />
                </button>
                <button onClick={() => togglePanel("user")} className={styles.Button}>
                    <FontAwesomeIcon icon={faUser}
                        size="xl"
                        style={{ color: panelActivo === "user" ? "blue" : (modoNocturno ? "#fff" : "gray") }} />
                </button>
            </div>

            <button onClick={() => togglePanel("microphone")} className={styles.ButtonMicro}>
                <FontAwesomeIcon icon={panelActivo === "microphone" ? faCircleXmark : faMicrophone}
                    size="xl"
                    style={{ color: "white" }} />
            </button>

            <div className={`${styles.PanelInfo} ${modoNocturno ? styles.darkMode : ''}`} 
                 style={{
                    display: Isdisplay, 
                    transition: "height 0.3s ease, opacity 0.3s ease", 
                    height: ubicacionActiva && InformacionDestino && Object.keys(InformacionDestino).length > 0 ? "340px" : "450px",
                }}>
                
                {panelActivo === "map" && <TrazadoRuta 
                    closePanel={closePanel} 
                    panelActivo={panelActivo}
                    onSeleccionMarcadorRecientes={onSeleccionMarcador} 
                    cambiarModoViaje={cambiarModoViaje} 
                    establecerDestino={establecerDestino} 
                    ubicacionActiva={ubicacionActiva} 
                    Idrutamarcador={Idrutamarcador} 
                    onIndicaciones={onIndicaciones}/>}

                {panelActivo === "user" && <User 
                    closePanel={closePanel} 
                    panelActivo={panelActivo} 
                    user={user} 
                    navigate={navigate}
                    
                     />}

                {panelActivo === "microphone" && <Microfono 
                    closePanel={closePanel}
                    panelActivo={panelActivo} 
                    activarReconocimiento={activarReconocimiento}
                    onSeleccionMarcador={onSeleccionMarcador} />}
                    
            </div>
        </div>
    );
}