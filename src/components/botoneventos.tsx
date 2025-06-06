import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faCalendar,
  faCalendarAlt,
  faHandshake,
  faLocationDot,
  faXmark,
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
        pointerEvents: 'auto',
        position: "relative",
        width: "100%"
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <button
          onClick={toggleEventos}
          style={{
            background: modoNocturno ? "#2d2d2d" : "rgb(255, 255, 255)",
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
          <FontAwesomeIcon icon={faCalendar} style={{ color: modoNocturno ? "#70cf73" : "black", fontSize: `${fontSize}rem` }} />
          <p style={{ margin: 0, color: modoNocturno ? "#70cf73" : "black", fontSize: `${fontSize}rem` }}>Eventos</p>
        </button>

        <button
          style={{
            background: modoNocturno ? "#2d2d2d" : "linear-gradient(55deg, #29482a, #4e8950, #9fb97f)",
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
          <FontAwesomeIcon icon={faHandshake} style={{ color: modoNocturno ? "#FBEC5D" : "white", fontSize: `${fontSize}rem`, }} />
          <p style={{ margin: 0, color: modoNocturno ? "#FBEC5D" : "white", fontSize: `${fontSize}rem` }}> Colaborar</p>
        </button>
      </div>

      <div
        style={{
          backgroundColor: modoNocturno ? "#2d2d2d" : "white",
          borderRadius: "10px",
          overflow: "visible",
          width: window.innerWidth < 768 ? "calc(100vw - 40px)" : "400px",
          maxHeight: window.innerWidth < 768 ? "calc(100vh - 200px)" : "500px",
          padding: EventoIsVisible ? "10px" : "0",
          paddingBottom: EventoIsVisible ? "30px" : "0",
          marginTop: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          position: window.innerWidth < 768 ? "fixed" : "absolute",
          top: window.innerWidth < 768 ? "50%" : "calc(100% + 5px)",
          left: window.innerWidth < 768 ? "50%" : "0",
          transform: window.innerWidth < 768 ? "translate(-50%, -50%)" : "none",
          zIndex: 1000,
          display: EventoIsVisible ? "block" : "none"
        }}
      >
        {EventoIsVisible && (
          <>
            <div style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxHeight: window.innerWidth < 768 ? "calc(80vh - 220px)" : "480px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: `1px solid ${modoNocturno ? "#404040" : "#eee"}`
              }}>
                <h3 style={{
                  margin: 0,
                  color: modoNocturno ? "white" : "black",
                  fontSize: `${fontSize}rem`
                }}>
                  Eventos
                </h3>
                <button
                  onClick={toggleEventos}
                  style={{
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    cursor: "pointer",
                    opacity: 0.6,
                    transition: "opacity 0.2s ease"
                  }}
                >
                  <FontAwesomeIcon
                    icon={faAngleUp}
                    style={{
                      color: modoNocturno ? "#fff" : "black",
                      fontSize: `${fontSize}rem`
                    }}
                  />
                </button>
              </div>

              <div style={{
                overflowY: "auto",
                flex: 1,
                padding: "10px"
              }}>
                {error ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontSize: `${fontSize}rem`,
                      fontWeight: "bold",
                      padding: "20px 10px"
                    }}
                  >
                    {error}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px"
                    }}
                  >
                    {events.length === 0 && (
                      <div style={{
                        textAlign: "center",
                        color: modoNocturno ? "#999" : "#666",
                        fontSize: `${fontSize}rem`,
                        padding: "20px 0"
                      }}>
                        No hay eventos próximos
                      </div>
                    )}

                    {events.map((event) => (
                      <div
                        key={event.id}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          background: modoNocturno ? "#222" : "#f8f9fa",
                          border: `1px solid ${modoNocturno ? "#404040" : "#eee"}`
                        }}
                      >
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px"
                        }}>
                          <h4 style={{
                            color: modoNocturno ? "white" : "black",
                            margin: 0,
                            fontSize: `${fontSize}rem`,
                            fontWeight: "600",
                            flex: 1,
                            paddingRight: "10px"
                          }}>
                            {event.title}
                          </h4>
                          <span style={{
                            fontSize: `${fontSize * 0.8}rem`,
                            color: event.colorStatus,
                            padding: "3px 6px",
                            borderRadius: "4px",
                            background: modoNocturno ? "#333" : "#f0f0f0",
                            whiteSpace: "nowrap"
                          }}>
                            • {event.status}
                          </span>
                        </div>

                        <p style={{
                          margin: "8px 0",
                          fontSize: `${fontSize * 0.9}rem`,
                          color: modoNocturno ? "#ccc" : "#666",
                          lineHeight: "1.4"
                        }}>
                          {event.description}
                        </p>

                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          fontSize: `${fontSize * 0.9}rem`,
                          color: modoNocturno ? "#04cf1b" : "#00570a"
                        }}>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              style={{ width: "14px" }}
                            />
                            <span style={{ flex: 1, wordBreak: "break-word" }}>
                              {event.start} - {event.end}
                            </span>
                          </div>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <FontAwesomeIcon
                              icon={faLocationDot}
                              style={{ width: "14px" }}
                            />
                            <span style={{ flex: 1, wordBreak: "break-word" }}>
                              {event.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={toggleEventos}
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#ff4444",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              aria-label="Cerrar panel de eventos"
            >
              <FontAwesomeIcon
                icon={faXmark}
                style={{
                  color: "white",
                  fontSize: `${fontSize}rem`
                }}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BotonEventos;
