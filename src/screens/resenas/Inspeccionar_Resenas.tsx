import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../resenas/css/Inspeccionar_Resenas.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

function Inspeccionar_Resenas() {
  const simbolo = ">";
  const usarDatosSimulados = true;
  let IdMarcador = 1;

  const datosSimulados = [
    {
      id: 1,
      comentario: "El Teatro Provincial de Curico es, sin duda, una joya cultural que brilla en la ciudad.",
      fecha: "2025-04-14",
      calificacion: 5,
      usuarios: {
        id: 1,
        nombre: "Elvis Cofre",
        correo: "elvis@example.com"
      },
      marcador: {
        id: 1,
        nombre_recinto: "Teatro Provincial de Curico",
        direccion: "Carmen 556-560, 3341768 Curicó, Maule"
      }
    },
    {
      id: 2,
      comentario: "Hermosa experiencia, todo muy limpio y bien organizado.",
      fecha: "2025-04-13",
      calificacion: 4,
      usuarios: {
        id: 2,
        nombre: "Josefina Herrera",
        correo: "josefina@example.com"
      },
      marcador: {
        id: 1,
        nombre_recinto: "Teatro Provincial de Curico",
        direccion: "Carmen 556-560, 3341768 Curicó, Maule"
      }
    }
  ];

  const [resenas, setResenas] = useState<any[]>([]);

  useEffect(() => {
    const fetchResenas = async () => {
      if (usarDatosSimulados) {
        setResenas(datosSimulados);
      } else {
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
              direccion
            )
          `)
          .eq('id_marcador', IdMarcador);
  
        if (error) {
          console.error("Error al obtener reseñas:", error);
        } else {
          setResenas(data);
        }
      }
    };

    fetchResenas();
  }, []);

  const marcador = resenas[0]?.marcador;

  return (
    <div className="container">
      <div className="header">
        <div className="icono">
          <FontAwesomeIcon icon={faReply} />
        </div>
        <div className="titulo-locacion">
          <h1>{marcador?.nombre_recinto || "Cargando..."}</h1>
        </div>
        <div className="info-locacion">
          <h4>{simbolo} Anfiteatro</h4>
        </div>
        <div className="text">
          <span>{marcador?.direccion || "Dirección no disponible"}</span>
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
              <h1>{r.usuarios?.nombre}</h1>
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
