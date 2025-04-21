import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMapLocation, faLocationPin, faLocationCrosshairs, faUser, faMicrophone, faCar, faTrain, faMotorcycle, faPersonWalking, faClockRotateLeft, faCircleXmark, faPersonBiking, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Reconocimiento from "../components/reconocimientodevoz";
import { useNavigate } from "react-router-dom";



//Funcionamiento completo del footer 
function Footer() {
    const navigate = useNavigate()
    //Controla el Panel que mostrara la informacion del maplocation y del userperson
    const [panelActivo, setPanelActivo] = useState<"map" | "user" | "microphone" | null>(null);
    const [modoNocturno, setModoNocturno] = useState(false)
    const [tamanoFuente, setTamanoFuente] = useState(1)
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "80%" : "300px");
    const setHeight = useState("0px")[1]// Cambiado a una variable de estado para controlar la altura del panel
    const [Isdisplay, setIsdisplay] = useState("none");
    const [activarReconocimiento, setactivarReconocimiento] = useState(false);

    //Cumple la funcion de ajutar el viewport, la config inicial y el listar, la limpieza al desmontar el componente
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "98%" : "300px");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    //Funcion Separada de cada Bottom cuando se activa uno el otro se cancela
    const togglePanel = (panel: "map" | "user" | "microphone") => {
        if (panelActivo === panel) {
            closePanel();
        } else {

            setPanelActivo(panel);
            setTimeout(() => {
                setIsdisplay("block");
                setHeight("350px");
            }, 10);
        }
    };

    useEffect(() => {
        if (panelActivo === "microphone") {
            setactivarReconocimiento(true);
        } else {
            setactivarReconocimiento(false);
        }
    }, [panelActivo]);

    const closePanel = () => {
        setHeight("0px");
        setIsdisplay("none");
        setactivarReconocimiento(false);
        setTimeout(() => {
            setPanelActivo(null);
        }, 300);
    };

    const aumentarFuente = () => {
        if (tamanoFuente < 1.5) {
            setTamanoFuente(tamanoFuente + 0.1)
        }
    }

    const disminuirFuente = () => {
        if (tamanoFuente > 0.8) {
            setTamanoFuente(tamanoFuente - 0.1)
        }
    }

    return (
        //Contenedor pirncipal (padre)
        <div
            style={{
                backgroundColor: "white",
                padding: "5px",
                alignItems: "center",
                borderRadius: "10px",
                top: "auto",
                bottom: "10px",
                zIndex: "1",
                height: "5%",
                width: width,
                transform: "translatex(-50%)",
                position: "fixed",
                transition: "width 0.3s ease",
                left: "50%",
            }}
        >

            <div //Contenedor de los Botones inferior del trazado de ruta y funciones disponibles
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "2px",
                    height: "30px",
                    width: "auto",
                    gap: 10,
                }}
            >
                <button onClick={() => togglePanel("map")} style={{ background: "transparent", padding: "20px", outline: "none", border: "none", margin: "10px" }}>
                    <FontAwesomeIcon icon={panelActivo === "map" ? faChevronDown : faMapLocation} size="xl" style={{ color: panelActivo === "map" ? "blue" : "gray" }} />
                </button>



                <button onClick={() => togglePanel("user")} style={{ background: "transparent", padding: "20px", outline: "none", border: "none", margin: "10px" }}>
                    <FontAwesomeIcon icon={faUser} size="xl" style={{ color: panelActivo === "user" ? "blue" : "gray" }} />
                </button>
            </div>

            <button onClick={() => togglePanel("microphone")} style={{ // El boton del Microphone esta aparte pero dentro del cotenedor principal
                position: "fixed",
                bottom: "25px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "rgb(253, 29, 29)",
                background: "linear-gradient(90deg, rgba(253, 29, 29, 1) 0%, rgba(255, 106, 60, 1) 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 4,
                cursor: "pointer"
            }}>
                <FontAwesomeIcon icon={panelActivo === "microphone" ? faCircleXmark : faMicrophone} size="xl" style={{ color: "white" }} />
            </button>

            <div // Panel de despliegue para cada informacion de Visualizacion 
                style={{
                    position: "absolute",
                    borderRadius: "5px",
                    marginTop: "8px",
                    bottom: "80%",
                    width: "100%",
                    left: "0px",
                    backgroundColor: "white",
                    overflow: "hidden",
                    height: "450px",
                    display: Isdisplay,
                    transition: "height 0.3s ease, opacity 0.3s ease",
                }}
            >
                {panelActivo === "map" && ( //Vista de los contenidos que tendra el panel de trazado de rutas

                    <div style={{ padding: "20px", position: "relative", height: "100%", overflow: "auto", fontSize: `${tamanoFuente}rem` }}>
                        <button
                            onClick={closePanel}
                            style={{
                                position: "absolute",
                                top: "1px",
                                right: "1px",
                                background: "transparent",
                                padding: "10px",
                                border: "none",
                                cursor: "pointer",

                            }}
                        >
                            <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                        </button>

                        <div style={{ marginTop: "29px" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: "8px",
                                    color: "green",
                                }}>
                                    <FontAwesomeIcon icon={faLocationCrosshairs} size="sm" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ubicación Actual"
                                    style={{
                                        background: "transparent",
                                        color: "black",
                                        fontSize: "14px",
                                        width: "100%",
                                        border: "1px solid gray",
                                        borderRadius: "20px",
                                        padding: "7px 12px",
                                        outline: "none",
                                    }}
                                />
                            </div>

                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "10px",
                            }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: "12px",
                                    color: "red"
                                }}>
                                    <FontAwesomeIcon icon={faLocationPin} size="sm" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Destino"
                                    style={{
                                        background: "transparent",
                                        color: "black",
                                        fontSize: "14px",
                                        width: "100%",
                                        border: "1px solid gray",
                                        borderRadius: "20px",
                                        padding: "7px 12px",
                                        outline: "none",
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "45px",
                                margin: "20px 0",
                            }}
                        >
                            <button style={{ background: "transparent", padding: "0px", outline: "none", border: "none" }}>
                                <FontAwesomeIcon icon={faCar} size="lg" style={{ color: "black" }} />
                            </button>
                            <button style={{ background: "transparent", padding: "0px", outline: "none", border: "none" }}>
                                <FontAwesomeIcon icon={faMotorcycle} size="lg" style={{ color: "black" }} />
                            </button>
                            <button style={{ background: "transparent", padding: "0px", outline: "none", border: "none" }}>
                                <FontAwesomeIcon icon={faTrain} size="lg" style={{ color: "black" }} />
                            </button>
                            <button style={{ background: "transparent", padding: "0px", outline: "none", border: "none" }}>
                                <FontAwesomeIcon icon={faPersonWalking} size="lg" style={{ color: "black" }} />
                            </button>
                            <button style={{ background: "transparent", padding: "0px", outline: "none", border: "none" }}>
                                <FontAwesomeIcon icon={faPersonBiking} size="lg" style={{ color: "black" }} />
                            </button>
                        </div>

                        <hr style={{ width: "90%" }}></hr>

                        <div style={{ marginTop: "15px" }}>
                            <h4
                                style={{
                                    color: "gray",
                                    textAlign: "center",
                                    font: " 100% sans-serif"
                                }}
                            >
                                DESTINOS RECIENTES
                            </h4>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "1px",
                                    fontSize: "13px",
                                    textAlignLast: "left"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "10px",
                                        color: "gray"
                                    }}
                                >
                                    <FontAwesomeIcon icon={faClockRotateLeft} style={{ color: "gray" }} size="lg" />
                                </div>

                                <div>
                                    <p style={{ margin: "0", fontWeight: "bold", color: "black" }}>Mall Curicó</p>
                                    <p style={{ margin: "0", color: "gray", fontSize: "12px" }}>Avenida O'Higgins, Curicó</p>
                                </div>

                            </div>
                            <hr style={{ width: "80%" }}></hr>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "10px 0",
                                    fontSize: "13px",
                                    textAlignLast: "left"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "8px",
                                        color: "gray"
                                    }}
                                >
                                    <FontAwesomeIcon icon={faClockRotateLeft} style={{ color: "gray" }} size="lg" />
                                </div>
                                <div>
                                    <p style={{ margin: "0", fontWeight: "bold", color: "black" }}>Comunidad Edificio Manuel Montt</p>
                                    <p style={{ margin: "0", color: "#666", fontSize: "12px" }}>Manuel Montt 756, Curicó Centro</p>
                                </div>
                            </div>
                        </div>
                        <hr style={{ width: "80%" }}></hr>
                    </div>

                )}

                {panelActivo === "user" && ( // Visualizacion de los datos que vera el usuario y sus funciones correspondientes
                    <div style={{ padding: "20px", position: "relative", height: "100%", overflow: "auto", fontSize: `${tamanoFuente}rem` }}>
                        <div style={{
                            flexDirection: "column",
                        }}>
                            <button
                                onClick={closePanel}
                                style={{
                                    position: "absolute",
                                    top: "1px",
                                    right: "1px",
                                    background: "transparent",
                                    padding: "10px",
                                    border: "none",
                                    cursor: "pointer"

                                }}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                            </button>

                            <h3 style={{ color: "black", margin: "10px", textAlign: "center" }}>Opciones</h3>

                            <div style={{ margin: "0px", justifyItems: "left" }}>

                                <button
                                    style={{
                                        color: "blue",
                                        background: "transparent",
                                        outline: "none",
                                        border: "none",
                                        fontWeight: "bold",
                                        padding: "10px",
                                        textAlign: "center",
                                        marginTop: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => { navigate('/login') }}
                                >
                                    INICIAR SESIÓN
                                </button>

                                <div>
                                    <button style={{ color: "black", background: "transparent", outline: "none", border: "none", padding: "10px" }}
                                        onClick={() => { navigate('/colaborar') }}>
                                        Colaborar
                                    </button>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        alignItems: "right",
                                        padding: "9px"
                                    }}
                                >
                                    <span style={{ color: "black", textAlign: "right" }}>Modo Nocturno</span>
                                    <div
                                        onClick={() => setModoNocturno(!modoNocturno)}
                                        style={{
                                            width: "40px",
                                            height: "20px",
                                            backgroundColor: modoNocturno ? "rgb(175, 253, 171)" : "white",
                                            borderRadius: "34px",
                                            left: "20px",
                                            border: "1px solid gray",
                                            outline: "none",
                                            position: "relative",
                                            transition: "background-color 0.4s",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: "absolute",
                                                height: "16px",
                                                border: "1px solid gray",
                                                width: "16px",
                                                left: modoNocturno ? "22px" : "2px",
                                                bottom: "1px",
                                                backgroundColor: "black",
                                                borderRadius: "50%",
                                                transition: "0.4s",
                                            }}
                                        ></span>
                                    </div>
                                </div>

                                <button
                                    style={{
                                        color: "black",
                                        background: "transparent",
                                        outline: "none",
                                        border: "none",
                                        padding: "9px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Modo Compacto
                                </button>

                            </div>
                            <div
                                style={{
                                    justifyContent: "space-between",
                                    padding: "8px",
                                    justifyItems: "center",
                                    textAlign: "center",
                                    margin: "10px"
                                }}
                            >
                                <div style={{ display: "flex" }}>
                                    <button
                                        onClick={disminuirFuente}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            display: "flex",
                                            fontWeight: "bold",
                                            alignItems: "center",
                                            padding: 0,
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faMinus} size="xs" style={{ color: "black" }} />
                                        <span style={{ marginRight: "2px", color: "black", textAlign: "center", fontSize: "18px" }}>A</span>

                                    </button>
                                    <span style={{ margin: "5px", color: "black", justifyItems: "center" }}>Tamaño de fuente</span>
                                    <button
                                        onClick={aumentarFuente}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            display: "flex",
                                            alignItems: "center",
                                            padding: 0,
                                        }}
                                    >
                                        <span style={{ marginRight: "2px", color: "black", textAlign: "center", fontSize: "18px" }}>A</span>
                                        <FontAwesomeIcon icon={faPlus} size="xs" style={{ color: "black" }} />
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>

                )}

                {panelActivo === "microphone" && ( //Vista de la funcion que realiza el Microphone
                    <div style={{ padding: "15px", position: "relative", height: "80%", overflow: "auto", fontSize: `${tamanoFuente}rem` }}>
                        {panelActivo !== null && (
                            <button
                                onClick={closePanel}
                                style={{
                                    position: "absolute",
                                    top: "1px",
                                    right: "1px",
                                    background: "transparent",
                                    padding: "10px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                            </button>
                        )}
                        <h3 style={{ color: "black", font: " 120% sans-serif", marginTop: "50px", textAlign: "center" }}>Te Escucho ¿Donde Quieres Ir...?</h3>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "30px",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            <Reconocimiento activarReconocimiento={activarReconocimiento} />
                        </div>

                    </div>


                )}

            </div>
        </div>
    );
}

export default Footer;
