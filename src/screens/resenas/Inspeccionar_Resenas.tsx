import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../resenas/css/Inspeccionar_Resenas.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

function Inspeccionar_Resenas() {
  const simbolo = ">";
  const marcadorId = 1; // Cambia esto si necesitas un marcador diferente
  const [resenas, setResenas] = useState<any[]>([]);

  useEffect(() => {
    const fetchResenas = async () => {
      const { data, error } = await supabase
        .from('resenas')
        .select(`
          id,
          comentario,
          fecha,
          calificacion,
          usuarios (
            id,
            nombre,
            correo
          ),
          marcador (
            id,
            nombre_recinto,
            direccion,
            tipo_recinto (
              tipo
            )
          )
        `)
        .eq('id_marcador', marcadorId);

      if (error) {
        console.error("Error al obtener reseñas:", error);
      } else {
        setResenas(data || []);
      }
    };

    fetchResenas();
  }, []);

  const marcador = resenas[0]?.marcador;

  return (
    <div className="container">
      <div className="header">
        <div className='imagen'>
          <img src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9eZeqiYZh_N6HddUd7JMb6o7pqX4RRnEi7nILjYXDI7kkYSnjc_vaeigx7oH_ya-PravH6AY-cDaK_Whg_xln3BIzCQQYzWkoH6xltRO771yV22JQs9BVH0mIQMcRyRveNe0Sd=w426-h240-k-no" alt="" />
        </div>
        <div className="icono">
          <FontAwesomeIcon icon={faReply} />
        </div>
        <div className="titulo-locacion">
          <h1>{marcador?.nombre_recinto || "Cargando..."}</h1>
        </div>
        <div className="info-locacion">
          <h4>{simbolo} {marcador?.tipo_recinto?.tipo || "Cargando tipo..."}</h4>
        </div>
        <div className="text">
          <span>{marcador?.direccion || "Dirección no disponible"}</span>
        </div>
      </div>

      <div className="contenido-reseña">
        <div className="titulo-reseña">
          <h4 style={{ paddingLeft: '0' }}>Reseñas</h4>
          <hr />
        </div>

        {resenas.map((r, index) => (
          <div className="bloque-reseña" key={index}>
            <div className="autor-reseña">
              <h1>{r.usuarios?.nombre || "Anónimo"}</h1>
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

