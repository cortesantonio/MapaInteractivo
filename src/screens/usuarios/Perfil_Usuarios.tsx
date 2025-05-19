import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import styles from "../usuarios/css/Perfil_Usuario.module.css"
import { supabase } from "../../services/supabase"
import { useEffect, useState } from "react"
import type { Usuarios } from "../../interfaces/Usuarios"
import type { Resenas } from "../../interfaces/Resenas"
import type { Solicitudes } from "../../interfaces/Solicitudes"
import { useNavigate, useParams } from "react-router-dom"
import NavbarAdmin from "../../components/NavbarAdmin"
import { useAuth } from "../../hooks/useAuth"

interface UsuarioExtendido extends Usuarios {
  discapacidadNombre?: string;
  discapacidadTipo?: string;
}


function Perfil_Usuario() {
  const [usuarios, setUsuarios] = useState<UsuarioExtendido[]>([]);
  const [resenas, setResenas] = useState<Resenas[]>([])
  const [solicitud, setSolicitud] = useState<Solicitudes[]>([])

  // Estado para controlar qué contenido mostrar
  const [vistaActual, setVistaActual] = useState<"perfil" | "resenas" | "aportes">("perfil")

  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth();
  const { userRole } = useAuth()
  useEffect(() => {
    const fetchData = async () => {
      // Obtener datos de reseñas
      const { data: resenasData, error: resenasError } = await supabase
        .from("resenas")
        .select(`id,id_usuario (id,nombre),fecha,calificacion,comentario,id_marcador (id,nombre_recinto,tipo_recinto)`)
        .eq("id_usuario", id)

      if (resenasError) throw resenasError
      setResenas((resenasData as any) || [])

      // Obtener datos del usuario
      const { data: usuariosData, error } = await supabase
        .from("usuarios")
        .select(`
            *,
            discapacidad (
              nombre,
              tipo
            )
          `)
        .eq("id", id)

      if (error) {
        console.error("Error al obtener datos:", error);
      } else {
        const usuariosFormateados = (usuariosData || []).map((usuario) => {
          const discapacidadData = Array.isArray(usuario.discapacidad)
            ? usuario.discapacidad[0]
            : null;

          return {
            ...usuario,
            discapacidadNombre: discapacidadData?.nombre,
            discapacidadTipo: discapacidadData?.tipo,
          };
        });
        setUsuarios(usuariosFormateados);
      }

      // Obtener datos de solicitudes
      const { data: solicitudesData, error: solicitudesError } = await supabase
        .from("solicitudes")
        .select("*")
        .eq("id_usuario", id)

      if (solicitudesError) throw solicitudesError
      setSolicitud(solicitudesData)
    }
    fetchData()
  }, [id])


  const switchEstados = async () => {

    const usuario = usuarios[0];
    if (!usuario) {
      console.error("No se encontró el usuario");
      return;
    }

    const nuevoEstado = !usuario.activo;

    const { error } = await supabase
      .from("usuarios")
      .update({ activo: nuevoEstado })
      .eq("id", id);

    if (error) {
      console.error("Error al cambiar el estado del usuario:", error);
    } else {
      setUsuarios(prev => ({ ...prev, activo: nuevoEstado }));
      alert(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
      navigate("/panel-administrativo/usuarios");
    }

    const fechaHoraActual = new Date().toISOString();

    const Registro_cambios = async () => {
      const tipoAccion = nuevoEstado ? 'Activación de Uusario' : 'Desactivación de Usuario';
      const detalleAccion = nuevoEstado
        ? `Se activó el Usuario con ID ${id}`
        : `Se desactivó el Usuario con ID ${id}`;

      const { data: registro_logs, error: errorLog } = await supabase
        .from('registro_logs')
        .insert([
          {
            id_usuario: user?.id,
            tipo_accion: tipoAccion,
            detalle: detalleAccion,
            fecha_hora: fechaHoraActual,
          }
        ]);

      if (errorLog) {
        console.error('Error al registrar en los logs:', errorLog);
        return;
      }

      console.log('Registro insertado en registro_logs correctamente', registro_logs);
    };

    Registro_cambios();
  };




  // Renderizado del perfil de usuario
  const renderPerfilUsuario = () => {
    return (
      <div className={styles.perfil_info}>
        {usuarios.map((usuario) => (
          <div key={usuario.id} className={styles.containerDatos}>
            <div className={styles.containeritemdatos}>
              <span className={styles.titulosdatos}>Usuario Activo:</span>
              <span className={styles.valorDato}>{usuario.activo ? (<p>Si</p>) : (<p>No</p>)}</span>
            </div>
            <div className={styles.containeritemdatos}>
              <span className={styles.titulosdatos}>Nombre:</span>
              <span className={styles.valorDato}>{usuario.nombre || "Sin información"}</span>
            </div>

            <div className={styles.containeritemdatos}>
              <span className={styles.titulosdatos}>Correo:</span>
              <span className={styles.valorDato}>{usuario.correo || "Sin información"}</span>
            </div>

            <div className={styles.containeritemdatos}>
              <span className={styles.titulosdatos}>Rut:</span>
              <span className={styles.valorDato}>{usuario.rut || "Sin información"}</span>
            </div>

            <div className={styles.containeritemdatos}>
              <span className={styles.titulosdatos}>Género:</span>
              <span className={styles.valorDato}>{usuario.genero || "Sin información"}</span>
            </div>

            {usuario.discapacidadNombre && usuario.discapacidadTipo && (
              <>
                <div className={styles.containeritemdatos}>
                  <span className={styles.titulosdatos}>Discapacidad:</span>
                  <span className={styles.valorDato}>{usuario.discapacidadNombre}</span>
                </div>

                <div className={styles.containeritemdatos}>
                  <span className={styles.titulosdatos}>Tipo:</span>
                  <span className={styles.valorDato}>{usuario.discapacidadTipo}</span>
                </div>
              </>
            )}

            {/*Esta funcion hace que No se muestre el rol en el perfil si el usuario es de rol Usuario,
              solo se podran visualizar en el perfil del Gestor o Admnistrador */}
            {usuario.rol !== "usuario" && (
              <div className={styles.containeritemdatos}>
                <span className={styles.titulosdatos}>Rol:</span>
                <span className={styles.valorDato}>{usuario.rol}</span>
              </div>
            )}
          </div>
        ))}

        <div className={styles.contenedor_botones_perfil}>
          <button className={styles.boton_editar} onClick={() => navigate(`/usuarios/editar/${id}`)}>
            Editar Usuario
          </button>
          {userRole === "administrador" || userRole === 'gestor' ? (
            <button onClick={switchEstados} className={styles.boton_desactivar}>
              {usuarios[0]?.activo ? "Desactivar Usuario" : "Activar Usuario"}
            </button>
          ) : (<></>)}
        </div>
      </div>
    )
  }

  // Renderizado de las reseñas del usuario
  const renderResenasUsuario = () => {
    return (
      <div className={styles.perfil_info}>
        {resenas.length > 0 ? (
          <div style={{ maxHeight: "380px", overflowY: "auto", padding: "0 15px" }}>
            {resenas.map((resena) => (
              <div className={styles.informacion_campos_de_resena} key={resena.id}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                  <div>
                    <h3 style={{ fontWeight: "400" }}>{resena.id_marcador?.nombre_recinto}</h3>
                  </div>

                  <div className={styles.calificacion_fecha_reseña}>
                    <FontAwesomeIcon className={styles.estrella} icon={faStar} />
                    <span>{resena.calificacion}</span>
                    &bull;
                    <span> {new Date(resena.fecha).toLocaleDateString()}</span>
                  </div>

                </div>

                <div className={styles.texto_reseña}>
                  <span>{resena.comentario}</span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className={styles.sin_resenas}>
            <p>Este usuario aún no ha realizado reseñas.</p>
            <hr />
          </div>
        )}
      </div>
    )
  }

  // Renderizado de los aportes del usuario
  const renderAportesUsuario = () => {
    return (
      <div className={styles.perfil_info}>
        {solicitud.length > 0 ? (
          <div style={{ maxHeight: "380px", overflowY: "auto", padding: "0 15px" }}>
            {solicitud.map((aporte) => (
              <div className={styles.informacion_campos_de_resena} key={aporte.id} onClick={() => { navigate(`/panel-administrativo/solicitud/${aporte.id}`) }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: "400" }}>{aporte.nombre_locacion}</h3>
                  </div>

                  <div style={{ flex: 1, textAlign: "right" }}>
                    <span
                      style={{
                        backgroundColor:
                          aporte.estado === "aprobada"
                            ? "rgba(65, 170, 17, 0.15)"
                            : aporte.estado === "rechazada"
                              ? "rgba(170, 17, 17, 0.15)"
                              : "rgba(223, 171, 0, 0.15)",
                        color:
                          aporte.estado === "aprobada"
                            ? "rgb(65, 170, 17)"
                            : aporte.estado === "rechazada"
                              ? "rgb(170, 17, 17)"
                              : "rgb(223, 171, 0)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontWeight: 500,
                        fontSize: "0.9rem"
                      }}
                    >
                      {aporte.estado === "aprobada"
                        ? "Aprobada"
                        : aporte.estado === "rechazada"
                          ? "Rechazada"
                          : "Pendiente"}
                    </span>
                  </div>
                </div>

                <div className={styles.campo}>
                  <p className={styles.valor}>&bull; {aporte.direccion}</p>
                </div>

                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.descripcion}</p>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className={styles.sin_resenas}>
            <p>Este usuario aún no ha realizado aportes.</p>
            <hr />
          </div>
        )}
      </div>
    )
  }

  // Renderizar el contenido según el estado actual
  const renderContenido = () => {
    switch (vistaActual) {
      case "resenas":
        return renderResenasUsuario()
      case "aportes":
        return renderAportesUsuario()
      default:
        return renderPerfilUsuario()
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavbarAdmin />

      <div className={styles.container}>
        <h2 className={styles.titulo}>Usuario</h2>

        <div className={styles.perfil_icono}>
          <img src={usuarios[0]?.avatar_url || ''} className={styles.imgUsuario} alt="" />
        </div>

        <div className={styles.nombre_usuario}>
          {usuarios.length > 0 && (
            <h2 style={{ marginBottom: "15px", fontSize: "1.5rem", paddingBottom: "5px", fontWeight: "400" }}>
              {usuarios[0].nombre}
            </h2>
          )}
        </div>

        <div className={styles.reseñas_usuario}>
          <button
            className={`${styles.botonAcciones} ${vistaActual === "resenas" ? styles.botonActivo : ""}`}
            style={{ gridColumn: "1" }}
            onClick={() => setVistaActual("resenas")}
          >
            Reseñas usuario
          </button>

          <button
            className={`${styles.botonAcciones} ${vistaActual === "perfil" ? styles.botonActivo : ""}`}
            style={{ gridColumn: "2" }}
            onClick={() => setVistaActual("perfil")}
          >
            Perfil Usuario
          </button>

          <button
            className={`${styles.botonAcciones} ${vistaActual === "aportes" ? styles.botonActivo : ""}`}
            style={{ gridColumn: "3" }}
            onClick={() => setVistaActual("aportes")}
          >
            Aportes Usuario
          </button>
        </div>

        <hr className={styles.separador_botones} />

        {renderContenido()}
      </div>

    </div>
  )
}

export default Perfil_Usuario
