import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faReply
} from "@fortawesome/free-solid-svg-icons"
import styles from "../usuarios/css/Formularios.module.css"
import { supabase } from "../../services/supabase"
import { useState, useEffect } from "react"
import { Usuarios } from "../../interfaces/Usuarios"
import { useNavigate, useParams } from "react-router-dom"

function Editar_Usuarios() {
  const { id } = useParams()
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const navigate = useNavigate();
  function Presionar_boton() {
    console.log("Botón presionado");

  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data: usuariosData, error } = await supabase.from('usuarios').select('*').eq('id', id)
      if (error) {
        console.error('Error al obtener datos:', error)
      } else {
        setUsuarios(usuariosData || [])
        console.log('Datos de usuarios obtenidos:', usuariosData)
      }
    };

    fetchUsuarios()
  }, [id])

  /*  const Actualizar_Informacion = async () => {
     const { error } = await supabase.from('usuarios').update({
       nombre: usuarios[0].nombre,
       correo: usuarios[0].correo,
       telefono: usuarios[0].telefono,
       genero: usuarios[0].genero,
       rol: usuarios[0].rol,
     })
       .eq('id', id)
 
     if (error) {
       console.error('Error al actualizar datos:', error)
       alert("Hubo un error al actualizar los datos")
     } else {
       console.log('Datos de usuario actualizados:', usuarios[0])
       alert("Datos de usuario actualizados correctamente")
     }
   };
  */
  const handleChange = (field: keyof Usuarios, value: any) => {
    const updatedUsuario = { ...usuarios[0], [field]: value };
    setUsuarios([updatedUsuario]);
  };
  return (
    <div>
      <div>
        <button className={styles.botonatras} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faReply} />
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.titulo}>
          <h1>Editar Usuario</h1>
        </div>
        <form className={styles.div_formulario}>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Nombre Completo</label>
            <input className={styles.formulario} type="text" placeholder="Nombre" onChange={(e) => handleChange('nombre', e.target.value)} value={usuarios[0]?.nombre || ""} />
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Correo</label>
            <input className={styles.formulario} type="email" placeholder="tu@correo.cl" onChange={(e) => handleChange('correo', e.target.value)} value={usuarios[0]?.correo || ""} />
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Contraseña</label>
            <input className={styles.formulario} type="password" placeholder="Contraseña" onChange={(e) => handleChange('password', e.target.value)} value={usuarios[0]?.password || ""} />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Telefono</label>
            <input className={styles.formulario} type="tel" placeholder="Contraseña" onChange={(e) => handleChange('telefono', e.target.value)} value={usuarios[0]?.telefono || ""} />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Genero</label>
            <select
              className={styles.formulario}
              onChange={(e) => handleChange('genero', e.target.value)}
              value={usuarios[0]?.genero || ""}
            >
              {['Hombre', 'Mujer'].map((rol, index) => (
                <option key={index} value={rol}>
                  {rol.charAt(0).toUpperCase() + rol.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Repetir Contraseña</label>
            <input className={styles.formulario} type="password" placeholder="Repetir Contraseña" />
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Rol</label>
            <select
              className={styles.formulario}
              onChange={(e) => handleChange('rol', e.target.value)}
              value={usuarios[0]?.rol || ""}
            >
              {['gestor', 'administrador'].map((rol, index) => (
                <option key={index} value={rol}>
                  {rol.charAt(0).toUpperCase() + rol.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.botones}>
            <button className={styles.btn1} type="button" onClick={() => { navigate(-1) }} >Cancelar</button>
            <button onClick={Presionar_boton} className={styles.btn2} type="submit">Editar Usuario</button>
          </div>
        </form>
      </div>
    </div>
  )
}


export default Editar_Usuarios;