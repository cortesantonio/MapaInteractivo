import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import "../usuarios/css/Inspeccionar_Reseñas.css"
import { useState } from 'react'
import { Usuarios } from "../../interfaces/Usuario";
import { Marcador } from '../../interfaces/Marcador';

interface Resena {
  comentario: string;
  fecha: string;
}

function Inspeccionar_Reseña() {
  const simbolo = ">";

  const [usuario] = useState<Usuarios[]>([
    {
      id: 1, nombre: "Elvis Cofre", correo: "Elvis@gmail.com", genero: "Masculino", edad: 22, telefono: 12345678, contraseña: "12345", rol: "Usuario", activo: true
    },
    {
      id: 2, nombre: "Josefina Jofre", correo: "Josefina@gmail.com", genero: "Femenino", edad: 25, telefono: 12345678, contraseña: "12345", rol: "Usuario", activo: true
    },
    {
      id: 3, nombre: "Jose Alvarez", correo: "Jose@gmail.com", genero: "Masculino", edad: 20, telefono: 12345678, contraseña: "12345", rol: "Usuario", activo: true
    }
  ]);

  const [marcador] = useState<Marcador[]>([
    {
      id: 1,
      nombre: "Teatro Provincial de Curico", tipo: "", calificacion_comunidad: 5, calificacion_google: 5, direccion: "Carmen 556-560, 3341768 Curicó, Maule.", pag_web: "", telefono: "",
    }
  ]);

  const [resena] = useState<Resena[]>([
    {
      comentario: "El Teatro Provincial de Curico es, sin duda, una joya cultural que brilla en la ciudad.",
      fecha: "16/02/2025",
    },
    {
      comentario: "Muy buena atención y excelente ubicación.",
      fecha: "17/02/2025",
    },
    {
      comentario: "Fui con mi familia y lo pasamos genial.",
      fecha: "18/02/2025",
    }
  ]);

  return (
    <div className="container">
      <div className="header">
        <div className="icono">
          <FontAwesomeIcon icon={faReply} />
        </div>
        <div className="titulo-locacion">
          <h1>{marcador[0].nombre}</h1>
        </div>
        <div className="info-locacion">
          <h4>{simbolo} Anfiteatro</h4>
        </div>
        <div className="text">
          <span>{marcador[0].direccion}</span>
        </div>
      </div>

      <div className="contenido-reseña">
        <div className="titulo-reseña">
          <h4>Reseñas</h4>
          <hr />
        </div>

        {resena.map((r, index) => (
          <div className="bloque-reseña" key={index}>
            <div className="autor-reseña">
              <h1>{usuario[index]?.nombre || "Usuario desconocido"}</h1>
              <div className="trash-button">
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>

            <div className="calificacion-fecha">
              <FontAwesomeIcon className="estrella" icon={faStar} />
              <span>5</span>
              <span>{r.fecha}</span>
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

export default Inspeccionar_Reseña;
