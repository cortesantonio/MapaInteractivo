import styles from "../resenas/css/Gestion_Resenas.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faFilter,
  faEllipsisVertical,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

function Gestion_Resenas() {
  const [isActiveBuscador, setIsActiveBuscador] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [Tipo_Ubicacion_Seleccionado, setTipo_Ubicacion_Seleccionado] = useState('');
  const [Estado_De_Datos] = useState(true);

  const [ubicaciones] = useState([
    {
      nombre_recinto: 'Teatro Provincial De Curico',
      direccion: 'Carmen 556-560, 3341768 Curicó, Maule',
      tipo_Recinto: 'Teatro',
      Fecha_Ingreso: '09-04-2025',
    },
    {
      nombre_recinto: 'Al Forno Pizza Romana',
      direccion: 'Av. Balmaceda 1715,Curicó, Maule',
      tipo_Recinto: 'Restaurante',
      Fecha_Ingreso: '08-04-2025',
    },
    {
      nombre_recinto: 'Estacionamiento',
      direccion: 'Manuel Montt 598-562, Curicó, Maule',
      tipo_Recinto: 'Estacionamiento',
      Fecha_Ingreso: '07-04-2025',
    },
  ]);

  const [Gestion_resenas, Set_Resenas] = useState<any[]>([]);

  useEffect(() => {
    const consulta_Sql = async () => {
      if (!Estado_De_Datos) {
        const { data, error } = await supabase
          .from('marcador')
          .select(`
            id,
            nombre_recinto,
            direccion,
            tipo_recinto (
              id,
              tipo
            ),
            solicitudes (
              fecha_ingreso
            )
          `);
        if (error) {
          console.log('Error al Obtener las reseñas', error);
        } else {
          Set_Resenas(data);
        }
      }
    };

    consulta_Sql();
  }, [Estado_De_Datos]);

  function handleBuscador() {
    setIsActiveBuscador(prev => !prev);
  }

  function handleBusquedaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBusqueda(e.target.value);
  }

  function iconos(nombre: string) {

    switch (nombre) {
      default:
        return faBuilding;
    }
  }

  

  const datosBase = Gestion_resenas.map(item => ({
    nombre_recinto: item.nombre_recinto,
    direccion: item.direccion,
    tipo_Recinto: item.tipo_recinto?.tipo || "Sin tipo",
    Fecha_Ingreso: item.solicitudes?.[0]?.fecha_ingreso || "Sin fecha",
  }));

  const datosParaMostrar = Estado_De_Datos ? ubicaciones : datosBase;

  const usuariosFiltrados = datosParaMostrar
    .filter(loc => {
      const coincideNombre = loc.nombre_recinto.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = Tipo_Ubicacion_Seleccionado === '' || loc.tipo_Recinto === Tipo_Ubicacion_Seleccionado;
      return coincideNombre && coincideTipo;
    })

    const tipo_ubicacion = ["Teatro","Restaurante", "Estacionamiento"]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <hr style={{ maxWidth: '70%', minWidth: '150px', width: '60%' }} />
        <h2 style={{ textAlign: 'right' }}>Gestion de Reseñas</h2>
      </header>

      <div className={styles.filtros}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className={styles.filtroCard} onClick={handleBuscador}>
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
          </button>

          <div className={styles.filtroCard}>
            <label>
              <FontAwesomeIcon icon={faFilter} />
            </label>
              <select value={Tipo_Ubicacion_Seleccionado} onChange={e => setTipo_Ubicacion_Seleccionado(e.target.value)}>
              <option value="">Todos</option>
              {tipo_ubicacion.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

         
        </div>

        {isActiveBuscador && (
          <div className={styles.buscar}>
            <form onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Buscar" value={busqueda} onChange={handleBusquedaChange} />
              <button type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <p style={{ color: 'gray' }}>Gestion De Reseñas</p>
        <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px', opacity: '50%' }} />

        {usuariosFiltrados.map((locacion, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.estado} style={{ backgroundColor: '#0397fc' }}>
              <FontAwesomeIcon icon={iconos(locacion.tipo_Recinto)} size="xl" style={{ color: 'white' }} />
            </div>

            <div className={styles.cardContent}>
              <p style={{ color: 'black' }}>{locacion.nombre_recinto || "Cargando..."}</p>
              <p style={{ color: 'gray', fontSize: '0.9rem' }}>{locacion.direccion}</p>
            </div>

            <div className={styles.opciones}>
              <button>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gestion_Resenas;