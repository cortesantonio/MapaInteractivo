import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLocationDot,
  faGlobe,
  faPhone,
  faStar,
  faClock,
  faShareNodes,
  faLocationArrow,
  faPenToSquare,
  faChevronDown,
  faWheelchair,
  faElevator,
  faXmark
} from "@fortawesome/free-solid-svg-icons"
import Teatro_2 from "../../assets/Teatro_2.jpg"


// Hook para detectar si es móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])
  return isMobile
}

const containerStyleMobile: React.CSSProperties = {
  background: "White",
  color: "black",
  borderRadius: "20px 20px 0 0",
  width: "100%",
  position: "fixed",
  left: "0",
  bottom: "0",
  border: "1px solid #e0e0e0",
  padding: "0",
  boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000,
  maxHeight: "85vh",
  overflowY: "auto",
  fontFamily: "Roboto, sans-serif",
}

const containerStyleDesktop: React.CSSProperties = {
  background: "White",
  color: "black",
  borderRadius: "10px",
  width: "350px",
  position: "absolute",
  left: "25px",
  top: "40px",
  border: "1px solid #e0e0e0",
  padding: "0",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  fontFamily: "Roboto, sans-serif",
  marginTop: "60px",
  overflow: "hidden",
}

// Función para los estilos de los botones, manteniendo la coherencia visual
const buttonStyle = (variant: "cancel" | "publish"): React.CSSProperties => ({
  flex: "1",
  padding: "8px 12px",
  borderRadius: "6px",
  border: variant === "cancel" ? "1px solid #ff3b30" : "none",
  backgroundColor: variant === "cancel" ? "white" : "#007aff",
  color: variant === "cancel" ? "#ff3b30" : "white",
  fontSize: "13px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.3s",
})





export function Escribir_resena({ onCancelar }: { onCancelar: () => void }) {
  const isMobile = useIsMobile()
  const containerStyle = isMobile ? containerStyleMobile : containerStyleDesktop
  const simbolo = ">"
  
  const [comentario, setComentario] = useState("")
  const [calificacion, setCalificacion] = useState(4)

  return (
    <div style={containerStyle}>
      {/* Imagen principal */}
      <div style={{ position: "relative" }}>
        <img
          style={{
            width: "100%",
            height: isMobile ? "160px" : "180px",
            objectFit: "cover",
            borderRadius: isMobile ? "20px 20px 0 0" : "10px 10px 0 0",
          }}
          src={Teatro_2 || "/placeholder.svg"}
          alt="Teatro"
        />
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={onCancelar}
            style={{
              width: "22px",
              height: "22px",
              background: "transparent",
              color:"white",
              border: "3px solid white",
              borderRadius: "50%",
              cursor: "pointer",
              filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
            }}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ padding: "0" }}>
        {/* Título, subtítulo y botones de acción */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "12px 0 8px 0",
            padding: "0 15px",
          }}
        >
          {/* Título y subtítulo */}
          <div
            style={{
              textAlign: "left",
              fontFamily: "Roboto, sans-serif",
              flex: "1",
            }}
          >
            <h3 style={{ fontSize: "18px", margin: "0 0 3px 0", fontWeight: "600", color: "#333" }}>
              Teatro Provincial De Curicó
            </h3>
            <h4 style={{ fontSize: "14px", margin: "0 0 3px 0", fontWeight: "400", color: "#666" }}>
              {simbolo} Anfiteatro
            </h4>
            <div style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "#666", marginBottom: "3px" }}>
              <FontAwesomeIcon icon={faStar} style={{ color: "#ffbf00", marginRight: "4px", fontSize: "12px" }} />
              <span style={{ marginRight: "5px", color:"#1f1f1f" }}> 4.5 en reseñas de la comunidad</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "#666", marginBottom: "3px" }}>
              <FontAwesomeIcon icon={faStar} style={{ color: "#ffbf00", marginRight: "4px", fontSize: "12px" }} />
              <span style={{ fontSize: "12px", color: "#666" }}>4.7 en Google Maps</span>
            </div>
          </div>

          {/* Botones de acción (a la derecha) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "80px",
              marginLeft: "10px",
            }}
          >
            {/* Botón Compartir (arriba) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "#007aff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "2px",
                }}
              >
                <FontAwesomeIcon icon={faShareNodes} style={{ color: "white", fontSize: "14px" }} />
              </div>
              <span style={{ fontSize: "10px", color: "#007aff", fontWeight: "500" }}>Compartir</span>
            </div>

            {/* Botón Como Llegar (abajo) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "#007aff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "2px",
                }}
              >
                <FontAwesomeIcon icon={faLocationArrow} style={{ color: "white", fontSize: "14px" }} />
              </div>
              <span style={{ fontSize: "10px", color: "#007aff", fontWeight: "500" }}>Cómo Llegar</span>
            </div>
          </div>
        </div>

        {/* Sección para compartir la experiencia */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            padding: "15px",
            margin: "15px 15px 15px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              margin: "0 0 12px 0",
              color: "#333",
              textAlign: "center",
            }}
          >
            Comparte Tu Experiencia
          </h3>

          {/* Calificación con estrellas */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
              {Array.from({ length: 5 }, (_, index) => {
                const starNumber = index + 1
                return (
                  <FontAwesomeIcon
                    key={starNumber}
                    icon={faStar}
                    style={{
                      fontSize: "24px",
                      color: starNumber <= calificacion ? "#ffbf00" : "#e0e0e0",
                      cursor: "pointer",
                      margin: "0 4px",
                      transition: "transform 0.2s, color 0.2s",
                      transform: starNumber <= calificacion ? "scale(1.1)" : "scale(1)",
                    }}
                    onClick={() => setCalificacion(starNumber)}
                  />
                )
              })}
            </div>
            <span style={{ fontSize: "13px", color: "#666", fontWeight: "500" }}>
              ¿Cómo calificarías tu experiencia?
            </span>
          </div>

          {/* Área de texto para la reseña */}
          <div style={{ marginBottom: "12px" }}>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comparte tu experiencia con este lugar..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "2px solid #bfbfbf",
                fontSize: "13px",
                resize: "vertical",
                fontFamily: "inherit",
                background: "#ffffff",
                boxSizing: "border-box",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                outline: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
            <button onClick={onCancelar} style={buttonStyle("cancel")}>
              Cancelar
            </button>
            <button style={buttonStyle("publish")}>Publicar</button>
          </div>
        </div>

        {/* Nota de política */}
        <div
          style={{
            fontSize: "11px",
            color: "#888",
            textAlign: "center",
            padding: "0 15px 15px",
          }}
        >
          Tu reseña será visible para todos los usuarios y cumplirá con nuestras políticas de contenido.
        </div>
      </div>
    </div>
  )
}


export function ContenidoResenas() {
  return (
    <div>
        
      
      {/* Lista de reseñas con scroll */}
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          marginBottom: "15px",
          padding: "0 15px 0 15px",
          /* Estilos para personalizar la barra de desplazamiento */
          scrollbarWidth: "thin",
          scrollbarColor: "#007aff #f1f1f1",
        }}
      >
        {/* Primera reseña */}
        <div style={{ 
          marginBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "15px"
        }}>
          <h4
            style={{
              fontSize: "14px",
              margin: "0 0 5px 0",
              fontWeight: "600",
              color: "#333",
              textAlign: "left"
            }}
          >
            Elvis Cofre
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{
                color: "#ffbf00",
                fontSize: "14px",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: "#666",
                margin: "0 5px",
              }}
            >
              5
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              • Hace 1 Mes
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
              color: "#333",
              textAlign: "left",
              whiteSpace: "pre-line", // Respeta saltos de línea
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            El Teatro Provincial de Curico es, sin duda, una joya cultural que brilla en la ciudad. Desde el momento en
            que se cruza la entrada, se percibe un ambiente acogedor y elegante que prepara al espectador para una
            experiencia inolvidable.
          </p>
        </div>

        {/* Segunda reseña */}
        <div style={{ 
          marginBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "15px"
        }}>
          <h4
            style={{
              fontSize: "14px",
              margin: "0 0 5px 0",
              fontWeight: "600",
              color: "#333",
              textAlign:"left"
            }}
          >
            Francisco Martin
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{
                color: "#ffbf00",
                fontSize: "14px",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: "#666",
                margin: "0 5px",
              }}
            >
              5
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              • Hace 3 Meses
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
              color: "#333",
              textAlign: "left",
              whiteSpace: "pre-line",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Asistir al Teatro Provincial de Curico fue una experiencia increíble de principio a fin. Desde que entras,
            te sumerges en un ambiente mágico, con una iluminación tenue que crea una atmósfera acogedora. El personal
            es muy amable y siempre está dispuesto a ayudar al visitante, lo que hace que la experiencia sea aún mejor.
          </p>
        </div>

        {/* Tercera reseña */}
        <div style={{ 
          marginBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "15px"
        }}>
          <h4
            style={{
              fontSize: "14px",
              margin: "0 0 5px 0",
              fontWeight: "600",
              color: "#333",
              textAlign:"left"
            }}
          >
            María Fernández
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{
                color: "#ffbf00",
                fontSize: "14px",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: "#666",
                margin: "0 5px",
              }}
            >
              4
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              • Hace 4 Meses
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
              color: "#333",
              textAlign: "left",
              whiteSpace: "pre-line",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Muy buen lugar para disfrutar de eventos culturales. La programación es variada y de calidad. Recomendado
            para toda la familia.
          </p>
        </div>

        {/* Reseña adicional para demostrar el scroll */}
        <div style={{ 
          marginBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "15px"
        }}>
          <h4
            style={{
              fontSize: "14px",
              margin: "0 0 5px 0",
              fontWeight: "600",
              color: "#333",
              textAlign:"left"
            }}
          >
            Carlos Rodríguez
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{
                color: "#ffbf00",
                fontSize: "14px",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: "#666",
                margin: "0 5px",
              }}
            >
              5
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              • Hace 5 Meses
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
              color: "#333",
              textAlign: "left",
              whiteSpace: "pre-line",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Excelente lugar para disfrutar de eventos culturales. La acústica es impresionante y las instalaciones están
            muy bien mantenidas. Recomiendo llegar con tiempo para disfrutar del ambiente antes de las funciones.
          </p>
        </div>

        {/* Reseña adicional para demostrar el scroll */}
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              fontSize: "14px",
              margin: "0 0 5px 0",
              fontWeight: "600",
              color: "#333",
              textAlign: "left"
            }}
          >
            Ana Martínez
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              padding: "15px"
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{
                color: "#ffbf00",
                fontSize: "14px",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: "#666",
                margin: "0 5px",
              }}
            >
              4
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              • Hace 6 Meses
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              margin: 0,
              lineHeight: "1.6",
              color: "#333",
              textAlign: "left",
              whiteSpace: "pre-line",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Asistí a un concierto la semana pasada y quedé encantada. El teatro tiene un encanto especial y el personal
            es muy atento. Lo único que mejoraría es la señalización para encontrar los baños.
          </p>
        </div>
        
        {/* Botón Ver Más Reseñas */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginTop: "10px",
          marginBottom: "20px"
        }}>
          <button style={{
            backgroundColor: "#007aff",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}>
            Ver Más Reseñas
          </button>
        </div>
      </div>
    </div>
  )
}



// COMPONENTE PRINCIPAL: Ver_informacion_publica
function Ver_informacion_publica() {
  const [mostrarResena, setMostrarReseña] = useState(false)
  const [mostrarMasHorarios, setMostrarMasHorarios] = useState(false)
  const [pestanaActiva, setPestanaActiva] = useState<"info" | "resenas">("info")
  const simbolo = ">"

  const isMobile = useIsMobile()
  const containerStyle = isMobile ? containerStyleMobile : containerStyleDesktop

  if (mostrarResena) {
    return <Escribir_resena onCancelar={() => setMostrarReseña(false)} />
  }

  return (
    <div style={containerStyle}>
      {/* Imagen principal */}
      <div style={{ position: "relative" }}>
        <img
          style={{
            width: "100%",
            height: isMobile ? "160px" : "180px",
            objectFit: "cover",
            borderRadius: isMobile ? "20px 20px 0 0" : "10px 10px 0 0",
          }}
          src={Teatro_2 || "/placeholder.svg"}
          alt="Teatro"
        />
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <FontAwesomeIcon
            icon={faXmark}
            style={{
              width: "22px",
              height: "22px",
              color: "white",
              border: "solid 3px white",
              borderRadius: "50%",
              cursor: "pointer",
              filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
            }}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ padding: "0" }}>
        {/* Título, subtítulo y botones de acción */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "12px 0 8px 0",
            padding: "0 15px",
          }}
        >
          {/* Título y subtítulo */}
          <div
            style={{
              textAlign: "left",
              fontFamily: "Roboto, sans-serif",
              flex: "1",
            }}
          >
            <h3 style={{ fontSize: "18px", margin: "0 0 3px 0", fontWeight: "600", color: "#333" }}>
              Teatro Provincial De Curicó
            </h3>
            <h4 style={{ fontSize: "14px", margin: "0 0 3px 0", fontWeight: "400", color: "#666" }}>
              {simbolo} Anfiteatro
            </h4>
            <div style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "#666", marginTop: "3px" }}>
              <FontAwesomeIcon icon={faStar} style={{ color: "#ffbf00", marginBottom: "23px", fontSize: "12px" }} />
              <span style={{ margin: "3px ", color:"#1f1f1f",marginBottom:"4px"}}> 4.5 en reseñas de la comunidad</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "#666", marginBottom: "3px" }}>
              <FontAwesomeIcon icon={faStar} style={{ color: "#ffbf00", marginRight: "4px", fontSize: "12px" }} />
              <span style={{ fontSize: "12px", color: "#666"}}>4.7 en Google Maps</span>
            </div>
          </div>

         {/* Botones de acción (a la derecha) */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: "10px",
  }}
>
  {/* Fila superior: Como Llegar y Compartir */}
  <div style={{ 
    display: "flex", 
    justifyContent: "space-between", 
    marginBottom: "8px",
    gap: "8px"
  }}>
    {/* Botón Como Llegar */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          backgroundColor: "#007aff",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2px",
        }}
      >
        <FontAwesomeIcon icon={faLocationArrow} style={{ color: "white", fontSize: "14px" }} />
      </div>
      <span style={{ fontSize: "10px", color: "#007aff", fontWeight: "500" }}>Como Llegar</span>
    </div>

    {/* Botón Compartir */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          backgroundColor: "#007aff",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2px",
        }}
      >
        <FontAwesomeIcon icon={faShareNodes} style={{ color: "white", fontSize: "14px" }} />
      </div>
      <span style={{ fontSize: "10px", color: "#007aff", fontWeight: "500" }}>Compartir</span>
    </div>
  </div>

  {/* Fila inferior: Escribir Reseña (centrado) */}
  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    width: "100%" 
  }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          backgroundColor: "#007aff",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2px",
          cursor: "pointer",
        }}
        onClick={() => setMostrarReseña(true)}
      >
        <FontAwesomeIcon icon={faPenToSquare} style={{ color: "white", fontSize: "14px" }} />
      </div>
      <span style={{ fontSize: "10px", color: "#007aff", fontWeight: "500", textAlign: "center" }}>
        Escribir<br />Reseña
      </span>
    </div>
  </div>
</div>

         </div>

        {/* Pestañas */}
        {isMobile ? (
          <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0", marginBottom: "12px" }}>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderBottom: pestanaActiva === "info" ? "2px solid #007aff" : "none",
                color: pestanaActiva === "info" ? "#007aff" : "#666",
                fontWeight: "500",
                fontSize: "13px",
                cursor: "pointer",
              }}
              onClick={() => setPestanaActiva("info")}
            >
              Info general
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderBottom: pestanaActiva === "resenas" ? "2px solid #007aff" : "none",
                color: pestanaActiva === "resenas" ? "#007aff" : "#666",
                fontSize: "13px",
                cursor: "pointer",
              }}
              onClick={() => setPestanaActiva("resenas")}
            >
              Reseñas
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0", margin: "10px 0" }}>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderBottom: pestanaActiva === "info" ? "2px solid #007aff" : "none",
                color: pestanaActiva === "info" ? "#007aff" : "#666",
                fontWeight: "500",
                fontSize: "13px",
                cursor: "pointer",
              }}
              onClick={() => setPestanaActiva("info")}
            >
              Vista general
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderBottom: pestanaActiva === "resenas" ? "2px solid #007aff" : "none",
                color: pestanaActiva === "resenas" ? "#007aff" : "#666",
                fontSize: "13px",
                cursor: "pointer",
              }}
              onClick={() => setPestanaActiva("resenas")}
            >
              Reseñas
            </div>
          </div>
        )}

        {/* Contenido según la pestaña activa */}
        {pestanaActiva === "resenas" ? <ContenidoResenas /> : (
          <>
            {/* Información de contacto */}
            <div style={{ marginBottom: "12px", padding: "0 15px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ width: "20px", display: "flex", justifyContent: "center", marginRight: "8px" }}>
                  <FontAwesomeIcon icon={faLocationDot} style={{ color: "#007aff", fontSize: "16px" }} />
                </div>
                <span style={{ fontSize: "13px", color: "#333" }}>
                  Carmen 556-560, 3341768 Curicó, Maule
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ width: "20px", display: "flex", justifyContent: "center", marginRight: "8px" }}>
                  <FontAwesomeIcon icon={faGlobe} style={{ color: "#007aff", fontSize: "16px" }} />
                </div>
                <span style={{ fontSize: "13px", color: "#007aff" }}>teatroprovincialcurico.cl</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ width: "20px", display: "flex", justifyContent: "center", marginRight: "8px" }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: "#007aff", fontSize: "16px" }} />
                </div>
                <span style={{ fontSize: "13px", color: "#007aff" }}>+56752591531</span>
              </div>
            </div>

            {/* Horarios */}
            <div style={{ marginBottom: "15px", padding: "0 15px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ width: "20px", display: "flex", justifyContent: "center", marginRight: "8px" }}>
                  <FontAwesomeIcon icon={faClock} style={{ color: "#007aff", fontSize: "16px" }} />
                </div>
                <div style={{ fontSize: "13px", color: "#333", fontWeight: "500" }}>Horario</div>
              </div>
              <div style={{ paddingLeft: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ width: "80px", fontSize: "13px", fontWeight: "500" }}>Lunes</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>8:30 - 16:30</div>
                  <div style={{ fontSize: "11px", color: "green", fontWeight: "500" }}>• Abierto</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ width: "80px", fontSize: "13px", fontWeight: "500" }}>Martes</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>8:30 - 16:30</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ width: "80px", fontSize: "13px", fontWeight: "500" }}>Miércoles</div>
                  <div style={{ flex: 1, fontSize: "13px" }}>8:30 - 16:30</div>
                </div>
                {mostrarMasHorarios && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ width: "80px", fontSize: "13px", fontWeight: "500" }}>Jueves</div>
                      <div style={{ flex: 1, fontSize: "13px" }}>8:30 - 16:30</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ width: "80px", fontSize: "13px", fontWeight: "500" }}>Viernes</div>
                      <div style={{ flex: 1, fontSize: "13px" }}>8:30 - 16:30</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ width: "80px", fontSize: "13px", fontWeight: "500" }}>Sábado</div>
                      <div style={{ flex: 1, fontSize: "13px" }}>Cerrado</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div style={{ width: "80px", fontSize: "13px", fontWeight: "500" }}>Domingo</div>
                      <div style={{ flex: 1, fontSize: "13px" }}>Cerrado</div>
                    </div>
                  </>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "8px",
                    color: "#007aff",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                  onClick={() => setMostrarMasHorarios(!mostrarMasHorarios)}
                >
                  {mostrarMasHorarios ? "Ver menos" : "Ver más"}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    style={{
                      marginLeft: "5px",
                      transform: mostrarMasHorarios ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.3s",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Accesibilidad */}
            <div style={{ marginBottom: "20px", padding: "0 15px" }}>
              <h3 style={{ textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#333", margin: "0 0 10px 0" }}>
                Tipo de accesibilidad:
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", fontSize: "13px" }}>
                  <FontAwesomeIcon icon={faWheelchair} style={{ marginRight: "10px", color: "#007aff" }} />
                  <span>Acceso para silla de ruedas</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: "13px" }}>
                  <FontAwesomeIcon icon={faElevator} style={{ marginRight: "10px", color: "#007aff" }} />
                  <span>Ascensor/rampa disponible</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: "13px" }}>
                  <span>Estacionamiento accesible</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Ver_informacion_publica
