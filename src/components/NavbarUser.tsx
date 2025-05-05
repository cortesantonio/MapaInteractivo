import { useAuth } from "../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function NavbarUser() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    if (!user) return null

    console.log(user)

    return (
        <div style={{
            position: 'absolute', top: 25, right: 25, background: 'red', height: 'fit-content',
            padding: 5, zIndex: 5, backgroundColor: 'white', borderRadius: '10px',
            boxShadow: '1px 1px 2px black'
        }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }} >
                <img
                    src={user?.user_metadata?.picture || '../src/assets/react.svg'}
                    alt="Foto de perfil"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />

                <div>
                    <p onClick={() => { navigate(`/usuario/perfil/${user.id}`) }} style={{ textDecoration: 'underline', fontWeight: 400, cursor: 'pointer' }}>{user?.user_metadata.full_name} </p>
                    <p style={{ fontSize: '0.8rem', color: 'gray' }}>{user?.email} </p>
                </div>

                <button
                    style={{
                        backgroundColor: "rgb(253, 29, 29)",
                        background: "linear-gradient(90deg, rgba(253, 29, 29, 1) 0%, rgba(255, 106, 60, 1) 100%)",
                        border: 'none',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onClick={signOut}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
            </div>
        </div>
    )

}