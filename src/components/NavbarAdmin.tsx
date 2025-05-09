import styles from './css/NavbarAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const NavbarAdmin = () => {
    const { user, userRole } = useAuth();
    const navigate = useNavigate()
    return (
        <div className={styles.container}>
            <div>
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => { navigate(-1) }} >
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
            </div>
            <div className={styles.boxIcon}>
                <img src={user?.user_metadata.avatar_url} alt="" />
                <FontAwesomeIcon icon={faScrewdriverWrench} size='sm' className={styles.icon} />
            </div>
            <div>
                <h4 style={{ textTransform: 'capitalize', fontSize: '1.2rem' }}>{user?.user_metadata.full_name}</h4>
                <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '600', color: 'gray' }}>
                    {userRole}
                </p>
            </div>

        </div>
    )
}

export default NavbarAdmin;