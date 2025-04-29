import styles from './List.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faMagnifyingGlass, faFilter, faSort, faCheck, faX, faInfo, faReply } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Solicitudes } from '../../interfaces/Solicitudes';
import { supabase } from '../../services/supabase';
import { useNavigate } from "react-router-dom";

function ListSolicitudes() {
    const [isActiveBuscador, setIsActiveBuscador] = useState(false);
    const [solicitudes, setSolicitudes] = useState<Solicitudes[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [orden, setOrden] = useState('desc');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSolicitudes = async () => {
            const { data, error } = await supabase
                .from('solicitudes')
                .select('*')
                .order('fecha_ingreso', { ascending: orden === 'asc' });

            if (error) console.error('Error al obtener solicitudes:', error);
            else setSolicitudes(data);
        };

        fetchSolicitudes();
    }, [orden]);

    function iconos(tipo: string) {
        switch (tipo) {
            case 'pendiente':
                return faEye;
            case 'aprobada':
                return faCheck;
            case 'rechazada':
                return faX;
            default:
                return faInfo;
        }
    }

    function bgcolor(tipo: string) {
        switch (tipo) {
            case 'pendiente':
                return 'rgb(223, 171, 0)';
            case 'aprobada':
                return 'rgb(65, 170, 17)';
            case 'rechazada':
                return 'rgb(170, 17, 17)';
            default:
                return 'rgb(97, 97, 97)';
        }
    }

    const solicitudesFiltradas = solicitudes
        .filter((sol) =>
            sol.nombre_locacion.toLowerCase().includes(busqueda.toLowerCase())
        )
        .filter((sol) =>
            filtroEstado ? sol.estado === filtroEstado : true
        );

    return (
        <div className={styles.container}>
            <button style={{ position: "absolute", left: "15px", top: "10px", border: "none", background: "transparent", fontSize: "25px", alignItems: "start" }} onClick={() => { navigate(-1) }}>
                <FontAwesomeIcon icon={faReply} />
            </button>
            <header className={styles.header} style={{ paddingTop:'40px', gap:'15px'}}>
                <hr style={{ flexGrow: "1"}} />
                <h2 style={{ textAlign: 'right', paddingRight: "15px", whiteSpace:"nowrap" }} >Gestión de solicitudes</h2>
            </header>

            <div className={styles.filtros}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button className={styles.filtroCard} onClick={() => setIsActiveBuscador(prev => !prev)} >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
                    </button>

                    <div className={styles.filtroCard}>
                        <label htmlFor="filtro"><FontAwesomeIcon icon={faFilter} /> </label>
                        <select id="filtro" onChange={(e) => setFiltroEstado(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="rechazado">Rechazado</option>
                        </select>
                    </div>

                    <div className={styles.filtroCard}>
                        <label htmlFor="orden"><FontAwesomeIcon icon={faSort} /></label>
                        <select id="orden" onChange={(e) => setOrden(e.target.value)}>
                            <option value="desc">Más reciente</option>
                            <option value="asc">Más antiguo</option>
                        </select>
                    </div>
                </div>

                {isActiveBuscador &&
                    <div className={styles.buscar}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                placeholder='Buscar por locación'
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                    </div>
                }
            </div>

            <div className={styles.content}>
                <p style={{ color: 'gray' }}>Listado de Solicitudes</p>
                <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />

                {solicitudesFiltradas.map((solicitud) => (
                    <div className={styles.card} key={solicitud.id}>
                        <div className={styles.estado}
                            style={{ backgroundColor: bgcolor(solicitud.estado) }}
                        >
                            <FontAwesomeIcon icon={iconos(solicitud.estado)} size='xl' style={{ color: 'white' }} />
                        </div>
                        <div className={styles.cardContent}>
                            <p style={{ color: solicitud.nombre_locacion.length > 0 ? 'black' : 'red' }}>
                                {solicitud.nombre_locacion.length > 0 ? solicitud.nombre_locacion : 'Sin nombre'}
                            </p>
                            <p style={{ color: solicitud.direccion.length > 0 ? 'gray' : 'red', fontSize: '0.9rem' }}>
                                {solicitud.direccion.length > 0 ? solicitud.direccion : 'Sin dirección'}
                            </p>
                        </div>
                        <div className={styles.opciones}>
                            <button><FontAwesomeIcon icon={faInfo} /> Revisar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListSolicitudes;
