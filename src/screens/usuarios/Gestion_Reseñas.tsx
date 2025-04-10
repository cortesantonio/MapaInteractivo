import styles from "../usuarios/css/Gestion_Reseñas.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, 
faFilter, 
faSort,
faEllipsisVertical,
faBuilding,
faTheaterMasks,faCar,faLocationDot} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';




function Gestion_Reseñas () {

    const [isActiveBuscador, setIsActiveBuscador] = useState(false);
    const [Tipo_Ubicacion_Seleccionado,  setTipo_Ubicacion_Seleccionado] = useState('');
    const [Seleccion_de_Orden, setSeleccion_de_Orden] = useState ("")

    function handleBuscador() {
        setIsActiveBuscador(prevState => !prevState);
    }

    const [ubicaciones] = useState([
        { nombre_locacion: 'Teatro Provincial De Curico', Ubicacion: 'Carmen 556-560, 3341768 Curicó, Maule',Tipo: "Teatro", Fecha_Ingreso: "09-04-2025"},
        { nombre_locacion: 'Al Forno Pizza Romana', Ubicacion: 'Av. Balmaceda 1715,Curicó, Maule',Tipo: "Restaurante",Fecha_Ingreso: "08-04-2025"},
        { nombre_locacion: 'Estacionamiento', Ubicacion: 'Manuel Montt 598-562, Curicó, Maule', Tipo:"Estacionamiento", Fecha_Ingreso: "07-04-2025"},
    ]);
    
    const [busqueda, setBusqueda] = useState('');

    function handleBusquedaChange(e: React.ChangeEvent<HTMLInputElement>) {
        setBusqueda(e.target.value);
    }
    
        const usuariosFiltrados = ubicaciones.filter((locacion) => {
        const coincideNombre = locacion.nombre_locacion.toLowerCase().includes(busqueda.toLowerCase());
        const coincideTipo_De_Ubicacion = Tipo_Ubicacion_Seleccionado === '' || locacion.Tipo === Tipo_Ubicacion_Seleccionado;
        return coincideNombre && coincideTipo_De_Ubicacion;
    }).sort (
        (a,b) => {
            if (Seleccion_de_Orden === "reciente") {
                return new Date(b.Fecha_Ingreso).getTime() - new Date(a.Fecha_Ingreso).getTime();
              }
            
              if (Seleccion_de_Orden === "antiguo") {
                return new Date(a.Fecha_Ingreso).getTime() - new Date(b.Fecha_Ingreso).getTime();
              }
            
              return 0; 
        }
    )

    function iconos (tipo:string) {

        switch (tipo) {
            case "Teatro":
                return faTheaterMasks;
            case "Restaurante":
                return faBuilding;
            case "Estacionamiento":
                return faCar;
            default:
                return faLocationDot
        }
    }
    

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <hr style={{ maxWidth: '70%', minWidth: '150px', width: '60%' }} />
                <h2 style={{textAlign:'right'}} >Gestion de Reseñas</h2>
            </header>
            <div className={styles.filtros}>
                <div style={{ display: 'flex', gap: '5px' }}>

                    <button className={styles.filtroCard} onClick={() => handleBuscador()} >
                        <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
                    </button>

                    

                    <div className={styles.filtroCard}>
                        <form action="">
                            <label htmlFor="filtro"><FontAwesomeIcon icon={faFilter} /> </label>
                            <select name="filtro" value={Tipo_Ubicacion_Seleccionado} onChange={
                                (e) => setTipo_Ubicacion_Seleccionado(e.target.value)
                            }>
                                <option value="">Todos</option>
                                <option value="Teatro">Teatro</option>
                                <option value="Restaurante">Restaurante</option>
                                <option value="Estacionamiento">Estacionamiento</option>
                            </select>
                        </form>
                    </div>

                    
                    

                    <div className={styles.filtroCard}>
                        <form action="">
                            <label htmlFor="orden">
                                <FontAwesomeIcon icon={faSort} />
                            </label>
                            <select value={Seleccion_de_Orden} onChange={(e) =>setSeleccion_de_Orden (e.target.value)}>
                                <option value="">Sin Ordenar</option>
                                <option value="reciente">Mas reciente</option>
                                <option value="antiguo">Mas antiguo</option>
                            </select>
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
                <p style={{ color: 'gray' }}>Gestion De Reseñas</p>
                <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px ', opacity: '50%' }} />
                {usuariosFiltrados.map((locacion, index) => (
        <div className={styles.card} key={index}>
            <div className={styles.estado} style={{ backgroundColor: '#0397fc' }}>
            <FontAwesomeIcon icon={iconos(locacion.Tipo)} size='xl' style={{ color: 'white' }} />
            </div>
            
            <div className={styles.cardContent}>
                <p style={{ color: 'black' }}>{locacion.nombre_locacion}</p>
                <p style={{ color: 'gray', fontSize: '0.9rem' }}>{locacion.Ubicacion}</p>
            </div>
            <div className={styles.opciones}>
                <button><FontAwesomeIcon icon={faEllipsisVertical} /></button>
            </div>
        </div>
            ))}


            </div>

        </div>
    )
}


export default Gestion_Reseñas;