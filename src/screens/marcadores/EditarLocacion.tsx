import styles from './css/EditarLocacion.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function EditarLocation() {
    const navigate = useNavigate()
    return (
        <div className={styles.container}>

            <div className={styles.HeaderFijo}>
                <img src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9eZeqiYZh_N6HddUd7JMb6o7pqX4RRnEi7nILjYXDI7kkYSnjc_vaeigx7oH_ya-PravH6AY-cDaK_Whg_xln3BIzCQQYzWkoH6xltRO771yV22JQs9BVH0mIQMcRyRveNe0Sd=w426-h240-k-no"
                    alt=""
                    className={styles.imagenMarcador}
                />
                <button className={styles.VolverAtras} onClick={() => { navigate(-1) }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>

                <div className={styles.Titulo} >
                    <h2>Editar Locación</h2>
                </div>
                <div className={styles.locacionTitulo}><h4>Teatro Provincial De Curico</h4></div>
                <div className={styles.locacionSubtitulo}><h4>&gt; Anfiteatro</h4></div>



                <div className={styles.container}>
                    <div className={styles.FormContainer}>
                        <form action="">
                            <div className={styles.formGrid}>
                                {/*Primer Grupo*/}
                                <div className={styles.FormSection} style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', margin: "5px" }}>

                                    <label className={styles.labelSeccion} htmlFor="">Nombre Locacion</label>
                                    <input type="text" className={styles.inputText} />
                                    <label className={styles.labelSeccion} htmlFor="">Descripcion</label>
                                    <input type="text" className={styles.inputText} />
                                    <label className={styles.labelSeccion} htmlFor="">Direccion</label>
                                    <input type="text" className={styles.inputText} />
                                    <select className={styles.formselect}>
                                        <option selected>Seleccione el Tipo Recinto</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>

                                {/*Segundo Grupo*/}
                                <div className={styles.sectionContainer}>
                                    <p>Accesibilidad Arquitectónica</p>

                                    <div className={styles.opt}>
                                        <input type="checkbox" value='rampa' id="" />
                                        <label htmlFor=""> Rampa</label><br />
                                    </div>

                                    <div className={styles.opt}>
                                        <input type="checkbox" value='Ascensores' id="" />
                                        <label htmlFor=""> Ascensores</label><br />
                                    </div>

                                    <div className={styles.opt}>
                                        <input type="checkbox" value='Estacionamientos' id="" />
                                        <label htmlFor=""> Estacionamientos para persona con discapacidad (Ley del tránsito)</label><br />
                                    </div>
                                </div>

                                {/*Tercer Grupo*/}
                                <div className={styles.sectionContainer}>
                                    <p>Accesibilidad Física</p>

                                    <div className={styles.opt}>
                                        <input type="checkbox" value='braille' id="" />
                                        <label htmlFor=""> Señalización en braille</label> <br />
                                    </div>

                                    <div className={styles.opt}>
                                        <input type="checkbox" value='auditiva' id="" />
                                        <label htmlFor=""> Señalización auditiva</label><br />
                                    </div>

                                    <div className={styles.opt}>
                                        <input type="checkbox" value='Luces' id="" />
                                        <label htmlFor=""> Luces intermitentes</label><br />
                                    </div>

                                    <div className={styles.opt}>
                                        <input type="checkbox" value='Mapas' id="" />
                                        <label htmlFor=""> Mapas táctiles</label><br />
                                    </div>
                                </div>

                                {/*Cuarto Grupo*/}
                                <div className={styles.sectionContainer}>

                                    <p>Accesibilidad Cognitiva</p>

                                    <div className={styles.opt}>
                                        <input type="checkbox" name="" id="" />
                                        <label htmlFor=""> Símbolos universales</label><br />
                                    </div>

                                    <div className={styles.opt}>
                                        <input type="checkbox" name="" id="" />
                                        <label htmlFor=""> Rutas intuitivas</label><br />
                                    </div>

                                    <div className={styles.opt}>
                                        <input type="checkbox" name="" id="" />
                                        <label htmlFor=""> Atención con personal capacitado</label><br />
                                    </div>
                                </div>

                                {/*Quinto Grupo*/}
                                <div className={styles.sectionContainer}>
                                    <p>Accesibilidad CA</p>

                                    <div className={styles.opt}>
                                        <input type="checkbox" name="" id="" />
                                        <label htmlFor=""> Sala de calma</label><br />
                                    </div>

                                    <div className={styles.opt} style={{ marginBottom: '15px' }}>
                                        <input type="checkbox" name="" id="" />
                                        <label htmlFor=""> Fono aislante de ruido</label><br />
                                    </div>
                                </div>
                            </div>

                        </form>
                        <div className={styles.acciones}>
                            <button type="button" style={{ backgroundColor: "transparent", color: "red" }} onClick={() => { navigate(-1) }} >
                                CANCELAR CAMBIOS
                            </button>
                            <button type="submit">Guardar Cambios</button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}


export default EditarLocation;