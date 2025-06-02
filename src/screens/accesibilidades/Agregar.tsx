import styles from './css/Agregar.module.css'
import NavbarAdmin from '../../components/NavbarAdmin';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheelchairMove, faEyeLowVision, faHandsAslInterpreting, faEarDeaf } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AgregarAccesibilidad() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Accesibilidad>({
        id: 0,
        tipo: '',
        nombre: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'id' ? Number(value) : value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {

        if (formData.nombre == '' || formData.tipo == '') {
            alert('No hay datos ingresados')
            return;
        }

        e.preventDefault();
        // Paso 1: Buscar si ya existe
        const { data: existing, error: fetchError } = await supabase
            .from('accesibilidad')
            .select('*')
            .eq('nombre', formData.nombre)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error al verificar existencia:', fetchError);
            return;
        }

        if (existing) {
            alert('Este nombre de accesibilidad ya está registrado.');
            return;
        }


        const { data: nuevaAccesibilidad, error } = await supabase
            .from('accesibilidad')
            .insert([
                {
                    tipo: formData.tipo,
                    nombre: formData.nombre,
                },
            ])
            .select() // opcional: si quieres recibir el registro insertado
            .single<Accesibilidad>();

        if (error) {
            console.error('Error al insertar en Supabase:', error);
        } else {
            alert('Agregado correctamente: ' + nuevaAccesibilidad.nombre);
            await Registro_cambios(nuevaAccesibilidad.id);
            navigate(-1);
        }

    };

    const fechaHoraActual = new Date().toISOString();

    const Registro_cambios = async (idAcc: number) => {

        const { data: registro_logs, error: errorLog } = await supabase
            .from('registro_logs')
            .insert([
                {
                    id_usuario: user?.id,
                    tipo_accion: 'Agregación de Accesibilidad',
                    detalle: `Se agregó una nueva Accesibilidad con ID ${idAcc}`,
                    fecha_hora: fechaHoraActual,
                }
            ]);

        if (errorLog) {
            console.error('Error al registrar en los logs:', errorLog);
            return;
        }

        console.log(' Registro insertado en registro_logs correctamente', registro_logs);
    };


    return (
        <>
            <NavbarAdmin />

            <div className={styles.container}>
                <div className={styles.titulo} >
                    <h2 style={{ textAlign: 'center' }}>
                        Agregar accesibilidad
                    </h2>
                </div>

                <div style={{ margin: '20px auto', width: '40%', display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
                    <div className={styles.formularioCentro}>
                        <label className={styles.labelSeccion} >Tipo accesibilidad</label>
                        <select name="tipo" value={formData.tipo} onChange={handleChange}>
                            <option value="">Selecciona un tipo</option>
                            <option value="Arquitectónica">Arquitectónica</option>
                            <option value="Sensorial">Sensorial</option>
                            <option value="Cognitiva">Cognitiva </option>
                            <option value="CA">CA </option>
                        </select>
                        <label className={styles.labelSeccion}>Nombre</label>
                        <input
                            name="nombre"
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </div>

                    <div className={styles.acciones}>
                        <button onClick={() => { navigate(-1) }} style={{ color: 'red', background: 'transparent', }}>Cancelar</button>
                        <button onClick={handleSubmit} >Agregar</button>
                    </div>
                </div>
            </div>
            <div className={styles.SubContainer}>
                <div className={styles.tituloCategorias}>
                    <h3 style={{ textAlign: 'center' }}>
                        Categorías de apoyo para una mejor accesibilidad
                    </h3>
                </div>
                <div className={styles.ContenGrid}>
                    {/* Arquitectónica */}
                    <div className={styles.iconoBox}>
                        <h2>Arquitectónica</h2>
                        <div className={`${styles.iconCircle} ${styles.arquitectonica}`}>
                            <FontAwesomeIcon icon={faWheelchairMove} className={styles.icono} />
                        </div>
                        <div>
                            <p>
                                Incluye rampas, ascensores, pasamanos, baños accesibles y señalización
                                adecuada que facilita el desplazamiento físico de personas con movilidad reducida.
                            </p>
                        </div>
                    </div>

                    {/* Sensorial */}
                    <div className={styles.iconoBox}>
                        <h2>Sensorial</h2>
                        <div className={`${styles.iconCircle} ${styles.sensorial}`}>
                            <FontAwesomeIcon icon={faEyeLowVision} className={styles.icono} />
                        </div>
                        <div>
                            <p>
                                Considera ayudas visuales y auditivas como señalización táctil, braille,
                                contraste de colores, bucles magnéticos y alarmas visuales o sonoras.
                            </p>
                        </div>
                    </div>

                    {/* Cognitiva */}
                    <div className={styles.iconoBox}>
                        <h2>Cognitiva</h2>
                        <div className={`${styles.iconCircle} ${styles.cognitiva}`}>
                            <FontAwesomeIcon icon={faHandsAslInterpreting} className={styles.icono} />
                        </div>
                        <div>
                            <p>
                                Apoya la comprensión mediante lenguaje claro, pictogramas,
                                señalética intuitiva, y entornos que favorecen la orientación y el entendimiento.
                            </p>
                        </div>
                    </div>

                    {/* Comunicación y Audición */}
                    <div className={styles.iconoBox}>
                        <h2>Comunicación y Audición</h2>
                        <div className={`${styles.iconCircle} ${styles.ca}`}>
                            <FontAwesomeIcon icon={faEarDeaf} className={styles.icono} />
                        </div>
                        <div>
                            <p>
                                Se enfoca en sistemas de comunicación aumentativa, intérpretes de lengua de señas,
                                subtitulados en videos, y accesos adaptados para personas con discapacidad auditiva o con dificultades auditivas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


        </>


    )

}