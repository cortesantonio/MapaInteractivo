import styles from "./css/User.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleXmark,
    faPlus,
    faMinus,
    faUser,
    faShieldAlt,
    faSignInAlt,
    faMoon,
    faCompress
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "./Modo_Nocturno";
import { useFontSize } from "./Modificador_Letras";
import { ClipLoader } from "react-spinners";

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
    const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

    return (
        <div role="dialog" aria-label="Panel de usuario">
            {panelActivo === "user" && (
                <div
                    className={`${styles.PanelActivo} ${modoNocturno ? styles.darkMode : ''}`}
                    style={{ fontSize: `${fontSize}rem` }}
                >
                    <div style={{ flexDirection: "column" }}>
                        <button
                            onClick={closePanel}
                            className={styles.ButtonClose}
                            aria-label="Cerrar panel"
                            title="Cerrar panel"
                        >
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>

                        <h3 className={styles.Titulo}>Opciones de Usuario</h3>

                        <div style={{ margin: "0px", justifyItems: "left" }}>
                            {user?.email != null ? (
                                !userRole ? (
                                    <p style={{ width: "100%", textAlign: "center", padding: "10px", color: modoNocturno ? "white" : "black" }}><ClipLoader color={modoNocturno ? "white" : "black"} size={15} /> Cargando sesión...</p>
                                ) : (
                                    <>
                                        {userRole === 'gestor' || userRole === 'administrador' ? (
                                            <button
                                                onClick={() => navigate('/panel-administrativo')}
                                                style={{ fontSize: `${fontSize}rem` }}
                                                className={styles.ButtonSesion}
                                                aria-label="Acceder al panel administrativo"
                                                title="Acceder al panel administrativo"
                                            >
                                                <FontAwesomeIcon icon={faShieldAlt} className={styles.ButtonIcon} />
                                                Panel Administrativo
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate(`/usuario/perfil/${user.id}`)}
                                                style={{ fontSize: `${fontSize}rem` }}
                                                className={styles.ButtonSesion}
                                                aria-label="Ver mi perfil de usuario"
                                                title="Ver mi perfil de usuario"
                                            >
                                                <FontAwesomeIcon icon={faUser} className={styles.ButtonIcon} />
                                                Ver perfil
                                            </button>
                                        )}
                                    </>
                                )
                            ) : (
                                <button
                                    className={styles.ButtonSesion}
                                    style={{ fontSize: `${fontSize}rem` }}
                                    onClick={() => navigate('/login')}
                                    aria-label="Iniciar sesión en la plataforma"
                                    title="Iniciar sesión en la plataforma"
                                >
                                    <FontAwesomeIcon icon={faSignInAlt} className={styles.ButtonIcon} />
                                    Iniciar sesión
                                </button>
                            )}

                            <div className={styles.ContenSpan} role="group" aria-label="Configuración de modo nocturno">
                                <span className={styles.SpanNoctur}>
                                    <FontAwesomeIcon icon={faMoon} className={styles.ButtonIcon} /> Modo nocturno
                                </span>
                                <div
                                    onClick={() => setModoNocturno(!modoNocturno)}
                                    className={styles.ButtonNoctur}
                                    style={{ backgroundColor: modoNocturno ? "rgb(175, 253, 171)" : "white", marginLeft: '10px' }}
                                    role="switch"
                                    aria-checked={modoNocturno}
                                    aria-label="Activar/desactivar modo nocturno"
                                    title="Activar/desactivar modo nocturno"
                                >
                                    <span className={styles.Span}
                                        style={{ left: modoNocturno ? "22px" : "2px" }}></span>
                                </div>
                            </div>
                            <button
                                onClick={() => { navigate("/modocompacto") }}
                                style={{ fontSize: `${fontSize}rem` }}
                                className={styles.ButtonCompact}
                                aria-label="Cambiar a modo compacto"
                                title="Cambiar a modo compacto"
                            >
                                <FontAwesomeIcon icon={faCompress} className={styles.ButtonIcon} />
                                Modo compacto
                            </button>
                        </div>
                        <div className={styles.ContenFuncion} role="group" aria-label="Configuración de tamaño de fuente">
                            <div style={{ display: "flex" }}>
                                <button
                                    onClick={decreaseFontSize}
                                    className={styles.MenosFuente}
                                    aria-label="Disminuir tamaño de fuente"
                                    title="Disminuir tamaño de fuente"
                                >
                                    <FontAwesomeIcon icon={faMinus} size="xs" style={{ color: modoNocturno ? "white" : "black" }} />
                                    <span className={styles.MenosA}>A</span>
                                </button>
                                <span className={styles.TituloFuente}>
                                    Tamaño de fuente
                                </span>
                                <button
                                    onClick={increaseFontSize}
                                    className={styles.MasFuente}
                                    aria-label="Aumentar tamaño de fuente"
                                    title="Aumentar tamaño de fuente"
                                >
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