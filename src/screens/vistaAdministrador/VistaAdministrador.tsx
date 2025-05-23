import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import GraficoTorta from "../../components/grafico/graficotorta";
import NavbarAdmin from "../../components/NavbarAdmin";
import { useAuth } from "../../hooks/useAuth";

function VistaAdministrador() {
    const navigate = useNavigate();
    const { signOut } = useAuth()
    const [datosGrafico, setdatosGrafico] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('solicitudes')
                .select('estado');

            if (error) {
                console.error('Error al obtener datos:', error);
            } else {
                setdatosGrafico(data);
            }
        };

        fetchData();
    }, []);
    const pendientes = datosGrafico.filter(item => item.estado === "pendiente").length;

    return (

        <>
            <NavbarAdmin />
            <div
                style={{
                    marginTop: "5px",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    alignItems: "center",
                    padding: "2px",
                }}
            >
                <div style={{
                    padding: "10px",
                    width: "80%",
                    height: "23vh",
                }}>

                    < GraficoTorta datosGrafico={datosGrafico} />

                </div>

                {/* Sección de Gestión */}
                <div style={{ position: 'relative', margin: '15px', width: "80vw", maxWidth: "380px", display: "flex", marginTop: "30px" }}>
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(0, 0, 0, 0.42)', width: "73%" }} />
                    <h3
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '-13px',
                            background: 'transparent',
                            fontSize: '18px',
                            color: 'black',
                        }}
                    >
                        Gestiones
                    </h3>
                </div>

                <div style={{ marginBottom: "20px", width: "80vw", maxWidth: "380px", alignItems: "center", justifyContent: "center" }}>

                    <div style={{ margin: "2px", marginTop: "5px" }}>
                        <button style={{
                            color: "black",
                            background: "transparent",
                            outline: "none",
                            display: "flex",
                            border: "none",
                            fontSize: "17px",
                            padding: "5px"
                        }} onClick={() => { navigate('/panel-administrativo/marcadores') }}
                        >Gestión de marcadores
                        </button>

                        <button
                            style={{
                                color: "black",
                                background: "transparent",
                                outline: "none",
                                display: "flex",
                                border: "none",
                                fontSize: "17px",
                                marginTop: "5px",
                                padding: "4px"
                            }} onClick={() => { navigate('/panel-administrativo/usuarios') }}
                        >Gestión de usuarios
                        </button>

                        <button
                            style={{
                                color: "black",
                                background: "transparent",
                                outline: "none",
                                display: "flex",
                                border: "none",
                                fontSize: "17px",
                                marginTop: "5px",
                                padding: "4px"
                            }} onClick={() => { navigate('/panel-administrativo/resenas') }}
                        >
                            Gestión de reseñas
                        </button>

                        <button
                            style={{
                                color: "black",
                                background: "transparent",
                                outline: "none",
                                display: "flex",
                                marginTop: "5px",
                                border: "none",
                                fontSize: "17px",
                                padding: "4px"
                            }} onClick={() => { navigate('/panel-administrativo/accesibilidades') }}
                        >Gestión de accesibilidades
                        </button>

                        <button
                            style={{
                                color: "black",
                                background: "transparent",
                                outline: "none",
                                display: "flex",
                                marginTop: "5px",
                                border: "none",
                                fontSize: "17px",
                                padding: "4px"
                            }} onClick={() => { navigate('/panel-administrativo/tipo-recinto') }}
                        >Gestión de recintos
                        </button>


                    </div>
                </div>

                {/* Sección de Solicitudes */}
                <div style={{ position: 'relative', margin: '15px', width: "80vw", maxWidth: "380px", display: "flex" }}>
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(0, 0, 0, 0.42)', width: "73%" }} />
                    <h3
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '-13px',
                            background: 'transparent',
                            fontSize: '17px',
                            color: 'black',
                        }}
                    >
                        Solicitudes
                    </h3>
                </div>

                <div style={{ marginBottom: "20px", width: "80vw", maxWidth: "380px", alignItems: "center", justifyContent: "center" }}>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>

                        <button style={{
                            color: "black",
                            background: "transparent",
                            outline: "none",
                            display: "flex",
                            marginTop: "5px",
                            border: "none",
                            fontSize: "17px",
                            padding: "4px"
                        }} onClick={() => { navigate('/panel-administrativo/solicitudes/pendiente') }}  >({pendientes}) Nuevas solicitudes.</button>

                        <button
                            style={{
                                color: "black",
                                background: "transparent",
                                outline: "none",
                                display: "flex",
                                marginTop: "5px",
                                border: "none",
                                fontSize: "17px",
                                padding: "4px"
                            }} onClick={() => { navigate('/panel-administrativo/solicitudes/aprobada') }}
                        >Solicitudes aceptadas.
                        </button>

                        <button
                            style={{
                                color: "black",
                                background: "transparent",
                                outline: "none",
                                display: "flex",
                                marginTop: "5px",
                                border: "none",
                                fontSize: "17px",
                                padding: "4px"
                            }} onClick={() => { navigate('/panel-administrativo/solicitudes/rechazada') }}
                        >Solicitudes rechazadas.
                        </button>
                    </div>
                </div>
                <div >
                    {/* Botón de cerrar sesión */}
                    <button
                        style={{
                            width: "35vw",
                            maxWidth: "150px",
                            backgroundColor: "rgba(236, 21, 21, 0.7)",
                            color: "white",
                            margin: "10px",
                            marginLeft: "25vw",
                            padding: "10px",
                            borderRadius: "7px",
                            fontWeight: "500",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            signOut();
                            navigate('/');
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </>

    )
}

export default VistaAdministrador;