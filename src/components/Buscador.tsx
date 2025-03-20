import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";

function Buscador() {
    const [filtroIsVisible, setFiltroIsVisible] = useState(false);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "80%" : "300px");
    const [height, setHeight] = useState("0px");
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "80%" : "300px");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },);

    const ampliarBuscador = () => {
        if (filtroIsVisible) {
            setHeight("0px");
            setOpacity(0);
            setTimeout(() => setFiltroIsVisible(false), 300);
        } else {
            setFiltroIsVisible(true);
            setTimeout(() => {
                setHeight("525px");
                setOpacity(1);
            }, 10);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "white",
                alignItems: "center",
                padding: "10px",
                borderRadius: "15px",
                gap: "10px",
                position: "absolute",
                top: "25px",
                zIndex: "1",
                left: "25px",
                width: width,
                transition: "width 0.3s ease",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: "25px",
                    gap: 10,
                }}
            >
                <img src="src/assets/icons/marcador-negro.png" alt="Marcador" style={{ width: "15px" }} />
                <input
                    type="text"

                    placeholder="Buscador"
                    style={{
                        background: "transparent",
                        color: "black",
                        border: "none",
                        fontSize: "1rem",
                        width: "100%",
                        height: "25px",
                        outline: "none",
                        fontWeight: "bold",

                    }}
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
                }}
            >
                {filtroIsVisible && (
                    <div style={{ marginTop: "10px", textAlign: "left" }}>
                        <p style={{ color: "black", fontWeight: 550 }}>Accesibilidad Física</p>
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Rampas
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Ascensores
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Puertas Automáticas
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Baños Adaptados
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Estacionamientos Reservados
                        </label>
                        <br />
                        <p style={{ color: "black", fontWeight: 550 }}>Accesibilidad Sensorial</p>
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Señalización en braille
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Señalización auditiva
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Luces intermitentes
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Mapas táctiles
                        </label>
                        <br />
                        <p style={{ color: "black", fontWeight: 550 }}>Accesibilidad Sensorial</p>
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Símbolos universales
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Rutas intuitivas
                        </label>
                        <br />
                        <label style={{ color: "black" }}>
                            <input type="checkbox" /> Atención con personal capacitado
                        </label>
                        <br />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <button style={{ backgroundColor: "white", color: "#af0000", fontWeight: "lighter", width: '40%' }}>Cancelar</button>
                            <button style={{ background: "linear-gradient(45deg, #ff0000, #ff6100)", color: "white", fontWeight: "bold", width: '40%' }}>Filtrar</button>
                        </div>
                    </div>

                )}
            </div>


        </div >
    );
}

export default Buscador;
