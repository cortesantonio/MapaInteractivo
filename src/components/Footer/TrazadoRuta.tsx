import styles from "./css/TrazadoRuta.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin, faLocationCrosshairs, faCar, faPersonWalking, faClockRotateLeft, faCircleXmark, faPersonBiking, faBus } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '../../services/supabase';
import { useState, useEffect } from 'react';
import { useTheme } from "./Modo_Nocturno";
import { useAuth } from "../../hooks/useAuth";
import { useFontSize } from "./Modificador_Letras";


export default function TrazadoRuta({ 
    closePanel, 
    panelActivo, 
    onSeleccionMarcadorRecientes, 
    cambiarModoViaje, 
    establecerDestino, 
    ubicacionActiva, 
    Idrutamarcador,
    onIndicaciones
}: {
    closePanel: () => void
    panelActivo: string
    onSeleccionMarcadorRecientes: (id: number) => void
    cambiarModoViaje: (modo: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT') => void
    establecerDestino: (lat: number | null, lng: number | null) => void;
    ubicacionActiva: boolean
    Idrutamarcador: number | null;
    onIndicaciones?: string[]; 
    
}) {

    const { user } = useAuth();
    const [destinosRecientes, setDestinosRecientes] = useState<boolean>(false)
    const [busquedasRecientes, setBusquedasRecientes] = useState<Array<{ id_marcador: any, fecha_hora: string }>>([]);
    const [marcadorUbicacion, setMarcadorUbicacion] = useState<Array<{ id: number, nombre: string, direccion: string, lat: number, lng: number }>>([]);
    const [busqueda, setBusqueda] = useState("");
    const [resultados, setResultados] = useState<Array<{ id: number, nombre: string, direccion: string, lat: number, lng: number }>>([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [destinoEstablecido, setDestinoEstablecido] = useState<boolean>(false);
    const [modoViajeActual, setModoViajeActual] = useState<'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT'>('DRIVING');
    const {modoNocturno} = useTheme ();
    const {fontSize} = useFontSize ();


    useEffect(() => {
        const obtenerBusquedas = async () => {
            if (!user) { // Si no hay usuario, no hace nada
                setDestinosRecientes(false);
                return;
            }
            const { data, error } = await supabase
                .from('busquedas')
                .select(`
                fecha_hora,
                id_marcador(
                id,
                nombre_recinto,
                direccion,
                url_img,
                accesibilidad_marcador (
                    accesibilidad (
                        nombre
                    )
                ))
            `)
                .eq('id_usuario', user.id)
                .order('fecha_hora', { ascending: false })

            if (!error && data) {
                const busquedasRecientesFormateadas = data.map((item: any) => ({
                    id_marcador: item.id_marcador,
                    fecha_hora: item.fecha_hora,
                }));
                setBusquedasRecientes(busquedasRecientesFormateadas);
                setDestinosRecientes(busquedasRecientesFormateadas.length > 0)
   
            } else {
                console.error("Error al obtener búsquedas con marcadores:", error);
            }
        };

        obtenerBusquedas();
    }, [user,]);

    useEffect(() => {
        const obtenerMarcadores = async () => {
            const { data, error } = await supabase
                .from('marcador')
                .select(`id, 
                nombre_recinto,
                direccion,
                latitud,
                longitud
                `);
            if (!error && data) {
                const MarcadorFormateadas = data.map((item: any) => ({
                    id: item.id,
                    nombre: item.nombre_recinto,
                    direccion: item.direccion,
                    lat: item.latitud,
                    lng: item.longitud,
                }));
                setMarcadorUbicacion(MarcadorFormateadas);
            } else {
                console.error("Error al obtener búsquedas con marcadores:", error);
            }
    
        };
        obtenerMarcadores(); 
        
    }, []);

    useEffect(() => {
        const buscarMarcadores = () => {
            const textoBusqueda = busqueda.toLowerCase();
    
            const resultadosFiltrados = marcadorUbicacion.filter((marcador: any) =>
                marcador.nombre.toLowerCase().includes(textoBusqueda) ||
                marcador.direccion.toLowerCase().includes(textoBusqueda)
            );
            setResultados(resultadosFiltrados);
        };
    
        buscarMarcadores();
    }, [busqueda, marcadorUbicacion]);

    useEffect(() => {
        if (Idrutamarcador === null) return;
    
        const marcador = marcadorUbicacion.find(item => item.id === Idrutamarcador);
        if (marcador) {
            establecerDestino(marcador.lat, marcador.lng);
            setBusqueda(marcador.nombre);
            setMostrarResultados(false);
            setDestinoEstablecido(true);
        } else {
            setBusqueda(""); 
            setDestinoEstablecido(false);
        }
    }, [Idrutamarcador, marcadorUbicacion, establecerDestino]);
    

    const handleCambiarModoViaje = (modo: 'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT') => {
        cambiarModoViaje(modo);  // Llama a la función prop
        setModoViajeActual(modo); // Actualiza el estado local
    };

    return (
        <div>
            {panelActivo === "map" && (

                <div className={styles.PanelActivo} style={{ fontSize: `${fontSize}rem` }}>
                    <button onClick={closePanel} className={styles.ButtonClose}>
                        <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                    </button>
                    <div style={{ marginTop: "29px" }}>
                        <div className={styles.ContenUno}>
                            <div className={styles.ContenInterUno}>
                                <FontAwesomeIcon icon={faLocationCrosshairs} size="sm" />
                            </div>
                            <input style={{pointerEvents: "none", cursor: "not-allowed",fontSize:  `${fontSize}rem` ,}}
                                type="text"
                                value={ubicacionActiva ? "Ubicación Activa" : "Ubicación Desactivada"}
                                readOnly
                                className={`${styles.Input} ${ubicacionActiva ? styles.activa : styles.desactivada}`}
                            />
                            
                        </div>

                        <div className={styles.ContenDos}>
                            <div className={styles.ContenInterDos}>
                                <FontAwesomeIcon icon={faLocationPin} size="sm" />
                            </div>
                            <div style={{ position: "relative", width: "100%" }}>
                            <input
                                    style={{color: modoNocturno ? "white":"",fontSize:  `${fontSize}rem` }}
                                    type="text"
                                    placeholder="Destino"
                                    className={styles.Input}
                                    value={busqueda}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        setBusqueda(valor);
                                        setMostrarResultados(true);

                                        if (valor.trim() === "") {
                                            establecerDestino(null, null);
                                            setDestinoEstablecido(false);
                                        }
                                    }}
                                />
                            {busqueda.length > 0 && mostrarResultados && (
                                    <div style={{
                                        fontSize:  `${fontSize}rem` ,
                                        position: "absolute",
                                        width: "100%",
                                        backgroundColor: modoNocturno ? "#2d2d2d" : 'white',
                                        borderRadius: '10px',
                                        height: 'auto',
                                        padding: '10px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        maxHeight: "100px",
                                        overflowY: "auto"
                                    }}>
                                        {resultados.length > 0 ? (
                                            resultados.map((item) => (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        fontSize:  `${fontSize}rem` ,
                                                        padding: "5px 0",
                                                        borderBottom: "1px solid #eee",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => {
                                                        establecerDestino(item.lat, item.lng);
                                                        setBusqueda(item.nombre); 
                                                        setDestinoEstablecido(true);
                                                        setMostrarResultados(false); 
                                                    }}
                                                >
                                                    <strong>{item.nombre}</strong><br />
                                                    <small>{item.direccion}</small>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ marginTop: "10px", color: "#888", fontSize:  `${fontSize}rem` , }}>Sin resultados.</p>
                                        )}
                                    </div>
                                )}

                            </div> 
                        </div>
                    </div>

                    <div className={styles.PositionIcons}>
                        <button className={styles.ButttonIcons} onClick={() => handleCambiarModoViaje('DRIVING')}>
                            <FontAwesomeIcon icon={faCar} size="lg" style={{ color: modoViajeActual === 'DRIVING' ? 'rgb(75, 127, 241)' : 'black'  }}/>
                        </button>
                        <button className={styles.ButttonIcons}>
                            <FontAwesomeIcon icon={faBus} size="lg" style={{ color: "gray" }} />
                        </button>
                        <button className={styles.ButttonIcons} onClick={() => handleCambiarModoViaje('WALKING')}>
                            <FontAwesomeIcon icon={faPersonWalking} size="lg" style={{ color: modoViajeActual === 'WALKING' ? 'rgb(75, 127, 241)' : 'black' }}/>
                        </button>
                        <button className={styles.ButttonIcons} onClick={() => handleCambiarModoViaje('BICYCLING')}>
                            <FontAwesomeIcon icon={faPersonBiking} size="lg" style={{ color: modoViajeActual === 'BICYCLING' ? 'rgb(75, 127, 241)' : 'black' }}/>
                        </button>
                    </div>

                    <hr className={styles.Lineahr} style={{ width: "98%" }}></hr>

                    {/* Desde aqui en adelante realizar la funcion correspondiente con la tabla de busquedas */}
                    {(!ubicacionActiva || !destinoEstablecido) ? (
                        <div style={{ marginTop: "15px" }}>
                            <h4 style={{color:modoNocturno ? "#fff" : ""}} className={styles.TituloDestin}>
                                DESTINOS RECIENTES
                            </h4>
                            {!destinosRecientes ? (
                                <p style={{color:modoNocturno ? "#fff" : "",fontSize:`${fontSize}rem`}} className={styles.MensajeP}>No hay Destinos Recientes</p>
                            ) : (
                                busquedasRecientes.map((busquedas, index) => (
                                    <div key={index} className={styles.ContenInfo} onClick={() => onSeleccionMarcadorRecientes(busquedas.id_marcador?.id)}>
                                        <div className={styles.IconsClock}>
                                            <FontAwesomeIcon icon={faClockRotateLeft} style={{ color: "gray" }} size="xl" />
                                        </div>
                                        <div>
                                            <p style={{ margin: "0", fontWeight: "bold", color: "black" }}>
                                                {busquedas.id_marcador?.nombre_recinto}
                                            </p>
                                            <p style={{ margin: "0", color: "gray", fontSize: "12px" }}>
                                                {busquedas.id_marcador?.direccion}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : null}

                    {(ubicacionActiva && destinoEstablecido) ? (
                        <div style={{ height: "90px"}}>
                        <h4 className={styles.TituloIndi}>
                          INDICACIONES
                        </h4>
                        <div style={{height: "100%",overflowY: "auto"}}>
                        {onIndicaciones && onIndicaciones.length > 0 ? (
                          onIndicaciones.map((instruccion, index) => (
                            <div key={index} className={styles.ContenInfo}>
                              <div>
                                <p
                                  style={{ margin: "0", fontWeight: "bold", color: modoNocturno ? "white" : "black", fontSize:  `${fontSize}rem` , }}
                                  dangerouslySetInnerHTML={{ __html: instruccion }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{color:modoNocturno ? "#fff" : ""}} className={styles.MensajeP}>No hay instrucciones disponibles</p>
                        )}

                        </div>
                        
                      </div>
                    ) : null}






                </div>

            )}
        </div>
    )
}

