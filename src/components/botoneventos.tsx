import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faCalendar,
  faCalendarAlt,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useGetCalendario from "../hooks/GetCalendario";

function BotonEventos() {
  const [EventoIsVisible, setEventoIsVisible] = useState(false);
  const { events, error } = useGetCalendario();

  const toggleEventos = () => {
    setEventoIsVisible((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <button
        onClick={toggleEventos}
        style={{
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faCalendar} style={{ color: "black" }} />
        <p style={{ margin: 0, color: "black", fontSize: "1rem" }}>Eventos</p>
      </button>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          overflow: "hidden",
          width: window.innerWidth < 768 ? "85%" : "300px",
          transition: "width 0.3s ease-in-out",
          padding: EventoIsVisible ? "10px" : "0",
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
              <FontAwesomeIcon icon={faAngleUp} size="2x" style={{ color: "black" }} />
              <p style={{ margin: 0, color: "black", fontSize: "1rem" }}>Ocultar</p>
            </button>

            {error ? (
              <div
                style={{
                  textAlign: "center",
                  color: "red",
                  fontSize: "1.2rem",
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
                  maxHeight: "390px",
                  overflowY: "auto",
                }}
              >
                {events.length === 0 && (
                  <div style={{ textAlign: "center", color: "gray", fontSize: "1rem" }}>
                    No hay eventos próximos
                  </div>
                )}

                {events.map((event) => (
                  <div key={event.id} style={{ paddingBottom: "10px" }}>
                    <div
                      style={{
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
                        <FontAwesomeIcon icon={faCalendar} size="xl" style={{ color: "black" }} />
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
                          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>
                            {event.title}
                          </h3>
                          <span
                            style={{
                              fontSize: "0.7rem",
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
                            fontSize: "0.9rem",
                            opacity: 0.6,
                          }}
                        >
                          {event.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.9rem",
                            marginTop: "10px",
                            color: "#00570a",
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
                            fontSize: "0.9rem",
                            color: "#00570a",
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
