import styles from './css/Compartir.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from './Footer/Modo_Nocturno';
import { useState } from 'react';

interface Props {
    idMarcador: number;
}

function Compartir({ idMarcador }: Props) {
    const { modoNocturno } = useTheme();
    const [copiado, setCopiado] = useState(false);
    const baseUrl = 'https://mapainteractivo.site';
    const sharedUrl = `${baseUrl}/?shared=${idMarcador}`;
    const texto = '¡Mira este lugar que encontré en Ruta Facil: Curicó!';

    const compartirEnRedSocial = (redSocial: string) => {
        let url = '';

        switch (redSocial) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharedUrl)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(`${texto} ${sharedUrl}`)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(sharedUrl)}`;
                break;
        }

        window.open(url, '_blank', 'width=600,height=400');
    };
    const mensajeCopiar = texto + sharedUrl;
    const copiarEnlace = async () => {
        try {
            await navigator.clipboard.writeText(mensajeCopiar);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch (err) {
            console.error('Error al copiar el enlace:', err);
        }
    };

    return (
        <div>
            <div className={styles.contenedor_principal_iconos}>
                <h3 style={{ color: modoNocturno ? "#fff" : "" }} >Compartir información</h3>
                <div className={styles.contenedor_de_iconos}>
                    <div className={styles.seccion_icono} onClick={() => compartirEnRedSocial('facebook')}>
                        <FontAwesomeIcon icon={faFacebook} style={{ color: "#1877f2", cursor: "pointer" }} className={styles.icono} />
                        <p style={{ color: modoNocturno ? "#fff" : "" }} className={styles.texto} >Facebook</p>
                    </div>
                    <div className={styles.seccion_icono} onClick={() => compartirEnRedSocial('whatsapp')}>
                        <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#25d366", cursor: "pointer" }} className={styles.icono} />
                        <p style={{ color: modoNocturno ? "#fff" : "" }} className={styles.texto} >WhatsApp</p>
                    </div>
                    <div className={styles.seccion_icono} onClick={() => compartirEnRedSocial('twitter')}>
                        <FontAwesomeIcon icon={faXTwitter} style={{ color: "#000000", cursor: "pointer" }} className={styles.icono} />
                        <p style={{ color: modoNocturno ? "#fff" : "" }} className={styles.texto} >Twitter</p>
                    </div>
                    <div className={styles.seccion_icono} onClick={copiarEnlace}>
                        <FontAwesomeIcon icon={faCopy} style={{ color: "#666666", cursor: "pointer" }} className={styles.icono} />
                        <p style={{ color: modoNocturno ? "#fff" : "" }} className={styles.texto} >
                            {copiado ? '¡Copiado!' : 'Copiar enlace'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Compartir;