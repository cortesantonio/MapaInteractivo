import { useNavigate } from 'react-router-dom'
import styles from './css/NotFound.module.css'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página no encontrada</h2>
        <p className={styles.message}>Lo sentimos, la página que buscas no existe.</p>
        <button 
          className={styles.button}
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default NotFound 