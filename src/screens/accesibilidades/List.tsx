import styles from './css/List.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPenToSquare, faUniversalAccess, faDeleteLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import EditarAccesibilidad from './Editar';
import { useNavigate } from "react-router-dom";
import NavbarAdmin from '../../components/NavbarAdmin';

function ListAccesibilidad() {
    const [accesibilidades, setAccesibilidades] = useState<Accesibilidad[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [query, setQuery] = useState('');
    const navigate = useNavigate()

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('accesibilidad')
            .select('*');
        if (!error) setAccesibilidades(data);
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
            <EditarAccesibilidad
                accesibilidadId={selectedId}
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
            .from('accesibilidad')
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
    const filteredAccesibilidades = accesibilidades.filter((a) =>
        a.nombre.toLowerCase().includes(query.toLowerCase()) ||
        a.tipo.toLowerCase().includes(query.toLowerCase())
    );


    return (

        <>
            <NavbarAdmin />
            <div className={styles.container}>

                <header className={styles.header} style={{ paddingTop: '40px', gap: '15px' }}>
                    <hr style={{ flexGrow: "1" }} />
                    <h2 style={{ textAlign: 'right', paddingRight: "15px", whiteSpace: "nowrap" }} >Gestion de Accesibilidades</h2>
                </header>
                <div className={styles.filtros}>
                    <div style={{ display: 'flex', gap: '5px' }}>

                        <button className={styles.filtroCard} onClick={() => handleBuscador()} >
                            <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
                        </button>
                        <button className={styles.agregarCard} style={{ backgroundColor: 'red' }} onClick={() => navigate('/panel-administrativo/accesibilidades/agregar')}>
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
                    <p>Listado</p>
                    <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />
                </div>
                <div className={styles.content}>


                    {filteredAccesibilidades.map((accesibilidad) => (
                        <div key={accesibilidad.id} className={styles.card} >
                            <div className={styles.estado}
                                style={{ backgroundColor: 'rgb(0, 97, 223)', }}
                            >
                                <FontAwesomeIcon icon={faUniversalAccess} size='xl' style={{ color: 'white' }} />
                            </div>
                            <div className={styles.cardContent}>
                                <p style={{ color: 'black', textTransform: 'capitalize' }}>{accesibilidad.nombre}</p>
                                <p style={{ color: 'gray', fontSize: '0.9rem', textTransform: 'capitalize' }}>Tipo: {accesibilidad.tipo}</p>
                            </div>

                            <div className={styles.opciones}>
                                <button title='Editar' onClick={() => setSelectedId(accesibilidad.id)}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </button>
                                <button title='Borrar filtro' onClick={() => handleDelete(accesibilidad.id)} ><FontAwesomeIcon icon={faDeleteLeft} /></button>
                            </div>
                        </div>
                    ))}





                </div>

            </div>
        </>
    )

}


export default ListAccesibilidad;