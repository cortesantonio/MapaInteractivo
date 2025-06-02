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
        <p>
          Completa los datos pendientes de tu perfil para continuar. <br />
          Queremos brindarte una mejor experiencia.</p>
        <div className={styles.ContenButton}>
          <button onClick={onCerrar}>Más tarde</button>
          <button className={styles.btnNavegacion} onClick={() => { navigate(`/usuarios/editar/${user.id}`) }}>Ir a Perfil</button>
        </div>
      </div>
    </div>
  );
};

export default ModalPerfilIncompleto;
