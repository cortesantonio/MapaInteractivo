import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faReply, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../usuarios/css/Formularios.module.css";
import { supabase } from "../../services/supabase";
import { useState, FormEvent } from "react";

function Agregar_Usuarios() {
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [rutValido, setRutValido] = useState(true);
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("gestor");
  const [genero, setGenero] = useState("Hombre");

  const validarRut = (rut: string): boolean => {
    rut = rut.replace(/\./g, "").replace("-", "");
    if (rut.length < 2) return false;
    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) return false;
    
    const cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    let resultado = 11 - (suma % 11);
    let dvEsperado = resultado === 11 ? "0" : resultado === 10 ? "K" : resultado.toString();
    return dv === dvEsperado;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!rutValido) {
      alert("El RUT no es válido");
      return;
    }

    if (contrasena !== repetirContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const { data, error } = await supabase.from("usuarios").insert([
      {
        nombre,
        rut,
        fecha_nacimiento: fechaNacimiento,
        correo,
        contrasena,
        telefono,
        rol,
        genero
      },
    ]);

    console.log(data);

    if (error) {
      console.error(error);
      alert("Error al añadir usuario");
    } else {
      alert("Usuario añadido correctamente");
      // Opcional: redirigir después de agregar
      // navigate('/ruta-destino');
    }
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
          <h1>Crear Usuario</h1>
        </div>

        <form className={styles.div_formulario} onSubmit={handleSubmit}>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Nombre Completo</label>
            <input
              className={styles.formulario}
              type="text"
              placeholder="Nombre"
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Rut</label>
            <input
              className={styles.formulario}
              type="text"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const valor = e.target.value;
                setRut(valor);
                setRutValido(validarRut(valor));
              }}
              required
            />
            {!rutValido && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                Rut no válido ("Por favor, Escriba Correctamente su Rut")
              </span>
            )}
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Fecha Nacimiento</label>
            <input
              className={styles.formulario}
              type="date"
              placeholder="Fecha Nacimiento"
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Correo</label>
            <input
              className={styles.formulario}
              type="email"
              placeholder="tu@correo.cl"
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Contraseña</label>
            <div className={styles.input_contraseña}>
              <input
                className={styles.formulario}
                type={mostrarContraseña ? "text" : "password"}
                placeholder="Contraseña"
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContraseña(!mostrarContraseña)}
                className={styles.boton_ojito}
              >
                <FontAwesomeIcon
                  icon={mostrarContraseña ? faEye : faEyeSlash}
                  style={{ color: "black" }}
                />
              </button>
            </div>
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Repetir Contraseña</label>
            <div className={styles.input_contraseña}>
              <input
                className={styles.formulario}
                type={mostrarContraseña ? "text" : "password"}
                placeholder="Repetir Contraseña"
                onChange={(e) => setRepetirContrasena(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContraseña(!mostrarContraseña)}
                className={styles.boton_ojito}
              >
                <FontAwesomeIcon
                  icon={mostrarContraseña ? faEye : faEyeSlash}
                  style={{ color: "black" }}
                />
              </button>
            </div>
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Teléfono</label>
            <input
              className={styles.formulario}
              type="text"
              placeholder="Teléfono"
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Rol</label>
            <select
              onChange={(e) => setRol(e.target.value)}
              className={styles.formulario}
              value={rol}
            >
              <option value="gestor">Gestor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Género</label>
            <select
              onChange={(e) => setGenero(e.target.value)}
              className={styles.formulario}
              value={genero}
            >
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className={styles.botones}>
            <button
              className={styles.btn1}
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button className={styles.btn2} type="submit">
              Añadir Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Agregar_Usuarios;