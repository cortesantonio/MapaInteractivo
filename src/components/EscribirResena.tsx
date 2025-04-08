import { useState } from 'react';
import styles from './EscribirResena.module.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    onSubmit: (resena: { calificacion: number; comentario: string }) => void;
    onCancel?: () => void;
}

export default function EscribirResena({ onSubmit, onCancel }: Props) {
    const [calificacion, setCalificacion] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState('');

    const handleSubmit = () => {
        if (calificacion === 0 || comentario.trim() === '') return;
        onSubmit({ calificacion, comentario });
        setCalificacion(0);
        setComentario('');
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
