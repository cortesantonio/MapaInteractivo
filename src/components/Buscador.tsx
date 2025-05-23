import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faFilterCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./css/Buscador.module.css";
import { supabase } from "../services/supabase";
import { Accesibilidad } from "../interfaces/Accesibilidad";
import { useTheme } from "../components/Footer/Modo_Nocturno";
import { useAuth } from '../hooks/useAuth';
import { useFontSize } from "./Footer/Modificador_Letras";

interface Marcador {
    id: number;
    nombre: string;
    direccion: string;
    filtros: string[];
}

interface BuscadorProps {
    onSeleccionMarcador: (id: number) => void;
}

function Buscador({ onSeleccionMarcador }: BuscadorProps) {
    const { user } = useAuth();
    const { modoNocturno } = useTheme();
    const { fontSize } = useFontSize();
    const [filtroIsVisible, setFiltroIsVisible] = useState(false);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "65%" : "300px");
    const [height, setHeight] = useState("0px");
    const [opacity, setOpacity] = useState(0);
    const [displayFiltro, setDisplayFiltro] = useState("none");
    const [filtrosActivos, setFiltrosActivos] = useState<Record<string, boolean>>({});
    const [marcadores, setMarcadores] = useState<Marcador[]>([]);
    const [resultados, setResultados] = useState<Marcador[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");
    const [opcionesAccesibilidad, setOpcionesAccesibilidad] = useState<Accesibilidad[]>([]);


    useEffect(() => {
        const fetchMarcadores = async () => {
            const { data: marcadoresData, error: marcadoresError } = await supabase
                .from('marcador')
                .select(`
                    id,
                    nombre_recinto,
                    direccion,
                    accesibilidad_marcador (
                        accesibilidad (
                            nombre
                        )
                    )
                `).eq('activo', true);

            const { data: accesibilidadesData, error: accesibilidadesError } = await supabase
                .from('accesibilidad')
                .select('id, nombre, tipo');

            if (marcadoresError || accesibilidadesError) {
                console.error(marcadoresError || accesibilidadesError);
                return;
            }

            const marcadoresFormateados = marcadoresData.map((item: any) => ({
                id: item.id,
                nombre: item.nombre_recinto,
                direccion: item.direccion,
                filtros: item.accesibilidad_marcador.map((am: any) => am.accesibilidad.nombre)
            }));

            const filtrosIniciales: Record<string, boolean> = {};
            accesibilidadesData.forEach((a) => {
                filtrosIniciales[a.nombre] = false;
            });

            setMarcadores(marcadoresFormateados);
            setResultados(marcadoresFormateados);
            setFiltrosActivos(filtrosIniciales);
            setOpcionesAccesibilidad(accesibilidadesData);
        };

        fetchMarcadores();
    }, []);



    const obtenerFechaChile = () => {
        const ahora = new Date();
        const fechaChile = new Intl.DateTimeFormat('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Santiago'
        }).formatToParts(ahora);

        // Convertir partes a un formato tipo ISO local sin zona horaria
        const partes: { [key: string]: string } = {};
        fechaChile.forEach(({ type, value }) => {
            partes[type] = value;
        });

        const fechaFinal = `${partes.year}-${partes.month}-${partes.day}T${partes.hour}:${partes.minute}:${partes.second}`;
        return fechaFinal;
    };


    const SeleccionBusqueda = async (idMarcador: number) => {
        const id_usuario = user?.id;

        if (!id_usuario) {
            return;
        }

        const fechaHoraChile = obtenerFechaChile();

        const { error: insertError } = await supabase.from('busquedas').insert({
            id_usuario,
            id_marcador: idMarcador,
            fecha_hora: fechaHoraChile,
        });

        if (insertError) {
            console.error("Error al registrar la búsqueda:", insertError);
        }
    };


    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "90%" : "300px");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },);

    const toggleFiltro = (filtro: string) => {
        setFiltrosActivos(prev => ({
            ...prev,
            [filtro]: !prev[filtro]
        }));
    };

    useEffect(() => {
        const texto = busqueda.toLowerCase();
        const filtrosSeleccionados = Object.entries(filtrosActivos)
            .filter(([_, activo]) => activo)
            .map(([nombre]) => nombre);

        const filtrados = marcadores.filter((m) => {
            const coincideTexto =
                m.nombre.toLowerCase().includes(texto) ||
                m.direccion.toLowerCase().includes(texto);

            const coincideFiltro = filtrosSeleccionados.every(f =>
                m.filtros.includes(f)
            );

            return coincideTexto && (filtrosSeleccionados.length === 0 || coincideFiltro);
        });

        setResultados(filtrados);
    }, [busqueda, marcadores, filtrosActivos]);

    const ampliarBuscador = () => {
        if (filtroIsVisible) {
            setHeight("0px");
            setOpacity(0);
            setTimeout(() => setFiltroIsVisible(false), 300);
            setDisplayFiltro('none')
        } else {
            setFiltroIsVisible(true);
            setTimeout(() => {
                setHeight("fit-content");
                setDisplayFiltro('block')
                setOpacity(1);
            }, 10);
        }
    };


    return (
        <div className={`${styles.container} ${modoNocturno ? styles.darkMode : ''}`}
            style={{
                width: width,
                transition: "width 0.3s ease",
                pointerEvents: 'auto'


            }}
        >
            <div style={{ backgroundColor: modoNocturno ? "#2d2d2d" : "", border: modoNocturno ? "none" : "1px solid #ccc" }} className={styles.distribucionContainer}>
                <FontAwesomeIcon
                    icon={faLocationDot}
                    size="xl"
                    style={{ color: modoNocturno ? "red" : "" }}
                />
                <input
                    type="text"
                    className={`${styles.inpBuscar}`}
                    style={{ backgroundColor: modoNocturno ? "#2d2d2d" : "", color: modoNocturno ? "white" : "", fontSize: `${fontSize}rem` }}
                    placeholder="Buscador"
                    onChange={(e) => setBusqueda(e.target.value)}
                    value={busqueda}
                />

                <button onClick={ampliarBuscador} style={{ background: "transparent", padding: "0px", outline: "none", border: "none" }}>
                    {filtroIsVisible ? (
                        <FontAwesomeIcon icon={faFilterCircleXmark} size="lg" style={{ color: "red" }} />
                    ) : (
                        <FontAwesomeIcon icon={faFilter} size="lg" style={{ color: modoNocturno ? "#888" : "black" }} />
                    )}
                </button>
            </div>

            {filtroIsVisible && (
                <div
                    style={{
                        overflow: "hidden",
                        height: height,
                        opacity: opacity,
                        transition: "height 0.3s ease, opacity 0.3s ease",
                        backgroundColor: modoNocturno ? "#333" : "white",
                        marginTop: '10px',
                        borderRadius: '15px',
                        padding: '15px',
                        display: displayFiltro,
                        border: modoNocturno ? "none" : "1px solid #ccc"
                    }}
                >
                    <div style={{ textAlign: "left" }}>
                        <p style={{ color: modoNocturno ? "white" : "black", fontWeight: 550 }}>
                            Filtros de Accesibilidad
                        </p>
                        {opcionesAccesibilidad.map((acces) => (
                            <div key={acces.id}>
                                <label style={{ color: modoNocturno ? "white" : "black" }}>
                                    <input
                                        type="checkbox"
                                        checked={filtrosActivos[acces.nombre] || false}
                                        onChange={() => toggleFiltro(acces.nombre)}
                                    />{" "}
                                    {acces.nombre}
                                </label>
                                <br />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {busqueda.length > 0 && (
                <div style={{
                    marginTop: "10px",
                    textAlign: "left",
                    maxHeight: "200px",
                    overflowY: "auto",
                    backgroundColor: modoNocturno ? '#333' : 'white',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: `${fontSize}rem`,
                    color: modoNocturno ? 'white' : 'black'
                }}>
                    <p>Resultados</p>
                    <hr style={{ borderColor: modoNocturno ? '#555' : '#ccc' }} />
                    {resultados.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                padding: "5px 0",
                                borderBottom: `1px solid ${modoNocturno ? '#555' : '#ccc'}`,
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                onSeleccionMarcador(item.id);
                                setFiltroIsVisible(false);
                                setBusqueda("");
                                SeleccionBusqueda(item.id);
                            }}
                        >
                            <strong>{item.nombre}</strong><br />
                            <small>{item.direccion}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Buscador;