import { useState, useEffect } from "react";
import style from "./loginUsuario.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom'
import { supabase } from "../../services/supabase";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function LoginUsuario() {
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState(false);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error al iniciar sesión', error.message)
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
          </div>
        )}

        <div
          className={style.containerderecho}
          style={{
            width: isMobile ? "100%" : "35%",
            height: isMobile ? "100vh" : "auto",
          }}
        >

          <div>
            <div className={style.containeratras}>
              <button className={style.botonatras} onClick={() => { navigate(-1) }}>
                <FontAwesomeIcon icon={faReply} />
              </button>
            </div>

            <div className={style.containerlogin}>
              <div className={style.containerHeader}>
                <h1>Iniciar sesión</h1>
                <p style={{ fontSize: '1rem' }}>Para continuar, inicia sesión con tu cuenta de Google. Es rápido, seguro y sin necesidad de contraseñas adicionales.</p>

              </div>

              <div className={style.containerboton}>
                <div className={style.botonSesion}>
                  <button className={style.botonGoogle} onClick={loginWithGoogle}>
                    <FontAwesomeIcon icon={faGoogle} color="white" /> Continuar con Google
                  </button>

                </div>

              </div>
              <p style={{ textAlign: "center", fontSize: "1rem", color: "#666", width: "60%", marginTop: '20px' }}>
                No almacenamos tu contraseña ni accedemos a tus datos personales sin permiso.
              </p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default LoginUsuario;
