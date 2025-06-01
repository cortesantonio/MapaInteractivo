import styles from './css/NavbarAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faScrewdriverWrench, faLocationDot, faUsersGear, faCity, faHouse, faListUl, faBars, faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"

const NavbarAdmin = () => {
    const { user, userRole } = useAuth();
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    }

    return (
        <nav className={styles.container} role="navigation" aria-label="Navegación principal">
            <div className={styles.leftSection}>
                <button 
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} 
                    onClick={() => navigate(-1)}
                    onKeyPress={(e) => handleKeyPress(e, () => navigate(-1))}
                    aria-label="Volver atrás"
                >
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>

                <div 
                    className={styles.boxIcon} 
                    onClick={() => navigate(`/usuario/perfil/${user?.id}`)}
                    onKeyPress={(e) => handleKeyPress(e, () => navigate(`/usuario/perfil/${user?.id}`))}
                    role="button"
                    tabIndex={0}
                    aria-label="Ir al perfil de usuario"
                    style={{ cursor: 'pointer' }}
                >
                    <img src={user?.user_metadata.avatar_url} alt={`Avatar de ${user?.user_metadata.full_name}`} />
                    {(userRole === 'administrador' || userRole === 'gestor') && 
                        <FontAwesomeIcon icon={faScrewdriverWrench} size='sm' className={styles.icon} aria-hidden="true" />
                    }
                </div>

                <div className={styles.InfoUser}>
                    <h4 
                        onClick={() => navigate(`/usuario/perfil/${user?.id}`)}
                        onKeyPress={(e) => handleKeyPress(e, () => navigate(`/usuario/perfil/${user?.id}`))}
                        role="button"
                        tabIndex={0}
                        style={{ textTransform: 'capitalize', fontSize: '1.2rem', fontWeight: 500, cursor: 'pointer' }}
                    >
                        {user?.user_metadata.full_name}
                    </h4>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '600', color: 'gray' }}>
                        {userRole}
                    </p>
                </div>

                {(userRole === 'administrador' || userRole === 'gestor') && (
                    <>
                        <button 
                            className={styles.ButtonBars} 
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-controls="navMenu"
                            aria-label="Menú de navegación"
                        >
                            <FontAwesomeIcon icon={faBars} size='xl' />
                        </button>
                        <div 
                            id="navMenu"
                            className={`${styles.navMenuContainer} ${isMenuOpen ? styles.menuOpen : ""}`}
                            role="menu"
                        >
                            <div className={styles.ButtonCruds}>
                                <button 
                                    onClick={() => navigate('/')}
                                    role="menuitem"
                                    aria-label="Ir al inicio"
                                >
                                    <FontAwesomeIcon icon={faHouse} aria-hidden="true" />
                                    Inicio
                                </button>
                                <button 
                                    onClick={() => navigate('/panel-administrativo/')}
                                    role="menuitem"
                                    aria-label="Ir al panel administrativo"
                                >
                                    <FontAwesomeIcon icon={faSquarePollHorizontal} aria-hidden="true" />
                                    Panel Administrativo
                                </button>
                                <button 
                                    onClick={() => navigate('/panel-administrativo/marcadores/')}
                                    role="menuitem"
                                    aria-label="Gestionar marcadores"
                                >
                                    <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
                                    Marcadores
                                </button>
                                <button 
                                    onClick={() => navigate('/panel-administrativo/usuarios/')}
                                    role="menuitem"
                                    aria-label="Gestionar usuarios"
                                >
                                    <FontAwesomeIcon icon={faUsersGear} aria-hidden="true" />
                                    Usuarios
                                </button>
                                <button 
                                    onClick={() => navigate('/panel-administrativo/tipo-recinto/')}
                                    role="menuitem"
                                    aria-label="Gestionar recintos"
                                >
                                    <FontAwesomeIcon icon={faCity} aria-hidden="true" />
                                    Recintos
                                </button>
                                <button 
                                    onClick={() => navigate('/panel-administrativo/registrosLogs')}
                                    role="menuitem"
                                    aria-label="Ver registros"
                                >
                                    <FontAwesomeIcon icon={faListUl} size='lg' aria-hidden="true" />
                                    Registros
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    )
}

export default NavbarAdmin;