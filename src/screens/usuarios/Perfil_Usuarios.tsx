import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faUser } from "@fortawesome/free-solid-svg-icons";
import "../usuarios/css/Perfil_Usuario.css";

function Perfil_Usuario() {
  return (
    <div>
      <div className="flecha">
        <FontAwesomeIcon icon={faReply} />
      </div>

      <div className="container">
        <h2 className="titulo">Usuario</h2>

        <div className="perfil-icono">
          <FontAwesomeIcon className="icono-usuario" icon={faUser} />
        </div>

        <h3 className="nombre-completo">*Nombre Completo*</h3>

        <div className="info">
          <div className="campo">
            <span className="label">RUT</span>
            <p className="valor">*Datos Usuario*</p>
            <hr />
          </div>

          <div className="campo">
            <span className="label">Correo</span>
            <p className="valor">*Datos Usuario*</p>
            <hr />
          </div>

          <div className="campo">
            <span className="label">Rol</span>
            <p className="valor">Gestor</p>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil_Usuario;
