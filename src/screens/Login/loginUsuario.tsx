import { useState, useEffect } from "react";
import style from "./loginUsuario.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom'
import { supabase } from "../../services/supabase";

function LoginUsuario() {
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState(false);
  const [Iscambio, setIscambio] = useState(true);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error al iniciar sesión', error.message)
    // No navegamos aquí; Supabase nos redirige a Google
  }

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div>
      <div
        className={style.container}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {!isMobile && (
          <div className={style.containerizquierdo} style={{ flex: 1 }}>
            <div className={style.containerlogo}>
              {/* <img className={style.logo} src="" alt="Logo" /> */}
            </div>
          </div>
        )}


        <div
          className={style.containerderecho}
          style={{
            width: isMobile ? "100%" : "35%",
            height: isMobile ? "100vh" : "auto",
          }}
        >
          {Iscambio ? (
            <div>
              <div className={style.containeratras}>
                <button className={style.botonatras} onClick={() => { navigate('/')}}>
                  <FontAwesomeIcon icon={faArrowLeftLong} />
                </button>
              </div>

              <div className={style.containerlogin}>
                <div className={style.containerHeader}>
                  <h1>Iniciar Sesión</h1>
                  <p>Para continuar como usuario debes tener cuenta de Google</p>
                </div>

                <div className={style.containerboton}>
                  <div className={style.botonSesion}>
                    <button className={style.botonGoogle} onClick={loginWithGoogle}>
                      Continuar con Google
                    </button>
                  </div>

                  <div className={style.containerdecorativo}>
                    <div className={style.diseñoRalla}></div>
                    <p>o si eres administrador</p>
                    <div className={style.diseñoRalla}></div>
                  </div>

                  <div className={style.botonSesion}>
                    <button className={style.botonAdmin} onClick={() => setIscambio(false)}>
                      Ingresar Credenciales
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={style.containeratras}>
                <button className={style.botonatras} onClick={() => setIscambio(true)}>
                  <FontAwesomeIcon icon={faArrowLeftLong} />
                </button>
              </div>

              <div className={style.containerlogin}>
                <div className={style.containerHeader}>
                  <h1>Iniciar Sesion</h1>
                  <p>Para continuar como administrativo deben haberte agregado previamente.</p>

                </div>
                <div>

                </div>

                <div className={style.containerCredenciales}>
                  <div className={style.containerCredencialesHeader}>
                    <p>Ingresa los datos suministrados por tu superior.</p>
                  </div>

                  <div className={style.InputCredenciales}>
                    <p>Correo/Rut</p>
                    <input className={style.inputdatos}>

                    </input>
                  </div>

                  <div className={style.containerContraseña}>
                    <p>Contraseña</p>
                    <div className={style.inputContraseña}>
                      <input type={mostrarContraseña ? "text" : "password"}>

                      </input>
                      <button onClick={() => setMostrarContraseña(!mostrarContraseña)} className={style.botonVerContraseña}>
                        {mostrarContraseña ? <FontAwesomeIcon icon={faEye} style={{ color: "#005dc2" }} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                      </button>
                    </div>

                  </div>

                  <div className={style.containerIniciar}>
                    <button className={style.botonIniciar}>
                      Iniciar sesion
                    </button>
                  </div>

                  <div className={style.containerOlvide}>
                    <button>
                      Olvidé mi contraseña
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default LoginUsuario;
