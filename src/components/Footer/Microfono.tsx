import styles from "./css/Microfono.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "./Modo_Nocturno";
import { useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { supabase } from '../../services/supabase';
import { useFontSize } from "./Modificador_Letras";


export default function Microfono({
    closePanel,
    panelActivo,
    activarReconocimiento,
    onSeleccionMarcador
}: {
    closePanel: () => void;
    panelActivo: string;
    activarReconocimiento: boolean;
    onSeleccionMarcador: (id: number) => void;
}) {

    const {modoNocturno} = useTheme ();
    const {fontSize} = useFontSize ();
    const [mensajePermisos, setMensajePermisos] = useState("");
    const [mostrarEscuchando, setMostrarEscuchando] = useState(false);
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [mensaje, setMensaje] = useState("Te Escucho ¿Cual es el nombre del lugar que quieres ir?");
    const contenedorRef = useRef<HTMLDivElement>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        return () => {
            SpeechRecognition.stopListening();

            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }

            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    useEffect(() => {
        const verificarPermisosMicrofono = async () => {
            try {
                const permiso = await navigator.permissions.query({ name: 'microphone' as PermissionName });

                if (permiso.state === 'denied') {
                    setMensajePermisos("No es posible acceder al micrófono. Los permisos fueron denegados.");
                } else if (permiso.state === 'prompt') {
                    setMensajePermisos("Activa los permisos del micrófono para utilizar esta función.");
                } else {
                    setMensajePermisos(""); 
                }

                permiso.onchange = () => {
                    if (permiso.state === 'denied') {
                        setMensajePermisos("No es posible acceder al micrófono. Los permisos fueron denegados.");
                    } else if (permiso.state === 'prompt') {
                        setMensajePermisos("Activa los permisos del micrófono para utilizar esta función.");
                    } else {
                        setMensajePermisos("");
                    }
                };
            } catch (error) {
                console.warn("No se pudo verificar el permiso del micrófono:", error);
            }
        };

        verificarPermisosMicrofono();
    }, []);

    useEffect(() => {
        const iniciarReconocimiento = async () => {
            try {

                SpeechRecognition.startListening({ continuous: true });

                setTimeout(() => {
                    setMostrarEscuchando(true);
                }, 2000);

            } catch (err) {
                console.error('Error al acceder al micrófono:', err);
            }
        };

        if (activarReconocimiento) {
            resetTranscript();
            iniciarReconocimiento();
        } else {
            SpeechRecognition.stopListening();

            setMostrarEscuchando(false);
            if (mediaRecorder) mediaRecorder.stop();
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
                setMediaRecorder(null);
            }
        }
    }, [activarReconocimiento]);

    useEffect(() => {
        if (!transcript) return;

        const handler = setTimeout(() => {
            // Elimina punto final si existe
            const textoSinPuntoFinal = transcript.trim().replace(/\.$/, "");
            buscarMarcadorPorTexto(textoSinPuntoFinal);
            resetTranscript();
        }, 2000);

        return () => clearTimeout(handler);
    }, [transcript]);

    useEffect(() => {
        if (!mostrarEscuchando) return;

        const timeout = setTimeout(() => {
            const nuevosIntentos = intentosFallidos + 1;
            setIntentosFallidos(nuevosIntentos);
            setMostrarEscuchando(false);

            if (nuevosIntentos >= 2) {
                setMensaje("Parece que no tengo resultados con ese nombre. ¿Quieres intentarlo otra vez?");
            } else {
                setMensaje("Lo siento, no logré entender lo que dijiste. ¿Podrías intentarlo otra vez?");
                setTimeout(() => {
                    setMostrarEscuchando(true);
                }, 2000);
            }
        }, 8000);

        return () => clearTimeout(timeout);
    }, [mostrarEscuchando]);

    const buscarMarcadorPorTexto = async (texto: string) => {
        const { data, error } = await supabase
            .from("marcador")
            .select("id, nombre_recinto")
            .eq("activo", true);

        if (error) {
            console.error("Error al buscar en Supabase:", error);
            return;
        }

        if (!data) return;

        const textoMin = texto.toLowerCase().trim();
        const coincidencia = data.find((marcador) =>
            marcador.nombre_recinto?.toLowerCase().includes(textoMin)
        );
        

        if (coincidencia) {
            setIntentosFallidos(0);
            setMostrarEscuchando(false);

            onSeleccionMarcador(coincidencia.id);
            closePanel();
        } else {
            const nuevosIntentos = intentosFallidos + 1;
            setIntentosFallidos(nuevosIntentos);
            setMostrarEscuchando(false);

            if (nuevosIntentos >= 2) {
                setMensaje("Parece que no tengo resultados con ese nombre. ¿Quieres intentarlo otra vez?");

            } else {
                setMensaje("Lo siento, no logré entender lo que dijiste. ¿Podrías intentarlo otra vez?");
                setTimeout(() => {
                    setMostrarEscuchando(true);
                }, 2000);
            }
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <p>Tu navegador no soporta reconocimiento de voz.</p>;
    }

    return (
        <div>
            {panelActivo === "microphone" && ( //Vista de la funcion que realiza el Microphone
                <div className={styles.PanelActivo} style={{ fontSize: `${fontSize}rem` }}>
                    {panelActivo !== null && (
                        <button
                            onClick={closePanel} className={styles.ButtonClose}>
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>
                    )}

                    {mensajePermisos && (
                        <h3 style={{ color: "red" }} className={styles.Titulo}>
                            {mensajePermisos}
                        </h3>
                    )}

                    {!mensajePermisos && (
                        <>
                            <h3 style={{ color: modoNocturno ? "#fff" : "" }} className={styles.Titulo}>
                                {mensaje}
                            </h3>
                            <div ref={contenedorRef} className={styles.MicroActive}>
                                {(intentosFallidos >= 2) ? (
                                    <button
                                        className={styles.BotonReintentar}
                                        onClick={() => {
                                            setIntentosFallidos(0);
                                            setMensaje("Te escucho ¿Cuál es el nombre del lugar que quieres ir?");
                                            setMostrarEscuchando(false);
                                            resetTranscript();
                                            setTimeout(() => {
                                                setMostrarEscuchando(true);
                                            }, 2000);
                                        }}
                                    >
                                        Volver a Intentarlo
                                    </button>
                                ) : (
                                    <>
                                        {mostrarEscuchando && (
                                            <p className={styles.EscuchandoTexto}>Escuchando...</p>
                                        )}
                                    </>
                                )}
                            </div>

                        </>

                    )}

                </div>
            )}
        </div>
    )
}