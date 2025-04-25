import styles from "../usuarios/css/Gestion_Usuarios.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter, faUser, faUserPen, faUserPlus, faReply } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Usuarios } from '../../interfaces/Usuarios';
import { useNavigate } from "react-router-dom";

function Gestion_Usuarios() {
    const navigate = useNavigate()

    const [isActiveBuscador, setIsActiveBuscador] = useState(false);
    const [rolSeleccionado, setRolSeleccionado] = useState('');
    const [usuarios, setUsuarios] = useState<Usuarios[]>([]);

    function handleBuscador() {
        setIsActiveBuscador(prevState => !prevState);
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data: usuariosData, error } = await supabase
                .from('usuarios')
                .select('*');

            if (error) {
                console.error('Error al obtener datos:', error);
            } else {
                setUsuarios(usuariosData || []);
            }
        };

        fetchData();
    }, []);

    const [busqueda, setBusqueda] = useState('');

    function handleBusquedaChange(e: React.ChangeEvent<HTMLInputElement>) {
        setBusqueda(e.target.value);
    }

    const usuariosFiltrados = usuarios.filter((usuario) => {
        const coincideNombre = usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideRol = rolSeleccionado === '' || usuario.rol === rolSeleccionado;
        return coincideNombre && coincideRol;
    });

    return (
        <div className={styles.container}>
            <button style={{ position: "absolute", left: "15px", top: "4px", border: "none", background: "transparent", fontSize: "25px", alignItems: "start" }} onClick={() => { navigate(-1) }}>
                <FontAwesomeIcon icon={faReply} />
            </button>
            <header className={styles.header} style={{paddingTop:'20px'}}>
                <hr style={{ maxWidth: '70%', minWidth: '150px', width: '60%' }} />
                <h2 style={{ textAlign: 'right' }} >Gestion de Usuarios</h2>
            </header>
            <div className={styles.filtros}>
                <div style={{ display: 'flex', gap: '5px' }}>

                    <button className={styles.filtroCard} onClick={() => handleBuscador()} >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
                    </button>
                    <div className={styles.filtroCard}>
                        <form action="">
                            <label htmlFor="filtro"><FontAwesomeIcon icon={faFilter} /> </label>
                            <select value={rolSeleccionado} onChange={e => setRolSeleccionado(e.target.value)}>
                                <option value="">Todos</option>
                                {[...new Set(usuarios.map(usuario => usuario.rol))].map((rolUnico, index) => (
                                    <option key={index} value={rolUnico}>
                                        {rolUnico}
                                    </option>
                                ))}
                            </select>
                        </form>
                    </div>

                    <div className={styles.add_user}>
                        <form action="">
                            <button onClick={() => { navigate('/panel-administrativo/usuarios/agregar') }}>
                                <FontAwesomeIcon icon={faUserPlus} /> Nuevo
                            </button>
                        </form>
                    </div>

                </div>
                {isActiveBuscador &&
                    <div className={styles.buscar}>
                        <form action="">
                            <input type="text" placeholder='Buscar' value={busqueda} onChange={handleBusquedaChange} />
                            <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                    </div>
                }
            </div>
            <div className={styles.content}>
                <p style={{ color: 'gray' }}>Gestion Usuarios</p>
                <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />
                {usuariosFiltrados.map((usuario, index) => (
                    <div className={styles.card} key={index}>
                        <div className={styles.estado} style={{ backgroundColor: '#0397fc' }}>
                            <FontAwesomeIcon icon={faUser} size='xl' style={{ color: 'white' }} />
                        </div>
                        <div
                            className={styles.cardContent}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/usuario/perfil/${usuario.id}`)}
                        >
                            <p style={{ color: 'black' }}>{usuario.nombre}</p>
                            <p style={{ color: 'gray', fontSize: '0.9rem' }}>{usuario.rol}</p>
                        </div>
                        <div className={styles.opciones}>
                            <button onClick={() => { navigate(`/usuarios/editar/${usuario.id}`) }}>
                                <FontAwesomeIcon icon={faUserPen} />
                            </button>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    )

}

export default Gestion_Usuarios;