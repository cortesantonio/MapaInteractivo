import styles from './Ver.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Ver() {
    const [isActiveModal, setIsActiveModal] = useState(false)
    function handleModal() {
        setIsActiveModal(!isActiveModal)
    }


    return (
        <div className={styles.container}>

            <div className={styles.titulo} >
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2>
                    Solicitud
                </h2>
            </div>


            <div className={styles.infoContainer}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Informacion</h2>
                        <span style={{ color: 'orange', fontWeight: 500, fontSize: '0.8rem' }}>• PENDIENTE</span>
                    </div>

                    <hr style={{ opacity: '50%' }} />
                    <h4>ID Solicitud</h4>
                    <p>134525343454453</p>
                    <h4>Fecha</h4>
                    <p>04/04/2025</p>
                    <h4>Representante</h4>
                    <p>Alberto Fuente</p>
                    <h4>Nombre Locacion</h4>
                    <p>O'Higgins / Prat</p>
                    <h4>Direccion</h4>
                    <p>Arturo Prat 700, Curicó, Maule</p>
                    <h4>Descripcion</h4>
                    <p>
                        Nos gustaría agregar nuestro edificio,
                        que cuenta con rampa de acceso para mayor
                        accesibilidad.
                    </p>
                    <h4>Accesibilidad Arquitectónica</h4>
                    <ul>
                        <li>Rampas</li>
                    </ul>

                    <h4>Accesibilidad Sensorial </h4>
                    <ul>
                        <li>Rampas</li>
                    </ul>

                    <h4>Accesibilidad Cognitiva</h4>
                    <ul>
                        <li>Rampas</li>
                    </ul>

                    <h4>Accesibilidad CA</h4>
                    <ul>
                        <li>Rampas</li>
                    </ul>

                    <h4>Documentacion</h4>
                    <p style={{ color: 'gray' }}>Sin archivos adjuntos.</p>
                </div>

                <div className={styles.acciones}>
                    <button onClick={handleModal} style={{ color: 'red', background: 'transparent', }}>Rechazar Solicitud</button>
                    <button>Aceptar Solicitud</button>
                </div>

            </div>

            {isActiveModal &&
                <div className={styles.contenerdorModal}>
                    <div className={styles.modal}>
                        <h3>Motivo de rechazo</h3>
                        <form action="">
                            <textarea placeholder='Escribe aqui...'></textarea>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button className={styles.btnModal} onClick={handleModal} style={{ color: 'red', background: 'transparent' }} type='button'> CANCELAR</button>
                                <button className={styles.btnModal} type='submit'> RECHAZAR SOLICITUD</button>

                            </div>

                        </form>
                    </div>
                </div>

            }

        </div>
    );
}
