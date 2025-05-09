import styles from "./info.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faWheelchair, faRoad, faSquareParking, faPuzzlePiece, faPersonWalkingWithCane} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Info() {
  const navigate = useNavigate();

  return (
    <div className={styles.container_principal}>
      <div>
        <button className={styles.botonatras} onClick={() => navigate(-1)} aria-label="Volver atrás"><FontAwesomeIcon icon={faReply} /></button>
      </div>
      <div className={styles.container}>
        <div className={styles.titulo}>
          <h1>Normas Para Poder Colaborar</h1>
          <hr />
        </div>
        <div className={styles.contentenido_principal_Seccion}>
          <section className={styles.Seccion_de_Accesibilidad}>
            <div className={styles.seccion_de_titulos}>
              <h2>Requisitos para implementar vías de Accesibilidad</h2>
            </div>
            <div className={styles.featureHeader}>
              <h3>Baños Accesibles (Requisitos para su Instalación):</h3>
              <FontAwesomeIcon icon={faWheelchair} className={styles.featureIcon_1} />
            </div>
            
            <div>
              <div className={styles.Pre_Descripcion}>
                <h4>Deben cumplir con diseño universal (art. 4.1.7 numeral 6) y el recinto debe cumplir con estas Medidas:</h4>
              </div>
              
              <div className={styles.especificacion_de_contenido}>
                <h5>Especificaciones Arquitectónicas:</h5>
                <hr />
                <h4>Dimensiones Mínimas del Recinto:</h4>
                <h4>El Baño debe permitir un Giro de 360° de una silla de ruedas:</h4>
                <ul>
                  <li>Deben incluir mudadores de diseño universal, accesibles para ambos sexos.</li>
                  <li>Diámetro Mínimo de 1,50 metros</li>
                  <li>El espacio puede incluir el área bajo el lavamanos, siempre que no haya pedestal ni elementos que impidan la aproximación frontal</li>
                </ul>
              </div>

              <div className={styles.especificacion_de_contenido}>
                <h4>Puertas de Acceso:</h4>
                <ul>
                  <li>Vano mínimo de 0,90 m y ancho libre de paso de 0,80 m</li>
                  <li>Preferiblemente debe abrir hacia el exterior.</li>
                  <li>Si abre hacia el interior, la puerta no puede interferir con el diámetro de giro de 1,50 m</li>
                </ul>
              </div>
              
              <div className={styles.especificacion_de_contenido}>
                <h4>Espacio de Transferencia del Inodoro:</h4>
                <ul>
                  <li>Debe haber al menos 0,80 m de ancho por 1,20 m de largo junto al inodoro para permitir transferencia lateral</li>
                </ul>
              </div>
            </div>
          </section>
          <section className={styles.Seccion_de_Accesibilidad}>
            <div className={styles.featureHeader}>
              <h3>Rampas Universales:</h3>
              <FontAwesomeIcon icon={faRoad} className={styles.featureIcon_2} />
            </div>
            
            <div>
              <div className={styles.Pre_Descripcion}>
                <h4>Las Rampas deben cumplir con diseño universal (art. 4.1.7 numeral 6) y el recinto debe cumplir con estas Medidas:</h4>
                <h4>En Cruces peatonales, accesos y desniveles debe cumplir con estos Requisitos:</h4>
              </div>
              
              <div className={styles.especificacion_de_contenido}>
                <h5>Especificaciones Arquitectónicas:</h5>
                <hr />
                <h4>Pendiente Máxima:</h4>
                <ul>
                  <li>Hasta 1.5 m: 12%.</li>
                  <li>Más de 1.5 m: pendiente decreciente según fórmula (ver art. 4.1.7)</li>
                  <li>Ancho mínimo: 1.2 m.</li>
                  <li>Superficie: antideslizante en seco y mojado.</li>
                </ul>
              </div>
            </div>
          </section>
          <section className={styles.Seccion_de_Accesibilidad}>
            <div className={styles.featureHeader}>
              <h3>Estacionamiento para Discapacitados:</h3>
              <FontAwesomeIcon icon={faSquareParking} className={styles.featureIcon_3} />
            </div>
            
            <div>
              <div className={styles.Pre_Descripcion}>
                <h4>Los estacionamientos accesibles deben cumplir con normativa específica para garantizar su uso adecuado:</h4>
              </div>
              
              <div className={styles.especificacion_de_contenido}>
                <h5>Especificaciones Arquitectónicas:</h5>
                <hr />
                <ul>
                  <li>Al menos el 1% del total de estacionamientos debe ser accesible, con un mínimo obligatorio de 2 unidades (art. 2.2.8 n°11)</li>
                  <small >* Fuente: Decreto DS N°50 / 2015 - OGUC</small>

                </ul>
                
                <h4>Dimensiones:</h4>
                <ul>
                  <li>5 m largo x 2.5 m ancho + franja de circulación de 1.1 m (compartible)</li>
                  <li>Pendiente máxima: 2% en ambos sentidos.</li>
                </ul>
                
                <h4>Señalización:</h4>
                <ul>
                  <li>Horizontal: con el Símbolo Internacional de Accesibilidad (SIA).</li>
                  <li>Vertical: visible pero no puede obstaculizar la apertura de puertas ni la ruta accesible.</li>
                </ul>
              </div>
            </div>
          </section>
          <section className={styles.Seccion_de_Accesibilidad}>
            <div className={styles.featureHeader}>
              <h3>Zonas de calma (Personas Neuro Divergentes )</h3>
              <FontAwesomeIcon icon={faPuzzlePiece} className={styles.featureIcon_4} />
            </div>
            
            <div>
              <div className={styles.Pre_Descripcion}>
                <h4>Las zonas de calma son espacios esenciales para personas con Trastorno del Espectro Autista:</h4>
              </div>
              
              <div className={styles.especificacion_de_contenido}>
                <h5>Especificaciones Arquitectónicas:</h5>
                <hr />
                <ul>
                  <li>Rutas accesibles claras y señalizadas.</li>
                  <li>Espacios de regulación emocional o descanso sensorial.</li>
                  <li>Acceso conectado mediante la ruta accesible (art. 2.2.8 y 2.6.17).</li>
                </ul>
              </div>
            </div>
          </section>
          <section className={styles.Seccion_de_Accesibilidad}>
            <div className={styles.featureHeader}>
              <h3>Accesibilidad Para Personas con Discapacidad Visual</h3>
              <FontAwesomeIcon icon={faPersonWalkingWithCane} className={styles.featureIcon_4} />
            </div>
            
            <div>
              <div className={styles.Pre_Descripcion}>
                <h4>Las zonas de calma son espacios esenciales para personas con Trastorno del Espectro Autista:</h4>
              </div>
              
              <div className={styles.especificacion_de_contenido}>
                <h5>Especificaciones Arquitectónicas:</h5>
                <hr />
                <ul>
                  <li>Señalización braille en dispositivos (como semáforos peatonales).</li>
                  <h4> Caracteristicas de la Señalización:</h4>
                  <li>Vibración</li>
                  <li>Señales Auditivas</li>
                  <li>Flechas en relieve en el botón del semáforo.</li>
                </ul>
              </div>
            </div>
          </section>

           
        </div>
      </div>
    </div>
  );
}



export default Info;