
import styles from './css/AgregarSolicitud.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faReply, faUpload, faArrowUpRightFromSquare,faFileImage,faFilePdf,faTimes } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from 'react';
import { Solicitudes } from '../../interfaces/Solicitudes';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Info from './Info';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useLoadScript, Autocomplete, } from "@react-google-maps/api";
import { APIProvider, Map as VisMap, AdvancedMarker } from "@vis.gl/react-google-maps";

interface AccesibilidadesPorTipo {
    [tipo: string]: Accesibilidad[];
}

const LIBRARIES: ("places")[] = ['places'];

export default function AgregarSolicitud() {
    const { user } = useAuth();
    const navigate = useNavigate()
    const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;
    const [accesibilidades, setAccesibilidades] = useState<AccesibilidadesPorTipo>({});
    const [formData, setFormData] = useState<Partial<Solicitudes>>({
        nombre_locacion: '',
        descripcion: '',
        direccion: '',
        documentacion: '',
        latitud: undefined,
        longitud: undefined,
        cumple_ley_21015: false,
    });
    const [instruccionesleidas, setInstruccionesLeidas] = useState(false); // semaforo para saber si el usuario leyo las instrucciones
    const [seleccionadas, setSeleccionadas] = useState<number[]>([]); // ids de accesibilidad seleccionada
    const [tipoRecinto, setTipoRecinto] = useState<Tipo_Recinto[]>(); // almacena los recintos del llamado a la api    
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);


    useEffect(() => {
        const fetchTipoRecinto = async () => {
            const { data, error } = await supabase.from('tipo_recinto').select('*');
            if (error) console.error('Error al obtener tipo recinto:', error);
            else {
                setTipoRecinto(data);
            }
        };

        fetchTipoRecinto();
    }, []);
    const [usuario, setUsuario] = useState<any>(null); // Almacena los datos del usuario

    useEffect(() => {
        // Verifica si hay un usuario cargado
        if (user?.id) {
            const fetchUsuario = async () => {
                const { data, error } = await supabase
                    .from('usuarios')
                    .select('*')
                    .eq('id', user.id) // Usas el id del usuario logueado
                    .single();

                if (error) {
                    console.error('Error al obtener usuario:', error);
                } else {
                    setUsuario(data); // Actualiza el estado con los datos del usuario
                }
            };

            fetchUsuario();
        }
    }, [user]);

    useEffect(() => { // LLAMADO A LA API PARA OBTNER TODOAS LAS ACCESIBILIDADES QUE HAY EN LA BASE DE DATOS Y LA CLASIFICA POR TIPO
        const fetchAccesibilidades = async () => {
            const { data, error } = await supabase.from('accesibilidad').select('*');
            if (error) console.error('Error al obtener accesibilidades:', error);
            else {
                const agrupadas: AccesibilidadesPorTipo = {};
                data.forEach((acc: Accesibilidad) => {
                    if (!agrupadas[acc.tipo]) agrupadas[acc.tipo] = [];
                    agrupadas[acc.tipo].push(acc);
                });
                setAccesibilidades(agrupadas);
            }
        };

        fetchAccesibilidades();
    }, []);
    // Generar vista previa cuando se selecciona un archivo
    useEffect(() => {
        if (!file) {
            setFilePreview(null);
            return;
        }

        // Solo generar previsualizaciones para imágenes
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // Para PDFs u otros archivos, mostrar un icono o texto
            setFilePreview('no-preview');
        }
    }, [file]);

    const handleCheckboxChange = (id: number) => { //MANEJA LOS IDS DE LAS ACCESIBILIDADES SELECIONADAS
        setSeleccionadas(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'descripcion') {
        setCharCount(value.length);
    }
    setFormData({
        ...formData,
        [name]: value
    });
};

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // MANEJA LOS DATOS DE LOS INPUTS
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            // Validar tamaño del archivo (máximo 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert('El archivo no puede ser mayor a 5MB');
                e.target.value = '';
                return;
            }


            setFile(selectedFile);
            setUploadError(null);
        }
    };

    const uploadFile = async () => {
        if (!file) return null;


        try {
            setUploading(true);
            setUploadError(null);


            // Crear un nombre de archivo único usando timestamp y nombre original
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${fileName}`; // Usando la raíz del bucket para mayor simplicidad


            // Subir archivo a Supabase Storage
            const { error } = await supabase.storage
                .from('documentacion')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true // Permitir sobrescribir si ya existe un archivo con el mismo nombre
                });

            if (error) {
                throw error;
            }

            // Obtener URL pública del archivo
            const { data: urlData } = supabase.storage
                .from('documentacion')
                .getPublicUrl(filePath);

            return urlData.publicUrl;
        } catch (error: any) {
            console.error('Error al subir archivo:', error.message);
            setUploadError(error.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => { // SE ENVIAN LOS DATOS A LA BASE DE DATOS. 
        e.preventDefault();

        const idUsuario = user?.id;
        if (!idUsuario) {
            alert('Error: No se ha encontrado el usuario');
            return;
        }

        if (!direccionValida) {
            alert('Por favor, selecciona una dirección desde las sugerencias de Google Places.');
            return;
        }

        if (!formData.tipo_recinto) {
            alert('Por favor, selecciona un tipo de recinto válido.');
            return;
        }

        setUploading(true);

        try {
            // 1. Subir archivo si existe
            let documentacionUrl = '';
            if (file) {
                const fileUrl = await uploadFile();
                if (!fileUrl) {
                    alert('Error al subir el archivo. Por favor, inténtelo de nuevo.');
                    setUploading(false);
                    return;
                }
                documentacionUrl = fileUrl;
            }

            // 2. Insertar la solicitud con la URL del archivo

            const { data: nuevaSolicitud, error: errorSolicitud } = await supabase
                .from('solicitudes')
                .insert([{
                    id_usuario: idUsuario,
                    nombre_locacion: formData.nombre_locacion,
                    direccion: formData.direccion,
                    descripcion: formData.descripcion,
                    tipo_recinto: formData.tipo_recinto,
                    documentacion: documentacionUrl,
                    estado: 'pendiente',
                    fecha_ingreso: new Date().toISOString(),
                    latitud: formData.latitud,
                    longitud: formData.longitud,
                    cumple_ley_21015: formData.cumple_ley_21015,
                }])
                .select()
                .single();

            if (errorSolicitud) {
                console.error('Error al insertar solicitud:', errorSolicitud);
                throw errorSolicitud;
            }

            if (!nuevaSolicitud) {
                throw new Error('No se recibió el ID de la solicitud creada.');
            }


            // 3. Insertar accesibilidades seleccionadas
            if (seleccionadas.length > 0) {
                const accesibilidadesInsert = seleccionadas.map(accId => ({
                    id_solicitud: nuevaSolicitud.id,
                    id_accesibilidad: accId
                }));


                const { error: errorAccesibilidades } = await supabase
                    .from('accesibilidad_solicitud')
                    .insert(accesibilidadesInsert);


                if (errorAccesibilidades) {
                    console.error('Error al insertar accesibilidades:', errorAccesibilidades);
                    // Continuamos sin interrumpir el flujo, ya que la solicitud principal se creó correctamente
                }
            }


            alert('Solicitud enviada correctamente');
            // 4. Registrar en registro_logs
            await Registro_cambios(nuevaSolicitud.id);
            navigate(-1);
        } catch (error: any) {
            console.error('Error al procesar la solicitud:', error.message);
            alert(`Error al enviar la solicitud: ${error.message}`);
        } finally {
            setUploading(false);
        }


    };

    // Función para cancelar/eliminar el archivo seleccionado
    const handleCancelFile = () => {
        setFile(null);
        setFilePreview(null);
        setUploadError(null);
        // Limpiar el input file
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };



    const fechaHoraActual = new Date().toISOString();

    const Registro_cambios = async (solicitudId: number) => {
        const { error: errorLog } = await supabase
            .from('registro_logs')
            .insert([
                {
                    id_usuario: user?.id,
                    tipo_accion: 'Agregación de una Solicitud',
                    detalle: `Se agregó una Solicitud con ID ${solicitudId}`,
                    fecha_hora: fechaHoraActual,
                }
            ]);

        if (errorLog) {
            console.error('Error al registrar en los logs:', errorLog);
            return;
        }

    };

    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [showFiltroOptions, setShowFiltroOptions] = useState(false);
    const tipoRecintoRef = useRef<HTMLInputElement>(null);

    const filteredTipoRecinto = (tipoRecinto ?? []).filter(tipo =>
        tipo.tipo.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    });


    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [direccionValida, setDireccionValida] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    if (loadError) return <div>Error al cargar Google Places</div>;
    if (!isLoaded) return <div>Cargando Autocomplete...</div>;


    if (!instruccionesleidas) {
        return <Info onConfirmarLectura={() => setInstruccionesLeidas(true)} />;
    }
    return (
        <div className={styles.container}>
            <div className={styles.titulo}>
                <button style={{ position: "static", backgroundColor: 'transparent', border: 'none', cursor: 'pointer', left: "5px" }} onClick={() => { navigate(-1) }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2 style={{ textAlign: 'center' }}>Colaborar <FontAwesomeIcon icon={faInfo} style={{ border: '1px solid gray', borderRadius: '50%', width: '20px', height: '20px', padding: '5px', color: 'gray', cursor: 'pointer' }} onClick={() => { setInstruccionesLeidas(false) }} /></h2>
            </div>

            {
                user ? (<div>

                    <p className={styles.welcomeMessage}>Hola, {usuario?.nombre}, colabora con la comunidad</p>
                    <p className={styles.subText}>{'> '} Con esto ayudas a mejorar la accesibilidad en tu ciudad.</p>


                </div>) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '2rem',
                        borderRadius: '10px',
                        maxWidth: '400px',
                        margin: '2rem auto'
                    }}>
                        <p style={{
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            color: '#333'
                        }}>
                            Para colaborar debes estar registrado
                        </p>

                        <button
                            onClick={() => { navigate('/login') }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#4285F4',
                                color: 'white',
                                border: 'none',
                                padding: '0.8rem 1.5rem',
                                fontSize: '1rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 500,
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            <FontAwesomeIcon icon={faGoogle} />
                            CONTINUAR CON GOOGLE
                        </button>
                    </div>
                )
            }


            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>

                    <label className={styles.labelSeccion}>Nombre del negocio o establecimiento </label>
                    <input
                        type="text"
                        placeholder='Escribe el nombre del negocio o establecimiento'
                        name="nombre_locacion"
                        className={styles.inputText}
                        value={formData.nombre_locacion}
                        onChange={handleInputChange}
                        disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario
                        required

                    />
                    <label className={styles.labelSeccion}>Tipo de establecimiento<span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}> - ¿Qué tipo de establecimiento o negocio es? (Ej.: farmacia, hospital, cajero, negocio...)</span></label>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                            ref={tipoRecintoRef}
                            type="text"
                            placeholder="Selecciona un tipo de recinto"
                            className={styles.inputText}
                            style={{ width: '100%', marginBottom: '0px'  }}
                            value={filtroBusqueda}
                            onChange={(e) => {
                                const texto = e.target.value;
                                setFiltroBusqueda(texto);
                                setShowFiltroOptions(true);

                                const tipoEncontrado = tipoRecinto?.find(
                                    (tipo) => tipo.tipo.toLowerCase() === texto.toLowerCase()
                                );

                                if (tipoEncontrado) {
                                    handleSelectChange({ target: { name: "tipo_recinto", value: tipoEncontrado.id } } as any);
                                } else {
                                    handleSelectChange({ target: { name: "tipo_recinto", value: '' } } as any);
                                }
                            }}

                            onFocus={() => setShowFiltroOptions(true)}
                            onBlur={() => {
                                setTimeout(() => {
                                    setShowFiltroOptions(false);
                                }, 100);
                            }}
                            disabled={!usuario?.nombre}
                            required
                        />
                        {showFiltroOptions && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    zIndex: 1000
                                }}
                            >
                                {filteredTipoRecinto.map((tipo) => (
                                    <div
                                        key={tipo.id}
                                        style={{
                                            padding: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.tipo_recinto === tipo.id ? '#f0f0f0' : 'white'
                                        }}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            handleSelectChange({ target: { name: "tipo_recinto", value: tipo.id } } as any);
                                            setFiltroBusqueda(tipo.tipo);
                                            setShowFiltroOptions(false);
                                        }}
                                    >
                                        {tipo.tipo}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <label className={styles.labelSeccion} style={{ marginTop: '10px' }}>
                        Accesibilidad del lugar
                        <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}>{' '}- Describa la accesibilidad del recinto (rampas, ascensores, baños adaptados, etc.)</span>
                    </label>
                    <textarea
                        name="descripcion"
                        placeholder='¿Tu recinto tiene accesibilidad? Describe qué tipo, si aplica'
                        rows={4}
                        style={{ resize: 'none', height: '100px' }}
                        value={formData.descripcion}
                        className={styles.inputText}
                        onChange={handleTextareaChange}
                        disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario
                        required
                        maxLength={250}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right' }}>{charCount}/250</div>
                    <label className={styles.labelSeccion}>
                        Dirección de su negocio
                        <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}>
                            {' '}- ¿Dónde está el negocio o recinto? (Dirección completa, ej: Av. Siempre Viva 742, Curicó)
                        </span>
                    </label>
                    <Autocomplete
                        onLoad={(ac) => setAutocomplete(ac)}
                        onPlaceChanged={() => {
                            if (!autocomplete) return;
                            const place = autocomplete.getPlace();
                            if (place.geometry?.location) {
                                const lat = place.geometry.location.lat();
                                const lng = place.geometry.location.lng();
                                setPosition({ lat, lng });
                                setDireccionValida(true);


                                const nuevaDireccion = place.formatted_address || '';
                                setFormData((prev) => ({
                                    ...prev,
                                    latitud: lat,
                                    longitud: lng,
                                    direccion: nuevaDireccion,
                                }));

                                if (inputRef.current) {
                                    inputRef.current.value = nuevaDireccion;
                                }
                            }
                        }}
                        options={{
                            types: ['address'],
                            fields: ['geometry', 'formatted_address'],
                            componentRestrictions: { country: 'cl' },
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            name="dirección"
                            placeholder="Escribe una dirección…"
                            className={styles.inputText}
                            value={formData.direccion}
                            onChange={(e) => {
                                handleInputChange(e);
                                setDireccionValida(false);
                                setPosition(null);
                            }}
                            style={{ width: '100%', padding: '0 10px' }}
                            required
                            disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario
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



                </div>

                <div className={styles.checkboxLey}>
                    <input
                        type="checkbox"
                        name="cumple_ley_21015"
                        id="cumple_ley_21015"
                        onChange={handleInputChange}
                        disabled={!usuario?.nombre}
                    />
                    <label htmlFor="cumple_ley_21015" className={styles.labelLey}>
                        <p>
                            Cumple con la{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.bcn.cl/leychile/navegar?idNorma=1103997"
                                className={styles.linkLey}
                            >
                                Ley N.º 21.015 <FontAwesomeIcon size="2xs" icon={faArrowUpRightFromSquare} style={{ transform: 'scale(1.2)' }} />
                            </a>
                        </p>
                        <span className={styles.descripcionLey}>
                            - Indique si su negocio cumple con la inclusión en el mundo laboral.
                        </span>
                    </label>
                </div>




                {Object.entries(accesibilidades).map(([tipo, lista]) => (
                    <div key={tipo}>
                        <p>{`Accesibilidad ${tipo}`}</p>
                        {lista.map(acc => (
                            <div className={styles.opt} key={acc.id}>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxColor}
                                    value={acc.id}
                                    checked={seleccionadas.includes(acc.id)}
                                    onChange={() => handleCheckboxChange(acc.id)}
                                    id={acc.nombre}
                                    disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario

                                />
                                <label htmlFor={acc.nombre} style={{ maxWidth: '400px' }} >{acc.nombre}</label>
                            </div>
                        ))}
                    </div>
                ))}


                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className={styles.labelSeccion}>
                            Documentación
                            <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}>
                                {' '} - Suba una foto o documento que respalde su solicitud (máx. 5MB)
                            </span>
                        </label>

                        
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", backgroundColor: "#f8f9fa", border: "2px dashed #dee2e6", borderRadius: "8px", padding: "20px", margin: "16px auto", width: "100%", maxWidth: "100%", transition: "all 0.2s ease" }}>
                            <div>
                                <h4 style={{ fontWeight: "300", borderBottom: "solid gray 1px", padding: "3px" }}>
                                    Subir Imagen o PDF
                                </h4>
                            </div>

                            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
                                <FontAwesomeIcon icon={faFileImage} style={{ color: '#2b579a', fontSize: "1.8rem" }} />
                                <FontAwesomeIcon icon={faFilePdf} style={{ color: '#dc3545', fontSize: "1.8rem" }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
                                <label className={styles.boton_subir} htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: usuario?.nombre ? '#007bff' : '#f0f0f0', color: usuario?.nombre ? '#fff' : '#6c757d', borderRadius: '6px', cursor: usuario?.nombre ? 'pointer' : 'not-allowed', opacity: usuario?.nombre ? 1 : 0.6, fontWeight: '500', transition: 'all 0.2s ease', border: 'none' }}>
                                    <FontAwesomeIcon icon={faUpload} />
                                    Seleccionar archivo
                                </label>

                                <input id="file-upload" type="file" accept="image/*,.pdf" onChange={handleFileChange} disabled={!usuario?.nombre} style={{ display: 'none' }} />

                                {/* Información del archivo y botón cancelar */}
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '8px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: "14px", color: file ? "#28a745" : "#6c757d", fontWeight: file ? "500" : "400", textAlign: "center" }}>
                                        {file ? `📄 ${file.name}` : 'Ningún archivo seleccionado'}
                                    </span>

                                    {file && (
                                        <button type="button" onClick={handleCancelFile} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#c82333'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#dc3545'; }}>
                                            <FontAwesomeIcon icon={faTimes} size="xs" />
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Texto informativo */}
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: "400", color: "#6c757d", textAlign: "center", lineHeight: "1.4" }}>
                                Solo puedes subir Imágenes o PDF
                            </p>
                        </div>

                        {filePreview && filePreview !== 'no-preview' && (
                            <div style={{ marginTop: '10px', maxWidth: '250px' }}>
                                <img src={filePreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                                <img src={filePreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                />
                            </div>
                        )}


                        {filePreview === 'no-preview' && (
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FontAwesomeIcon icon={faInfo} />
                                <span>Archivo seleccionado (sin vista previa disponible)</span>
                            </div>
                        )}

                        {uploadError && (
                            <div style={{ color: 'red', marginTop: '5px' }}>
                                Error: {uploadError}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.acciones}>
                    <button
                        type="button"
                        style={{ color: 'red', background: 'transparent' }}
                        onClick={() => { navigate(-1) }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!usuario?.nombre || uploading}
                        style={{ opacity: uploading ? 0.7 : 1 }}
                    >
                        {uploading ? 'Enviando...' : 'Enviar solicitud'}
                    </button>
                </div>
            </form>

        </div>
    );
}