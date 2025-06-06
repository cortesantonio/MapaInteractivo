import styles from "../components/css/ModalPerfil.module.css"
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type ModalProps = {
  onCerrar: () => void;
};

const ModalPerfilIncompleto = ({ onCerrar }: ModalProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null
  return (
    <div className={styles.ModalContainer}>
      <div className={styles.ContenInfo}>
        <h2>¡Completa tu perfil!</h2>
        <p>
          Para brindarte la mejor experiencia posible, necesitamos que completes los datos pendientes de tu perfil.
          Esto nos ayudará a personalizar tu experiencia y mostrarte contenido relevante.
        </p>
        <div className={styles.ContenButton}>
          <button onClick={onCerrar}>Más tarde</button>
          <button className={styles.btnNavegacion} onClick={() => { navigate(`/usuarios/editar/${user.id}`) }}>
            Completar perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPerfilIncompleto;
