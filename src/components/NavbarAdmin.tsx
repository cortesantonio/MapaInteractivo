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
    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => { navigate(-1) }} >
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>

                <div className={styles.boxIcon} onClick={() => { navigate(`/usuario/perfil/${user?.id}`) }} style={{ cursor: 'pointer' }}>
                    <img src={user?.user_metadata.avatar_url} alt="" />
                    <FontAwesomeIcon icon={faScrewdriverWrench} size='sm' className={styles.icon} />
                </div>
                <div className={styles.InfoUser}>
                    <h4 onClick={() => { navigate(`/usuario/perfil/${user?.id}`) }} style={{ textTransform: 'capitalize', fontSize: '1.2rem', fontWeight: 500, cursor: 'pointer' }}>{user?.user_metadata.full_name}</h4>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '600', color: 'gray' }}>
                        {userRole}
                    </p>
                </div>
                <button className={styles.ButtonBars} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} size='xl' />
                </button>
                <div className={`${styles.navMenuContainer} ${isMenuOpen ? styles.menuOpen : ""}`}>
                    <div className={styles.ButtonCruds}>

                        <button onClick={() => { navigate('/') }}>
                            <FontAwesomeIcon icon={faHouse} />
                            Inicio
                        </button>
                        <button onClick={() => { navigate('/panel-administrativo/') }}>
                            <FontAwesomeIcon icon={faSquarePollHorizontal} />
                            Panel Administrativo
                        </button>
                        <button onClick={() => { navigate('/panel-administrativo/marcadores/') }}>
                            <FontAwesomeIcon icon={faLocationDot} />
                            Marcadores
                        </button>

                        <button onClick={() => { navigate('/panel-administrativo/usuarios/') }}>
                            <FontAwesomeIcon icon={faUsersGear} />
                            Usuarios
                        </button>

                        <button onClick={() => { navigate('/panel-administrativo/tipo-recinto/') }}>
                            <FontAwesomeIcon icon={faCity} />
                            Recintos
                        </button>

                        <button onClick={() => { navigate('/panel-administrativo/registrosLogs') }}>
                            <FontAwesomeIcon icon={faListUl} size='lg' />
                            Registros
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default NavbarAdmin;