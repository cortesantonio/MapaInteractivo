import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "../usuarios/css/Formularios.module.css";
import { supabase } from "../../services/supabase";
import { useState, FormEvent } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useAuth } from '../../hooks/useAuth';

function Agregar_Usuarios() {
  const { user } = useAuth();
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [rutValido, setRutValido] = useState(true);
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("gestor");
  const [genero, setGenero] = useState("Hombre");
  const [tipo, set_tipo_discapacidad] = useState("Fisica");
  const [nombreDiscapacidad, setNombreDiscapacidad] = useState("");
  const [tiene_una_Discapacidad, set_tiene_una_Discapacidad] = useState(false);


  // Función para formatear el RUT mientras el usuario escribe
  const formatearRut = (rut: string): string => {
    // Eliminar todos los caracteres no numéricos y la letra K
    let valor = rut.replace(/[^\dkK]/g, "");

    // Separar el cuerpo y el dígito verificador
    let cuerpo = valor;
    let dv = "";

    if (valor.length > 1) {
      cuerpo = valor.slice(0, -1);
      dv = valor.slice(-1).toUpperCase();
    }

    // Formatear el cuerpo con puntos
    if (cuerpo.length > 0) {
      let rutFormateado = "";
      let i = cuerpo.length - 1;
      let contador = 0;

      while (i >= 0) {
        rutFormateado = cuerpo.charAt(i) + rutFormateado;
        contador++;
        if (contador === 3 && i !== 0) {
          rutFormateado = "." + rutFormateado;
          contador = 0;
        }
        i--;
      }

      // Agregar el guión y dígito verificador
      if (dv) {
        rutFormateado = rutFormateado + "-" + dv;
      }

      return rutFormateado;
    }

    return valor;
  };

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

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorIngresado = e.target.value;

    // Solo permitir números, K, k, puntos y guiones
    if (!/^[0-9kK.\-]*$/.test(valorIngresado) && valorIngresado !== "") {
      return;
    }

    // Formateamos el RUT
    const rutFormateado = formatearRut(valorIngresado);
    setRut(rutFormateado);

    // Validamos el RUT solo si tiene un formato completo
    if (rutFormateado.includes("-")) {
      setRutValido(validarRut(rutFormateado));
    } else {
      // Si no está completo, no mostramos error todavía
      setRutValido(true);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validarRut(rut)) {
      alert("El RUT no es válido");
      return;
    }
    if (password !== repetirContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const { data: nuevoUsuario, error: userError } = await supabase
        .from("usuarios")
        .insert([{
          nombre,
          rut,
          fecha_nacimiento: fechaNacimiento,
          correo,
          password,
          telefono,
          rol,
          genero
        }])
        .select()
        .single();

      if (userError || !nuevoUsuario) {
        console.error(userError);
        alert("Error al añadir usuario");
        return;
      }

      if (tiene_una_Discapacidad) {
        const { error: discapacidad_error } = await supabase
          .from("discapacidad")
          .insert([{
            id_usuario: nuevoUsuario.id,
            nombre: nombreDiscapacidad,
            tipo: tipo
          }]);
        if (discapacidad_error) {
          console.error("Error al añadir discapacidad:", discapacidad_error);
          alert("Usuario creado, pero hubo un error al registrar la discapacidad");
          return;
        }
      }

      await Registro_cambios(nuevoUsuario.id);
      alert("Usuario añadido correctamente");
      navigate(-1);

    } catch (error) {
      console.error(error);
      alert("Error en el proceso de registro");
    }

  };

  const fechaHoraActual = new Date().toISOString();

  const Registro_cambios = async (idUsuario: number) => {

    const { data: registro_logs, error: errorLog } = await supabase
      .from('registro_logs')
      .insert([
        {
          id_usuario: user?.id,
          tipo_accion: 'Agregación de Usuario',
          detalle: `Se agregó un nuevo Usuario con ID ${idUsuario}`,
          fecha_hora: fechaHoraActual,
        }
      ]);

    if (errorLog) {
      console.error('Error al registrar en los logs:', errorLog);
      return;
    }

    console.log(' Registro insertado en registro_logs correctamente', registro_logs);
  };

  return (
    <div>
      <NavbarAdmin />

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
              onChange={handleRutChange}
              maxLength={12}
              required
            />
            {!rutValido && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                Rut no válido ("Por favor, escriba correctamente su Rut")
              </span>
            )}
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Fecha de Nacimiento</label>
            <input className={styles.formulario} type="date" placeholder="Fecha Nacimiento" onChange={(e) => setFechaNacimiento(e.target.value)} required />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Correo</label>
            <input className={styles.formulario} type="email" placeholder="tu@correo.cl" onChange={(e) => setCorreo(e.target.value)} required />
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
              <option value="usuario">usuario</option>
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

          <div className={styles.checkbox_input}>
            <div className={styles.checkbox_container}>
              <input
                type="checkbox"
                checked={tiene_una_Discapacidad}
                onChange={(e) => set_tiene_una_Discapacidad(e.target.checked)}
              />
              <label>¿Presentas algún tipo de discapacidad?</label>
            </div>
          </div>

          {tiene_una_Discapacidad && (
            <>
              <div className={styles.espacio}>
                <label className={styles.etiquetas}>Tipo Discapacidad</label>
                <select
                  onChange={(e) => set_tipo_discapacidad(e.target.value)}
                  className={styles.formulario}
                  value={tipo}
                >
                  <option value="Fisica">Física</option>
                  <option value="Sensorial">Sensorial</option>
                  <option value="Intelectual">Intelectual</option>
                  <option value="Psicosocial">Psicosocial</option>
                  <option value="NeuroDesarrollo">NeuroDesarrollo</option>
                </select>
              </div>

              <div className={styles.espacio}>
                <label className={styles.etiquetas}>Especifica el nombre</label>
                <input className={styles.formulario} type="text" placeholder="Nombre de la discapacidad" value={nombreDiscapacidad} onChange={(e) => setNombreDiscapacidad(e.target.value)} required />
              </div>
            </>
          )}

          <div className={styles.botones}>
            <button className={styles.btn1} type="button" onClick={() => navigate(-1)}>Cancelar</button>
            <button className={styles.btn2} type="submit">Añadir Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Agregar_Usuarios;