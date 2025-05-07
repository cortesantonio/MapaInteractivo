import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMapLocation, faUser, faMicrophone, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./css/Footer.module.css";
import TrazadoRuta from './TrazadoRuta';
import User from './User';
import Microfono from "./Microfono";

interface Props {          // FK
    onSeleccionMarcador: (id: number) => void;
}

//Funcionamiento completo del footer 
export default function Footer({ onSeleccionMarcador }: Props) {
    const navigate = useNavigate()
    const { user } = useAuth();
    //Controla el Panel que mostrara la informacion del maplocation y del userperson
    const [panelActivo, setPanelActivo] = useState<"map" | "user" | "microphone" | null>(null);
    const [modoNocturno, setModoNocturno] = useState(false)
    const [tamanoFuente, setTamanoFuente] = useState(1)
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "80%" : "300px");
    const setHeight = useState("0px")[1]// Cambiado a una variable de estado para controlar la altura del panel
    const [Isdisplay, setIsdisplay] = useState("none");
    const [activarReconocimiento, setactivarReconocimiento] = useState(false);

    //Cumple la funcion de ajutar el viewport, la config inicial y el listar, la limpieza al desmontar el componente
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "98%" : "300px");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    //Funcion Separada de cada Bottom cuando se activa uno el otro se cancela
    const togglePanel = (panel: "map" | "user" | "microphone") => {
        if (panelActivo === panel) {
            closePanel();
        } else {

            setPanelActivo(panel);
            setTimeout(() => {
                setIsdisplay("block");
                setHeight("350px");
            }, 10);
        }
    };

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
        setTimeout(() => {
            setPanelActivo(null);
        }, 300);
    };

    const aumentarFuente = () => {
        if (tamanoFuente < 1.5) {
            setTamanoFuente(tamanoFuente + 0.1)
        }
    }

    const disminuirFuente = () => {
        if (tamanoFuente > 0.8) {
            setTamanoFuente(tamanoFuente - 0.1)
        }
    }

    return (
        // Contenedor pirncipal (padre)
        <div className={styles.ContenPrin} style={{ fontSize: `${tamanoFuente}rem`, width: width, }}>

            {/* Contenedor de los Botones inferior del trazado de ruta y funciones disponibles */}

            <div className={styles.ContenButton}>
                <button onClick={() => togglePanel("map")} className={styles.Button}>
                    <FontAwesomeIcon icon={panelActivo === "map" ? faChevronDown : faMapLocation} size="xl" style={{ color: panelActivo === "map" ? "blue" : "gray" }} />
                </button>
                <button onClick={() => togglePanel("user")} className={styles.Button}>
                    <FontAwesomeIcon icon={faUser} size="xl" style={{ color: panelActivo === "user" ? "blue" : "gray" }} />
                </button>
            </div>
            {/* El boton del Microphone esta aparte pero dentro del cotenedor principal */}
            <button onClick={() => togglePanel("microphone")} className={styles.ButtonMicro}>
                <FontAwesomeIcon icon={panelActivo === "microphone" ? faCircleXmark : faMicrophone} size="xl" style={{ color: "white" }} />
            </button>
            <div className={styles.PanelInfo} style={{ display: Isdisplay, transition: "height 0.3s ease, opacity 0.3s ease" }}>
                {/* Vista de los contenidos que tendra el panel de trazado de rutas */}
                {panelActivo === "map" && <TrazadoRuta tamanoFuente={tamanoFuente} closePanel={closePanel} panelActivo={panelActivo} onSeleccionMarcadorRecientes={onSeleccionMarcador} />}

                {/* Visualizacion de los datos que vera el usuario y sus funciones correspondientes */}
                {panelActivo === "user" && <User tamanoFuente={tamanoFuente} closePanel={closePanel} panelActivo={panelActivo} user={user} navigate={navigate}
                    modoNocturno={modoNocturno} setModoNocturno={setModoNocturno} disminuirFuente={disminuirFuente} aumentarFuente={aumentarFuente} />}

                {/* Vista de la funcion que realiza el Microphone */}
                {panelActivo === "microphone" && <Microfono tamanoFuente={tamanoFuente} closePanel={closePanel}
                    panelActivo={panelActivo} activarReconocimiento={activarReconocimiento} />}
            </div>
        </div>
    );
}

