

function VistaAdministrador() {


    return (
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
                marginTop: "40px",
                width: "380px",
                height: "200px",
                display: "flex",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.43)"
            }}>Espacio para el grafico

            </div>

            {/* Sección de Gestión */}
            <div style={{ position: 'relative', margin: '15px', width: "380px", display: "flex", marginTop: "30px" }}>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(0, 0, 0, 0.42)', width: "78%" }} />
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
                    Gestion
                </h3>
            </div>

            <div style={{ marginBottom: "20px", width: "380px", alignItems: "center", justifyContent: "center" }}>

                <div style={{ margin: "2px", marginTop: "5px" }}>
                    <button style={{
                        color: "black",
                        background: "transparent",
                        outline: "none",
                        display: "flex",
                        border: "none",
                        fontSize: "17px",
                        padding: "5px"
                    }}
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
                        }}
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
                        }}
                    >Gestión de reseñas
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
                        }}
                    >Gestión de accesibilidades
                    </button>
                </div>
            </div>

            {/* Sección de Solicitudes */}
            <div style={{ position: 'relative', margin: '15px', width: "380px", display: "flex" }}>
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

            <div style={{ marginBottom: "20px", width: "380px", alignItems: "center", justifyContent: "center" }}>

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
                    }}>* nuevas solicitudes.</button>

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
                        }}
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
                        }}
                    >Solicitudes rechazadas.
                    </button>
                </div>
            </div>
            <div >
                {/* Botón de cerrar sesión */}
                <button
                    style={{
                        width: "150px",
                        backgroundColor: "rgba(236, 21, 21, 0.7)",
                        color: "white",
                        margin: "10px",
                        marginLeft: "230px",
                        padding: "10px",
                        borderRadius: "7px",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    CERRAR SESIÓN
                </button>
            </div>
        </div>
    )
}

export default VistaAdministrador;