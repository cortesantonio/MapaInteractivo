import styles from './css/List.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPenToSquare, faUniversalAccess, faDeleteLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import EditarTipoRecinto from './Editar';
import NavbarAdmin from '../../components/NavbarAdmin';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ListTipoRecinto() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tiposRecintos, setTiposRecintos] = useState<Tipo_Recinto[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [query, setQuery] = useState('');

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('tipo_recinto')
            .select('*');
        if (!error) setTiposRecintos(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [isActiveBuscador, setIsActiveBuscador] = useState(false);

    function handleBuscador() {
        setIsActiveBuscador(prevState => !prevState);
    }

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
    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('¿Estás seguro que deseas eliminar este registro?');

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
        const { data: registro_logs, error: errorLog } = await supabase
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

        console.log(' Registro insertado en registro_logs correctamente', registro_logs);
    };

    const TipoRecintosFiltrados = tiposRecintos.filter((a) =>
        a.tipo.toLowerCase().includes(query.toLowerCase())
    );


    return (<>
        <NavbarAdmin />
        <div className={styles.container}>

            <header className={styles.header} style={{ paddingTop: '40px', gap: '15px' }}>
                <hr style={{ flexGrow: "1" }} />
                <h2 style={{ textAlign: 'right', paddingRight: "15px", whiteSpace: "nowrap" }} >Gestión de recintos</h2>
            </header>
            <div className={styles.filtros}>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'right' }}>

                    <button className={styles.filtroCard} onClick={() => handleBuscador()} >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
                    </button>
                    <button className={styles.agregarCard} style={{ backgroundColor: 'red' }} onClick={() => navigate('/panel-administrativo/tipo-recinto/agregar')}>
                        <FontAwesomeIcon icon={faPlus} color='white' /> Agregar
                    </button>
                </div>
                {isActiveBuscador &&
                    <div className={styles.buscar}>
                        <form action="">
                            <input type="text" placeholder='Buscar'
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}

                            />
                            <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                    </div>
                }
            </div>

            <div className={styles.SubTitulo}>
                <p>Listado de recintos</p>
                <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />
            </div>
            <div className={styles.content}>


                {TipoRecintosFiltrados.map((tRecinto) => (
                    <div key={tRecinto.id} className={styles.card} >
                        <div className={styles.estado}
                            style={{ backgroundColor: 'rgb(0, 97, 223)', }}
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
                            <button title='Borrar filtro' onClick={() => handleDelete(tRecinto.id)} ><FontAwesomeIcon icon={faDeleteLeft} /></button>
                        </div>
                    </div>
                ))}





            </div>

        </div>
    </>

    )

}


export default ListTipoRecinto;