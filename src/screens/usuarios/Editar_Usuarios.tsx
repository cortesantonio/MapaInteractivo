import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faReply, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons"
import styles from "../usuarios/css/Formularios.module.css"
import { supabase } from "../../services/supabase"
import { useState, useEffect } from "react"
import { Usuarios } from "../../interfaces/Usuarios"
import { useNavigate, useParams } from "react-router-dom"
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { Discapacidad } from "../../interfaces/Discapacidad"

function Editar_Usuarios() {
  const { id } = useParams()
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [accesibilidad, setAccesibilidad] = useState<Accesibilidad[]>([]);
  const navigate = useNavigate();
  const [tiene_una_Discapacidad, set_tiene_una_Discapacidad] = useState(false);
  const [rutValido, setRutValido] = useState(true);
  const [discapacidad, setDiscapacidad] = useState<Discapacidad[]>([]);
  const [tipoAccesibilidadSeleccionado, setTipoAccesibilidadSeleccionado] = useState<string>("");

  // Esto almacena la información del usuario actualmente autenticado
  const [usuarioActual, setUsuarioActual] = useState<Usuarios | null>(null);
  // Esto guardar el rol original del usuario que se está editando
  const [rolOriginalEditado, setRolOriginalEditado] = useState<string>("");

  useEffect(() => {
    const obtenerUsuarioActual = async () => {
      const { data: userSession } = await supabase.auth.getUser();
      //  Se obtiene la sesión activa del usuario logueado.
      if (userSession?.user?.email) {
        const { data, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("correo", userSession.user.email)
          .single();

        if (error) {
          console.error("Error al obtener usuario actual:", error);
        } else {
          setUsuarioActual(data);
        }
      }
    };

    obtenerUsuarioActual();
  }, []);



  // Se muestran las opciones de rol 
  let rolesDisponibles: string[] = [];

  if (usuarioActual?.rol === "administrador") {
    rolesDisponibles = ["usuario", "gestor", "administrador"];
  } else if (usuarioActual?.rol === "gestor") {
    rolesDisponibles = ["usuario", "gestor"];
  } else if (usuarioActual?.rol === "usuario") {
    rolesDisponibles = [usuarios[0]?.rol];
  }

  // Función para validar el RUT chileno
  const validarRut = (rut: string): boolean => {
    if (!rut) return false;
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

  // Función para formatear el RUT chileno
  const formatRut = (value: string): string => {
    let rutLimpio = value.replace(/[^0-9kK]/g, "");

    let dv = "";
    if (rutLimpio.length > 1) {
      dv = rutLimpio.charAt(rutLimpio.length - 1);
      rutLimpio = rutLimpio.slice(0, -1);
    }

    let resultado = "";
    while (rutLimpio.length > 3) {
      resultado = "." + rutLimpio.substr(rutLimpio.length - 3) + resultado;
      rutLimpio = rutLimpio.slice(0, rutLimpio.length - 3);
    }
    resultado = rutLimpio + resultado;

    if (dv) {
      resultado += "-" + dv;
    }

    return resultado;
  };



  // Función para manejar cambios en el campo RUT
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => { const value = e.target.value; const formattedRut = formatRut(value); handleChange('rut', formattedRut); setRutValido(validarRut(formattedRut)); };

  useEffect(() => {
    const fetchUsuarios = async () => {

      // Consulta para Mostrar datos según el id del Usuario
      const { data: usuariosData, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
      if (error) {
        console.error('Error al obtener datos de usuario:', error);
        alert("Error al cargar datos del usuario");
        return;
      }
      if (usuariosData) {
        setUsuarios([usuariosData]);
        setRutValido(validarRut(usuariosData.rut));
        setRolOriginalEditado(usuariosData.rol.toLowerCase()); // Aquí se guarda el rol original
      }
      // Consulta para obtener todos los tipos de Accesibilidad
      const { data: accesibilidadData } = await supabase.from('accesibilidad').select('*');
      setAccesibilidad(accesibilidadData || []);

      if (accesibilidadData && accesibilidadData.length > 0) {
        setTipoAccesibilidadSeleccionado(accesibilidadData[0].id);
      }

      // Consulta para obtener datos de discapacidad del usuario
      const { data: discapacidadData } = await supabase.from("discapacidad").select("*").eq('id_usuario', id);
      if (discapacidadData && discapacidadData.length > 0) {
        setDiscapacidad(discapacidadData);
        set_tiene_una_Discapacidad(true);
        if (discapacidadData[0].id_accesibilidad) {
          setTipoAccesibilidadSeleccionado(discapacidadData[0].id_accesibilidad);
        }
      } else {
        setDiscapacidad(discapacidadData as any);
      }



    };

    if (id) {
      fetchUsuarios();
    }
  }, [id]);

  const Actualizar_Informacion = async () => {

    if (!rutValido) {
      alert("El RUT no es válido");
      return;
    }

    if (!usuarioActual || usuarios.length === 0) {
      alert("Error: no se pudo validar el usuario actual");
      return;
    }

    const rolActual = usuarioActual.rol.toLowerCase();
    const rolEditadoOriginal = rolOriginalEditado;
    const idActual = usuarioActual.id;

    //  restriccion de jerárquia
    if (rolActual === "administrador") {
      if (rolEditadoOriginal === "administrador" && idActual !== usuarios[0].id) {
        alert("No puedes editar a otros Administradores.");
        return;
      }
    } else if (rolActual === "gestor") {
      if (rolEditadoOriginal === "administrador") {
        alert("No puedes editar a un Administrador.");
        return;
      }
      if (rolEditadoOriginal === "gestor" && idActual !== usuarios[0].id) {
        alert("No puedes editar a otros Gestores.");
        return;
      }
      // Se restinje que un gestor asigne rol administrador
      if (usuarios[0].rol === "administrador") {
        alert("No puedes asignar el rol Administrador.");
        return;
      }
    } else if (rolActual === "usuario") {
      if (idActual !== usuarios[0].id) {
        alert("No puedes editar información de otros usuarios.");
        return;
      }
    }

    try {
      // Actualizar información del usuario
      const { error: errorUsuario } = await supabase.from('usuarios').update({ nombre: usuarios[0].nombre, correo: usuarios[0].correo, telefono: usuarios[0].telefono, genero: usuarios[0].genero, rol: usuarios[0].rol, rut: usuarios[0].rut, password: usuarios[0].password, fecha_nacimiento: usuarios[0].fecha_nacimiento }).eq('id', id);
      if (errorUsuario) {
        console.error('Error al actualizar datos de usuario:', errorUsuario);
        alert("Hubo un error al actualizar los datos del usuario");
        return;
      }
      // Actualizar o eliminar información de discapacidad
      if (tiene_una_Discapacidad) {
        // Verificar si ya existe un registro de discapacidad para este usuario
        const { data: existingData } = await supabase.from("discapacidad").select("*").eq("id_usuario", id);

        if (existingData && existingData.length > 0) {
          // Si existe, actualizamos
          await supabase.from("discapacidad").update({ nombre: discapacidad[0]?.nombre || "", tipo: discapacidad[0]?.tipo || "", }).eq("id_usuario", id);
        } else {
          // Si no existe, insertamos
          await supabase.from("discapacidad").insert([{ id_usuario: id, nombre: discapacidad[0]?.nombre || "", tipo: discapacidad[0]?.tipo || "", }]);
        }
      }
      alert("Datos de usuario actualizados correctamente");
      console.log('Datos de usuario actualizados correctamente');
      navigate(-1);
    } catch (error) {
      console.error('Error general al actualizar:', error);
      alert("Ocurrió un error al actualizar la información");
    }
  };

  const handleDiscapacidadChange = (field: keyof Discapacidad, value: string) => { const updated = [{ ...discapacidad[0], [field]: value }]; setDiscapacidad(updated); };
  const handleChange = (field: keyof Usuarios, value: any) => { const updatedUsuario = { ...usuarios[0], [field]: value }; setUsuarios([updatedUsuario]); };


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
        <form className={styles.div_formulario} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Nombre Completo *</label>
            <input
              className={styles.formulario}
              type="text"
              placeholder="Nombre"
              onChange={(e) => handleChange('nombre', e.target.value)}
              value={usuarios[0]?.nombre || ""}
              required
            />
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Correo *</label>
            <input
              className={styles.formulario}
              type="email"
              placeholder="tu@correo.cl"
              onChange={(e) => handleChange('correo', e.target.value)}
              value={usuarios[0]?.correo || ""}
              required
            />
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Fecha de Nacimiento</label>
            <input
              className={styles.formulario}
              type="date"
              placeholder="Fecha de Nacimiento"
              onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
              value={usuarios[0]?.fecha_nacimiento ? new Date(usuarios[0].fecha_nacimiento).toISOString().split('T')[0] : ""}
            />
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Rut *</label>
            <input
              className={`${styles.formulario} ${!rutValido ? styles.input_error : ''}`}
              type="text"
              placeholder="12.345.678-9"
              onChange={handleRutChange}
              value={usuarios[0]?.rut || ""}
              maxLength={12}
              required
            />
            {!rutValido && (
              <span className={styles.error_text}>
                Rut no válido (Formato: 12.345.678-9)
              </span>
            )}
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Contraseña *</label>
            <div className={styles.input_contraseña}>
              <input
                className={styles.formulario}
                type={mostrarContraseña ? "text" : "password"}
                placeholder="Contraseña"
                onChange={(e) => handleChange('password', e.target.value)}
                value={usuarios[0]?.password || ""}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContraseña(!mostrarContraseña)}
                className={styles.boton_ojito}
              >
                <FontAwesomeIcon icon={mostrarContraseña ? faEye : faEyeSlash} style={{ color: "black" }} />
              </button>
            </div>
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Teléfono</label>
            <input
              className={styles.formulario}
              type="tel"
              placeholder="Teléfono"
              onChange={(e) => handleChange('telefono', e.target.value)}
              value={usuarios[0]?.telefono || ""}
            />
          </div>

          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Género</label>
            <select
              className={styles.formulario}
              onChange={(e) => handleChange('genero', e.target.value)}
              value={usuarios[0]?.genero || ""}
            >
              <option value="">Seleccione género</option>
              {['Hombre', 'Mujer', 'No especificado'].map((genero, index) => (
                <option key={index} value={genero}>
                  {genero}
                </option>
              ))}
            </select>
          </div>
          {/*Esta funcion hace que solo administradores y gestores puedan cambiar roles o información de otros. 
          Nadie puede modificar su propio rol ni el de su mismo nivel. */}
          {usuarioActual &&
            usuarios.length > 0 &&
            usuarioActual.id !== usuarios[0].id && // Solo mostrar si el usuario actual NO está editando su propio perfil
            (usuarioActual.rol === "administrador" || usuarioActual.rol === "gestor") && (
              <div className={styles.espacio}>
                {/* Permite cambiar el rol de un usuario */}
                <label className={styles.etiquetas}>Rol *</label>
                <select
                  className={styles.formulario}
                  onChange={(e) => handleChange('rol', e.target.value)}
                  value={usuarios[0]?.rol || ""}
                >
                  {rolesDisponibles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol.charAt(0).toUpperCase() + rol.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

          <div className={styles.checkbox_input}>
            <div className={styles.checkbox_container}>
              <input
                type="checkbox"
                checked={tiene_una_Discapacidad}
                onChange={(e) => set_tiene_una_Discapacidad(e.target.checked)}
                id="discapacidad_checkbox"
              />
              <label htmlFor="discapacidad_checkbox">¿Presentas algún tipo de discapacidad?</label>
            </div>

            {tiene_una_Discapacidad && (
              <>
                <div className={styles.espacio}>
                  <label className={styles.etiquetas}>Tipo de Accesibilidad *</label>
                  <select
                    className={styles.formulario}
                    value={tipoAccesibilidadSeleccionado}
                    onChange={(e) => setTipoAccesibilidadSeleccionado(e.target.value)}
                    required={tiene_una_Discapacidad}
                  >
                    <option value="">Seleccione tipo de accesibilidad</option>
                    {accesibilidad.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.espacio}>
                  <label className={styles.etiquetas}>Nombre de la Discapacidad *</label>
                  <input
                    className={styles.formulario}
                    type="text"
                    placeholder="Nombre de la discapacidad"
                    value={discapacidad[0]?.nombre || ""}
                    onChange={(e) => handleDiscapacidadChange("nombre", e.target.value)}
                    required={tiene_una_Discapacidad}
                  />
                </div>

                <div className={styles.espacio}>
                  <label className={styles.etiquetas}>Tipo de Discapacidad *</label>
                  <input
                    className={styles.formulario}
                    type="text"
                    placeholder="Tipo de Discapacidad"
                    value={discapacidad[0]?.tipo || ""}
                    onChange={(e) => handleDiscapacidadChange("tipo", e.target.value)}
                    required={tiene_una_Discapacidad}
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.botones}>
            <button className={styles.btn1} type="button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button
              className={styles.btn2}
              type="button"
              onClick={Actualizar_Informacion}
            >
              Editar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Editar_Usuarios;