import styles from './css/RegistrosLogs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Registro_Logs } from '../../interfaces/Registro_Logs';
import NavbarAdmin from '../../components/NavbarAdmin';
import { useNavigate } from 'react-router-dom';

export default function RegistroLogs() {
    const [busqueda, setBusqueda] = useState('');
    const [registroLogs, setRegistrosLogs] = useState<Registro_Logs[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const getItemsPerPage = (height: number): number => {
        if (height < 1000) return 10;
        return 17;
    };

    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage(window.innerHeight));

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(getItemsPerPage(window.innerHeight));
        };

        window.addEventListener('resize', handleResize);

        // Establece el valor correcto en el primer render
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('registro_logs')
            .select(`
                *,
                id_usuario (
                    id, nombre, rol
                )
            `);
        if (!error) setRegistrosLogs(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    function handleBusquedaChange(e: React.ChangeEvent<HTMLInputElement>) {
        setBusqueda(e.target.value);
    }

    // Filtro en tiempo real por tipo_accion o detalle
    const registrosFiltrados = registroLogs
        .filter((log) =>
            log.tipo_accion.toLowerCase().includes(busqueda.toLowerCase())
        )
        .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());

    const totalPages = Math.ceil(registrosFiltrados.length / itemsPerPage);

    const paginatedLogs = registrosFiltrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    function handlePageChange(newPage: number) {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }

    // Funcion de complilacion de paginación
    const getVisiblePageRange = (): number[] => {
        const maxVisible = window.innerWidth <= 768 ? 3 : 7;
        const half = Math.floor(maxVisible / 2);

        let start = currentPage - half;
        let end = currentPage + half;

        if (start < 1) {
            start = 1;
            end = Math.min(maxVisible, totalPages);
        }

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, totalPages - maxVisible + 1);
        }

        const range: number[] = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    };


    return (
        <>
            <NavbarAdmin />
            <div className={styles.container}>

                <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Gestión de registros</h2>

                <div className={styles.filtros}>
                    <div className={styles.filtroCard} style={{ position: 'relative' }}>
                        <label>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar por tipo de acción"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            style={{
                                width: '150px',
                                padding: '5px',
                                border: 'none',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div className={styles.content}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Fecha y hora</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Tipo de acción</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>{new Date(log.fecha_hora).toLocaleString()}</td>
                                    <td><button style={{ textTransform: 'capitalize' }} onClick={() => { navigate(`/usuario/perfil/${log.id_usuario?.id}`) }}>{log.id_usuario?.nombre ?? 'Desconocido'} <FontAwesomeIcon icon={faArrowUpRightFromSquare} size='xs' /></button></td>
                                    <td style={{ textTransform: 'capitalize' }}>{log.id_usuario?.rol ?? 'Desconocido'}</td>
                                    <td>{log.tipo_accion}</td>
                                    <td>{log.detalle}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.paginacion}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>

                    {getVisiblePageRange().map((page) => (
                        <button
                            key={page}
                            className={currentPage === page ? styles.activePage : ''}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}


                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>

            </div>

        </>
    );
}

