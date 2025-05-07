import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faReply,faEyeSlash,faEye} from "@fortawesome/free-solid-svg-icons"
import styles from "../usuarios/css/Formularios.module.css"
import { supabase } from "../../services/supabase"
import { useState, useEffect } from "react"
import { Usuarios } from "../../interfaces/Usuarios"
import { useNavigate, useParams } from "react-router-dom"
import { Accesibilidad } from "../../interfaces/Accesibilidad"
import { Discapacidad } from "../../interfaces/Discapacidad"

function Editar_Usuarios() {
  const { id } = useParams()
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
  const [accesibilidad, setAccesibilidad] = useState<Accesibilidad[]>([]);
  const navigate = useNavigate();
  const [tiene_una_Discapacidad, set_tiene_una_Discapacidad] = useState(false);
  const [rutValido, setRutValido] = useState(true);
  const [discapacidad, setDiscapacidad] = useState <Discapacidad[]>([]);
  const Actualizar_Discapacidad = async () => {
    if (!tiene_una_Discapacidad) return;
  
    const { error } = await supabase.from("discapacidad").upsert([{
      id_usuario: id,
      nombre: discapacidad[0]?.nombre || "",
      tipo: discapacidad[0]?.tipo || ""
    }], { onConflict: ['id_usuario'] as any });
  
    if (error) {
      console.error('Error actualizando discapacidad:', error);
    } else {
      console.log('Discapacidad actualizada correctamente');
    }
  };
  
  // Función para validar el RUT chileno
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

  // Nueva función para formatear el RUT chileno
  const formatRut = (value: string): string => {
    // Eliminar todos los caracteres no numéricos y la K final si existe
    let rutLimpio = value.replace(/[^0-9kK]/g, "");
    
    // Separar el dígito verificador si existe
    let dv = "";
    if (rutLimpio.length > 1) {
      dv = rutLimpio.charAt(rutLimpio.length - 1);
      rutLimpio = rutLimpio.slice(0, -1);
    }
    
    // Formatear el cuerpo del RUT con puntos
    let resultado = "";
    while (rutLimpio.length > 3) {
      resultado = "." + rutLimpio.substr(rutLimpio.length - 3) + resultado;
      rutLimpio = rutLimpio.slice(0, rutLimpio.length - 3);
    }
    resultado = rutLimpio + resultado;
    
    // Agregar el guión y el dígito verificador
    if (dv) {
      resultado += "-" + dv;
    }
    
    return resultado;
  };

  // Función específica para manejar cambios en el campo RUT
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Obtener el valor actual del input
    const value = e.target.value;
    
    // Formatear el RUT
    const formattedRut = formatRut(value);
    
    // Actualizar el estado con el RUT formateado
    handleChange('rut', formattedRut);
    
    // Validar el RUT
    setRutValido(validarRut(formattedRut));
  };

  function Presionar_boton() {
    console.log("Botón presionado");
    // Validar el RUT antes de continuar
    if (!rutValido) {
      alert("El RUT no es válido");
      return;
    }
    // Si el RUT es válido, actualizar la información
    Actualizar_Informacion();
    Actualizar_Discapacidad ();
  };

  
  useEffect(() => {
    const fetchUsuarios = async () => {
      //Consulta para Mostar datos segun el id del Usuario
      const { data: usuariosData, error } = await supabase.from('usuarios').select('*').eq('id', id)
      if (error) {
        console.error('Error al obtener datos:', error)
      } else {
        setUsuarios(usuariosData || [])
        console.log('Datos de usuarios obtenidos:', usuariosData)

      // Consulta Para obtener Todos los Tipos de Accesibilidad
      const { data: accesibilidadData, error: accesibilidadError } = await supabase.from('accesibilidad').select('*')
      if (accesibilidadError) throw accesibilidadError
      setAccesibilidad(accesibilidadData as any || [])
      console.log("Accesibilidad", accesibilidadData)

      const {data:discapacidad_Data, error:Discapacidad_Error } = await supabase.from ("discapacidad").select ("*").eq ('id_usuario',id)
      if (Discapacidad_Error) throw Discapacidad_Error;
      setDiscapacidad (discapacidad_Data as any || [])
      console.log ("Discapacidades User:",discapacidad_Data) 
     
        // Validar el RUT al cargar los datos
        if (usuariosData && usuariosData.length > 0 && usuariosData[0].rut) {
          setRutValido(validarRut(usuariosData[0].rut));
        }
        
        // Si el usuario tiene discapacidad, marcar el checkbox
        if (discapacidad_Data && discapacidad_Data.length > 0) {
          set_tiene_una_Discapacidad(true);
        }
      }
    };

    fetchUsuarios()
  }, [id])

    const Actualizar_Informacion = async () => {
     const { error } = await supabase.from('usuarios').update({
       nombre: usuarios[0].nombre,
       correo: usuarios[0].correo,
       telefono: usuarios[0].telefono,
       genero: usuarios[0].genero,
       rol: usuarios[0].rol,
       rut: usuarios[0].rut,
       password: usuarios[0].password,
       fecha_nacimiento: usuarios[0].fecha_nacimiento
     })
       .eq('id', id)
 
     if (error) {
       console.error('Error al actualizar datos:', error)
       alert("Hubo un error al actualizar los datos")
     } else {
       console.log('Datos de usuario actualizados:', usuarios[0])
       alert("Datos de usuario actualizados correctamente")
       navigate(-1);
     }
   };


  
   
   const handleDiscapacidadChange = (field: keyof Discapacidad, value: string) => {
    const updated = [{ ...discapacidad[0], [field]: value }];
    setDiscapacidad(updated);
  };
  
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
            <label className={styles.etiquetas}>Fecha de Nacimiento</label>
            <input className={styles.formulario} type="date" placeholder="Fecha de Nacimiento" onChange={(e) => handleChange('fecha_nacimiento', e.target.value)} value= {usuarios[0]?.fecha_nacimiento? new Date(usuarios[0].fecha_nacimiento).toISOString().slice(0, 10): ""} />
          </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Rut</label>
            <input 
              className={styles.formulario} 
              type="text" 
              placeholder="12.345.678-9" 
              onChange={handleRutChange} 
              value={(usuarios[0]?.rut) || ""} 
              maxLength={12} // Limitar la longitud para evitar entradas muy largas
            />
            {!rutValido && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                Rut no válido ("Por favor, Escriba Correctamente su Rut")
              </span>
            )}
          </div>
                  <div className= {styles.espacio}>
                      <label className= {styles.etiquetas}>Contraseña</label>
                    <div className={styles.input_contraseña}>
                        <input className={styles.formulario} type={mostrarContraseña ? "text" : "password"} placeholder="Contraseña" onChange={(e) => handleChange('password', e.target.value)} value={usuarios[0]?.password || ""} />
                      <button type="button" onClick={() => setMostrarContraseña(!mostrarContraseña)} className={styles.boton_ojito}>
                        <FontAwesomeIcon icon={mostrarContraseña ? faEye : faEyeSlash} style={{ color: "black" }} />
                      </button>
                    </div>
                  </div>
          <div className={styles.espacio}>
            <label className={styles.etiquetas}>Telefono</label>
            <input className={styles.formulario} type="tel" placeholder="Teléfono" onChange={(e) => handleChange('telefono', e.target.value)} value={usuarios[0]?.telefono || ""} />
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
                  <div className= {styles.espacio}>
                      <label className= {styles.etiquetas}>Repetir Contraseña</label>
                    <div className={styles.input_contraseña}>
                        <input className={styles.formulario} type={mostrarContraseña ? "text" : "password"} placeholder="Repetir Contraseña" required  onChange={(e) => handleChange('password', e.target.value)} value={usuarios[0]?.password || ""} />
                      <button type="button" onClick={() => setMostrarContraseña(!mostrarContraseña)} className={styles.boton_ojito}>
                        <FontAwesomeIcon icon={mostrarContraseña ? faEye : faEyeSlash} style={{ color: "black" }} />
                      </button>
                    </div>
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


        <div className={styles.checkbox_input}>
        <div className={styles.checkbox_container}>
          <input
            type="checkbox"
            checked={tiene_una_Discapacidad}
            onChange={(e) => set_tiene_una_Discapacidad(e.target.checked)}
          />
          <label>¿Presentas algún tipo de discapacidad?</label>
        </div>
          {tiene_una_Discapacidad && (
          <>
          <div className={styles.espacio}>
              <label className={styles.etiquetas}>Tipo de Accesibilidad</label>
            <select className={styles.formulario}>
              {accesibilidad.map((tipo, index) => (
                <option key={index} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
          
          
          

        <div className={styles.espacio}>
          <label className={styles.etiquetas}>Discapacidad del Usuario</label>
          <input className={styles.formulario} type="text"placeholder="Nombre de la discapacidad" required value={discapacidad[0]?.nombre || ""} onChange={(e) => handleDiscapacidadChange("nombre", e.target.value)}/>
        </div>

        <div className={styles.espacio}>
            <label className={styles.etiquetas}>Tipo de Discapacidad</label>
            <input className={styles.formulario} type="text"placeholder="Tipo de Discapacidad" required value={discapacidad[0]?.tipo || ""} onChange={(e) => handleDiscapacidadChange("tipo", e.target.value)}/>
          </div>
      </>
)}
        </div>
          <div className={styles.botones}>
            <button className={styles.btn1} type="button" onClick={() => navigate(-1)}>Cancelar</button>
            <button onClick={Presionar_boton} className={styles.btn2} type="submit">Editar Usuario</button>
          </div>
        </form>
      </div>
    </div>
  )
}


export default Editar_Usuarios;