import styles from "../usuarios/css/Gestion_Usuarios.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter, faSort,faUser ,faEllipsisVertical,faUserPlus} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function Gestion_Usuarios() {

    const [isActiveBuscador, setIsActiveBuscador] = useState(false);

    function handleBuscador() {
        setIsActiveBuscador(prevState => !prevState);
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <hr style={{ maxWidth: '70%', minWidth: '150px', width: '60%' }} />
                <h2 style={{textAlign:'right'}} >Gestion de Usuarios</h2>
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
                                <option value="">Usuario</option>
                                <option value="">Gestor</option>
                                <option value="">Administrador</option>
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

                    <div className= {styles.add_user}>
                        <form action="">
                            <button>
                                <FontAwesomeIcon icon={faUserPlus} /> Nuevo
                            </button>
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
                <p style={{ color: 'gray' }}>Gestion Usuarios</p>
                <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />
                <div className={styles.card} >
                    <div className={styles.estado}
                        style={{ backgroundColor: '#0397fc' }}
                    >
                        <FontAwesomeIcon icon={faUser} size='xl' style={{ color: 'white' }} />

                    </div>
                    <div className={styles.cardContent}>
                        <p style={{ color: 'black' }}>Alberto Fuente</p>
                        <p style={{ color: 'gray', fontSize: '0.9rem' }}>Usuario</p>
                    </div>

                    <div className={styles.opciones}>
                        <button><FontAwesomeIcon icon={faEllipsisVertical}/></button>

                        
                    </div>
                </div>

                <div className={styles.card} >
                    <div className={styles.estado}
                        style={{ backgroundColor: '#0397fc' }}
                    >
                        <FontAwesomeIcon icon={faUser} size='xl' style={{ color: 'white' }} />

                    </div>
                    <div className={styles.cardContent}>
                        <p style={{ color: 'black' }}>Adrián López</p>
                        <p style={{ color: 'gray', fontSize: '0.9rem' }}>Gestor</p>
                    </div>

                    <div className={styles.opciones}>
                        <button><FontAwesomeIcon icon={faEllipsisVertical}/></button>
                    </div>
                </div>

                <div className={styles.card} >
                    <div className={styles.estado}
                        style={{ backgroundColor: '#0397fc' }}
                    >
                        <FontAwesomeIcon icon={faUser} size='xl' style={{ color: 'white' }} />

                    </div>
                    <div className={styles.cardContent}>
                        <p style={{ color: 'black' }}>Sofía Ramírez</p>
                        <p style={{ color: 'gray', fontSize: '0.9rem' }}>Administrador</p>
                    </div>
                    <div className={styles.opciones}>
                        <button><FontAwesomeIcon icon={faEllipsisVertical}/></button>
                    </div>
                </div>

            </div>

        </div>
    )

}

export default Gestion_Usuarios;