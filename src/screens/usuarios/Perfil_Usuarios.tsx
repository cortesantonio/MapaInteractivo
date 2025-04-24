import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faUser } from "@fortawesome/free-solid-svg-icons";
import "../usuarios/css/Perfil_Usuario.css";
import { supabase } from "../../services/supabase";
import { useEffect, useState } from "react";
import { Usuarios } from "../../interfaces/Usuarios";
import { useNavigate, useParams } from "react-router-dom";

function Perfil_Usuario() {
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const { id } = useParams();

  const idUsuario = id;

  useEffect(() => {
    const fetchData = async () => {
      const { data: usuariosData, error } = await supabase
        .from('usuarios')
        .select('*').eq('id', idUsuario); // Cambia '1' por el ID del usuario que deseas obtener

      if (error) {
        console.error('Error al obtener datos:', error);
      } else {
        setUsuarios(usuariosData || []);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flecha" style={{ cursor: 'pointer' }} onClick={() => { navigate(-1) }}>
        <FontAwesomeIcon icon={faReply} />
      </div>
      <div className="container">
        <h2 className="titulo">Usuario</h2>
        <div className="perfil-icono">
          <FontAwesomeIcon className="icono-usuario" icon={faUser} />
        </div>

        <div className="info">
          <div className="perfil-info">
            {usuarios.map((usuario) => (
              <div key={usuario.id}>
                <div className="campo">
                  <span className="label">Nombre:</span>
                  <p className="nombre-usuario">{usuario.nombre}</p>
                  <hr />
                </div>
                <div className="campo">
                  <span className="label">Correo:</span>
                  <p className="correo-usuario">{usuario.correo}</p>
                  <hr />
                </div>
                <div>
                  <span className="label">Rol:</span>
                  <p className="rol-usuario">{usuario.rol}</p>
                  <hr />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="btn-editar" >
          <button onClick={() => { navigate(`/usuarios/editar/${idUsuario}`) }}>
            Editar Usuario</button>
        </div>
      </div>
    </div>
  );
}

export default Perfil_Usuario;
