import styles from './Ver.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Solicitudes } from '../../interfaces/Solicitudes';
import { supabase } from '../../services/supabase';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { useEffect } from 'react';
import { Usuarios } from '../../interfaces/Usuarios';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { Accesibilidad_Solicitud } from '../../interfaces/Accesibilidad_Solicitud';
import { useNavigate, useParams } from 'react-router-dom';

interface AccesibilidadesPorTipo {
    [tipo: string]: Accesibilidad[];
}

type SolicitudCompleta = Solicitudes & {
    id_usuario: Usuarios;
    tipo_recinto: Tipo_Recinto;
    accesibilidades: Accesibilidad[]; // solo si lo traes anidado
};


export default function Ver() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [solicitud, setSolicitud] = useState<Partial<SolicitudCompleta>>({});
    const [accesibilidades, setAccesibilidades] = useState<AccesibilidadesPorTipo>({});
    const [isActiveModal, setIsActiveModal] = useState(false)
    const [respuestaRechazo, setRespuestaRechazo] = useState('');

    function handleModal() {
        setIsActiveModal(!isActiveModal)
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data: solicitudData, error: solicitudError } = await supabase
                .from('solicitudes')
                .select(`
                    *,
                    id_usuario:usuarios(*),
                    tipo_recinto(*),
                    accesibilidad_solicitud (
                        id_accesibilidad:accesibilidad(*)
                    )
                `)
                .eq('id', id) // Reemplaza por ID dinámico si hace falta
                .single();

            if (solicitudError) {
                console.error('Error cargando la solicitud:', solicitudError);
                return;
            }

            setSolicitud(solicitudData);


            const accesibilidadesRaw = solicitudData.accesibilidad_solicitud.map((item: Accesibilidad_Solicitud) => item.id_accesibilidad);
            const agrupadas: AccesibilidadesPorTipo = {};

            accesibilidadesRaw.forEach((acc: Accesibilidad) => {
                if (!agrupadas[acc.tipo]) agrupadas[acc.tipo] = [];
                agrupadas[acc.tipo].push(acc);
            });

            setAccesibilidades(agrupadas);

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
        const { error } = await supabase
            .from('solicitudes')
            .update({ estado: 'aprobada' })
            .eq('id', id);

        if (error) {
            console.error('Error al aprobar la solicitud:', error);
            return;
        }

        alert('Solicitud aprobada exitosamente');
        // Opcional: volver a cargar los datos o navegar a otra vista
    };

    const handleRechazar = async () => {
        const { error } = await supabase
            .from('solicitudes')
            .update({ estado: 'rechazada', respuesta_rechazo: respuestaRechazo, fecha_revision: new Date() })
            .eq('id', id);

        if (error) {
            console.error('Error al rechazar la solicitud:', error);
            return;
        }

        alert('Solicitud rechazada exitosamente');
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
                        <h2>Informacion</h2>
                        <span style={{ color: colorState(solicitud.estado as string), fontWeight: 500, fontSize: '0.8rem', textTransform: 'uppercase' }}>• {solicitud.estado}</span>
                    </div>

                    {solicitud.estado == 'rechazada' && (
                        <div style={{ position: 'relative', backgroundColor: 'rgba(255, 32, 32, 0.69)', borderRadius: '5px', padding: 10, paddingBottom: 20, marginBottom: '10px', color: 'white', boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.53)' }}>
                            <div style={{ position: 'absolute', right: 5, top: 5 }}><FontAwesomeIcon icon={faTriangleExclamation} size='xl' /></div>
                            <h4>Respuesta de rechazo</h4>
                            <p>{solicitud.respuesta_rechazo} </p>
                            <h4>Supervisor</h4>
                            <p>Nombre, falta agregar la relacion</p>
                            <h4>Fecha de revision</h4>
                            <p>{new Date(solicitud.fecha_revision as Date).toLocaleString()}</p>
                        </div>
                    )}
                    <hr style={{ opacity: '50%' }} />
                    <h4>ID Solicitud</h4>
                    <p>{solicitud?.id}</p>
                    <h4>Fecha ingreso</h4>
                    {solicitud.fecha_ingreso && (
                        <p>{new Date(solicitud.fecha_ingreso).toLocaleDateString()}</p>
                    )}
                    <h4>Hora ingreso</h4>
                    {solicitud.fecha_ingreso && (
                        <p>{new Date(solicitud.fecha_ingreso).toTimeString()}</p>
                    )}

                    <h4>Nombre representante</h4>
                    <p style={{ textTransform: 'uppercase' }}>{solicitud.id_usuario?.nombre}</p>
                    <h4>Correo representante</h4>
                    <p style={{ textTransform: 'uppercase' }}>{solicitud.id_usuario?.correo}</p>

                    <h4>Numero de contacto representante</h4>
                    <p>(+56 9) {solicitud.id_usuario?.telefono}</p>

                    <h4>Nombre Locacion</h4>
                    <p>{solicitud.nombre_locacion}</p>

                    <h4>Descripcion/Comentario de solicitud</h4>
                    <p>{solicitud.descripcion != '' ? solicitud.descripcion : <span style={{ color: 'gray' }}>No especificado</span>}</p>

                    <h4>Direccion</h4>
                    <p>{solicitud.direccion != '' ? solicitud.direccion : <span style={{ color: 'gray' }}>No especificado</span>}</p>

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
                    <h4>Documentacion</h4>
                    <p style={{ color: 'gray' }}>Sin archivos adjuntos.</p>
                </div>

                {solicitud.estado == 'pendiente' &&
                    <div className={styles.acciones}>
                        <button onClick={handleModal} style={{ color: 'red', background: 'transparent', }}>Rechazar Solicitud</button>
                        <button onClick={handleAprobar}>Aceptar Solicitud</button>
                    </div>
                }



            </div>

            {isActiveModal &&
                <div className={styles.contenerdorModal}>
                    <div className={styles.modal}>
                        <h3>Motivo de rechazo</h3>
                        <textarea placeholder='Escribe aqui...' onChange={(e) => setRespuestaRechazo(e.target.value)}></textarea>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className={styles.btnModal} onClick={handleModal} style={{ color: 'red', background: 'transparent' }} type='button'> CANCELAR</button>
                            <button className={styles.btnModal} onClick={handleRechazar} type='submit'> RECHAZAR SOLICITUD</button>

                        </div>

                    </div>
                </div>

            }

        </div>
    );
}
