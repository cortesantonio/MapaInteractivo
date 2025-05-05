import styles from "./css/TrazadoRuta.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin, faLocationCrosshairs, faCar, faTrain, faMotorcycle, faPersonWalking, faClockRotateLeft, faCircleXmark, faPersonBiking } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '../../services/supabase';
import { useState, useEffect } from 'react';
import { useAuth } from "../../hooks/useAuth";
import { Busquedas } from "../../interfaces/Busquedas";

export default function TrazadoRuta({ tamanoFuente, closePanel, panelActivo }: {
    tamanoFuente: number,
    closePanel: () => void
    panelActivo: string
}) {

    const { user } = useAuth();

    const [busquedasRecientes, setBusquedasRecientes] = useState<Partial<Busquedas>[]>([]);


    useEffect(() => {
        const obtenerBusquedas = async () => {
            if (!user) return; // Si no hay usuario, no hace nada

            const { data, error } = await supabase
                .from('busquedas')
                .select(`
                fecha_hora,
                id_marcador(
                nombre_recinto,
                direccion
                )
            `)
                .eq('id_usuario', user.id)
                .order('fecha_hora', { ascending: false })

            if (!error && data) {
                const busquedasRecientesFormateadas = data.map((item: any) => ({
                    id_marcador: item.id_marcador,
                    fecha_hora: item.fecha_hora,
                }));
                setBusquedasRecientes(busquedasRecientesFormateadas);
                console.log(busquedasRecientesFormateadas)
            } else {
                console.error("Error al obtener búsquedas con marcadores:", error);
            }
        };

        obtenerBusquedas();
    }, [user]);


    return (
        <div>
            {panelActivo === "map" && (

                <div className={styles.PanelActivo} style={{ fontSize: `${tamanoFuente}rem` }}>
                    <button onClick={closePanel} className={styles.ButtonClose}>
                        <FontAwesomeIcon icon={faCircleXmark} style={{ color: "red" }} size="xl" />
                    </button>
                    <div style={{ marginTop: "29px" }}>
                        <div className={styles.ContenUno}>
                            <div className={styles.ContenInterUno}>
                                <FontAwesomeIcon icon={faLocationCrosshairs} size="sm" />
                            </div>
                            <input type="text" placeholder="Ubicación Actual" className={styles.Input} />
                        </div>

                        <div className={styles.ContenDos}>
                            <div className={styles.ContenInterDos}>
                                <FontAwesomeIcon icon={faLocationPin} size="sm" />
                            </div>
                            <input type="text" placeholder="Destino" className={styles.Input} />
                        </div>
                    </div>

                    <div className={styles.PositionIcons}>
                        <button className={styles.ButttonIcons}>
                            <FontAwesomeIcon icon={faCar} size="lg" style={{ color: "black" }} />
                        </button>
                        <button className={styles.ButttonIcons}>
                            <FontAwesomeIcon icon={faMotorcycle} size="lg" style={{ color: "black" }} />
                        </button>
                        <button className={styles.ButttonIcons}>
                            <FontAwesomeIcon icon={faTrain} size="lg" style={{ color: "black" }} />
                        </button>
                        <button className={styles.ButttonIcons}>
                            <FontAwesomeIcon icon={faPersonWalking} size="lg" style={{ color: "black" }} />
                        </button>
                        <button className={styles.ButttonIcons}>
                            <FontAwesomeIcon icon={faPersonBiking} size="lg" style={{ color: "black" }} />
                        </button>
                    </div>

                    <hr className={styles.hr} style={{ width: "98%" }}></hr>

                    {/* Desde aqui en adelante realizar la funcion correspondiente con la tabla de busquedas */}

                    <div style={{ marginTop: "15px" }}>
                        <h4 className={styles.TituloDestin}>
                            DESTINOS RECIENTES
                        </h4>

                        {busquedasRecientes.map((busquedas, index) => (
                            <div key={index} className={styles.ContenInfo}>
                                <div className={styles.IconsClock}>
                                    <FontAwesomeIcon icon={faClockRotateLeft} style={{ color: "gray" }} size="lg" />
                                </div>
                                <div>
                                    <p style={{ margin: "0", fontWeight: "bold", color: "black" }}> {busquedas.id_marcador?.nombre_recinto} </p>
                                    <p style={{ margin: "0", color: "gray", fontSize: "12px" }}> {busquedas.id_marcador?.direccion} </p>
                                </div>
                            </div>

                        ))}

                        <hr className={styles.hr} style={{ width: "90%" }}></hr>
                    </div>

                </div>

            )}
        </div>
    )
}

