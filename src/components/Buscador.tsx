import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faLocationDot, faUniversalAccess, faXmark, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
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
    onSeleccionFiltro?: (filtros: { nombre: string; tipo: string }[]) => void;
}

function Buscador({ onSeleccionMarcador, onSeleccionFiltro }: BuscadorProps) {
    const { user } = useAuth();
    const { modoNocturno } = useTheme();
    const { fontSize } = useFontSize();
    const [modalVisible, setModalVisible] = useState(false);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "65%" : "300px");
    const [filtrosActivos, setFiltrosActivos] = useState<Record<string, boolean>>({});
    const [marcadores, setMarcadores] = useState<Marcador[]>([]);
    const [resultados, setResultados] = useState<Marcador[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");
    const [opcionesAccesibilidad, setOpcionesAccesibilidad] = useState<Accesibilidad[]>([]);

    const coloresAccesibilidad: Record<string, string> = {
        "Arquitectónica": "#FB8C00",
        "Cognitiva": "#4FC3F7",
        "Sensorial": "#FFEB3B",
        "CA": "#66BB6A",
    };


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
                            nombre,
                            imagen
                        )
                    )
                `).eq('activo', true);

            const { data: accesibilidadesData, error: accesibilidadesError } = await supabase
                .from('accesibilidad')
                .select('id, nombre, tipo, imagen');

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
        setFiltrosActivos(prev => {
            const nuevosFiltros = {
                ...prev,
                [filtro]: !prev[filtro]
            };

            const seleccionados = Object.entries(nuevosFiltros)
                .filter(([_, activo]) => activo)
                .map(([nombre]) => ({
                    nombre,
                    tipo: opcionesAccesibilidad.find(a => a.nombre === nombre)?.tipo || ""
                }));

            if (onSeleccionFiltro) {
                onSeleccionFiltro(seleccionados);
            }

            return nuevosFiltros;
        });
    };

    const aplicarFiltros = () => {
        setModalVisible(false);
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

    const contarFiltrosActivos = () => {
        return Object.values(filtrosActivos).filter(activo => activo).length;
    };

    const [categoriasAbiertas, setCategoriasAbiertas] = useState<string[]>([]);

    const abrirCategoria = (tipo: string) => {
        setCategoriasAbiertas((prev) =>
            prev.includes(tipo)
                ? prev.filter((cat) => cat !== tipo)
                : [...prev, tipo]
        );
    };
    return (
        <div className={`${styles.container} ${modoNocturno ? styles.darkMode : ''}`}
            style={{
                width: width,
                transition: "width 0.3s ease",
                pointerEvents: 'auto',

            }}
        >
            <div style={{
                backgroundColor: modoNocturno ? "#2d2d2d" : "", border: modoNocturno ? "1px solid rgb(102, 102, 102)" : "1px solid #ccc"
            }} className={styles.distribucionContainer}>
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
                    name="busqueda"
                />

                <button
                    onClick={() => setModalVisible(true)}
                    style={{ background: "transparent", padding: "0px", outline: "none", border: "none", position: "relative" }}
                    aria-label="Abrir filtros"
                    className={styles.filterButton}
                >
                    <FontAwesomeIcon
                        icon={faFilter}
                        size="xl"
                        style={{ color: modoNocturno ? "#888" : "black" }}
                    />
                    {contarFiltrosActivos() > 0 && (
                        <span className={styles.filterCount}>
                            {contarFiltrosActivos()}
                        </span>
                    )}
                </button>
            </div>

            {modalVisible && (
                <div
                    className={styles.modalOverlay}
                    onClick={(e) => {
                        // Solo cerrar si el clic fue directamente en el overlay
                        if (e.target === e.currentTarget) {
                            setModalVisible(false);
                        }
                    }}
                >
                    <div className={styles.modalContent} style={{ backgroundColor: modoNocturno ? "#333" : "white" }}>
                        <div className={styles.modalHeader}>
                            <h2 style={{ color: modoNocturno ? "white" : "black" }}>Filtros de Accesibilidad</h2>
                            <button
                                onClick={() => setModalVisible(false)}
                                className={styles.closeButton}
                                aria-label="Cerrar filtros"
                            >
                                <FontAwesomeIcon icon={faXmark} size="lg" />
                            </button>
                        </div>

                        <div className={styles.filtrosContainer}>
                            {Object.entries(
                                opcionesAccesibilidad.reduce((acc, item) => {
                                    if (!acc[item.tipo]) acc[item.tipo] = [];
                                    acc[item.tipo].push(item);
                                    return acc;
                                }, {} as Record<string, Accesibilidad[]>)
                            ).map(([tipo, accesibilidades]) => (
                                <div key={tipo} className={styles.filtroGrupo}>
                                    <h3
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            color: modoNocturno ? "#ddd" : "#222",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => abrirCategoria(tipo)}
                                    >
                                        {tipo}
                                        <span
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                backgroundColor: coloresAccesibilidad[tipo] || "#ccc",
                                                display: "inline-block"
                                            }}
                                        />
                                        <FontAwesomeIcon icon={categoriasAbiertas.includes(tipo) ? faAngleUp : faAngleDown} />

                                    </h3>

                                    {categoriasAbiertas.includes(tipo) && (
                                        <div className={styles.pictogramasGrid}>
                                            {accesibilidades.map((acces) => (
                                                <div
                                                    key={acces.id}
                                                    className={`${styles.pictogramaItem} ${filtrosActivos[acces.nombre] ? styles.activo : ''}`}
                                                    onClick={() => toggleFiltro(acces.nombre)}
                                                    role="button"
                                                    aria-pressed={filtrosActivos[acces.nombre]}
                                                    style={{ backgroundColor: modoNocturno ? "#2d2d2d" : "", }}
                                                    title={acces.nombre}

                                                >
                                                    <div className={styles.pictogramaPlaceholder}>
                                                        {acces.imagen ? (
                                                            <img
                                                                src={acces.imagen}
                                                                alt="Imagen"
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    borderRadius: '50%'
                                                                }}
                                                            />
                                                        ) : (
                                                            <FontAwesomeIcon
                                                                icon={faUniversalAccess}
                                                                size="xl"
                                                                style={{ color: 'white' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <span
                                                        style={{
                                                            color: modoNocturno ? "white" : "black",
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '100%',
                                                        }}
                                                    >
                                                        {acces.nombre}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                onClick={aplicarFiltros}
                                className={styles.aplicarButton}
                                style={{
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: `${fontSize}rem`
                                }}
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {busqueda.length > 0 && (
                <div className={styles.resultadosContainer}>
                    {resultados.map((item) => (
                        <div
                            key={item.id}
                            className={styles.resultadoItem}
                            onClick={() => {
                                onSeleccionMarcador(item.id);
                                setModalVisible(false);
                                setBusqueda("");
                                SeleccionBusqueda(item.id);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                className={styles.resultadoIcon}
                            />
                            <div className={styles.resultadoInfo}>
                                <div className={styles.resultadoNombre}>
                                    {item.nombre}
                                </div>
                                <div className={styles.resultadoDireccion}>
                                    {item.direccion}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Buscador;