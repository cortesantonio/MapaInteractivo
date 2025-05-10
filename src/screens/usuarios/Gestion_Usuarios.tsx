import styles from "../usuarios/css/Gestion_Usuarios.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faUser,
  faUserPen,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Usuarios } from "../../interfaces/Usuarios";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
function Gestion_Usuarios() {

  const navigate = useNavigate();

  const [isActiveBuscador, setIsActiveBuscador] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [busqueda, setBusqueda] = useState("");

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

  const handleBuscador = () => {
    setIsActiveBuscador((prevState) => !prevState);
  };

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

  return (<>
    <NavbarAdmin />
    <div className={styles.container}>

      <header className={styles.header} style={{ paddingTop: "25px", gap: "15px" }}>
        <hr style={{ flexGrow: "1" }} />
        <h2 className={styles.Titulo}>
          Gestion de Usuarios
        </h2>
      </header>

      <div className={styles.filtros}>
        <div style={{ display: "flex", gap: "5px" }}>
          <button className={styles.filtroCard} onClick={handleBuscador}>
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscador
          </button>

          <div className={styles.filtroCard}>
            <label htmlFor="filtro">
              <FontAwesomeIcon icon={faFilter} />
            </label>
            <select value={rolSeleccionado} onChange={(e) => setRolSeleccionado(e.target.value)}
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
            style={{ paddingLeft: "10vw" }}
          >
            <form action="">
              <button
                onClick={() => {
                  navigate("/panel-administrativo/usuarios/agregar");
                }}
              >
                <FontAwesomeIcon icon={faUserPlus} /> Nuevo
              </button>
            </form>
          </div>
        </div>

        {isActiveBuscador && (
          <div className={styles.buscar}>
            <form action="">
              <input
                type="text"
                placeholder="Buscar"
                value={busqueda}
                onChange={handleBusquedaChange}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
          </div>
        )}
      </div>

      <div className={styles.SubTitulo}>
        <p>Gestion Usuarios</p>
        <hr style={{ width: "25%", marginTop: "10px", marginBottom: "10px ", opacity: "50%", }} />
      </div>
      <div className={styles.content}>
        <div className={styles.gridUsuarios}>
          {usuariosFiltrados.map((usuario, index) => (
            <div className={styles.card} key={index}>
              <div
                className={styles.estado}
                style={{ backgroundColor: "#0397fc" }}
              >
                <FontAwesomeIcon icon={faUser} size="xl" style={{ color: "white" }} />
              </div>

              <div
                className={styles.cardContent}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/usuario/perfil/${usuario.id}`)}
              >
                <p style={{ color: "black" }}>{usuario.nombre}</p>
                <p style={{ color: "gray", fontSize: "0.9rem" }}>{usuario.rol}</p>
              </div>

              <div className={styles.opciones}>
                <button
                  onClick={() => {
                    navigate(`/usuarios/editar/${usuario.id}`);
                  }}
                >
                  <FontAwesomeIcon icon={faUserPen} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  );
}

export default Gestion_Usuarios;