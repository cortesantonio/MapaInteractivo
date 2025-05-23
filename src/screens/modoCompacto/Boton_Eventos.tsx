import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarAlt,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useGetCalendario from "../../hooks/GetCalendario";
import "./css/Boton_Eventos.css"; // Importamos la hoja de estilos

function BotonEventos() {
  const { events, error } = useGetCalendario();

  return (
    <div className="contenedor_principal">
      <div className="tarjeta_eventos">
        <div className="columna_eventos">
          {error ? (
            <div className="mensaje_error">
              {error}
            </div>
          ) : (
            <div className="lista_eventos">
              {events.length === 0 && (
                <div className="mensaje_sin_eventos">
                  No hay eventos próximos
                </div>
              )}

              {events.map((event) => (
                <div key={event.id} className="evento_item">
                  <div className="separador_evento"></div>
                  <div className="contenedor_evento">
                    <div className="icono_calendario">
                      <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className="detalles_evento">
                      <div className="encabezado_evento">
                        <h3 className="titulo_evento">
                          {event.title}
                        </h3>
                        <span
                          className="estado_evento"
                          style={{ color: event.colorStatus }}
                        >
                          • {event.status}
                        </span>
                      </div>
                      <p className="descripcion_evento">
                        {event.description}
                      </p>
                      <div className="fecha_evento">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span>
                          {event.start} - {event.end}
                        </span>
                      </div>
                      <div className="ubicacion_evento">
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
      </div>
    </div>
  );
}

export default BotonEventos;