import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faReply
  } from "@fortawesome/free-solid-svg-icons"
import styles from "../usuarios/css/Formularios.module.css"




function Agregar_Usuarios () {
    return (
        <div>
            <div className={styles.flecha}>
            <FontAwesomeIcon icon={faReply}/>
            </div>
      
      
        <div className= {styles.container}>
            <div className={styles.titulo}>
                <h1>Crear Usuario</h1>
            </div>

          <form className={styles.div_formulario}>
              <div className= {styles.espacio}>
                <label className={styles.etiquetas}>Nombre Completo</label>
                <input className= {styles.formulario} type="text" placeholder="Nombre" />
              </div>

            <div className= {styles.espacio}>
              <label className= {styles.etiquetas}>Rut</label>
              <input className= {styles.formulario} type="text" placeholder="12.345.678-9" />
            </div>

            <div className= {styles.espacio}>
              <label className= {styles.etiquetas}>Correo</label>
              <input className= {styles.formulario} type="email" placeholder="tu@correo.cl" />
            </div>

            <div className= {styles.espacio}>
              <label className= {styles.etiquetas}>Contraseña</label>
              <input className= {styles.formulario} type="password" placeholder="Contraseña" />
            </div>

            <div className= {styles.espacio}>
              <label className= {styles.etiquetas}>Repetir Contraseña</label>
              <input className= {styles.formulario} type="password" placeholder="Repetir Contraseña" />
            </div>

            <div className= {styles.espacio}>
              <label className= {styles.etiquetas}>Rol</label>
              <select className= {styles.formulario}>
                <option value="gestor">Gestor</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

              <div className= {styles.botones}>
                  <button className= {styles.btn1} type="button">Cancelar</button>
                  <button className= {styles.btn2} type="submit">Añadir Usuario</button>
              </div>
          </form>
      </div>
    </div>
    )
}

export default Agregar_Usuarios;