import styles from "./css/User.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";

export default function User({
    tamanoFuente,
    closePanel,
    panelActivo,
    navigate,
    modoNocturno,
    setModoNocturno,
    disminuirFuente,
    aumentarFuente,
}: {
    tamanoFuente: number;
    closePanel: () => void;
    panelActivo: string;
    user?: { email?: string };
    navigate: (path: string) => void;
    modoNocturno: boolean;
    setModoNocturno: (value: boolean) => void;
    disminuirFuente: () => void;
    aumentarFuente: () => void;
}) {
    const { userRole, user } = useAuth();


    return (
        <div>
            {panelActivo === "user" && (
                <div className={styles.PanelActivo} style={{ fontSize: `${tamanoFuente}rem` }}>
                    <div style={{ flexDirection: "column" }}>
                        <button onClick={closePanel} className={styles.ButtonClose}>
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>

                        <h3 className={styles.Titulo}>Opciones</h3>

                        <div style={{ margin: "0px", justifyItems: "left" }}>
                            {user?.email != null ? (
                                <>
                                    {userRole !== 'usuario' ? (<button onClick={() => { navigate('/panel-administrativo') }} className={styles.ButtonSesion}>PANEL ADMINISTRATIVO</button>)
                                        :
                                        (<button onClick={() => { navigate(`/usuario/perfil/${user.id}`) }} className={styles.ButtonSesion}>VER PERFIL</button >)
                                    }
                                </>
                            ) : (
                                <button className={styles.ButtonSesion} onClick={() => { navigate('/login') }}>
                                    INICIAR SESIÓN
                                </button>)}
                            <div>
                                <button className={styles.ButtonColab} onClick={() => { navigate('/colaborar') }}>
                                    Colaborar
                                </button>
                            </div>
                            <div className={styles.ContenSpan}>
                                <span className={styles.SpanNoctur}>Modo Nocturno</span>
                                <div
                                    onClick={() => setModoNocturno(!modoNocturno)} className={styles.ButtonNoctur}
                                    style={{ backgroundColor: modoNocturno ? "rgb(175, 253, 171)" : "white", }}>
                                    <span className={styles.Span} style={{ left: modoNocturno ? "22px" : "2px" }}></span>
                                </div>
                            </div>
                            <button className={styles.ButtonCompact}>
                                Modo Compacto
                            </button>
                        </div>
                        <div className={styles.ContenFuncion}>
                            <div style={{ display: "flex" }}>
                                <button
                                    onClick={disminuirFuente} className={styles.MenosFuente}>
                                    <FontAwesomeIcon icon={faMinus} size="xs" style={{ color: "black" }} />
                                    <span className={styles.MenosA}>A</span>
                                </button>
                                <span className={styles.TituloFuente}>Tamaño de fuente</span>
                                <button
                                    onClick={aumentarFuente} className={styles.MasFuente}>
                                    <span className={styles.MasA}>A</span>
                                    <FontAwesomeIcon icon={faPlus} size="xs" style={{ color: "black" }} />
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

            )}
        </div>
    )
}