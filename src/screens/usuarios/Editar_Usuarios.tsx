import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faReply
  } from "@fortawesome/free-solid-svg-icons"

  import "../usuarios/css/Formularios.css"




function Editar_Usuarios () {
    return (
      
      <div>
        <div className="flecha">
          <FontAwesomeIcon icon={faReply}/>
        </div>
      
      
        <div className="container">
      <div className="text">
        <h1>Editar Usuario</h1>
      </div>

      <form>
        <div className="espacio">
          <label className="etiquetas">Nombre Completo</label>
          <input className="formulario" type="text" placeholder="Nombre" />
        </div>

        <div className="espacio">
          <label className="etiquetas">Rut</label>
          <input className="formulario" type="text" placeholder="12.345.678-9" />
        </div>

        <div className="espacio">
          <label className="etiquetas">Correo</label>
          <input className="formulario" type="email" placeholder="tu@correo.cl" />
        </div>

        <div className="espacio">
          <label className="etiquetas">Contraseña</label>
          <input className="formulario" type="password" placeholder="Contraseña" />
        </div>

        <div className="espacio">
          <label className="etiquetas">Repetir Contraseña</label>
          <input className="formulario" type="password" placeholder="Repetir Contraseña" />
        </div>

        <div className="espacio">
          <label className="etiquetas">Rol</label>
          <select className="formulario">
            <option value="gestor">Gestor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <div className="botones">
          <button className="btn1" type="button">Cancelar</button>
          <button className="btn2" type="submit">Guardar Cambios</button>
        </div>
      </form>
      </div>
    </div>
    )
}


export default Editar_Usuarios;