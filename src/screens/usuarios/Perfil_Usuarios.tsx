import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faUser,faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "../usuarios/css/Perfil_Usuario.module.css";
import { supabase } from "../../services/supabase";
import { useEffect, useState } from "react";
import { Usuarios } from "../../interfaces/Usuarios";
import { Resenas } from "../../interfaces/Resenas";
import { useNavigate, useParams } from "react-router-dom";



function Perfil_Usuario() {
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [resenas, setResenas] = useState<Resenas[]>([]);
  
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams()
  

  useEffect(() => {
    const fetchData = async () => {
      const { data: usuariosData, error } = await supabase.from('usuarios').select('*').eq('id', id);
      const { data: resenasData, error: resenasError } = await supabase.from('resenas').select(`id,id_usuario (id,nombre),fecha,calificacion,comentario,id_marcador (id,nombre_recinto,tipo_recinto)`).eq('id_usuario', id);
  
      if (resenasError) throw resenasError;
      setResenas(resenasData as any || []);
      console.log ("datos reseñas",resenasData)
     
      if (error) {
        console.error('Error al obtener datos:', error);
      } else {
        setUsuarios(usuariosData || []);
        console.log('Datos de usuarios obtenidos:', usuariosData);
      }
    };

    fetchData();
  }, [id]);


  const contenido_resenas_usuarios = () => {
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
            <div className={styles.nombre_usuario}>
                {usuarios.length > 0 && (<h2 style={{marginBottom:"15px",fontSize:"1.5rem",paddingBottom:"5px",fontWeight:"400"}}>{usuarios[0].nombre}</h2>)}
            </div>
        <div className= {styles.perfil_info}>
            <div className={styles.reseñas_usuario}>
              <button onClick={() => setMostrarContenido(false)}>Perfil Usuario</button>
            </div>
            
            {resenas.length > 0 ? (
              resenas.map((resenas) => (
                <div className={styles.informacion_campos_de_resena} key={resenas.id}>
                  <div>
                    <label>Nombre:</label>
                  </div>
                  <div className={styles.campo}>
                    <p className={styles.valor}>{resenas.id_usuario?.nombre}</p>
                  </div>

                  <div>
                    <label>Nombre Recinto:</label>
                  </div>

                  <div className={styles.campo}>
                    <p className={styles.valor}>{resenas.id_marcador?.nombre_recinto}</p>
                  </div>  

                  <div>
                    <label>Comentario:</label>
                  </div>

                  <div className={styles.texto_reseña}>
                    <span>{resenas.comentario}</span>
                  </div>

                  <div style={{marginBottom:"10px"}}>
                    <label>Calificación:</label>
                  </div>
                  
                  <div className={styles.calificacion_fecha_reseña}>
                    <FontAwesomeIcon className={styles.estrella} icon={faStar} />
                    <span>{resenas.calificacion}</span>
                    <span>{new Date(resenas.fecha).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.sin_resenas}>
                <p>Este usuario aún no ha realizado reseñas.</p>
                <hr />
              </div>
            )}
        </div>  
      </div>
    </div>
    );
  };

  return (
    <>
      {mostrarContenido ? (
        contenido_resenas_usuarios()
      ) : (
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
            
            <div className={styles.nombre_usuario}>
                {usuarios.length > 0 && (<h2 style={{marginBottom:"15px",fontSize:"1.5rem",paddingBottom:"5px",fontWeight:"400"}}>{usuarios[0].nombre}</h2>)}
            </div>
            
  
            <div className={styles.perfil_info}>
              <div className={styles.reseñas_usuario}>
                <button onClick={() => setMostrarContenido(true)}>Reseñas usuario</button>
              </div>
  
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
  
            <div className= {styles.contenedor_botones_perfil}>
                <button className={styles.boton_editar} onClick={() => navigate(`/usuarios/editar/${id}`)}>Editar Usuario</button>
                <button className={styles.boton_desactivar}>Desactivar Usuario</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Perfil_Usuario;