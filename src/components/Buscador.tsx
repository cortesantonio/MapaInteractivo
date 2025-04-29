import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faFilterCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./css/Buscador.module.css";
import { supabase } from "../services/supabase";
import { Accesibilidad } from "../interfaces/Accesibilidad";
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

    const [filtroIsVisible, setFiltroIsVisible] = useState(false);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "80%" : "300px");
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
            // 1. Traer marcadores y relaciones con accesibilidad
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

            // 2. Traer accesibilidades
            const { data: accesibilidadesData, error: accesibilidadesError } = await supabase
                .from('accesibilidad')
                .select('id, nombre, tipo');

            if (marcadoresError || accesibilidadesError) {
                console.error(marcadoresError || accesibilidadesError);
                return;
            }

            // 3. Formatear marcadores
            const marcadoresFormateados = marcadoresData.map((item: any) => ({
                id: item.id,
                nombre: item.nombre_recinto,
                direccion: item.direccion,
                filtros: item.accesibilidad_marcador.map((am: any) => am.accesibilidad.nombre)
            }));

            // 4. Inicializar filtros activos con todos en true. OPCIONAL, PARA DESPUES DEJARLE COMO PREDETERMINADO SI EL USUARIO TIENE DISCAPACIDAD REGISTRADA.
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



    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "80%" : "300px");
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
        <div className={styles.container}
            style={{
                width: width,
                transition: "width 0.3s ease",
            }}
        >
            <div
                className={styles.distribucionContainer}>
                <FontAwesomeIcon icon={faLocationDot} size="xl" />
                <input
                    type="text"
                    className={styles.inpBuscar}
                    placeholder="Buscador"
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <button onClick={ampliarBuscador} style={{ background: "transparent", padding: "0px", outline: "none", border: "none" }}>
                    {filtroIsVisible ? (
                        <FontAwesomeIcon icon={faFilterCircleXmark} size="lg" style={{ color: "red" }} />
                    ) : (
                        <FontAwesomeIcon icon={faFilter} size="lg" style={{ color: "black" }} />
                    )}
                </button>
            </div>

            <div
                style={{
                    overflow: "hidden",
                    height: height,
                    opacity: opacity,
                    transition: "height 0.3s ease, opacity 0.3s ease",
                    backgroundColor: "white",
                    marginTop: '10px',
                    borderRadius: '15px',
                    padding: '15px',
                    display: displayFiltro

                }}
            >
                {filtroIsVisible && (
                    <div style={{ textAlign: "left" }}>
                        <p style={{ color: "black", fontWeight: 550 }}>Filtros de Accesibilidad</p>
                        {opcionesAccesibilidad.map((acces) => (
                            <div key={acces.id}>
                                <label style={{ color: "black" }}>
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
                )}
            </div>

            {busqueda.length > 0 && (
                <div style={{
                    marginTop: "10px", textAlign: "left", maxHeight: "200px", overflowY: "auto",
                    backgroundColor: 'white', borderRadius: '10px', padding: '10px'
                }}>
                    <p>Resultados</p>
                    <hr />
                    {resultados.map((item) => (
                        <div
                            key={item.id}
                            style={{ padding: "5px 0", borderBottom: "1px solid #ccc", cursor: "pointer" }}
                            onClick={() => onSeleccionMarcador(item.id)}
                        >
                            <strong>{item.nombre}</strong><br />
                            <small>{item.direccion}</small>
                        </div>
                    ))}
                </div>
            )}
        </div >

    );
}

export default Buscador;
