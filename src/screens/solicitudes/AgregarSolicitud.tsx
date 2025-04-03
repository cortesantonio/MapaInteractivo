import styles from './AgregarSolicitud.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons';

export default function AgregarSolicitud() {
    return (

        <div className={styles.container}>
            <div className={styles.titulo} >
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2 style={{ textAlign: 'center' }}>
                    Colaborar
                </h2>
            </div>

            <div style={{ margin: 'auto' }}>
                <form action="">
                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>

                        <label className={styles.labelSeccion} htmlFor="">Nombre Locacion</label>
                        <input type="text" className={styles.inputText} />
                        <label className={styles.labelSeccion} htmlFor="">Descripcion</label>
                        <input type="text" className={styles.inputText} />
                        <label className={styles.labelSeccion} htmlFor="">Direccion</label>
                        <input type="text" className={styles.inputText} />
                    </div>

                    <p>Accesibilidad Arquitectónica</p>

                    <div className={styles.opt}>
                        <input type="checkbox" value='rampa' id="" />
                        <label htmlFor=""> Rampa</label><br />
                    </div>

                    <div className={styles.opt}>
                        <input type="checkbox" value='Ascensores' id="" />
                        <label htmlFor="">Ascensores</label><br />
                    </div>

                    <div className={styles.opt}>
                        <input type="checkbox" value='Estacionamientos' id="" />
                        <label htmlFor="">Estacionamientos para persona con discapacidad (Ley del tránsito)</label><br />
                    </div>

                    <p>Accesibilidad Física</p>

                    <div className={styles.opt}>
                        <input type="checkbox" value='braille' id="" />
                        <label htmlFor="">Señalización en braille</label> <br />
                    </div>

                    <div className={styles.opt}>
                        <input type="checkbox" value='auditiva' id="" />
                        <label htmlFor="">Señalización auditiva</label><br />
                    </div>

                    <div className={styles.opt}>
                        <input type="checkbox" value='Luces' id="" />
                        <label htmlFor="">Luces intermitentes</label><br />
                    </div>

                    <div className={styles.opt}>
                        <input type="checkbox" value='Mapas' id="" />
                        <label htmlFor="">Mapas táctiles</label><br />
                    </div>

                    <p>Accesibilidad Cognitiva</p>

                    <div className={styles.opt}>
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">Símbolos universales</label><br />
                    </div>

                    <div className={styles.opt}>
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">Rutas intuitivas</label><br />
                    </div>

                    <div className={styles.opt}>
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">Atención con personal capacitado</label><br />
                    </div>

                    <p>Accesibilidad CA</p>

                    <div className={styles.opt}>
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">Sala de calma</label><br />
                    </div>

                    <div className={styles.opt} style={{ marginBottom: '15px' }}>
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">Fono aislante de ruido</label><br />
                    </div>


                    <label className={styles.labelSeccion} htmlFor="">Documentacion (opcional)</label><br />
                    <input type='file' />

                    <div className={styles.acciones}>
                        <button style={{ color: 'red', background: 'transparent', }}>Cancelar</button>
                        <button>Enviar Solicitud</button>
                    </div>
                </form>
            </div>
        </div>


    )

}