import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faTrash, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import styles from "../resenas/css/Inspeccionar_Resenas.module.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Resenas } from '../../interfaces/Resenas';
import { Marcador } from '../../interfaces/Marcador';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ImagenConFallback from '../../components/ImagenConFallback';
import { useAuth } from '../../hooks/useAuth';

function Inspeccionar_Resenas() {
  const { user } = useAuth();
  const { id } = useParams();
  const [marcador, setMarcador] = useState<Marcador | null>(null);
  const [resenas, setResenas] = useState<Resenas[]>([]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: marcadorData, error: marcadorError } = await supabase.from("marcador").select(`id,nombre_recinto,direccion,url_img,tipo_recinto (tipo)`).eq("id", id).single();
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

  const EliminarResena = async (idResena: number) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres borrar esta reseña?");
    if (!confirmacion) return;

    try {
      const { error } = await supabase
        .from("resenas")
        .delete()
        .eq("id", idResena);

      if (error) throw error;

      setResenas((prevResenas) => prevResenas.filter(r => r.id !== idResena));

      alert("Reseña eliminada con éxito");
      Registro_cambios(idResena);
    } catch (error) {
      console.error("Error al borrar la reseña:", error);
      alert("Hubo un error al eliminar la reseña");

    }
  };

  const fechaHoraActual = new Date().toISOString();
  const Registro_cambios = async (id: number) => {
    const { data: registro_logs, error: errorLog } = await supabase
      .from('registro_logs')
      .insert([
        {
          id_usuario: user?.id,
          tipo_accion: 'Eliminación de una Reseña',
          detalle: `Se eliminó una Reseña con ID ${id}`,
          fecha_hora: fechaHoraActual,
        }
      ]);

    if (errorLog) {
      console.error('Error al registrar en los logs:', errorLog);
      return;
    }

    console.log(' Registro insertado en registro_logs correctamente', registro_logs);
  };

  const renderResenas = () => {
    if (loading) return <p>Cargando reseñas...</p>;
    if (resenas.length === 0) return <p>No hay Reseñas aún</p>;

    return resenas.map((r, index) => (
      <div className={styles.bloque_reseña} key={index}>
        <div className={styles.autor_reseña}>
          <h1>{r.id_usuario?.nombre} <button style={{ background: 'none', border: 'none' }}
            onClick={() => { navigate(`/usuario/perfil/${r.id_usuario.id}`) }}> <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></button> </h1>
          <div className={styles.trash_button}>
            <button style={{ border: "none", color: "red", backgroundColor: "transparent", width: "100%", height: "100%" }} onClick={() => EliminarResena(r.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
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
          <ImagenConFallback
            src={marcador?.url_img}
            alt="Imagen del recinto"
            className={styles.imagenMarcador}
          />
        </div>
        <button className={styles.botonatras} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faReply} />
        </button>
        <div className={styles.Titulo} >
          <h2>Reseña del marcador</h2>
        </div>
        <div className={styles.locacionTitulo}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <h4>
              {marcador?.nombre_recinto || "Cargando..."}</h4>
          </div>
          <p>{'>'} {(marcador?.tipo_recinto as any)?.tipo || "Cargando tipo..."}</p>
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