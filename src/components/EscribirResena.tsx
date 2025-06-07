import { useState } from 'react';
import styles from './css/EscribirResena.module.css';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './Footer/Modo_Nocturno';

interface Props {
    onSubmit: (resena: { calificacion: number; comentario: string }) => void;
    onCancel?: () => void;
    idMarcador: number;
}

export default function EscribirResena({ onSubmit, onCancel, idMarcador }: Props) {
    const [calificacion, setCalificacion] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState('');
    const { user } = useAuth()
    const navigate = useNavigate()
    const { modoNocturno } = useTheme();

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

        const partes: { [key: string]: string } = {};
        fechaChile.forEach(({ type, value }) => {
            partes[type] = value;
        });

        return `${partes.year}-${partes.month}-${partes.day}T${partes.hour}:${partes.minute}:${partes.second}`;
    };

    const handleSubmit = async () => {
        if (calificacion === 0 || comentario.trim() === '') return;
        onSubmit({ calificacion, comentario });
        setCalificacion(0);
        setComentario('');

        const Fechahorachile = obtenerFechaChile();

        const { data: nuevaReseña, error } = await supabase.from('resenas').insert({
            calificacion,
            comentario,
            fecha: Fechahorachile,
            id_usuario: user?.id,
            id_marcador: idMarcador,
        })
            .select()
            .single();

        if (error) {
            console.error("No se Puedieron Insertar los Datos", error)
        } else {
            await Registro_cambios(nuevaReseña.id);
            alert("¡Gracias por compartir tu reseña!");
        }
    };

    const fechaHoraActual = new Date().toISOString();

    const Registro_cambios = async (idReseña: number) => {
        const { error: errorLog } = await supabase
            .from('registro_logs')
            .insert([{
                id_usuario: user?.id,
                tipo_accion: 'Agregación de Reseña',
                detalle: `Se agregó una nueva Reseña con ID ${idReseña}`,
                fecha_hora: fechaHoraActual,
            }]);

        if (errorLog) {
            console.error('Error al registrar en los logs:', errorLog);
            return;
        }

    };

    return (
        <div className={`${styles.formContainer} ${modoNocturno ? styles.formContainerOscuro : ''}`}>
            {user !== undefined ? (
                <>
                    <h3 className={styles.titulo}>Comparte tu experiencia</h3>

                    <div className={styles.starsContainer}>
                        <div className={styles.stars} role="radiogroup" aria-label="Calificación">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setCalificacion(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className={`${styles.starButton} ${star <= (hover || calificacion) ? styles.starFilled : styles.starEmpty}`}
                                    aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                                    aria-pressed={calificacion === star}
                                >
                                    <FontAwesomeIcon icon={faStar} size='lg' />
                                </button>
                            ))}
                        </div>
                        <p className={styles.starLabel}>¿Cómo calificarías tu experiencia?</p>
                    </div>

                    <div className={styles.comentarioContainer}>
                        <label htmlFor="comentario" className={styles.comentarioLabel}>
                            Tu reseña
                        </label>
                        <textarea
                            id="comentario"
                            placeholder="Por favor, escribe tu reseña aquí."
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            className={styles.textArea}
                            aria-label="Escribe tu reseña"
                            rows={4}
                        />
                    </div>

                    <div className={styles.buttons}>
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className={styles.cancelButton}
                                aria-label="Cancelar reseña"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            onClick={handleSubmit}
                            className={styles.submitButton}
                            disabled={calificacion === 0 || comentario.trim() === ''}
                            aria-label="Publicar reseña"
                        >
                            Publicar
                        </button>
                    </div>
                </>
            ) : (
                <div className={styles.loginPrompt}>
                    <p>Inicia sesión para dejar una reseña</p>
                    <button
                        className={styles.loginButton}
                        onClick={() => navigate('/login')}
                        aria-label="Iniciar sesión con Google"
                    >
                        Continuar con Google
                    </button>
                </div>
            )}
        </div>
    );
}
