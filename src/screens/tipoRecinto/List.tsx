import styles from './css/List.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPenToSquare, faUniversalAccess, faDeleteLeft, faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import EditarTipoRecinto from './Editar';
import NavbarAdmin from '../../components/NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ListTipoRecinto() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [tiposRecintos, setTiposRecintos] = useState<Tipo_Recinto[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [busqueda, setBusqueda] = useState('');
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);


    const fetchData = async () => {
        const { data, error } = await supabase
            .from('tipo_recinto')
            .select('*');
        if (!error) setTiposRecintos(data);
    }

    useEffect(() => {
        fetchData();
    }, []);


    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('¿Estás seguro que deseas eliminar este tipo de recinto?');

        if (!confirmDelete) return;

        const { error } = await supabase
            .from('tipo_recinto')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error al eliminar:', error);
            alert('Hubo un error al eliminar el registro.');
        } else {
            alert('Tipo Recinto eliminado correctamente.');
            fetchData(); // refresca la lista
            Registro_cambios(id);
        }

    };

    const fechaHoraActual = new Date().toISOString();
    const Registro_cambios = async (id: number) => {
        const { error: errorLog } = await supabase
            .from('registro_logs')
            .insert([
                {
                    id_usuario: user?.id,
                    tipo_accion: 'Eliminación de un Tipo Recinto',
                    detalle: `Se eliminó un Tipo de Recinto con ID ${id}`,
                    fecha_hora: fechaHoraActual,
                }
            ]);

        if (errorLog) {
            console.error('Error al registrar en los logs:', errorLog);
            return;
        }

    };

    const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const tiposFiltrados = tiposRecintos.filter((a) =>
        a.tipo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPages = Math.ceil(tiposFiltrados.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = tiposFiltrados.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [busqueda]);


    if (selectedId !== null) {
        return (
            <EditarTipoRecinto
                idTipoRecinto={selectedId}
                onCancel={() => setSelectedId(null)}
                onUpdate={() => {
                    fetchData(); // refresca lista después de editar
                    setSelectedId(null); // vuelve a lista
                }}
            />
        );
    }


    return (
        <>
            <NavbarAdmin />
            <div className={styles.container}>
                <header className={styles.header} style={{ paddingTop: '40px', gap: '15px' }}>
                    <hr style={{ flexGrow: "1" }} />
                    <h2 style={{ textAlign: 'right', paddingRight: "15px", whiteSpace: "nowrap" }} >Categoría de recintos</h2>
                </header>
                <div className={styles.filtros}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'right' }}>
                        <div className={styles.filtroCard} style={{ position: 'relative' }}>
                            <label>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </label>
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
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
                        <button className={styles.agregarCard} style={{ backgroundColor: 'red' }} onClick={() => navigate('/panel-administrativo/tipo-recinto/agregar')}>
                            <FontAwesomeIcon icon={faPlus} color='white' /> Agregar
                        </button>
                    </div>

                </div>

                <div className={styles.SubTitulo}>
                    <p>Listado de recintos</p>
                    <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />
                </div>
                <div className={styles.content}>

                    {currentItems.map((tRecinto) => (
                        <div key={tRecinto.id} className={styles.card} >
                            <div className={styles.estado}
                                style={{ backgroundColor: 'rgb(0, 97, 223)' }}
                            >
                                <FontAwesomeIcon icon={faUniversalAccess} size='xl' style={{ color: 'white' }} />
                            </div>
                            <div className={styles.cardContent}>
                                <p style={{ color: 'black', fontSize: '1rem', textTransform: 'capitalize' }}>{tRecinto.tipo}</p>
                            </div>

                            <div className={styles.opciones}>
                                <button title='Editar' onClick={() => setSelectedId(tRecinto.id)}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </button>
                                <button title='Eliminar' onClick={() => handleDelete(tRecinto.id)} >
                                    <FontAwesomeIcon icon={faDeleteLeft} />
                                </button>
                            </div>
                        </div>
                    ))}

                </div>

                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '20px',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                            Anterior
                        </button>

                        <div style={{
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'center'
                        }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: currentPage === page ? '#0397fc' : 'white',
                                        color: currentPage === page ? 'white' : 'black',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            Siguiente
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                )}

            </div>
        </>

    )

}


export default ListTipoRecinto;