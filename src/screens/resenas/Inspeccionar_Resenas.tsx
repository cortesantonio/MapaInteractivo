import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from "../resenas/css/Inspeccionar_Resenas.module.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Resenas } from '../../interfaces/Resenas';
import { Marcador } from '../../interfaces/Marcador';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Inspeccionar_Resenas() {
  const { id } = useParams();
  const [marcador, setMarcador] = useState<Marcador | null>(null);
  const [resenas, setResenas] = useState<Resenas[]>([]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: marcadorData, error: marcadorError } = await supabase.from("marcador").select(`id,nombre_recinto,direccion,tipo_recinto (tipo)`).eq("id", id).single();
        if (marcadorError) throw marcadorError;
        setMarcador(marcadorData as any);
        const { data: resenasData, error: resenasError } = await supabase.from("resenas").select(`id,id_usuario (id,nombre),fecha,calificacion,comentario`).eq("id_marcador", id);
        if (resenasError) throw resenasError;
        setResenas(resenasData as any || []);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const renderResenas = () => {
  if (loading) return <p>Cargando reseñas...</p>;
  if (resenas.length === 0) return <p>No hay Reseñas aún</p>;

    return resenas.map((r, index) => (
      <div className={styles.bloque_reseña} key={index}>
        <div className={styles.autor_reseña}>
          <h1>{r.id_usuario?.nombre}</h1>
          <div className={styles.trash_button}>
            <FontAwesomeIcon icon={faTrash} />
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
    ));
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.imagen}>
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9eZeqiYZh_N6HddUd7JMb6o7pqX4RRnEi7nILjYXDI7kkYSnjc_vaeigx7oH_ya-PravH6AY-cDaK_Whg_xln3BIzCQQYzWkoH6xltRO771yV22JQs9BVH0mIQMcRyRveNe0Sd=w426-h240-k-no"
            alt=""
          />
        </div>
        <div>
          <button className={styles.botonatras} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faReply} />
          </button>

        </div>
        <div className={styles.titulo_locacion}>
          <h2>{marcador?.nombre_recinto || "Cargando..."}</h2>
        </div>
        <div className={styles.info_locacion}>
          <h4>{'>'} {(marcador?.tipo_recinto as any)?.tipo || "Cargando tipo..."}</h4>
        </div>
        <div className={styles.text}>
          <h2>{marcador?.direccion || "Cargando..."}</h2>
        </div>
      </div>
      <div className={styles.inspeccionar_reseñas}>
        <div className={styles.contenido_reseña}>
          <div className={styles.titulo_reseña}>
            <h4 style={{ paddingLeft: '0' }}>Reseñas</h4>
            <hr />
          </div>
          {renderResenas()}
        </div>
      </div>
    </div>
  );
}

export default Inspeccionar_Resenas;