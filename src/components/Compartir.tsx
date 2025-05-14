import styles from './css/Compartir.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFacebook, 
    faWhatsapp, 
    faXTwitter,
    faInstagram
} from "@fortawesome/free-brands-svg-icons";
import { useTheme } from './Footer/Modo_Nocturno';


function Compartir () {
    const {modoNocturno} = useTheme ();

    return (
        <div>
            <div className= {styles.contenedor_principal_iconos}>
                <h3 style={{color: modoNocturno ? "#fff" : ""}} >Compartir Informacion</h3>
                <div className= {styles.contenedor_de_iconos}>
                   <div className= {styles.seccion_icono}>
                         <FontAwesomeIcon icon={faFacebook} style={{color:"#1877f2",cursor:"pointer"}} className= {styles.icono} /><p style={{color: modoNocturno ? "#fff" : ""}} className= {styles.texto} >Facebook</p>
                   </div>
                    <div className= {styles.seccion_icono}>
                        <FontAwesomeIcon icon={faWhatsapp} style={{color:"#25d366",cursor:"pointer"}} className= {styles.icono} /><p style={{color: modoNocturno ? "#fff" : ""}} className= {styles.texto} >WhatsApp</p>
                    </div>
                    <div className= {styles.seccion_icono}>
                        <FontAwesomeIcon icon={faInstagram} style={{color:"#E4405F",cursor:"pointer"}} className= {styles.icono} /><p style={{color: modoNocturno ? "#fff" : ""}} className= {styles.texto} >Instagram</p>
                    </div>
                    <div className= {styles.seccion_icono}>
                        <FontAwesomeIcon icon={faXTwitter} style={{color: "#000000",cursor:"pointer"}} className= {styles.icono} /><p style={{color: modoNocturno ? "#fff" : ""}} className= {styles.texto} >Twitter</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Compartir;