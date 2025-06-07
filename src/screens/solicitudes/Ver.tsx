import styles from './css/Ver.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faTriangleExclamation, faArrowUpRightFromSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Solicitudes } from '../../interfaces/Solicitudes';
import { supabase } from '../../services/supabase';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { useEffect } from 'react';
import { Usuarios } from '../../interfaces/Usuarios';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { Accesibilidad_Solicitud } from '../../interfaces/Accesibilidad_Solicitud';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APIProvider, Map as VisMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { sendEmail } from "../../utils/sendEmail";
import { Marcador } from '../../interfaces/Marcador';

function contentEmail(nombre: string, estado: string, solicitudId: string) {
    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
            body { font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; }
            .container { background: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; }
            .header { color: #007bff; font-size: 20px; margin-bottom: 20px; }
            .content { font-size: 16px; color: #333; }
            .footer { font-size: 12px; color: #999; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">Tu solicitud fue actualizada a: ${estado}</div>
            <div class="content">
                Hola ${nombre},<br/><br/>
                Tu solicitud con ID <strong>${solicitudId}</strong> ha cambiado de estado.<br/>
                Estado actual: <strong>${estado}</strong><br/><br/>

                

                ¡Gracias por tu paciencia!<br/>
                El equipo de mapainteractivo.site
            </div>
            <div class="footer">
                Este mensaje fue enviado automáticamente. Por favor, no respondas.
            </div>
            </div>
        </body>
        </html>
  `;
    return html;
}


interface AccesibilidadesPorTipo {
    [tipo: string]: Accesibilidad[];
}

type SolicitudCompleta = Solicitudes & {
    id_usuario: Usuarios;
    tipo_recinto: Tipo_Recinto;
    accesibilidades: Accesibilidad[]; // solo si lo traes anidado
    id_supervisor: Usuarios;
};


export default function Ver() {
    const navigate = useNavigate()
    const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;
    const { id } = useParams()
    const { user, userRole } = useAuth()
    const [solicitud, setSolicitud] = useState<Partial<SolicitudCompleta>>({});
    const [accesibilidades, setAccesibilidades] = useState<AccesibilidadesPorTipo>({});
    const [isActiveModal, setIsActiveModal] = useState(false)
    const [respuestaRechazo, setRespuestaRechazo] = useState('');
    const [accesibilidadesRaw, setAccesibilidadesRaw] = useState([]);
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [correoDestinario, setCorreoDestinario] = useState<string>('')
    const [infoMarcador, setinfoMarcador] = useState<Partial<Marcador>>()

    function handleModal() {
        setIsActiveModal(!isActiveModal)
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data: solicitudData, error: solicitudError } = await supabase
                .from('solicitudes')
                .select(`
                    *,
                    id_usuario:usuarios!solicitudes_id_usuario_fkey(*),
                    id_supervisor:usuarios!solicitudes_supervisor_fkey(*),
                    tipo_recinto(*),
                    accesibilidad_solicitud (
                    id_accesibilidad:accesibilidad(*)
                    )
                `)
                .eq('id', id)
                .single();


            if (solicitudError) {
                console.error('Error cargando la solicitud:', solicitudError);
                return;
            }
            setCorreoDestinario(solicitudData.id_usuario.correo)
            setSolicitud(solicitudData);

            const accesibilidadesRawData = solicitudData.accesibilidad_solicitud.map((item: Accesibilidad_Solicitud) => item.id_accesibilidad);
            setAccesibilidadesRaw(accesibilidadesRawData);
            const agrupadas: AccesibilidadesPorTipo = {};

            accesibilidadesRawData.forEach((acc: Accesibilidad) => {
                if (!agrupadas[acc.tipo]) agrupadas[acc.tipo] = [];
                agrupadas[acc.tipo].push(acc);
            });

            setAccesibilidades(agrupadas);

            if (solicitudData?.latitud && solicitudData?.longitud) {
                setPosition({
                    lat: solicitudData.latitud,
                    lng: solicitudData.longitud,
                });
            }

            if (solicitudData?.estado == 'aprobada') {
                const { data: marcadorData, error: marcadorError } = await supabase
                    .from('marcador')
                    .select('*')
                    .eq('id_solicitud', id)
                    .single();

                if (marcadorError) {
                    console.error('Error cargando el marcador:', marcadorError);
                    return;
                }
                setinfoMarcador(marcadorData)
            }

        };

        fetchData();
    }, [id]);
    function colorState(estado: string) {
        switch (estado) {
            case 'pendiente':
                return 'orange';
            case 'aprobada':
                return 'green';
            case 'rechazada':
                return 'red';
            default:
                return 'gray';
        }
    }

    const handleAprobar = async () => {
        const { data: newMarcador, error: errorMarcador } = await supabase
            .from('marcador')
            .insert({
                id_solicitud: id,
                id_usuario: solicitud.id_usuario?.id, // este seria el dueño del marcador.
                activo: true,
                tipo_recinto: solicitud.tipo_recinto?.id,
                nombre_recinto: solicitud.nombre_locacion,
                direccion: solicitud.direccion,
                pagina_web: "sin especificar",
                telefono: "sin especificar",
                latitud: solicitud.latitud,
                longitud: solicitud.longitud,
            })
            .select()
            .single();

        if (errorMarcador) {
            console.error('Error al crear el marcador:', errorMarcador.message, errorMarcador.details);
            alert(`Error al crear el marcador: ${errorMarcador.message}`);
            return;
        }

        if (!newMarcador) {
            console.error('No se pudo crear el marcador: sin datos devueltos');
            alert('No se pudo crear el marcador: sin datos devueltos');
            return;
        }

        for (const acc of accesibilidadesRaw) {
            const { error: errorAccesibilidad } = await supabase
                .from('accesibilidad_marcador')
                .insert({
                    id_marcador: newMarcador.id,
                    id_accesibilidad: acc['id'],
                });

            if (errorAccesibilidad) {
                alert(`Error al registrar accesibilidad: ${errorAccesibilidad.message}`);
                return;
            }
        }

        const { error } = await supabase
            .from('solicitudes')
            .update({
                estado: 'aprobada',
                fecha_revision: new Date(),
                id_supervisor: user?.id
            })
            .eq('id', id);

        if (error) {
            console.error('Error al aprobar la solicitud:', error);
            return;
        }

        alert('Solicitud aprobada exitosamente');

        const fechaHoraActual = new Date().toISOString();

        const Registro_cambios = async () => {
            const { error: errorLog } = await supabase
                .from('registro_logs')
                .insert([
                    {
                        id_usuario: user?.id,
                        tipo_accion: 'Aceptación de una Solicitud',
                        detalle: `Se ha aceptado una Solicitud con ID ${id}`,
                        fecha_hora: fechaHoraActual,
                    }
                ]);

            if (errorLog) {
                console.error('Error al registrar en los logs:', errorLog);
                return;
            }

        };
        Registro_cambios();


        sendEmail(correoDestinario,
            "Solicitud aprobada",
            contentEmail(solicitud.id_usuario?.nombre || '', 'Aprobada', id as string))
            .then(res => res)
            .catch(err => console.error("Error", err))

        navigate(-1)

    };

    const handleRechazar = async () => {
        const { error } = await supabase
            .from('solicitudes')
            .update({
                estado: 'rechazada', respuesta_rechazo: respuestaRechazo, fecha_revision: new Date(),
                id_supervisor: user?.id
            })
            .eq('id', id);

        if (error) {
            console.error('Error al rechazar la solicitud:', error);
            return;
        }

        alert('Solicitud rechazada exitosamente');
        navigate(-1)

        const fechaHoraActual = new Date().toISOString();

        sendEmail(correoDestinario,
            "Solicitud rechazada",
            contentEmail(solicitud.id_usuario?.nombre || '', 'Rechazada', id as string))
            .then(res => res)
            .catch(err => console.error("Error", err))


        const Registro_cambios = async () => {
            const { error: errorLog } = await supabase
                .from('registro_logs')
                .insert([
                    {
                        id_usuario: user?.id,
                        tipo_accion: 'Rechazo de una solicitud',
                        detalle: `Se ha rechazado una Solicitud con ID ${id}`,
                        fecha_hora: fechaHoraActual,
                    }
                ]);

            if (errorLog) {
                console.error('Error al registrar en los logs:', errorLog);
                return;
            }

        };
        Registro_cambios();
    };


    return (
        <div className={styles.container}>

            <div className={styles.titulo} >
                <button onClick={() => { navigate(-1) }} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2>
                    Solicitud
                </h2>
            </div>


            <div className={styles.infoContainer}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Información</h2>
                        <span style={{ color: colorState(solicitud.estado as string), fontWeight: 500, fontSize: '0.8rem', textTransform: 'capitalize' }}>• {solicitud.estado}</span>

                    </div>

                    {solicitud.estado == 'rechazada' && (
                        <div style={{ position: 'relative', backgroundColor: 'rgba(255, 32, 32, 0.69)', borderRadius: '5px', padding: 10, paddingBottom: 20, marginBottom: '10px', color: 'white', boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.53)' }}>
                            <div style={{ position: 'absolute', right: 5, top: 5 }}><FontAwesomeIcon icon={faTriangleExclamation} size='xl' /></div>
                            <h4>Respuesta de rechazo</h4>
                            <p>{solicitud.respuesta_rechazo} </p>
                            <h4>Supervisor </h4>
                            <p>{solicitud.id_supervisor?.nombre + ' '} <button style={{ color: 'white', background: 'transparent', border: 'none' }} onClick={() => { navigate(`/usuario/perfil/${solicitud.id_supervisor?.id}`) }}><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></button></p>
                            <h4>Fecha de revisión</h4>
                            <p>{new Date(solicitud.fecha_revision as Date).toLocaleString()}</p>
                        </div>
                    )}
                    {solicitud.estado == 'aprobada' && (
                        <div style={{
                            position: 'relative', backgroundColor: 'rgba(0, 122, 0, 0.58)', borderRadius: '5px', padding: 10,
                            paddingBottom: 20, marginBottom: '10px', color: 'white', boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.53)'
                        }}>
                            <div style={{ position: 'absolute', right: 5, top: 5 }}><FontAwesomeIcon icon={faCheck} size='xl' /></div>
                            <h4 style={{ fontWeight: 400, fontSize: '1.2rem' }}>Solicitud aprobada</h4>
                            <h4>Supervisor </h4>
                            <p>{solicitud.id_supervisor?.nombre + ' '} <button style={{ color: 'white', background: 'transparent', border: 'none' }}
                                onClick={() => { navigate(`/usuario/perfil/${solicitud.id_supervisor?.id}`) }}><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></button></p>
                            <h4>Fecha de revisión</h4>
                            <p>{new Date(solicitud.fecha_revision as Date).toLocaleString()}</p>
                            {infoMarcador && (
                                <button className={styles.btnVerMarcado} onClick={() => { navigate(`/panel-administrativo/marcadores/informacion/${infoMarcador.id}`) }}>Revisa tu marcador</button>
                            )}


                        </div>)}
                    <hr style={{ opacity: '50%' }} />
                    <h4>Identificador de solicitud</h4>
                    <p>{solicitud?.id}</p>
                    <h4>Fecha de ingreso</h4>

                    {solicitud.fecha_ingreso && (
                        <p>{new Date(solicitud.fecha_ingreso).toLocaleDateString()}</p>
                    )}
                    <h4>Hora ingreso</h4>
                    {solicitud.fecha_ingreso && (
                        <p>{new Date(solicitud.fecha_ingreso).toTimeString()}</p>
                    )}

                    <h4>Nombre representante</h4>
                    <p style={{ textTransform: 'capitalize' }}>{solicitud.id_usuario?.nombre}</p>
                    <h4>Correo representante</h4>
                    <p>{solicitud.id_usuario?.correo}</p>

                    <h4>Número de contacto representante</h4>
                    <p>(+56 9) {solicitud.id_usuario?.telefono}</p>

                    <h4>Nombre locación</h4>
                    <p style={{ textTransform: 'capitalize' }}>{solicitud.nombre_locacion}</p>

                    <h4>Descripción/Comentario de solicitud</h4>
                    <p>{solicitud.descripcion != '' ? solicitud.descripcion : <span style={{ color: 'gray' }}>No especificado</span>}</p>

                    <h4>Dirección</h4>
                    <p>{solicitud.direccion != '' ? solicitud.direccion : <span style={{ color: 'gray' }}>No especificado</span>}</p>

                    <div style={{ paddingTop: "10px", border: "1px solid rgba(0, 0, 0, 0.2)", borderRadius: '5px', padding: '10px', marginTop: '10px' }}>
                        <APIProvider apiKey={apiKey}>
                            <VisMap
                                mapId="bf51a910020fa25a"
                                center={position}
                                defaultZoom={16}
                                disableDefaultUI={true}
                                zoomControl={true}
                                gestureHandling="greedy"
                                keyboardShortcuts={false}
                                style={{ width: '100%', height: '200px' }}
                            >
                                <AdvancedMarker position={position} />
                            </VisMap>
                        </APIProvider>
                    </div>

                    <h4>Tipo de recinto</h4>
                    <p>{solicitud.tipo_recinto?.tipo}</p>

                    <h4>Cumple con <span style={{ fontWeight: 500, textDecoration: 'underline', cursor: 'help' }} title='ley de inclusion laboral'>LEY 21015</span>:</h4>
                    <p>{solicitud.cumple_ley_21015 ? '✅SI' : '❌NO'}</p>

                    <h4>Accesibilidades seleccionadas</h4>
                    {Object.entries(accesibilidades).length > 0 ? (
                        Object.entries(accesibilidades).map(([tipo, lista]) => (
                            <div key={tipo}>
                                <h5 style={{ marginTop: 10, fontWeight: 400 }}>{tipo}</h5>
                                <ul>
                                    {lista.map(acc => <li key={acc.id}>{acc.nombre}</li>)}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'gray' }}>No hay accesibilidades seleccionadas.</p>
                    )}
                    <h4>Documentación</h4>
                    {solicitud.documentacion != '' ? (
                        <a href={solicitud.documentacion} target="_blank" rel="noopener noreferrer" style={{ color: 'black', paddingLeft: '25px', textDecoration: 'underline' }}>
                            Ver documentación <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </a>
                    ) : (
                        <p style={{ color: 'gray' }}>Sin archivos adjuntos.</p>
                    )}
                </div>
                {userRole == 'gestor' || userRole == 'administrador' && solicitud.estado == 'pendiente' &&
                    <div className={styles.acciones}>
                        <button onClick={handleModal} style={{ color: 'red', background: 'transparent', }}>Rechazar solicitud</button>
                        <button onClick={handleAprobar}>Aceptar solicitud</button>
                    </div>
                }



            </div>

            {isActiveModal &&
                <div className={styles.contenerdorModal}>
                    <div className={styles.modal}>
                        <h3>Motivo de rechazo</h3>
                        <textarea placeholder='Escribe aqui...' onChange={(e) => setRespuestaRechazo(e.target.value)}></textarea>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className={styles.btnModal} onClick={handleModal} style={{ color: 'red', background: 'transparent' }} type='button'> Cancelar</button>
                            <button className={styles.btnModal} onClick={handleRechazar} type='submit'> Rechazar solicitud</button>

                        </div>

                    </div>
                </div>

            }

        </div>
    );
}
