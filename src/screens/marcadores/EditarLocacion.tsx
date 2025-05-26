import styles from './css/EditarLocacion.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from 'react';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Marcador } from '../../interfaces/Marcador';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { supabase } from '../../services/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { APIProvider, Map as VisMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import ImagenConFallback from '../../components/ImagenConFallback';
import { useAuth } from '../../hooks/useAuth';

interface TipoDeAccesibilidades {
    [tipo: string]: Accesibilidad[];
}

const LIBRARIES: ("places")[] = ['places'];

export default function EditarLocacion() {
    const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;
    const navigate = useNavigate()
    const { user, userRole } = useAuth();
    const { id } = useParams();
    const [accesibilidades, setAccesibilidades] = useState<TipoDeAccesibilidades>({});
    const estadoInicialMarcadores: Partial<Marcador> = {
        nombre_recinto: '',
        tipo_recinto: '',
        direccion: '',
        pagina_web: '',
        telefono: '',
        url_img: '',
        latitud: undefined,
        longitud: undefined,
        activo: true,
        accesibilidad_certificada: false,
        info_adicional: '',

    };
    const [dataMarcador, setDataMarcador] = useState<Partial<Marcador>>(estadoInicialMarcadores);
    const [selecciones, setSelecciones] = useState<number[]>([]);
    const [tipoRecinto, setTipoRecinto] = useState<Tipo_Recinto[]>([]);
    const [marcadorPropio, setMarcadorPropio] = useState(false);


    useEffect(() => { //Busca todos los tipo de recintos registradas en la base de datos
        const fetchTipos = async () => {
            const { data, error } = await supabase
                .from('tipo_recinto')
                .select('*');

            if (error) {
                console.error('Error al obtener tipos de recinto:', error);
            } else {
                setTipoRecinto(data as Tipo_Recinto[]);
            }
        };
        fetchTipos();
    }, []);

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

    const handleCheckboxChange = (id: number) => { //MANEJA LOS IDS DE LAS ACCESIBILIDADES SELECIONADAS
        setSelecciones(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleAgregarMarcador = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        actualizarMarcador();
        Registro_cambios();
    };

    const fechaHoraActual = new Date().toISOString();

    const Registro_cambios = async () => {
        const { data: registro_logs, error: errorLog } = await supabase
            .from('registro_logs')
            .insert([
                {
                    id_usuario: user?.id,
                    tipo_accion: 'Edición de Marcador',
                    detalle: `Se editó el marcador con ID ${id}`,
                    fecha_hora: fechaHoraActual,
                }
            ]);

        if (errorLog) {
            console.error('Error al registrar en los logs:', errorLog);
            return;
        }

        console.log(' Registro insertado en registro_logs correctamente', registro_logs);
    };


    useEffect(() => { // Usa el id de forma dinamica obteniendolo desde el id que se encuentra en la URL
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

                if (data.latitud && data.longitud) {
                    setPosition({ lat: data.latitud, lng: data.longitud });
                    setDireccionValida(true);
                }

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

    const actualizarMarcador = async () => {
        if (!id) return;

        if (!direccionValida) {
            alert('Por favor, selecciona una dirección desde las sugerencias de Google Places.');
            return;
        }

        try {

            // 1. Se inserta el "registro_logs"
            console.log('Entró a actualizarMarcador');
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log('Usuario obtenido:', user);

            if (userError || !user) {
                console.error('No se pudo obtener el usuario:', userError);
                return;
            }

            // 2. Actualiza la tabla 'marcador'
            const { error: errorMarcador } = await supabase
                .from('marcador')
                .update({
                    ...dataMarcador,
                    tipo_recinto: dataMarcador.tipo_recinto,
                })
                .eq('id', id);

            if (errorMarcador) {
                console.error('Error al actualizar el marcador:', errorMarcador);
                return;
            }

            // 3. Elimina las relaciones antiguas en 'accesibilidad_marcador'
            const { error: errorDelete } = await supabase
                .from('accesibilidad_marcador')
                .delete()
                .eq('id_marcador', id);

            if (errorDelete) {
                console.error('Error al eliminar relaciones anteriores:', errorDelete);
                return;
            }

            // 4. Inserta las nuevas relaciones
            const nuevasRelaciones = selecciones.map(idAcc => ({
                id_marcador: id,
                id_accesibilidad: idAcc,
            }));

            const { error: errorInsert } = await supabase
                .from('accesibilidad_marcador')
                .insert(nuevasRelaciones);

            if (errorInsert) {
                console.error('Error al insertar nuevas relaciones:', errorInsert);
                return;
            }

            alert('Marcador actualizado correctamente.');
            navigate(-1);
        } catch (err) {
            console.error('Error inesperado:', err);
        }
    };


    // Verificar si el usuario es el dueño del marcador o tiene rol de administrador o gestor para permitir la edición
    useEffect(() => {
        if (!dataMarcador || !user) return;

        const esDueño = String(dataMarcador.id_usuario) === String(user.id);
        const esAdminOGestor = userRole === 'administrador' || userRole === 'gestor';

        if (esDueño || esAdminOGestor) {
            setMarcadorPropio(true); // Permitir edición
        } else {
            setMarcadorPropio(false)
        }
    }, [dataMarcador, user, userRole]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    });

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [direccionValida, setDireccionValida] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    if (loadError) return <div>Error cargando places</div>;
    if (!isLoaded) return <div>Cargando autocomplete...</div>;

    if (!marcadorPropio) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Acceso denegado</h2>
                    <p>No tienes permiso para editar este marcador.</p>
                </div>
            </div>
        );
    }

    return (


        <div className={styles.container}>
            <div className={styles.header}>

                <ImagenConFallback
                    src={dataMarcador?.url_img}
                    alt="Imagen del recinto"
                    className={styles.imagenMarcador}
                />

                <button className={styles.VolverAtras}
                    type="submit" onClick={() => { navigate(-1) }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <div className={styles.Titulo} >
                    <h2>Editar locación</h2>
                </div>
                <div className={styles.locacionTitulo}>
                    <h4>{dataMarcador.nombre_recinto}</h4>
                    <p> {/*Muestra todos los tipos recintos, busca que el tipo id conincida con tipo_recinto, si coinside muestra el nombre, si no muestra una cadena vacia*/}
                        {tipoRecinto.find(t => t.id === Number(dataMarcador.tipo_recinto))?.tipo || ''}
                    </p>
                </div>
            </div>
            <div className={styles.Conten}>
                <div className={styles.FormContainer}>
                    <form onSubmit={handleAgregarMarcador}>
                        <div className={styles.formGrid}>
                            {/*Primer Grupo*/}
                            <div className={styles.FormSection} style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', margin: "5px" }}>

                                {userRole === 'administrador' || userRole === 'gestor' ? (
                                    <>
                                        <label className={styles.labelSeccion} >Nombre locación</label>
                                        <input
                                            type="text"
                                            value={dataMarcador.nombre_recinto}
                                            onChange={(e) => setDataMarcador({ ...dataMarcador, nombre_recinto: e.target.value })}
                                            className={styles.inputText} required />

                                        <label className={styles.labelSeccion}>Tipo de Recinto</label>
                                        <select
                                            name="tipo_recinto"
                                            className={styles.inputOpt}
                                            required
                                            value={dataMarcador.tipo_recinto}
                                            onChange={(e) => {
                                                const newTipoRecinto = e.target.value;
                                                setDataMarcador({ ...dataMarcador, tipo_recinto: newTipoRecinto });
                                                console.log('Nuevo tipo seleccionado:', newTipoRecinto);
                                            }}
                                        >
                                            <option value="">Selecciona un tipo de recinto</option>
                                            {tipoRecinto?.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.tipo}
                                                </option>
                                            ))}
                                        </select>

                                        <label className={styles.labelSeccion} htmlFor="">Dirección</label>
                                        <Autocomplete
                                            onLoad={ac => setAutocomplete(ac)}
                                            onPlaceChanged={() => {
                                                if (!autocomplete) return;
                                                const place = autocomplete.getPlace();
                                                if (place.geometry?.location) {
                                                    const lat = place.geometry.location.lat();
                                                    const lng = place.geometry.location.lng();

                                                    setPosition({ lat, lng });
                                                    setDireccionValida(true);

                                                    setDataMarcador(prev => ({
                                                        ...prev,
                                                        latitud: lat,
                                                        longitud: lng,
                                                        direccion: place.formatted_address || '',
                                                    }));
                                                }
                                            }}
                                            options={{
                                                types: ['address'],
                                                fields: ['geometry', 'formatted_address'],
                                                componentRestrictions: { country: 'cl' }
                                            }}
                                        >
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={dataMarcador.direccion}
                                                placeholder="Escribe una dirección…"
                                                className={styles.inputText}
                                                onChange={(e) => {
                                                    const nuevaDireccion = e.target.value;
                                                    setDireccionValida(false);
                                                    setPosition(null);
                                                    setDataMarcador(prev => ({
                                                        ...prev,
                                                        direccion: nuevaDireccion,
                                                    }));
                                                }}
                                                required
                                            />
                                        </Autocomplete>
                                        <APIProvider apiKey={apiKey}>
                                            {position && (
                                                <div style={{ paddingTop: "10px", border: "1px solid rgba(0, 0, 0, 0.2)", borderRadius: '5px', padding: '10px', marginTop: '10px' }}>
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
                                                </div>
                                            )}
                                        </APIProvider>
                                    </>

                                ) : null}


                                < label className={styles.labelSeccion} htmlFor="">Página web</label>
                                <input
                                    type="text"
                                    value={dataMarcador.pagina_web}
                                    onChange={(e) => setDataMarcador({ ...dataMarcador, pagina_web: e.target.value })}
                                    className={styles.inputText} />

                                <label className={styles.labelSeccion} htmlFor="">URL de imagen</label>
                                <input
                                    type="text"
                                    value={dataMarcador.url_img}
                                    onChange={(e) => setDataMarcador({ ...dataMarcador, url_img: e.target.value })}
                                    className={styles.inputText} />


                                <label className={styles.labelSeccion} htmlFor="">Teléfono</label>
                                <div className={styles.ContainerinputTelefono}>
                                    <p className={styles.codTelfono}>+569</p>
                                    <input
                                        type="number" value={dataMarcador.telefono}
                                        onChange={(e) => setDataMarcador({ ...dataMarcador, telefono: e.target.value })} />
                                </div>

                            </div>
                            {userRole === 'administrador' || userRole === 'gestor' ? (
                                <div className={styles.gridContainer}>
                                    {Object.entries(accesibilidades).map(([tipo, lista]) => (
                                        <div key={tipo} className={styles.accesibilidadGrupo}>
                                            <p><strong>{`Accesibilidad ${tipo}`}</strong></p>
                                            {lista.map(acc => (
                                                <div className={styles.opt} key={acc.id}>
                                                    <input
                                                        type="checkbox"
                                                        value={acc.id}
                                                        checked={selecciones.includes(acc.id)}
                                                        onChange={() => handleCheckboxChange(acc.id)}
                                                        id={acc.nombre}
                                                    />
                                                    <label htmlFor={acc.nombre}>{acc.nombre}</label>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    <div>
                                        <label className={styles.labelSeccion} htmlFor="">Informacion Adicional</label>
                                        <textarea
                                            placeholder="Escribe información adicional sobre el marcador..."
                                            value={dataMarcador.info_adicional}
                                            onChange={(e) => setDataMarcador({ ...dataMarcador, info_adicional: e.target.value })}
                                            className={styles.inputText}
                                            rows={4}
                                            style={{ resize: 'none', height: '100px' }}

                                        />
                                    </div>

                                </div>) : null}
                            {/*Segundo Grupo*/}

                        </div>

                        {/* EDICION AVANZAD DEL MARCADOR, DISPONIBLE PARA ADMIN O GESTOR */}
                        {userRole === 'administrador' || user?.role === 'gestor' ? (<>
                            <h3>Edicion avanzada</h3>
                            <div >
                                <label className={styles.labelSeccion} style={{ marginRight: '20px' }} htmlFor="">Activo</label>
                                <input
                                    type="checkbox"
                                    checked={dataMarcador.activo}
                                    onChange={(e) => setDataMarcador({ ...dataMarcador, activo: e.target.checked })}
                                    style={{ display: 'block' }}
                                />

                                <label className={styles.labelSeccion} htmlFor="">Accesibilidad certificada</label>
                                <input
                                    style={{ display: 'block' }}
                                    type="checkbox"
                                    checked={dataMarcador.accesibilidad_certificada}
                                    onChange={(e) => setDataMarcador({ ...dataMarcador, accesibilidad_certificada: e.target.checked })}
                                    value={dataMarcador.accesibilidad_certificada ? 'true' : 'false'}
                                />

                            </div>
                        </>

                        ) : null}



                        <div className={styles.acciones}>
                            <button type="submit"
                                style={{ backgroundColor: "transparent", color: "red" }}
                                onClick={() => {
                                    setSelecciones([]);
                                    setDataMarcador(estadoInicialMarcadores);
                                    navigate(-1); // Para volver atrás
                                }}
                            >Cancelar
                            </button>
                            <button>Guardar cambios</button>
                        </div>
                    </form>
                    {/* Botones de guardar y cancelar */}
                    {userRole === 'usuario' && (
                        <p style={{ color: 'gray', marginTop: '25px', fontSize: '1rem' }}>Si necesitas editar otro campo, contacta con el soporte.</p>
                    )}
                </div>
            </div >
        </div >
    )
}

