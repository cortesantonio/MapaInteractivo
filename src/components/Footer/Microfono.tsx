import styles from "./css/Microfono.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Reconocimiento from "../../components/Footer/reconocimientodevoz";
import { useTheme } from "./Modo_Nocturno";
import { useFontSize } from "./Modificador_Letras";


export default function Microfono({
    closePanel,
    panelActivo,
    activarReconocimiento,
}: {
    closePanel: () => void;
    panelActivo: string;
    activarReconocimiento: boolean;
}) {

    const {modoNocturno} = useTheme ();
    const {fontSize} = useFontSize ();

    return (
        <div>
            {panelActivo === "microphone" && ( //Vista de la funcion que realiza el Microphone
                <div className={styles.PanelActivo} style={{ fontSize: `${fontSize}rem` }}>
                    {panelActivo !== null && (
                        <button
                            onClick={closePanel} className={styles.ButtonClose}>
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>
                    )}

                    <h3 style={{color: modoNocturno ? "#fff" : ""}} className={styles.Titulo}>Te Escucho ¿Donde Quieres Ir...?</h3>

                    <div className={styles.MicroActive}>
                        <Reconocimiento activarReconocimiento={activarReconocimiento} />
                    </div>
                </div>
            )}
        </div>
    )
}