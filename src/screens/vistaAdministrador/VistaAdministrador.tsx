import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import GraficoTorta from "../../components/grafico/graficotorta";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useAuth } from "../../hooks/useAuth";
import styles from './VistaAdministrador.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faClock,
    faUsers,
    faStar,
    faWheelchair,
    faBuilding,
    faSignOutAlt,
    faCheckCircle,
    faTimesCircle,
    faBell
} from '@fortawesome/free-solid-svg-icons';

/**
 * Componente principal del panel de administración
 * Muestra un dashboard con gráficos y opciones de gestión
 */
function VistaAdministrador() {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [datosGrafico, setdatosGrafico] = useState<any[]>([]);

    // Cargar datos del gráfico al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('solicitudes')
                .select('estado');

            if (error) {
                console.error('Error al obtener datos:', error);
            } else {
                setdatosGrafico(data);
            }
        };

        fetchData();
    }, []);

    const pendientes = datosGrafico.filter(item => item.estado === "pendiente").length;

    return (
        <>
            <NavbarAdmin />
            <main className={styles.container} role="main">
                {/* Sección del gráfico de solicitudes */}
                <section aria-label="Gráfico de solicitudes" className={styles.graficoContainer}>

                    <GraficoTorta datosGrafico={datosGrafico} />
                </section>

                {/* Sección de Gestión - Menú principal de administración */}
                <div className={styles.sectionHeader} style={{ marginTop: "50px" }}>
                    <hr className={styles.sectionDivider} />
                    <h2 className={styles.sectionTitle}>
                        Gestiones
                    </h2>
                </div>
                <p className={styles.sectionDescription}>
                    Gestiona y configura todos los aspectos de tu sistema desde aquí.
                </p>
                <nav className={styles.menuContainer} aria-label="Menú de gestiones">
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/marcadores')}
                        aria-label="Ir a gestión de marcadores"
                    >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
                        Gestión de marcadores
                    </button>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/marcadores/horarios')}
                        aria-label="Ir a gestión de horarios en marcadores"
                    >
                        <FontAwesomeIcon icon={faClock} className={styles.icon} />
                        Gestión de horarios en marcadores
                    </button>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/usuarios')}
                        aria-label="Ir a gestión de usuarios"
                    >
                        <FontAwesomeIcon icon={faUsers} className={styles.icon} />
                        Gestión de usuarios
                    </button>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/resenas')}
                        aria-label="Ir a gestión de reseñas"
                    >
                        <FontAwesomeIcon icon={faStar} className={styles.icon} />
                        Gestión de reseñas
                    </button>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/accesibilidades')}
                        aria-label="Ir a gestión de accesibilidades"
                    >
                        <FontAwesomeIcon icon={faWheelchair} className={styles.icon} />
                        Gestión de accesibilidades
                    </button>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/tipo-recinto')}
                        aria-label="Ir a gestión de recintos"
                    >
                        <FontAwesomeIcon icon={faBuilding} className={styles.icon} />
                        Gestión de recintos
                    </button>
                </nav>

                {/* Sección de Solicitudes - Gestión de solicitudes pendientes y procesadas */}
                <div className={styles.sectionHeader}>
                    <hr className={styles.sectionDivider} />
                    <h2 className={styles.sectionTitle}>
                    Resumen de solicitudes
                    </h2>
                </div>

                <nav className={styles.menuContainer} aria-label="Menú de solicitudes">
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/solicitudes/pendiente')}
                        aria-label={`Ver ${pendientes} nuevas solicitudes`}
                    >
                        <FontAwesomeIcon icon={faBell} className={styles.icon} />
                        Nuevas solicitudes
                        <span className={styles.pendingCount} aria-label={`${pendientes} solicitudes pendientes`}>
                            {pendientes}
                        </span>
                    </button>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/solicitudes/aprobada')}
                        aria-label="Ver solicitudes aceptadas"
                    >
                        <FontAwesomeIcon icon={faCheckCircle} className={styles.icon} />
                        Solicitudes aceptadas
                    </button>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/panel-administrativo/solicitudes/rechazada')}
                        aria-label="Ver solicitudes rechazadas"
                    >
                        <FontAwesomeIcon icon={faTimesCircle} className={styles.icon} />
                        Solicitudes rechazadas
                    </button>
                </nav>

                {/* Botón de cierre de sesión */}
                <button
                    className={styles.logoutButton}
                    onClick={() => {
                        signOut();
                        navigate('/');
                    }}
                    aria-label="Cerrar sesión"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} style={{ color: "white" }} />
                    Cerrar sesión
                </button>
            </main>
        </>
    );
}

export default VistaAdministrador;