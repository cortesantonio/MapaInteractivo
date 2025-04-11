import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import "../usuarios/css/Inspeccionar_Reseñas.css"

function Inspeccionar_Reseña() {
    const simbolo = ">";
    const reseña = {
        nombre_locacion: "Teatro Provincial De Curico",
        Reseña_Usuario: "El Teatro Provincial de Curico es, sin duda, una joya cultural que brilla en la ciudad. Desde el momento en que se cruza la entrada, se percibe un ambiente acogedor y elegante que prepara al espectador para una experiencia inolvidable.",
        ubicacion: "Carmen 556-560, 3341768 Curicó, Maule.",
        fecha: "16/02/2025",
        titulo: "Reseña",
        nombre: "Elvis Cofre",
        nombre2: "Jose Arenas",
        nombre3: "Josefina Vasquez",
        nombre4: "Alfredo Romero"
    }

    return (
        <div className="container">
        <div className="header">
            <div className="icono">
                <FontAwesomeIcon icon={faReply} />
            </div>
            <div className="titulo-locacion">
                <h1>{reseña.nombre_locacion}</h1>
            </div>
            <div className="info-locacion">
                <h4>{simbolo} Anfiteatro</h4>
            </div>
            <div className="text">
                <span>{reseña.ubicacion}</span>
            </div>
        </div>
    
        <div className="contenido-reseña">
            <div className="titulo-reseña">
                <h4>{reseña.titulo}</h4>
                <hr />
            </div>

            <div className="bloque-reseña">
                <div className="autor-reseña">
                    <h1>{reseña.nombre}</h1>
                    <div className="trash-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                </div>
    
                <div className="calificacion-fecha">
                    <FontAwesomeIcon className="estrella" icon={faStar} />
                    <span>5</span>
                    <span>{reseña.fecha}</span>
                </div>
    
                <div className="texto-reseña">
                    <span>{reseña.Reseña_Usuario}</span>
                </div>
            </div>
    
            
            <div className="bloque-reseña">
                <div className="autor-reseña">
                    <h1>{reseña.nombre2}</h1>
                    <div className="trash-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                </div>
    
                <div className="calificacion-fecha">
                    <FontAwesomeIcon className="estrella" icon={faStar} />
                    <span>5</span>
                    <span>{reseña.fecha}</span>
                </div>
    
                <div className="texto-reseña">
                    <span>{reseña.Reseña_Usuario}</span>
                </div>
            </div>
    
            
            <div className="bloque-reseña">
                <div className="autor-reseña">
                    <h1>{reseña.nombre3}</h1>
                    <div className="trash-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                </div>
    
                <div className="calificacion-fecha">
                    <FontAwesomeIcon className="estrella" icon={faStar} />
                    <span>5</span>
                    <span>{reseña.fecha}</span>
                </div>
    
                <div className="texto-reseña">
                    <span>{reseña.Reseña_Usuario}</span>
                </div>
            </div>

            <div className="bloque-reseña">
                <div className="autor-reseña">
                    <h1>{reseña.nombre4}</h1>
                    <div className="trash-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                </div>
    
                <div className="calificacion-fecha">
                    <FontAwesomeIcon className="estrella" icon={faStar} />
                    <span>5</span>
                    <span>{reseña.fecha}</span>
                </div>
    
                <div className="texto-reseña">
                    <span>{reseña.Reseña_Usuario}</span>
                </div>
            </div>


            
        </div>
    </div>
    
    )
}

export default Inspeccionar_Reseña;
