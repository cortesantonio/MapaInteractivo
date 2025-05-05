import { useAuth } from "../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from './css/NavbarUser.module.css'
import { useState } from "react";

export default function NavbarUser() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)


    if (!user) return null
    return (
        <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', flexDirection: 'column', gap: '10px' }}>
            <div className={styles.containerUser} >
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}
                    onClick={() => { setModalOpen(!modalOpen) }}
                >
                    <img
                        src={user?.user_metadata?.picture || '../src/assets/react.svg'}
                        alt="Foto de perfil"
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                </div>
            </div>

            {modalOpen == true && (
                <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: 10, pointerEvents: 'auto', width: '200px' }}>
                    <div >
                        <p style={{ fontWeight: 400, cursor: 'pointer', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{user?.user_metadata.full_name} </p>
                        <p style={{ fontSize: '0.9rem', color: 'gray', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{user?.email} </p>

                    </div>
                    <div className={styles.opt}>
                        <button className={styles.btnNavegacion} onClick={() => { navigate(`/usuario/perfil/${user.id}`) }} style={{ display: 'block' }}>Ver perfil</button>
                        <button className={styles.btnNavegacion} onClick={() => { navigate(`/usuario/perfil/editar/${user.id}`) }} style={{ display: 'block' }}>Editar perfil</button>
                    </div>

                    <button className={styles.btnCerrarSesion} onClick={signOut}>
                        Cerrar Sesion  <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>
                </div>

            )
            }
        </div >

    )

}