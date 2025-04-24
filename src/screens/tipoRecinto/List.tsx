import styles from './css/List.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPenToSquare, faUniversalAccess, faDeleteLeft, faPlus, faReply } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import EditarTipoRecinto from './Editar';
import { useNavigate } from "react-router-dom";

function ListTipoRecinto() {
    const [tiposRecintos, setTiposRecintos] = useState<Tipo_Recinto[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [query, setQuery] = useState('');
    const navigate = useNavigate()

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
            alert('Registro eliminado correctamente.');
            fetchData(); // refresca la lista
        }
    };
    const TipoRecintosFiltrados = tiposRecintos.filter((a) =>
        a.tipo.toLowerCase().includes(query.toLowerCase())
    );


    return (
        <div className={styles.container}>
            <button style={{ position: "absolute", left: "15px", top: "4px", border: "none", background: "transparent", fontSize: "25px", alignItems: "start" }} onClick={() => { navigate(-1)}}>
                <FontAwesomeIcon icon={faReply} />
            </button>
            <header className={styles.header} style={{paddingTop:'20px'}}>
                <hr style={{ maxWidth: '70%', minWidth: '150px', width: '60%' }} />
                <h2 style={{ textAlign: 'right' }} >Gestion de Accesibilidades</h2>
            </header>
            <div className={styles.filtros}>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'right' }}>

                    <button className={styles.filtroCard} onClick={() => handleBuscador()} >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
                    </button>
                    <button className={styles.agregarCard} style={{ backgroundColor: 'red' }}>
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

            <div className={styles.content}>
                <p style={{ color: 'gray' }}>Listado</p>

                <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />

                {TipoRecintosFiltrados.map((tRecinto) => (
                    <div key={tRecinto.id} className={styles.card} >
                        <div className={styles.estado}
                            style={{ backgroundColor: 'rgb(0, 97, 223)', }}
                        >
                            <FontAwesomeIcon icon={faUniversalAccess} size='xl' style={{ color: 'white' }} />
                        </div>
                        <div className={styles.cardContent}>
                            <p style={{ color: 'gray', fontSize: '0.9rem', textTransform: 'capitalize' }}>{tRecinto.tipo}</p>
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
    )

}


export default ListTipoRecinto;