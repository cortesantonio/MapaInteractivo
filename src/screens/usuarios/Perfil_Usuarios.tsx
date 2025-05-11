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
function Perfil_Usuario() {
  const [usuarios, setUsuarios] = useState<Usuarios[]>([])
  const [resenas, setResenas] = useState<Resenas[]>([])
  const [solicitud, setSolicitud] = useState<Solicitudes[]>([])

  // Estado para controlar qué contenido mostrar
  const [vistaActual, setVistaActual] = useState<"perfil" | "resenas" | "aportes">("perfil")

  const navigate = useNavigate()
  const { id } = useParams()

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
      const { data: usuariosData, error } = await supabase.from("usuarios").select("*").eq("id", id)

      if (error) {
        console.error("Error al obtener datos:", error)
      } else {
        setUsuarios(usuariosData || [])
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

  // Renderizado del perfil de usuario
  const renderPerfilUsuario = () => {
    return (
      <div className={styles.perfil_info}>
        <div>
          <div className={styles.reseñas_usuario}>
            <button onClick={() => setVistaActual("resenas")}>Reseñas usuario</button>
            <button onClick={() => setVistaActual("aportes")}>Aportes Usuario</button>
          </div>
          <hr className={styles.separador_botones} />

          {usuarios.map((usuario) => (
            <div className={styles.informacion_campos} key={usuario.id}>
              <div className={styles.campo}>
                <span className={styles.label}>Nombre:</span>
                <p className={styles.valor}>{usuario.nombre}</p>
                <hr />
              </div>

              <div className={styles.campo}>
                <span className={styles.label}>Correo:</span>
                <p className={styles.valor}>{usuario.correo}</p>
                <hr />
              </div>
              {/*Esta funcion hace que No se muestre el rol en el perfil si el usuario es de rol Usuario,
              solo se podran visualizar en el perfil del Gestor o Admnistrador */}
              {usuario.rol !== "usuario" && (
                <div className={styles.campo}>
                  <span className={styles.label}>Rol:</span>
                  <p className={styles.valor}>{usuario.rol}</p>
                  <hr />
                </div>
              )}

            </div>
          ))}
        </div>

        <div className={styles.contenedor_botones_perfil}>
          <button className={styles.boton_editar} onClick={() => navigate(`/usuarios/editar/${id}`)}>
            Editar Usuario
          </button>
          <button className={styles.boton_desactivar}>Desactivar Usuario</button>
        </div>
      </div>
    )
  }

  // Renderizado de las reseñas del usuario
  const renderResenasUsuario = () => {
    return (
      <div className={styles.perfil_info}>
        <div className={styles.reseñas_usuario}>
          <button onClick={() => setVistaActual("perfil")}>Perfil Usuario</button>
          <button onClick={() => setVistaActual("aportes")}>Aportes Usuario</button>
        </div>
        <hr className={styles.separador_botones} />

        {resenas.length > 0 ? (
          <div style={{ maxHeight: "380px", overflowY: "auto", padding: "0 15px" }}>
            {resenas.map((resena) => (
              <div className={styles.informacion_campos_de_resena} key={resena.id}>
                <div>
                  <label>Nombre Recinto:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{resena.id_marcador?.nombre_recinto}</p>
                </div>

                <div>
                  <label>Comentario:</label>
                </div>
                <div className={styles.texto_reseña}>
                  <span>{resena.comentario}</span>
                </div>

                <div className={styles.campo}>
                  <label>Calificación:</label>
                </div>
                <div className={styles.calificacion_fecha_reseña}>
                  <FontAwesomeIcon className={styles.estrella} icon={faStar} />
                  <span>{resena.calificacion}</span>
                </div>
                <div>
                  <label>Fecha Reseña:</label>
                </div>
                <div className={styles.texto_reseña}>
                  <span> {new Date(resena.fecha).toLocaleDateString()}</span>
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
        <div className={styles.reseñas_usuario}>
          <button onClick={() => setVistaActual("perfil")}>Perfil Usuario</button>
          <button onClick={() => setVistaActual("resenas")}>Reseñas usuario</button>
        </div>
        <hr className={styles.separador_botones} />

        {solicitud.length > 0 ? (
          <div style={{ maxHeight: "380px", overflowY: "auto", padding: "0 15px" }}>
            {solicitud.map((aporte) => (
              <div className={styles.informacion_campos_de_resena} key={aporte.id}>

                <div>
                  <label>Nombre Locación:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.nombre_locacion}</p>
                </div>



                {/* <div>
                  <label>Tipo de solicitud:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.nombre_locacion}</p>
                </div> */}

                <div>
                  <label>Descripción</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.descripcion}</p>
                </div>

                <div>
                  <label>Dirección</label>
                </div>

                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.direccion}</p>
                </div>

                <div>
                  <label>Estado:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.estado}</p>
                </div>

                {/* <div>
                  <label>Documentación:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.documentacion}</p>
                </div> */}

                {/* <div>
                  <label>Fecha Ingreso:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{new Date(aporte.fecha_ingreso).toLocaleDateString()}</p>
                </div> */}

                {/* <div>
                  <label>Respuesta Rechazo:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.respuesta_rechazo}</p>
                </div> */}

                {/* <div>
                  <label>Fecha Revisión:</label>
                </div>
                <div className={styles.campo}>
                  <p className={styles.valor}>{new Date(aporte.fecha_revision).toLocaleDateString()}</p>
                </div>

                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.cumple_ley_21015}</p>
                </div>

                <div className={styles.campo}>
                  <p className={styles.valor}>{aporte.accesibilidad_certificada}</p>
                </div> */}
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
    <div>
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

        {renderContenido()}
      </div>

    </div>
  )
}

export default Perfil_Usuario
