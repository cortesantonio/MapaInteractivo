import styles from "./css/User.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "./Modo_Nocturno";
import { useFontSize } from "./Modificador_Letras";


export default function User({
    closePanel,
    panelActivo,
    navigate,
}: {
    closePanel: () => void;
    panelActivo: string;
    user?: { email?: string };
    navigate: (path: string) => void;
}) {
    const { userRole, user } = useAuth();
    const { modoNocturno, setModoNocturno } = useTheme();
    const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize(); // Usar el contexto

    return (
        <div>
            {panelActivo === "user" && (
                <div className={`${styles.PanelActivo} ${modoNocturno ? styles.darkMode : ''}`}
                    style={{ fontSize: `${fontSize}rem` }}>
                    <div style={{ flexDirection: "column" }}>
                        <button onClick={closePanel} className={styles.ButtonClose}>
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>

                        <h3 className={styles.Titulo}>Opciones</h3>

                        <div style={{ margin: "0px", justifyItems: "left" }}>
                            {user?.email != null ? (
                                <>
                                    {userRole !== 'usuario' ? (
                                        <button onClick={() => { navigate('/panel-administrativo') }}
                                            className={styles.ButtonSesion}>
                                            Panel Administrativo
                                        </button>
                                    ) : (
                                        <button onClick={() => { navigate(`/usuario/perfil/${user.id}`) }}
                                            className={styles.ButtonSesion}>
                                            Ver perfil
                                        </button>
                                    )}
                                </>
                            ) : (
                                <button className={styles.ButtonSesion}
                                    style={{ fontSize: `${fontSize}rem` }}
                                    onClick={() => { navigate('/login') }}>
                                    Iniciar sesión
                                </button>
                            )}
                            <div>
                                <button style={{ fontSize: `${fontSize}rem` }} className={styles.ButtonColab}
                                    onClick={() => { navigate('/colaborar') }}>
                                    Colaborar
                                </button>
                            </div>
                            <div className={styles.ContenSpan}>
                                <span className={styles.SpanNoctur}>Modo nocturno</span>
                                <div
                                    onClick={() => setModoNocturno(!modoNocturno)}
                                    className={styles.ButtonNoctur}
                                    style={{ backgroundColor: modoNocturno ? "rgb(175, 253, 171)" : "white" }}>
                                    <span className={styles.Span}
                                        style={{ left: modoNocturno ? "22px" : "2px" }}></span>
                                </div>
                            </div>
                            <button onClick={() => { navigate("/modocompacto") }} style={{ fontSize: `${fontSize}rem` }} className={styles.ButtonCompact}>
                                Modo compacto
                            </button>
                        </div>
                        <div className={styles.ContenFuncion}>
                            <div style={{ display: "flex" }}>
                                <button
                                    onClick={decreaseFontSize}
                                    className={styles.MenosFuente}>
                                    <FontAwesomeIcon icon={faMinus} size="xs" style={{ color: modoNocturno ? "white" : "black" }} />
                                    <span className={styles.MenosA}>A</span>
                                </button>
                                <span className={styles.TituloFuente}>Tamaño de fuente</span>
                                <button
                                    onClick={increaseFontSize}
                                    className={styles.MasFuente}>
                                    <span className={styles.MasA}>A</span>
                                    <FontAwesomeIcon icon={faPlus} size="xs" style={{ color: modoNocturno ? "white" : "black" }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}