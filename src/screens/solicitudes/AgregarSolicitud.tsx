import styles from './css/AgregarSolicitud.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faReply } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import { Solicitudes } from '../../interfaces/Solicitudes';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Info from './Info';

import { faGoogle } from '@fortawesome/free-brands-svg-icons'; // Asegúrate de importar esto
interface AccesibilidadesPorTipo {
    [tipo: string]: Accesibilidad[];
}

export default function AgregarSolicitud() {
    const { user } = useAuth();
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

    const [instruccionesleidas, setInstruccionesLeidas] = useState(false); // semaforo para saber si el usuario leyo las instrucciones


    const [seleccionadas, setSeleccionadas] = useState<number[]>([]); // ids de accesibilidad seleccionada


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
                    console.log('Usuario:', data);
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



    const handleSubmit = async (e: React.FormEvent) => { // SE ENVIAN LOS DATOS A LA BASE DE DATOS. 
        e.preventDefault();

        const idUsuario = user?.id;
        if (!idUsuario) {
            alert('Error: No se ha encontrado el usuario');
            return;
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


    if (!instruccionesleidas) {
        return <Info onConfirmarLectura={() => setInstruccionesLeidas(true)} />;
    }
    return (
        <div className={styles.container}>
            <div className={styles.titulo}>
                <button style={{ position: "absolute", backgroundColor: 'transparent', border: 'none', cursor: 'pointer', left: "10px" }} onClick={() => { navigate(-1) }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2 style={{ textAlign: 'center' }}>Colaborar <FontAwesomeIcon icon={faInfo} style={{ border: '1px solid gray', borderRadius: '50%', width: '20px', height: '20px', padding: '5px', color: 'gray', cursor: 'pointer' }} onClick={() => { navigate("/info") }} /></h2>
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
                        backgroundColor: '#f9f9f9',
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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

                    <label className={styles.labelSeccion}>Nombre Locación <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}> - ¿Como se llama su negocio?</span></label>
                    <input
                        type="text"
                        name="nombre_locacion"
                        className={styles.inputText}
                        value={formData.nombre_locacion}
                        onChange={handleInputChange}

                        disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario

                        required

                    />
                    <label className={styles.labelSeccion}>Tipo de Recinto</label>
                    <select
                        name="tipo_recinto"
                        className={styles.inputText}
                        required
                        value={formData.tipo_recinto || ''}
                        onChange={handleSelectChange}
                        disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario

                    >
                        <option value="">Selecciona un tipo de recinto</option>
                        {tipoRecinto?.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                        ))}
                    </select>

                    <label className={styles.labelSeccion}>
                        Mensaje
                        <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}>
                            {' '} - Describa brevemente la accesibilidad de su negocio.
                        </span>
                    </label>
                    <input
                        type="text"
                        name="descripcion"
                        required
                        className={styles.inputText}
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario

                    />
                    <label className={styles.labelSeccion}>
                        Dirección
                        <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}>
                            {' '} - ¿Dónde está ubicado su negocio? (Dirección completa)
                        </span>
                    </label>
                    <input
                        type="text"
                        name="direccion"
                        className={styles.inputText}
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                        disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario

                    />
                </div>

                <div className={styles.opt}>
                    <label htmlFor='cumple_ley_21015' style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
                        <p>Cumple con la <a target='_blank' href="https://www.bcn.cl/leychile/navegar?idNorma=1103997" style={{ color: 'black', fontWeight: 500, textTransform: 'capitalize' }}>ley nro. 21015 </a></p>
                        <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic', maxWidth: '200px', }}>
                            - Indique si su negocio cumple con  la inclusion al mundo laboral.
                        </span>
                    </label>
                    <input type="checkbox" name="cumple_ley_21015" id='cumple_ley_21015' onChange={handleInputChange} disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario
                    />

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
                                    disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario

                                />
                                <label htmlFor={acc.nombre} style={{ maxWidth: '400px' }} >{acc.nombre}</label>
                            </div>
                        ))}
                    </div>
                ))}


                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                    <label className={styles.labelSeccion} style={{}}>
                        Documentación
                    </label>

                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setFormData({ ...formData, documentacion: e.target.files[0].name }); //subir a storage
                            }
                        }}
                        disabled={!usuario?.nombre} // Deshabilitar el campo si no hay usuario

                    />
                    <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }}>
                        {' '} - Suba una foto o documento que respalde su solicitud. </span>
                </div>



                <div className={styles.acciones}>
                    <button type="reset" style={{ color: 'red', background: 'transparent' }} onClick={() => { navigate(-1) }} >Cancelar</button>
                    <button type="submit" disabled={!usuario?.nombre} >Enviar Solicitud</button>
                </div>
            </form>

        </div>
    );
}
