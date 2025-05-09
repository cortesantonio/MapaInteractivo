import styles from './css/InfoDetallada.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Marcador } from '../../interfaces/Marcador';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface TipoDeAccesibilidades {
    [tipo: string]: Accesibilidad[];
}

export default function InfoDetallada() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [accesibilidades, setAccesibilidades] = useState<TipoDeAccesibilidades>({});
    const [nombreTipoRecinto, setNombreTipoRecinto] = useState('');
    const [dataMarcador, setDataMarcador] = useState<Partial<Marcador>>({
        nombre_recinto: '',
        tipo_recinto: '',
        direccion: '',
        pagina_web: '',
        telefono: '',
        id_usuario: undefined,
        id_solicitud: undefined,
        url_img: '',
        latitud: undefined,
        longitud: undefined,
        activo: true,
    });
    const [selecciones, setSelecciones] = useState<number[]>([]);
    const [supervisor, setSupervisor] = useState({
        id: undefined,
        nombre: ''
    });

    useEffect(() => { // LLAMADO A LA API PARA OBTNER TODOAS LAS ACCESIBILIDADES QUE HAY EN LA BASE DE DATOS Y LA CLASIFICA POR TIPO
        const fetchAccesibilidades = async () => {
            const { data, error } = await supabase.from('accesibilidad').select('*');
            if (error) console.error('Error al obtener accesibilidades:', error);
            else {
                const agrupadas: TipoDeAccesibilidades = {};
                data.forEach((acc: Accesibilidad) => {
                    if (!agrupadas[acc.tipo]) agrupadas[acc.tipo] = [];
                    agrupadas[acc.tipo].push(acc);
                });
                setAccesibilidades(agrupadas);
            }
        };

        fetchAccesibilidades();
    }, []);

    useEffect(() => {
        const fetchMarcador = async () => {
            const { data, error } = await supabase
                .from('marcador')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error al obtener el marcador:', error);
            } else {
                setDataMarcador(data);

                const { data: relaciones, error: errorRelaciones } = await supabase
                    .from('accesibilidad_marcador')
                    .select('id_accesibilidad')
                    .eq('id_marcador', id);

                if (errorRelaciones) {
                    console.error('Error al obtener relaciones de accesibilidad:', errorRelaciones);
                } else {
                    const ids = relaciones.map((r) => r.id_accesibilidad);
                    setSelecciones(ids);
                }
            }
        };

        if (id) {
            fetchMarcador();
        }
    }, [id]);

    useEffect(() => {
        const fetchNombreUsuario = async () => {
            if (!dataMarcador.id_usuario) return;

            const { data, error } = await supabase
                .from('usuarios')
                .select('id, nombre')
                .eq('id', dataMarcador.id_usuario)
                .single();

            if (error) {
                console.error('Error al obtener el nombre del usuario:', error);
            } else {
                setSupervisor(data);
            }
        };

        fetchNombreUsuario();
    }, [dataMarcador.id_usuario]);

    useEffect(() => {
        const fetchTipoRecinto = async () => {
            if (!dataMarcador.tipo_recinto) return;

            const { data, error } = await supabase
                .from('tipo_recinto')
                .select('tipo')
                .eq('id', dataMarcador.tipo_recinto)
                .single();

            if (error) {
                console.error('Error al obtener el tipo de recinto:', error);
            } else {
                setNombreTipoRecinto(data.tipo);
            }
        };

        fetchTipoRecinto();
    }, [dataMarcador.tipo_recinto]);


    const toggleActivo = async () => {
        if (!id) return;

        const nuevoEstado = !dataMarcador.activo;

        const { error } = await supabase
            .from('marcador')
            .update({ activo: nuevoEstado })
            .eq('id', id);

        if (error) {
            console.error('Error al cambiar el estado de activo:', error);
        } else {
            setDataMarcador(prev => ({ ...prev, activo: nuevoEstado }));
            alert(`Marcador ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
        }
    };




    return (
        <div className={styles.container}>


            <div className={styles.header}>
                <img
                    src={dataMarcador?.url_img}
                    alt="Imagen del recinto"
                    className={styles.imagenMarcador}
                />
                <button style={{ zIndex: 10 }} className={styles.VolverAtras} onClick={() => { navigate(-1) }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <div className={styles.Titulo} >
                    <h2>Informacion Detallada</h2>
                </div>
                <div className={styles.locacionTitulo}>
                    <h4>{dataMarcador.nombre_recinto}</h4>
                    <p>{nombreTipoRecinto}</p>


                </div>
            </div>

            <div className={styles.Conten}>
                <div className={styles.FormContainer}>
                    <div className={styles.formGrid}>
                        {/*Primer Grupo*/}
                        <div className={styles.formSection} >
                            <label htmlFor="">¿Está activo? {dataMarcador.activo ? (<p>Si</p>) : (<p>No</p>)}</label>
                            <label className={styles.labelSeccion} >Solicitud</label>
                            {dataMarcador.id_solicitud == null ? (
                                <p>No se ingresó registro.</p>
                            ) : (
                                <p>{dataMarcador.id_solicitud}
                                    <button className={styles.btnLink} >
                                        <FontAwesomeIcon onClick={() => { navigate(`/panel-administrativo/solicitud/${supervisor.id}`) }} size="sm" icon={faArrowUpRightFromSquare} />

                                    </button>
                                </p>
                            )}

                            <label className={styles.labelSeccion} >Supervisor</label>
                            {supervisor.id === undefined ? (
                                <p>No se ingresó registro.</p>
                            ) : (
                                <p>{supervisor.nombre}
                                    <button className={styles.btnLink} >
                                        <FontAwesomeIcon onClick={() => { navigate(`/usuario/perfil/${supervisor.id}`) }} size="sm" icon={faArrowUpRightFromSquare} />

                                    </button>
                                </p>
                            )}


                            <label className={styles.labelSeccion} >Nombre Locacion</label>
                            <p>{dataMarcador.nombre_recinto}</p>
                            <label className={styles.labelSeccion}>Tipo de Recinto</label>
                            <p>{nombreTipoRecinto}</p>
                            <label className={styles.labelSeccion} htmlFor="">Direccion</label>
                            <p>{dataMarcador.direccion}</p>
                            <label className={styles.labelSeccion} htmlFor="">Pagina Web</label>
                            <p>{dataMarcador.pagina_web}</p>
                            <label className={styles.labelSeccion} htmlFor="">Telefono</label>
                            <div className={styles.ContainerinputTelefono}>
                                <p className={styles.codTelfono}>+569</p>
                                <p>{dataMarcador.telefono}</p>
                            </div>
                            <label className={styles.labelSeccion}>Latitud</label>
                            <p>{dataMarcador.latitud}</p>
                            <label className={styles.labelSeccion}>Longitud</label>
                            <p>{dataMarcador.longitud}</p>


                        </div>

                        {/*Segundo Grupo*/}
                        <div className={styles.gridContainer}>
                            {Object.entries(accesibilidades).map(([tipo, lista]) => {
                                const seleccionadas = lista.filter(acc => selecciones.includes(acc.id));
                                if (seleccionadas.length === 0) return null;

                                return (
                                    <div key={tipo} className={styles.accesibilidadGrupo}>
                                        <p><strong>{`Accesibilidad ${tipo}`}</strong></p>
                                        {seleccionadas.map(acc => (
                                            <div className={styles.opt} key={acc.id}>
                                                <input
                                                    type="checkbox"
                                                    value={acc.id}
                                                    checked={true}
                                                    disabled={true} // <--- Esto evita que se pueda editar
                                                    id={acc.nombre}
                                                />
                                                <label htmlFor={acc.nombre}>{acc.nombre}</label>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}

                        </div>

                    </div>

                    <div className={styles.acciones}>

                        <button
                            type="button"
                            onClick={toggleActivo}
                            style={{ color: dataMarcador.activo ? 'red' : 'green', backgroundColor: 'transparent' }}
                        >
                            {dataMarcador.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button type="submit" onClick={() => { navigate(`/panel-administrativo/marcadores/editar/${dataMarcador.id}`) }}>Editar</button>
                    </div>
                </div>
            </div>



        </div>
    )

}