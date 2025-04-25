import { useState } from 'react';
import styles from './css/EscribirResena.module.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../services/supabase';




interface Props {
    onSubmit: (resena: { calificacion: number; comentario: string }) => void;
    onCancel?: () => void;
    idMarcador: number;
}

export default function EscribirResena({ onSubmit, onCancel, idMarcador }: Props) {
    const [calificacion, setCalificacion] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState('');

    const obtenerFechaChile = () => {
        const ahora = new Date();
      
        const fechaChile = new Intl.DateTimeFormat('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'America/Santiago'
        }).formatToParts(ahora);
      
        // Convertir partes a un formato tipo ISO local sin zona horaria
        const partes: { [key: string]: string } = {};
        fechaChile.forEach(({ type, value }) => {
          partes[type] = value;
        });
      
        const fechaFinal = `${partes.year}-${partes.month}-${partes.day}T${partes.hour}:${partes.minute}:${partes.second}`;
        return fechaFinal;
      };
    

    const handleSubmit = async () => {
        if (calificacion === 0 || comentario.trim() === '') return;
        onSubmit({ calificacion, comentario });
        setCalificacion(0);
        setComentario('');

        const Fechahorachile = obtenerFechaChile();

        const { data, error } = await supabase.from('resenas').insert({
            calificacion,
            comentario,
            fecha: Fechahorachile, // Fecha actual
            id_usuario: 1, 
            id_marcador: idMarcador,
          });

          if (error){
            console.error("No se Puedieron Insertar los Datos",error)
          }

          else {
            console.log ("Datos Enviados con Exito",data)
          }
    };
    return (
        <div className={styles.formContainer}>
            <h3>Comparte tu experiencia.</h3>

            <div className={styles.stars}>
                <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            onClick={() => setCalificacion(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className={star <= (hover || calificacion) ? styles.starFilled : styles.starEmpty}
                        />
                    ))}
                </div>

                <p style={{ fontSize: '0.9rem', color: 'gray', }}>¿Cómo calificarías tu experiencia?</p>
            </div>

            <textarea
                placeholder="Por favor, escribe tu reseña aquí."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className={styles.textArea}
            />

            <div className={styles.buttons}>
                {onCancel && <button onClick={onCancel} style={{ backgroundColor: "white", color: "#af0000", fontWeight: 300, width: '40%', border: '1px solid #af0000' }}>Cancelar</button>}
                <button onClick={handleSubmit} style={{ background: "linear-gradient(45deg, #ff0000, #ff6100)", color: "white", fontWeight: "bold", width: '40%' }}>Publicar</button>
            </div>
        </div>
    );
}
