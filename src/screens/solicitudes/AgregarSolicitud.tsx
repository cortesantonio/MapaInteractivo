import styles from './AgregarSolicitud.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faReply } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import { Usuarios } from '../../interfaces/Usuarios';
import { Solicitudes } from '../../interfaces/Solicitudes';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { useNavigate } from 'react-router-dom';
interface AccesibilidadesPorTipo {
    [tipo: string]: Accesibilidad[];
}

export default function AgregarSolicitud() {
    const navigate = useNavigate()
    const [accesibilidades, setAccesibilidades] = useState<AccesibilidadesPorTipo>({});
    const [formData, setFormData] = useState<Partial<Solicitudes>>({
        nombre_locacion: '',
        descripcion: '',
        direccion: '',
        documentacion: '',
        cumple_ley_21015: false,
        accesibilidad_certificada: false,
    });

    const [seleccionadas, setSeleccionadas] = useState<number[]>([]); // ids de accesibilidad seleccionada

    // pensado para obtener el usuario que esta rellenando el formulario o tomar los datos del form y crear el usuario.
    const [usuario, setUsuario] = useState<Partial<Usuarios>>({
        correo: '',
        nombre: '',
        telefono: 0,
        genero: '',
        fecha_nacimiento: new Date(),
    });

    const [tipoRecinto, setTipoRecinto] = useState<Tipo_Recinto[]>(); // almacena los recintos del llamado a la api

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

    const handleCheckboxChange = (id: number) => { //MANEJA LOS IDS DE LAS ACCESIBILIDADES SELECIONADAS
        setSeleccionadas(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
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



    
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(false); // SEMAFORO PARA SABER SI EL USUARIO SE ENCONTRO O NO Y ASI SABER CUANDO CREAR EL USUARIO O CUANDO PASAR EL ID

    const handleCorreoBlur = async () => { // AQUI SE BUSCA EL USUARIO POR EL CORREO EN LA BASE DE DATOS, SI EXISTE SE SETEA EN EL FORM Y SE AUTO COMPLETA. SI NO, SE CREA.
        if (!usuario.correo) return;

        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('correo', usuario.correo)
            .single();

        if (error || !data) {
            console.warn("Usuario no encontrado");
            return;
        }
        setUsuario({
            id: data.id,
            correo: data.correo,
            nombre: data.nombre,
            telefono: data.telefono,
        });
        setUsuarioEncontrado(true);
    };

    const handleSubmit = async (e: React.FormEvent) => { // SE ENVIAN LOS DATOS A LA BASE DE DATOS. 
        e.preventDefault();
        let idUsuario = usuario.id;

        if (!usuarioEncontrado) {
            const { data: newUser, error: userError } = await supabase
                .from('usuarios')
                .insert([{
                    correo: usuario.correo,
                    nombre: usuario.nombre,
                    telefono: usuario.telefono,
                    rol: 'usuario',
                    activo: true,
                    fecha_nacimiento: usuario.fecha_nacimiento,
                    genero: usuario.genero
                }])
                .select()
                .single();

            if (userError) {
                console.error('Error al insertar usuario:', userError);
                return;
            }

            idUsuario = newUser.id;
            setUsuario({ ...usuario, id: newUser.id });
        }

        const { data: solicitud, error: errrosol } = await supabase
            .from('solicitudes')
            .insert({
                id_usuario: idUsuario,
                nombre_locacion: formData.nombre_locacion,
                direccion: formData.direccion,
                descripcion: formData.descripcion,
                tipo_recinto: formData.tipo_recinto,
                documentacion: formData.documentacion,
                estado: 'pendiente',
                fecha_ingreso: new Date().toISOString(),
                cumple_ley_21015: formData.cumple_ley_21015,
                accesibilidad_certificada: formData.accesibilidad_certificada,
            })
            .select()
            .single();
        console.log(errrosol)
        for (const accId of seleccionadas) {
            await supabase.from('accesibilidad_solicitud').insert({
                id_solicitud: solicitud.id,
                id_accesibilidad: accId
            });
        }
        alert('Solicitud enviada correctamente');
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.titulo}>
                <button style={{ position: "absolute", backgroundColor: 'transparent', border: 'none', cursor: 'pointer', left: "10px" }} onClick={() => { navigate(-1) }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2 style={{ textAlign: 'center' }}>Colaborar <FontAwesomeIcon icon={faInfo} style={{ border: '1px solid gray', borderRadius: '50%', width: '20px', height: '20px', padding: '5px', color: 'gray',cursor:'pointer'} } onClick={() => { navigate("/info") }}/></h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
                    <label className={styles.labelSeccion}>Correo de contacto</label>
                    <input
                        type="email"
                        name="correo"
                        className={styles.inputText}
                        value={usuario.correo}
                        disabled={usuarioEncontrado}
                        required
                        onChange={(e) => setUsuario({ ...usuario, correo: e.target.value })}
                        onBlur={handleCorreoBlur}
                    />

                    <label className={styles.labelSeccion}>Nombre</label>
                    <input
                        type="text"
                        value={usuario.nombre}
                        disabled={usuarioEncontrado}
                        required
                        onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                        className={styles.inputText}
                        style={{ textTransform: 'uppercase' }}

                    />

                    <label className={styles.labelSeccion} >Teléfono</label>
                    <input
                        type="text"
                        value={usuario.telefono}
                        disabled={usuarioEncontrado}
                        required
                        className={styles.inputText}
                        onChange={(e) => setUsuario({ ...usuario, telefono: Number(e.target.value) })}
                    />
                    {usuarioEncontrado ? (
                        <p style={{ color: 'green', fontWeight: 300, textAlign: 'right', fontSize: '0.8rem' }}>{"> "}Usuario encontrado</p>
                    ) : (
                        <>

                            <label className={styles.labelSeccion}>Genero</label>
                            <select
                                name="genero"
                                className={styles.inputText}
                                value={usuario.genero}
                                onChange={(e) => setUsuario({ ...usuario, genero: e.target.value })}
                            >
                                <option value="">Selecciona un género</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Otro</option>
                            </select>

                            <label className={styles.labelSeccion}>fecha de nacimiento</label>

                            <input type="date" name="fecha_nacimiento" className={styles.inputText} onChange={(e) => setUsuario({ ...usuario, fecha_nacimiento: new Date(e.target.value) })} />


                        </>
                    )}

                    <label className={styles.labelSeccion}>Nombre Locación</label>
                    <input
                        type="text"
                        name="nombre_locacion"
                        className={styles.inputText}
                        value={formData.nombre_locacion}
                        onChange={handleInputChange}
                        required
                    />
                    <label className={styles.labelSeccion}>Tipo de Recinto</label>
                    <select
                        name="tipo_recinto"
                        className={styles.inputText}
                        required
                        value={formData.tipo_recinto || ''}
                        onChange={handleSelectChange}
                    >
                        <option value="">Selecciona un tipo de recinto</option>
                        {tipoRecinto?.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                        ))}
                    </select>

                    <label className={styles.labelSeccion}>Mensaje</label>
                    <input
                        type="text"
                        name="descripcion"
                        required
                        className={styles.inputText}
                        value={formData.descripcion}
                        onChange={handleInputChange}
                    />
                    <label className={styles.labelSeccion}>Dirección</label>
                    <input
                        type="text"
                        name="direccion"
                        className={styles.inputText}
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.opt}>
                    <label htmlFor='cumple_ley_21015' style={{ fontWeight: 500 }}>Cumple con la ley nro. 21015</label>
                    <input type="checkbox" name="cumple_ley_21015" id='cumple_ley_21015' onChange={handleInputChange} />

                </div>

                <div className={styles.opt}>
                    <label htmlFor='accesibilidad_certificada' style={{ fontWeight: 500 }}>Accesibilidad certificada -{">"} mover a marcador</label>
                    <input type="checkbox" name="accesibilidad_certificada" id='accesibilidad_certificada' onChange={handleInputChange} />

                </div>

                {Object.entries(accesibilidades).map(([tipo, lista]) => (
                    <div key={tipo}>
                        <p>{`Accesibilidad ${tipo}`}</p>
                        {lista.map(acc => (
                            <div className={styles.opt} key={acc.id}>
                                <input
                                    type="checkbox"
                                    value={acc.id}
                                    checked={seleccionadas.includes(acc.id)}
                                    onChange={() => handleCheckboxChange(acc.id)}
                                    id={acc.nombre}
                                />
                                <label htmlFor={acc.nombre} >{acc.nombre}</label>
                            </div>
                        ))}
                    </div>
                ))}

                <label className={styles.labelSeccion}>Documentación (opcional)</label>
                {/* <input
                type="file"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, documentacion: e.target.files[0].name }); //subir a storage
                    }
                }}
            /> */}

                <div className={styles.acciones}>
                    <button type="reset" style={{ color: 'red', background: 'transparent' }}>Cancelar</button>
                    <button type="submit" >Enviar Solicitud</button>
                </div>
            </form>

        </div>
    );
}
