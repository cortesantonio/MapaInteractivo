import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from "../resenas/css/Inspeccionar_Resenas.module.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Resenas } from '../../interfaces/Resenas';
import { useParams } from 'react-router-dom';

function Inspeccionar_Resenas() {
  const { id } = useParams() // aqui se recibe la id del marcador que se esta consultando
  const [resenas, setResenas] = useState<Resenas[]>([]);

  useEffect(() => {
    const fetchResenas = async () => {
      const { data, error } = await supabase
        .from('resenas')
        .select(`id,id_marcador (id,nombre_recinto,direccion,tipo_recinto (id,tipo)),id_usuario (id,nombre),fecha,calificacion,comentario`).eq('id_marcador', id);
      if (error) {
        console.error("Error al obtener reseñas:", error);
      } else {
        setResenas(data as any);
        console.log("Reseñas obtenidas:", data);
      }
    };

    fetchResenas();
  }, [id]);


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.imagen}>
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9eZeqiYZh_N6HddUd7JMb6o7pqX4RRnEi7nILjYXDI7kkYSnjc_vaeigx7oH_ya-PravH6AY-cDaK_Whg_xln3BIzCQQYzWkoH6xltRO771yV22JQs9BVH0mIQMcRyRveNe0Sd=w426-h240-k-no"
            alt=""

          />
        </div>

        <div className={styles.icono}>
          <FontAwesomeIcon icon={faReply} />
        </div>

        <div className={styles.titulo_locacion}>
          <h2>{resenas[0]?.id_marcador.nombre_recinto || "Cargando..."}</h2>
        </div>

        <div className={styles.info_locacion}>
          <h4>{'>'} {(resenas[0]?.id_marcador.tipo_recinto as any)?.tipo || "Cargando tipo..."}</h4>
        </div>

        <div className={styles.text}>
          <h2>{resenas[0]?.id_marcador.direccion || "Cargando..."}</h2>
        </div>
      </div>

      <div className={styles.inspeccionar_reseñas}>
        <div className={styles.contenido_reseña}>
          <div className={styles.titulo_reseña}>
            <h4 style={{ paddingLeft: '0' }}>Reseñas</h4>
            <hr />
          </div>

          {resenas.map((r, index) => (
            <div className={styles.bloque_reseña} key={index}>
              <div className={styles.autor_reseña}>
                <h1>{r.id_usuario.nombre}</h1>
                <div >
                  <div className={styles.trash_button}>
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                </div>
              </div>

              <div className={styles.calificacion_fecha}>
                <FontAwesomeIcon className={styles.estrella} icon={faStar} />
                <span>{r.calificacion}</span>
                <span>{new Date(r.fecha).toLocaleDateString()}</span>
              </div>

              <div className={styles.texto_reseña}>
                <span>{r.comentario}</span>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>

  );
}

export default Inspeccionar_Resenas;
