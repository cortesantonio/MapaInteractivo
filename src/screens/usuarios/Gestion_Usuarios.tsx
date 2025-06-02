import styles from "../usuarios/css/Gestion_Usuarios.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter, faUser, faUserPlus, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Usuarios } from "../../interfaces/Usuarios";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";

function Gestion_Usuarios() {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usuariosData, error } = await supabase
        .from("usuarios")
        .select("*");

      if (error) {
        console.error("Error al obtener datos:", error);
      } else {
        setUsuarios(usuariosData || []);
      }
    };

    fetchData();
  }, []);

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideNombre = usuario.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideRol = rolSeleccionado === "" || usuario.rol === rolSeleccionado;
    return coincideNombre && coincideRol;
  });

  // Lógica de paginación
  const totalPages = Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = usuariosFiltrados.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Resetear la página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, rolSeleccionado]);

  return (<>
    <NavbarAdmin />
    <div className={styles.container}>

      <header className={styles.header} style={{ paddingTop: "25px", gap: "15px" }}>
        <hr style={{ flexGrow: "1" }} />
        <h2 className={styles.Titulo}>
          Gestión de usuarios
        </h2>
      </header>

      <div className={styles.filtros}>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
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

          <div className={styles.filtroCard}>
            <label htmlFor="filtro">
              <FontAwesomeIcon icon={faFilter} />
            </label>
            <select value={rolSeleccionado} style={{ textTransform: 'capitalize', padding: '5px' }} onChange={(e) => setRolSeleccionado(e.target.value)}
            >
              <option value="">Todos</option>
              {[...new Set(usuarios.map((usuario) => usuario.rol))].map(
                (rolUnico, index) => (
                  <option key={index} value={rolUnico}>
                    {rolUnico}
                  </option>
                )
              )}
            </select>
          </div>

          <div
            className={styles.add_user}
          >
            <button
              onClick={() => {
                navigate("/panel-administrativo/usuarios/agregar");
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} /> Nuevo
            </button>
          </div>
        </div>


      </div>

      <div className={styles.SubTitulo}>
        <p>Listado de usuarios</p>
        <hr style={{ width: "25%", marginTop: "10px", marginBottom: "10px ", opacity: "50%", }} />
      </div>
      <div className={styles.content}>
        <div className={styles.gridUsuarios}>
          {currentItems.map((usuario, index) => (
            <div className={styles.card}
              onClick={() => navigate(`/usuario/perfil/${usuario.id}`)}
              style={{ cursor: "pointer" }}
              key={index}>
              <div
                className={styles.estado}
                style={{ backgroundColor: "#0397fc" }}
              >
                <FontAwesomeIcon icon={faUser} size="xl" style={{ color: "white" }} />
              </div>

              <div
                className={styles.cardContent}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "black", fontSize: "0.8rem", textTransform: 'uppercase', textAlign: 'left' }}>{usuario.rol}</p>
                  <div>{usuario.activo ? (<p style={{ backgroundColor: 'rgba(186, 255, 130, 0.73)', borderRadius: '10px', padding: '2px 10px 2px 10px' }}>Activo</p>) : (<p style={{ backgroundColor: 'rgba(255, 145, 130, 0.73)', borderRadius: '10px', padding: '2px 10px 2px 10px' }} >Desactivado</p>)}</div>
                </div>

                <p style={{ color: "black" }}>{usuario.nombre}</p>
                <p style={{ color: "gray", fontSize: "0.9rem" }}>{usuario.correo}</p>
                {usuario.rut != null ? <p style={{ color: "gray", fontSize: "0.8rem" }}>{usuario.rut}</p> : <p style={{ color: 'gray', fontSize: '0.8rem' }}>RUT no ingresado.</p>}

              </div>
            </div>
          ))}
        </div>

        {/* Controles de paginación */}
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
    </div>
  </>
  );
}

export default Gestion_Usuarios;