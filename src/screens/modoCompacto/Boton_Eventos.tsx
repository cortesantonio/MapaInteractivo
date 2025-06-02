import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarAlt,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useGetCalendario from "../../hooks/GetCalendario";
import styles from "./css/Boton_Eventos.module.css"; // Importamos la hoja de estilos

function BotonEventos() {
  const { events, error } = useGetCalendario();

  return (
    <div className={styles.contenedor_principal}>
      <div className={styles.tarjeta_eventos}>
        <div className={styles.columna_eventos}>
          {error ? (
            <div className={styles.mensaje_error}>
              {error}
            </div>
          ) : (
            <div className={styles.lista_eventos}>
              {events.length === 0 && (
                <div className={styles.mensaje_sin_eventos}>
                  No hay eventos próximos
                </div>
              )}

              {events.map((event) => (
                <div key={event.id} className={styles.evento_item}>
                  <div className={styles.separador_evento}></div>
                  <div className={styles.contenedor_evento}>
                    <div className={styles.icono_calendario}>
                      <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className={styles.detalles_evento}>
                      <div className={styles.encabezado_evento}>
                        <h3 className={styles.titulo_evento}>
                          {event.title}
                        </h3>
                        <span
                          className={styles.estado_evento}
                          style={{ color: event.colorStatus }}
                        >
                          • {event.status}
                        </span>
                      </div>
                      <p className={styles.descripcion_evento}>
                        {event.description}
                      </p>
                      <div className={styles.fecha_evento}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span>
                          {event.start} - {event.end}
                        </span>
                      </div>
                      <div className={styles.ubicacion_evento}>
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