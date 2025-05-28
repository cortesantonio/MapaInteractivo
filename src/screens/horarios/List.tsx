import styles from "./css/List.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilter, faBuilding, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from "../../interfaces/Tipo_Recinto";
import { Marcador } from '../../interfaces/Marcador';
import { useNavigate } from 'react-router-dom'
import NavbarAdmin from "../../components/NavbarAdmin";

function ListHorarioMarcador() {
  const [busqueda, setBusqueda] = useState('');
  const [Tipo_Ubicacion_Seleccionado, setTipo_Ubicacion_Seleccionado] = useState('');
  const [tipoRecinto, setTipoRecinto] = useState<Tipo_Recinto[]>();
  const [Gestion_resenas, Set_Resenas] = useState<Marcador[]>([]);
  const ITEMS_PER_PAGE = 10;
  const [showFiltroOptions, setShowFiltroOptions] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const { data: tipoRecintoData, error: tipoRecintoError } = await supabase
        .from('tipo_recinto')
        .select('*');

      const { data: gestionResenasData, error: gestionResenasError } = await supabase
        .from('marcador')
        .select(`
          *,
          tipo_recinto:tipo_recinto (
            tipo
          )
        `);

      if (tipoRecintoError || gestionResenasError) {
        console.error('Error al obtener datos:', tipoRecintoError || gestionResenasError);
      } else {
        setTipoRecinto(tipoRecintoData || []);
        Set_Resenas(gestionResenasData || []);
      }
    };

    fetchData();
  }, []);

  function handleBusquedaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBusqueda(e.target.value);
  }

  const filteredTipoRecinto = tipoRecinto?.filter(tipo =>
    tipo.tipo.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  const Edificio = Gestion_resenas.filter((recinto) => {
    const nombre = recinto.nombre_recinto.toLowerCase();
    const tipo = (recinto.tipo_recinto as any)?.tipo.toLowerCase();
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda = nombre.includes(textoBusqueda) || tipo.includes(textoBusqueda);
    const coincideTipo =
      Tipo_Ubicacion_Seleccionado === '' ||
      tipo === Tipo_Ubicacion_Seleccionado.toLowerCase();
    return coincideBusqueda && coincideTipo;
  });


  const totalPages = Math.ceil(Edificio.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = Edificio.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, Tipo_Ubicacion_Seleccionado]);

  return (
    <>
      <NavbarAdmin />
      <div className={styles.container}>

        <header className={styles.header} style={{ paddingTop: '40px', gap: '15px' }}>
          <hr style={{ flexGrow: "1" }} />
          <h2 style={{ textAlign: 'right', paddingRight: "15px", whiteSpace: "nowrap" }}>Gestión de horarios de marcadores</h2>
        </header>

        <div className={styles.filtros}>
          <div style={{ display: 'flex', gap: '5px' }}>

            <div className={styles.filtroCard} style={{ position: 'relative' }}>
              <label>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o tipo..."
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

            <div className={styles.filtroCard} style={{ position: 'relative' }}>
              <label>
                <FontAwesomeIcon icon={faFilter} />
              </label>
              <input
                type="text"
                value={filtroBusqueda}
                onChange={(e) => {
                  setFiltroBusqueda(e.target.value);
                  setShowFiltroOptions(true);
                }}
                onFocus={() => setShowFiltroOptions(true)}
                placeholder="Filtrar por tipo..."
                style={{
                  width: '150px',
                  padding: '5px',
                  border: 'none',
                  outline: 'none'
                }}
              />
              {showFiltroOptions && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  <div
                    style={{
                      padding: '8px',
                      cursor: 'pointer',
                      backgroundColor: Tipo_Ubicacion_Seleccionado === '' ? '#f0f0f0' : 'white'
                    }}
                    onClick={() => {
                      setTipo_Ubicacion_Seleccionado('');
                      setFiltroBusqueda('');
                      setShowFiltroOptions(false);
                    }}
                  >
                    Todos
                  </div>
                  {filteredTipoRecinto?.map((tipo) => (
                    <div
                      key={tipo.id}
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        backgroundColor: Tipo_Ubicacion_Seleccionado === tipo.tipo ? '#f0f0f0' : 'white'
                      }}
                      onClick={() => {
                        setTipo_Ubicacion_Seleccionado(tipo.tipo);
                        setFiltroBusqueda(tipo.tipo);
                        setShowFiltroOptions(false);
                      }}
                    >
                      {tipo.tipo}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        <div className={styles.SubTitulo}>
          <p>Listado de marcadores</p>
          <hr style={{ width: '25%', marginTop: '10px', marginBottom: '10px', opacity: '50%' }} />
        </div>
        <div className={styles.content}>
          {currentItems.map((locacion: { id: number, nombre_recinto: string; direccion: string; tipo_recinto: string; }, index: number) => (
            <div className={styles.card} key={index} onClick={() => { navigate(`/panel-administrativo/marcadores/horario/${locacion.id}`) }}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.estado} style={{ backgroundColor: '#0397fc' }}>
                <FontAwesomeIcon icon={faBuilding} size="xl" style={{ color: 'white' }} />
              </div>

              <div className={styles.cardContent}  >
                <p style={{ color: 'gray', fontSize: '0.7rem', textTransform: 'capitalize' }}>{(locacion.tipo_recinto as any)?.tipo}</p>

                <p style={{ color: 'black' }}>{locacion.nombre_recinto || "Cargando..."}</p>
                <p style={{ color: 'gray', fontSize: '0.9rem' }}>{locacion.direccion}</p>
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

  );
}

export default ListHorarioMarcador;