import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faFilterCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./css/Buscador.module.css";

interface Marcador {
    id: number;
    nombre: string;
    direccion: string;
    filtros: string[];
}

const marcadoresSimulados: Marcador[] = [
    {
        id: 1,
        nombre: "Centro Cultural",
        direccion: "Av. Siempre Viva 123",
        filtros: ["Rampas", "Baños Adaptados", "Señalización auditiva"]
    },
    {
        id: 2,
        nombre: "Biblioteca Central",
        direccion: "Calle de los Libros 456",
        filtros: ["Ascensores", "Señalización en braille"]
    },
];



function Buscador() {
    const [filtroIsVisible, setFiltroIsVisible] = useState(false);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "80%" : "300px");
    const [height, setHeight] = useState("0px");
    const [opacity, setOpacity] = useState(0);
    const [displayFiltro, setDisplayFiltro] = useState("none");
    const [filtrosActivos, setFiltrosActivos] = useState<Record<string, boolean>>({});

    const [marcadores, setMarcadores] = useState<Marcador[]>([]);
    const [resultados, setResultados] = useState<Marcador[]>([]);
    const [busqueda, setBusqueda] = useState<string>("");

    useEffect(() => {
        // hacer aqui el llamado a la api o al almacen de cache

        setMarcadores(marcadoresSimulados);
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
                        <p style={{ color: "black", fontWeight: 550 }}>Accesibilidad Física</p>

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Rampas"] || false}
                                onChange={() => toggleFiltro("Rampas")}
                            /> Rampas
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Ascensores"] || false}
                                onChange={() => toggleFiltro("Ascensores")}
                            /> Ascensores
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Puertas Automáticas"] || false}
                                onChange={() => toggleFiltro("Puertas Automáticas")}
                            /> Puertas Automáticas
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Baños Adaptados"] || false}
                                onChange={() => toggleFiltro("Baños Adaptados")}
                            /> Baños Adaptados
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Estacionamientos Reservados"] || false}
                                onChange={() => toggleFiltro("Estacionamientos Reservados")}
                            /> Estacionamientos Reservados
                        </label>
                        <br />

                        <p style={{ color: "black", fontWeight: 550 }}>Accesibilidad Sensorial</p>

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Señalización en braille"] || false}
                                onChange={() => toggleFiltro("Señalización en braille")}
                            /> Señalización en braille
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Señalización auditiva"] || false}
                                onChange={() => toggleFiltro("Señalización auditiva")}
                            /> Señalización auditiva
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Luces intermitentes"] || false}
                                onChange={() => toggleFiltro("Luces intermitentes")}
                            /> Luces intermitentes
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Mapas táctiles"] || false}
                                onChange={() => toggleFiltro("Mapas táctiles")}
                            /> Mapas táctiles
                        </label>
                        <br />

                        <p style={{ color: "black", fontWeight: 550 }}>Accesibilidad Cognitiva</p>

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Símbolos universales"] || false}
                                onChange={() => toggleFiltro("Símbolos universales")}
                            /> Símbolos universales
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Rutas intuitivas"] || false}
                                onChange={() => toggleFiltro("Rutas intuitivas")}
                            /> Rutas intuitivas
                        </label>
                        <br />

                        <label style={{ color: "black" }}>
                            <input
                                type="checkbox"
                                checked={filtrosActivos["Atención con personal capacitado"] || false}
                                onChange={() => toggleFiltro("Atención con personal capacitado")}
                            /> Atención con personal capacitado
                        </label>
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
                    {resultados.length > 0 ? (
                        resultados.map((item) => (
                            <div key={item.id} style={{ padding: "5px 0", borderBottom: "1px solid #ccc" }}>
                                <strong>{item.nombre}</strong><br />
                                <small>{item.direccion}</small>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: "gray" }}>No se encontraron resultados.</p>
                    )}
                </div>
            )}
        </div >

    );
}

export default Buscador;
