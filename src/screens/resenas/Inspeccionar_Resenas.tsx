import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../resenas/css/Inspeccionar_Resenas.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Resenas } from '../../interfaces/Resenas';

function Inspeccionar_Resenas() {
  const simbolo = ">";
  let Marcador_id = 6; 
  const [resenas, setResenas] = useState<Resenas[]>([]);
  useEffect(() => {
    const fetchResenas = async () => {
        const { data, error } = await supabase
          .from('resenas')
          .select(`id,id_marcador (id,nombre_recinto,direccion,tipo_recinto (id,tipo)),id_usuario (id,nombre),fecha,calificacion,comentario`).eq('id_marcador', Marcador_id); 
        if (error) {
          console.error("Error al obtener reseñas:", error);
        } else {
          setResenas(data as any);
          console.log("Reseñas obtenidas:", data);
        }
    };

    fetchResenas();
  }, []);


  return (
    <div className="container">
      <div  className="header">
        <div className='imagen'>
          <img src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9eZeqiYZh_N6HddUd7JMb6o7pqX4RRnEi7nILjYXDI7kkYSnjc_vaeigx7oH_ya-PravH6AY-cDaK_Whg_xln3BIzCQQYzWkoH6xltRO771yV22JQs9BVH0mIQMcRyRveNe0Sd=w426-h240-k-no" alt="" />
        </div>
        <div className="icono">
          <FontAwesomeIcon icon={faReply} />
        </div>
        <div className="titulo-locacion">
          <h2>{resenas[0]?.id_marcador.nombre_recinto || "Cargando..."}</h2>
        </div>
        <div className="info-locacion">
          <h4>{simbolo} { (resenas[0]?.id_marcador.tipo_recinto as any)?.tipo || "Cargando tipo..."}</h4>
        </div>
        <div className="text">
          <h2>{resenas[0]?.id_marcador.direccion || "Cargando..."}</h2>
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
              <h1>{r.id_usuario.nombre}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="trash-button">
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                
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
