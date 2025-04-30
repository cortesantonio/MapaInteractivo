import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "../usuarios/css/Perfil_Usuario.module.css";
import { supabase } from "../../services/supabase";
import { useEffect, useState } from "react";
import { Usuarios } from "../../interfaces/Usuarios";
import { useNavigate, useParams } from "react-router-dom";

function Perfil_Usuario() {
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const navigate = useNavigate();
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const { data: usuariosData, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id);

      if (error) {
        console.error('Error al obtener datos:', error);
      } else {
        setUsuarios(usuariosData || []);
        console.log('Datos de usuarios obtenidos:', usuariosData);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <div>
        <button className={styles.botonatras} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faReply} />
        </button>

      </div>

      <div className={styles.container}>
        <h2 className={styles.titulo}>Usuario</h2>

        <div className={styles.perfil_icono}>
          <FontAwesomeIcon className={styles.icono_usuario} icon={faUser} />
        </div>

        <div className={styles.perfil_info}>
          {usuarios.map((usuario) => (
            <div className={styles.informacion_campos} key={usuario.id}>
              <div className={styles.campo}>
                <span className={styles.label}>Nombre:</span>
                <p className={styles.valor}>{usuario.nombre}</p>
                <hr />
              </div>

              <div className={styles.campo}>
                <span className={styles.label}>Correo:</span>
                <p className={styles.valor}>{usuario.correo}</p>
                <hr />
              </div>

              <div className={styles.campo}>
                <span className={styles.label}>Rol:</span>
                <p className={styles.valor}>{usuario.rol}</p>
                <hr />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.btn_editar}>
          <button onClick={()=>{navigate(`/usuarios/editar/${id}`)}}>Editar Usuario</button>
        </div>
      </div>
    </div>
  );
}

export default Perfil_Usuario;
