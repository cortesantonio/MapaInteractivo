import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../resenas/css/Inspeccionar_Resenas.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Resenas } from '../../interfaces/Resenas';

function Inspeccionar_Resenas() {
  const simbolo = ">";
  const [resenas, setResenas] = useState<Resenas[]>([]);
  useEffect(() => {
    const fetchResenas = async () => {
        const { data, error } = await supabase
          .from('resenas')
          .select(`
            id,
            id_marcador (
            id,
            nombre_recinto,
            direccion
            ),
            id_usuario (
            id,
            nombre
            ),
            fecha,
            calificacion,
            comentario
          `)
          
  
        if (error) {
          console.error("Error al obtener reseñas:", error);
        } else {
          setResenas(data);
          console.log("Reseñas obtenidas:", data);
        }
      
    };

    fetchResenas();
  }, []);

  

  return (
    <div className="container">
      <div className="header">
        <div className="icono">
          <FontAwesomeIcon icon={faReply} />
        </div>
        <div className="titulo-locacion">
          <h1>{"Cargando..."}</h1>
        </div>
        <div className="info-locacion">
          <h4>{simbolo} Anfiteatro</h4>
        </div>
        <div className="text">
          <span>{ "Dirección no disponible"}</span>
        </div>
      </div>

      <div className="contenido-reseña">
        <div className="titulo-reseña">
          <h4>Reseñas</h4>
          <hr />
        </div>

        {resenas.map((r, index) => (
          <div className="bloque-reseña" key={index}>
            <div className="autor-reseña">
              <h1>{r.id_usuario.nombre}</h1>
              <div className="trash-button">
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>

            <div className="calificacion-fecha">
              <FontAwesomeIcon className="estrella" icon={faStar} />
              <span>{r.calificacion}</span>
              <span>{new Date(r.fecha).toLocaleDateString()}</span>
            </div>

            <div className="texto-reseña">
              <span>{r.comentario}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inspeccionar_Resenas;
