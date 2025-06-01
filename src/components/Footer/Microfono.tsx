import styles from "./css/Microfono.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "./Modo_Nocturno";
import { useEffect, useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { supabase } from '../../services/supabase';
import { useFontSize } from "./Modificador_Letras";
import { useAuth } from '../../hooks/useAuth';


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
    const { user } = useAuth();
    const {modoNocturno} = useTheme ();
    const {fontSize} = useFontSize ();
    const [mensajePermisos, setMensajePermisos] = useState("");
    const [mostrarEscuchando, setMostrarEscuchando] = useState(false);
    const [intentosFallidos, setIntentosFallidos] = useState(0);
    const [mensaje, setMensaje] = useState("Te Escucho ¿Cual es el nombre del lugar que quieres ir?");
    const contenedorRef = useRef<HTMLDivElement>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [modoSeleccion, setModoSeleccion] = useState(false);
    const [estadoPermisoMicrofono, setEstadoPermisoMicrofono] = useState<string>("");


    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();


    useEffect(() => {
        const verificarPermisosMicrofono = async () => {
            try {
                const permiso = await navigator.permissions.query({ name: 'microphone' as PermissionName });

                const actualizarMensaje = () => {
                    setEstadoPermisoMicrofono(permiso.state);
                    if (permiso.state === 'denied') {
                        setMensajePermisos(
                            "No se puede acceder al micrófono porque los permisos fueron denegados.\n" +
                            "Ve a la configuración del navegador > Privacidad y seguridad > Permisos > Micrófono y habilítalos."
                        );
                    } else if (permiso.state === 'prompt') {
                        setMensajePermisos(
                            "Activa los permisos del micrófono para usar esta función.\n" +
                            "Cuando se te solicite, haz clic en 'Permitir'."
                        );
                    } else {
                        setMensajePermisos("");
                    }
                };

                actualizarMensaje();

                permiso.onchange = actualizarMensaje;
            } catch (error) {
                console.warn("No se pudo verificar el permiso del micrófono:", error);
            }
        };

        verificarPermisosMicrofono();
    }, []);


    const solicitarPermisoMicrofono = async () => {
        if (!browserSupportsSpeechRecognition){
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(stream); 
            setEstadoPermisoMicrofono('granted');
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error("Error al solicitar permiso del micrófono:", error);

        }
    };


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
    
    const SeleccionBusqueda = async (idMarcador: number) => {
        const id_usuario = user?.id;

        if (!id_usuario) {
            return;
        }

        const fechaHoraChile = obtenerFechaChile();

        const { error: insertError } = await supabase.from('busquedas').insert({
            id_usuario,
            id_marcador: idMarcador,
            fecha_hora: fechaHoraChile,
        });

        if (insertError) {
            console.error("Error al registrar la búsqueda:", insertError);
        }
    };

    useEffect(() => {
        const iniciarReconocimiento = async () => {
            try {
                if (estadoPermisoMicrofono !== 'granted') {
                    await solicitarPermisoMicrofono();
                    return;
                }

                resetTranscript();
                await SpeechRecognition.startListening({ continuous: true });
                setTimeout(() => setMostrarEscuchando(true), 2000);
            } catch (error) {
                console.error('Error al iniciar reconocimiento:', error);
                setMostrarEscuchando(false);
            }
        };

        if (activarReconocimiento) {
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
    }, [activarReconocimiento, estadoPermisoMicrofono]);

    useEffect(() => {
        if (!transcript) return;

        const handler = setTimeout(() => {
            const textoSinPuntoFinal = transcript.trim().replace(/\.$/, "");
            buscarMarcadorPorTexto(textoSinPuntoFinal);
            resetTranscript();
        }, 2000);

        return () => clearTimeout(handler);
    }, [transcript]);

    useEffect(() => {
        if (!mostrarEscuchando || modoSeleccion) return;

        const timeout = setTimeout(() => {
            const nuevosIntentos = intentosFallidos + 1;
            setIntentosFallidos(nuevosIntentos);
            setMostrarEscuchando(false);

            if (nuevosIntentos >= 2) {
                setMensaje("Parece que no tengo resultados con ese nombre. ¿Quieres intentarlo otra vez?");
                SpeechRecognition.stopListening();
            } else {
                setMensaje("Lo siento, no logré entender lo que dijiste. ¿Podrías intentarlo otra vez?");
                setTimeout(() => {
                    setMostrarEscuchando(true);
                }, 2000);
            }
        }, 8000);

        return () => clearTimeout(timeout);
    }, [mostrarEscuchando, modoSeleccion]);

    const [coincidenciasEncontradas, setCoincidenciasEncontradas] = useState<{ id: number; nombre_recinto: string }[] | null>(null);

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

        const palabrasTexto = textoMin.split(/\s+/); 

        const coincidencias = data.filter((marcador: { nombre_recinto: string; id: number }) => {
            const nombreMin = marcador.nombre_recinto?.toLowerCase().trim() || "";
            const palabrasNombre = nombreMin.split(/\s+/); 
            return palabrasTexto.some(palabraTexto =>
                palabrasNombre.includes(palabraTexto)
            );
        });

        if (coincidencias.length === 1) {
            setIntentosFallidos(0);
            setMostrarEscuchando(false);
            onSeleccionMarcador(coincidencias[0].id);
            SeleccionBusqueda(coincidencias[0].id);
            closePanel();
        } else if (coincidencias.length === 2) {
            setCoincidenciasEncontradas(coincidencias);
            setModoSeleccion(true);
            setMostrarEscuchando(false);
            setMensaje(
                `Se encontraron 2 lugares:\n1) ${coincidencias[0].nombre_recinto}\n2) ${coincidencias[1].nombre_recinto}\n\nPor favor, di el número de la opción que quieres.`
            );

            setTimeout(() => {
                SpeechRecognition.startListening({ continuous: true });
            }, 1500);

            setTimeout(() => {
                setMostrarEscuchando(true);
            }, 2000);

            setTimeout(() => {
                setMensaje("No se detectó una opción válida. ¿Quieres intentarlo otra vez?");
                setCoincidenciasEncontradas(null);
                setModoSeleccion(false);
                setMostrarEscuchando(false);
                SpeechRecognition.stopListening();
                setIntentosFallidos((prev) => prev + 3);
            }, 10000);

        } else if (coincidencias.length >= 3) {
            setCoincidenciasEncontradas(null);
            setMostrarEscuchando(false);
            SpeechRecognition.stopListening();
            resetTranscript();
            setMensaje(
                "Se encontraron muchos resultados. Por favor, di algo más específico."
            );

            setTimeout(() => {
                SpeechRecognition.startListening({ continuous: true });
            }, 1500);

            setTimeout(() => {
                setMostrarEscuchando(true);
            }, 2000);

            setTimeout(() => {
                setMensaje("No se detectó una opción válida. ¿Quieres intentarlo otra vez?");
                setCoincidenciasEncontradas(null);
                setModoSeleccion(false);
                setMostrarEscuchando(false);
                SpeechRecognition.stopListening();
            }, 10000);
        } else {
            const nuevosIntentos = intentosFallidos + 1;
            setIntentosFallidos(nuevosIntentos);
            setMostrarEscuchando(false);

            if (nuevosIntentos >= 2) {
                SpeechRecognition.stopListening();
                setMensaje("Parece que no tengo resultados con ese nombre. ¿Quieres intentarlo otra vez?");
            } else {
                setMensaje("Lo siento, no logré entender lo que dijiste. ¿Podrías intentarlo otra vez?");
                resetTranscript();
                SpeechRecognition.stopListening();
                setTimeout(() => {
                    SpeechRecognition.startListening({ continuous: true });
                }, 1500);
                
                setTimeout(() => {
                    setMostrarEscuchando(true);
                }, 2000);
            }
        }
    };

    useEffect(() => {
        if (coincidenciasEncontradas && transcript) {
            const opcionTexto = transcript.trim().toLowerCase();

            let opcion: number | null = null;
            if (opcionTexto === "1" || opcionTexto === "uno") {
                opcion = 1;
            } else if (opcionTexto === "2" || opcionTexto === "dos") {
                opcion = 2;
            }

            if (opcion === 1 || opcion === 2) {
                const index = opcion - 1;
                if (coincidenciasEncontradas[index]) {
                    onSeleccionMarcador(coincidenciasEncontradas[index].id);
                    SeleccionBusqueda(coincidenciasEncontradas[index].id); 
                    closePanel();
                    setCoincidenciasEncontradas(null);
                    SpeechRecognition.stopListening();
                    setModoSeleccion(false);
                    
                }
            } else {
                setMensaje("Por favor, di '1', o '2' para seleccionar la opción.");
                SpeechRecognition.stopListening();
                resetTranscript();
                setMostrarEscuchando(false);

                setTimeout(() => {
                    SpeechRecognition.startListening({ continuous: true });
                }, 1500);

                setTimeout(() => {
                    setMostrarEscuchando(true);
                }, 2000);

            }
        }
    }, [transcript, coincidenciasEncontradas]);

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className={styles.microfonoIncompatible}>
                <div className={styles.icono}>
                    <FontAwesomeIcon icon={faMicrophoneSlash} />
                </div>
                <p>
                    El reconocimiento de voz no está disponible en tu navegador.<br />
                    Prueba con Google Chrome u otro navegador compatible.
                </p>
            </div>
        );
    }


    return (
        <div>
            {panelActivo === "microphone" && (
                <div className={styles.PanelActivo} style={{ fontSize: `${fontSize}rem` }}>
                    {panelActivo !== null && (
                        <button
                            onClick={closePanel} className={styles.ButtonClose}>
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>
                    )}

                    {mensajePermisos && (
                        <h3 style={{ color: "red", whiteSpace: "pre-line"  }} className={styles.Titulo}>
                            {mensajePermisos}
                        </h3>
                    )}

                    {!mensajePermisos && (
                        <>
                            <h3 style={{ color: modoNocturno ? "#fff" : "", whiteSpace: "pre-line" }} className={styles.Titulo}>
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
                                                SpeechRecognition.startListening({ continuous: true });
                                            }, 1500);

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