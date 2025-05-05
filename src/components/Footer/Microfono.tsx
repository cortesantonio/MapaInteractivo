import styles from "./css/Microfono.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Reconocimiento from "../../components/Footer/reconocimientodevoz";


export default function Microfono({
    tamanoFuente,
    closePanel,
    panelActivo,
    activarReconocimiento,
}: {
    tamanoFuente: number;
    closePanel: () => void;
    panelActivo: string;
    activarReconocimiento: boolean;
}) {
    return (
        <div>
            {panelActivo === "microphone" && ( //Vista de la funcion que realiza el Microphone
                <div className={styles.PanelActivo} style={{ fontSize: `${tamanoFuente}rem` }}>
                    {panelActivo !== null && (
                        <button
                            onClick={closePanel} className={styles.ButtonClose}>
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>
                    )}

                    <h3 className={styles.Titulo}>Te Escucho ¿Donde Quieres Ir...?</h3>

                    <div className={styles.MicroActive}>
                        <Reconocimiento activarReconocimiento={activarReconocimiento} />
                    </div>
                </div>
            )}
        </div>
    )
}