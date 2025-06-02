import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faCalendar,
  faCalendarAlt,
  faHandshake,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useGetCalendario from "../hooks/GetCalendario";
import { useTheme } from "../components/Footer/Modo_Nocturno";
import { useFontSize } from "./Footer/Modificador_Letras";
import { useNavigate } from "react-router-dom";

function BotonEventos() {
  const [EventoIsVisible, setEventoIsVisible] = useState(false);
  const { events, error } = useGetCalendario();
  const { modoNocturno } = useTheme();
  const { fontSize } = useFontSize();
  const navigate = useNavigate();

  const toggleEventos = () => {
    setEventoIsVisible((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        pointerEvents: 'auto'
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>

        <button
          onClick={toggleEventos}
          style={{
            background: modoNocturno ? "#2d2d2d" : "white",
            border: modoNocturno ? "none" : "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px 15px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <FontAwesomeIcon icon={faCalendar} style={{ color: modoNocturno ? "white" : "black", fontSize: `${fontSize}rem` }} />
          <p style={{ margin: 0, color: modoNocturno ? "white" : "black", fontSize: `${fontSize}rem` }}>Eventos</p>
        </button>

        <button
          style={{
            background: modoNocturno ? "#2d2d2d" : "white",
            border: modoNocturno ? "none" : "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px 10px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
          onClick={() => { navigate('/colaborar') }}
          aria-label="Colaborar con el proyecto"
          title="Colaborar con el proyecto"
        >
          <FontAwesomeIcon icon={faHandshake} style={{ color: modoNocturno ? "white" : "black", fontSize: `${fontSize}rem` }} />
          <p style={{ margin: 0, color: modoNocturno ? "white" : "black", fontSize: `${fontSize}rem` }}> Colaborar</p>
        </button>

      </div>
    
      <div
        style={{
          backgroundColor: modoNocturno ? "#2d2d2d" : "white",
          borderRadius: "10px",
          overflow: "hidden",
          width: window.innerWidth < 768 ? "100%" : "300px",
          padding: EventoIsVisible ? "10px" : "0",
          marginTop: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {EventoIsVisible && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={toggleEventos}
              style={{
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                opacity: 0.4,
                gap: "5px",
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} size="2x" style={{ color: modoNocturno ? "#fff" : "black", fontSize: `${fontSize}rem` }} />
              <p style={{ margin: 0, color: modoNocturno ? "white" : "black", fontSize: `${fontSize}rem` }}>Ocultar</p>
            </button>

            {error ? (
              <div
                style={{
                  textAlign: "center",
                  color: "red",
                  fontSize: `${fontSize}rem`,
                  fontWeight: "bold",
                }}
              >
                {error}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "410px",
                  overflowY: "auto",
                }}
              >
                {events.length === 0 && (
                  <div style={{ textAlign: "center", color: "gray", fontSize: `${fontSize}rem` }}>
                    No hay eventos próximos
                  </div>
                )}

                {events.map((event) => (
                  <div key={event.id} style={{ paddingBottom: "10px" }}>
                    <div
                      style={{
                        fontSize: `${fontSize}rem`,
                        width: "100%",
                        height: "1px",
                        backgroundColor: "black",
                        opacity: 0.2,
                        maxWidth: "95%",
                        margin: "0 auto 10px auto",
                      }}
                    ></div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px",
                          opacity: 0.8,
                          marginTop: "15px",
                        }}
                      >
                        <FontAwesomeIcon icon={faCalendar} size="xl" style={{ color: modoNocturno ? "#fff" : "black" }} />
                      </div>
                      <div
                        style={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          padding: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h3 style={{ color: modoNocturno ? "white" : "black", margin: 0, fontSize: `${fontSize}`, fontWeight: "600" }}>
                            {event.title}
                          </h3>
                          <span
                            style={{
                              fontSize: `${fontSize}rem`,
                              color: event.colorStatus,
                              textTransform: "uppercase",
                              textAlign: "center",
                            }}
                          >
                            • {event.status}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "5px 0",
                            fontSize: `${fontSize}rem`,
                            opacity: 0.6,
                            color: modoNocturno ? "white" : "black"
                          }}
                        >
                          {event.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: `${fontSize}rem`,
                            marginTop: "10px",
                            color: modoNocturno ? "#04cf1b" : "#00570a"
                          }}
                        >
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <span>
                            {event.start} - {event.end}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: `${fontSize}rem`,
                            color: modoNocturno ? "#04cf1b" : "#00570a",
                            marginTop: "10px",
                          }}
                        >
                          <FontAwesomeIcon icon={faLocationDot} />
                          <span>{event.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BotonEventos;
