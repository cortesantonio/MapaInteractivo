import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleUp,
    faCalendar,
    faCalendarAlt,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useGetCalendario from "../hooks/GetCalendario";

function BotonEventos() {
    const [Eventoisvisible, setEventoIsVisible] = useState(false);
    const [height, setHeight] = useState("0px");
    const [opacity, setOpacity] = useState(0);
    const [width, setWidth] = useState("90px");
    const [ismargin, setismargin] = useState("0");

    const { events, error } = useGetCalendario();

    const getInitialPosition = () => {
        return {
            right: window.innerWidth <= 768 ? "10%" : `${window.innerWidth - 325}px`,
        };
    };

    const [position, setPosition] = useState(getInitialPosition());

    useEffect(() => {
        const handleResize = () => {
            setPosition(getInitialPosition());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const ampliarBotonEventos = () => {
        if (Eventoisvisible) {
            setHeight("0px");
            setismargin("0px");
            setOpacity(0);
            setWidth("90px");
            setTimeout(() => setEventoIsVisible(false), 300);
        } else {
            setEventoIsVisible(true);
            setTimeout(() => {
                setHeight("fit-content");
                setismargin("10px");
                setOpacity(1);
                if (window.innerWidth <= 768) {
                    setWidth("77%");
                } else {
                    setWidth("300px");
                }
            }, 10);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "white",
                alignItems: "center",
                padding: "10px",
                borderRadius: "5px",
                gap: "10px",
                width: width,
                transition: "width 0.3s ease-in-out",
                zIndex: 1
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "15px",
                    gap: "10px",
                    margin: ismargin,

                }}
            >


                <button
                    onClick={ampliarBotonEventos}
                    style={{
                        background: "transparent",
                        padding: "0px",
                        outline: "none",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",

                    }}
                >

                    <FontAwesomeIcon
                        icon={faCalendar}
                        size="lg"
                        style={{ color: "black" }}
                    />
                    <p
                        style={{
                            background: "transparent",
                            color: "black",
                            border: "none",
                            fontSize: "1rem",
                            outline: "none",

                        }}
                    >
                        Eventos
                    </p>

                </button>
                {Eventoisvisible && (
                    <button
                        onClick={ampliarBotonEventos}
                        style={{
                            background: "transparent",
                            padding: "0px",
                            outline: "none",
                            border: "none",
                            display: "flex",
                            opacity: 0.4,
                            overflow: "hidden",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faAngleUp}
                            size="2x"
                            style={{ color: "black" }}
                        />
                        <p
                            style={{
                                background: "transparent",
                                color: "black",
                                border: "none",
                                fontSize: "1rem",
                                outline: "none",
                            }}
                        >
                            Ocultar
                        </p>
                    </button>
                )}


            </div>
            <div
                style={{
                    overflow: "hidden",
                    height: height,
                    width: "100%",
                    opacity: opacity,
                    transition: "height 0.3s ease, opacity 0.3s ease",
                }}
            >


                {Eventoisvisible && (
                    <div
                        style={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "30px",
                        }}
                    >
                        {error ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "red",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    width: "100%",
                                }}
                            >
                                {error}
                            </div>
                        ) : (
                            <div
                                style={{
                                    flexGrow: 1,
                                    textAlign: "left",
                                    display: "flex",
                                    flexDirection: "column",
                                    maxHeight: "390px",
                                    overflowY: "auto",
                                }}
                            >

                                {events.length === 0 && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            color: "gray",
                                            fontSize: "1rem",
                                            width: "100%",

                                        }}
                                    >
                                        No hay eventos próximos
                                    </div>
                                )}

                                {events.map((event) => (
                                    <div key={event.id} style={{ paddingBottom: "10px" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",

                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "1px",
                                                    backgroundColor: "black",
                                                    opacity: 0.2,
                                                    maxWidth: "95%",
                                                    margin: "0 auto",
                                                }}
                                            ></div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: 'space-between',
                                                alignItems: "start",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: 'center', padding: "10px", opacity: 0.8, marginTop: '15px' }}>
                                                <FontAwesomeIcon icon={faCalendar} size="xl" style={{ color: "black" }} />
                                            </div>
                                            <div
                                                style={{
                                                    flexGrow: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    padding: "10px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600" }}>
                                                        {event.title}
                                                    </h3>
                                                    <span
                                                        style={{
                                                            fontSize: "0.7rem",
                                                            color: event.colorStatus,
                                                            textTransform: 'uppercase',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        • {event.status}
                                                    </span>
                                                </div>
                                                <p style={{ margin: "5px 0", fontSize: "0.9rem", opacity: 0.6 }}
                                                >
                                                    {event.description}</p>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        fontSize: "0.9rem",
                                                        marginTop: '10px',
                                                        color: "#00570a",
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                                    <span>
                                                        {event.start} - {event.end}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        fontSize: "0.9rem",
                                                        color: "#00570a",
                                                        marginTop: '10px'

                                                    }}
                                                >
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
                )}

            </div>
        </div>
    );
}

export default BotonEventos;
