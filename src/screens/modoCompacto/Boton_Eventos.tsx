import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useGetCalendario from "../../hooks/GetCalendario";


function BotonEventos() {
  const { events, error } = useGetCalendario();
  const fontSize = 1.1;

  return (
    <section 
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: window.innerWidth < 768 ? "calc(80vh - 220px)" : "480px"
      }}
      role="region"
      aria-label="Lista de eventos próximos"
    >
      <div>
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
              role="alert"
              aria-label="Error al cargar eventos"
            >
              {error}
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px"
            }}>
              {events.length === 0 && (
                <div 
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: `${fontSize}rem`,
                    padding: "20px 0"
                  }}
                  role="status"
                  aria-label="No hay eventos disponibles"
                >
                  No hay eventos próximos
                </div>
              )}

              {events.map((event, index) => (
                <article
                  key={event.id}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#f8f9fa",
                    border: "1px solid #eee"
                  }}
                  role="article"
                  aria-label={`Evento ${index + 1} de ${events.length}: ${event.title}`}
                  tabIndex={0}
                >
                  <header style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px"
                  }}>
                    <h4 style={{
                      color: "black",
                      margin: 0,
                      fontSize: `${fontSize}rem`,
                      fontWeight: "600",
                      flex: 1,
                      paddingRight: "10px"
                    }}>
                      {event.title}
                    </h4>
                    <span 
                      style={{
                        fontSize: `${fontSize * 0.8}rem`,
                        color: event.colorStatus,
                        padding: "3px 6px",
                        borderRadius: "4px",
                        background: "#f0f0f0",
                        whiteSpace: "nowrap"
                      }}
                      aria-label={`Estado del evento: ${event.status}`}
                    >
                      • {event.status}
                    </span>
                  </header>

                  <p style={{
                    margin: "8px 0",
                    fontSize: `${fontSize * 0.9}rem`,
                    color: "#666",
                    lineHeight: "1.4"
                  }}>
                    {event.description}
                  </p>

                  <div 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      fontSize: `${fontSize * 0.9}rem`,
                      color: "#00570a"
                    }}
                    role="group"
                    aria-label="Detalles del evento"
                  >
                    <div 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                      aria-label={`Fecha y hora: desde ${event.start} hasta ${event.end}`}
                    >
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        style={{ width: "14px" }}
                        aria-hidden="true"
                      />
                      <span style={{ flex: 1, wordBreak: "break-word" }}>
                        {event.start} - {event.end}
                      </span>
                    </div>
                    <div 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                      aria-label={`Ubicación: ${event.address}`}
                    >
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{ width: "14px" }}
                        aria-hidden="true"
                      />
                      <span style={{ flex: 1, wordBreak: "break-word" }}>
                        {event.address}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BotonEventos;