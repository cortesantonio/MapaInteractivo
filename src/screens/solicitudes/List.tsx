import styles from './List.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faMagnifyingGlass, faFilter, faSort, faCheck, faX, faInfo } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function List() {

    const [isActiveBuscador, setIsActiveBuscador] = useState(false);

    function handleBuscador() {
        setIsActiveBuscador(prevState => !prevState);
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <hr style={{ maxWidth: '50%', minWidth: '150px', width: '50%' }} />
                <h2 style={{ fontSize: '1rem', textAlign: 'right' }}>Gestion de solicitudes</h2>
            </header>
            <div className={styles.filtros}>
                <div style={{ display: 'flex', gap: '5px' }}>

                    <button className={styles.filtroCard} onClick={() => handleBuscador()} >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
                    </button>

                    <div className={styles.filtroCard}>
                        <form action="">
                            <label htmlFor="filtro"><FontAwesomeIcon icon={faFilter} /> </label>
                            <select name="filtro" id="">
                                <option value="">Filtro</option>
                                <option value="">Pendiente</option>
                                <option value="">Aprobado</option>
                                <option value="">Rechazado</option>
                            </select>
                        </form>
                    </div>

                    <div className={styles.filtroCard}>
                        <form action="">
                            <label htmlFor="orden">
                                <FontAwesomeIcon icon={faSort} />
                            </label>
                            <select name="orden" id="">
                                <option value="">Mas reciente</option>
                                <option value="">Mas antiguo</option>
                            </select>
                        </form>
                    </div>
                </div>
                {isActiveBuscador &&
                    <div className={styles.buscar}>
                        <form action="">
                            <input type="text" placeholder='Buscar' />
                            <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                    </div>
                }
            </div>

            <div className={styles.content}>
                <p style={{ color: 'gray' }}>Listado de Solicitudes</p>
                <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />
                <div className={styles.card} >
                    <div className={styles.estado}
                        style={{ backgroundColor: 'rgb(223, 171, 0)' }}
                    >
                        <FontAwesomeIcon icon={faEye} size='xl' style={{ color: 'white' }} />

                    </div>
                    <div className={styles.cardContent}>
                        <p style={{ color: 'black' }}>O'Higgins / Prat</p>
                        <p style={{ color: 'gray', fontSize: '0.9rem' }}>Arturo Prat 700, Curicó, Maule</p>
                    </div>

                    <div className={styles.opciones}>
                        <button><FontAwesomeIcon icon={faInfo} /></button>

                        <button><FontAwesomeIcon icon={faX} /></button>
                    </div>
                </div>

                <div className={styles.card} >
                    <div className={styles.estado}
                        style={{ backgroundColor: 'rgb(0, 173, 14)' }}
                    >
                        <FontAwesomeIcon icon={faCheck} size='xl' style={{ color: 'white' }} />

                    </div>
                    <div className={styles.cardContent}>
                        <p style={{ color: 'black' }}>Hites</p>
                        <p style={{ color: 'gray', fontSize: '0.9rem' }}>Arturo Prat 630, Curicó, Maule</p>
                    </div>

                    <div className={styles.opciones}>
                        <button><FontAwesomeIcon icon={faInfo} /></button>

                        <button><FontAwesomeIcon icon={faX} /></button>
                    </div>
                </div>

                <div className={styles.card} >
                    <div className={styles.estado}
                        style={{ backgroundColor: 'rgb(173, 0, 0)' }}
                    >
                        <FontAwesomeIcon icon={faX} size='xl' style={{ color: 'white' }} />

                    </div>
                    <div className={styles.cardContent}>
                        <p style={{ color: 'black' }}>Escorial De Curico</p>
                        <p style={{ color: 'gray', fontSize: '0.9rem' }}>Yungay 475, Curicó, Maule</p>
                    </div>
                    <div className={styles.opciones}>
                        <button><FontAwesomeIcon icon={faInfo} /></button>

                        <button><FontAwesomeIcon icon={faX} /></button>
                    </div>
                </div>

            </div>

        </div>
    )

}


export default List;