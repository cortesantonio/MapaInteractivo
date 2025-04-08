import { useEffect, useState } from 'react';
import { Marcador } from '../../interfaces/Marcador';
import { Review } from '../../interfaces/Review';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // para español
import styles from './VerMarcador.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faRoute, faCommentDots, faStar, faLocationDot, faPhone, faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import EscribirResena from '../../components/EscribirResena';

export default function VerMarcador() {
    const [cargando, setCargando] = useState<boolean>(true);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "100%" : "350px");
    const [height, setHeight] = useState(window.innerWidth <= 768 ? "100%" : "fit-content");
    const [Marcador, setMarcador] = useState<Marcador | null>(null);
    const [tabActiva, setTabActiva] = useState<'general' | 'resenas'>('general');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        // Acá podrías hacer un fetch real
        const data: Marcador = {
            nombre: "Teatro Provincial De Curicó",
            tipo: "Anfiteatro",
            calificacion_comunidad: 4.3,
            calificacion_google: 4.7,
            direccion: "Carmen 556-560, 3341768 Curicó, Maule",
            pag_web: "teatroprovincialcurico.cl",
            telefono: "+56752591531",
            horarios: {
                lunes: "8:30 – 16:30",
                martes: "Cerrado",
                miércoles: "8:30 – 16:30"
            },
            accesibilidad: {
                arquitectonica: [
                    "Rampas de acceso",
                    "Estacionamientos reservados"
                ],
                sensorial: [
                    "Brailer",
                ],
                cognitiva: []
            }
        };

        setMarcador(data);
    }, []);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "100%" : "350px");
            setHeight(window.innerWidth <= 768 ? "100%" : "fit-content");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },);


    function InfoMarcador() {

        return (
            <div className={styles.InfoMarcador}>
                {Marcador && (
                    <>
                        <p><FontAwesomeIcon icon={faLocationDot} style={{ color: "#74C0FC", }} /> {Marcador.direccion}</p>
                        <p><FontAwesomeIcon icon={faPhone} style={{ color: "#74C0FC", }} /> {Marcador.telefono}</p>
                        <p><FontAwesomeIcon icon={faEarthAmericas} style={{ color: "#74C0FC", }} /> {Marcador.pag_web}</p>

                        <h4>Horarios</h4>
                        <ul>
                            <li>
                                Lunes: {Marcador.horarios.lunes}
                            </li>
                            <li>
                                Martes: {Marcador.horarios.martes}
                            </li>
                            <li>
                                Miércoles: {Marcador.horarios.miércoles}
                            </li>
                        </ul>

                        <h4>Accesibilidad</h4>

                        <p style={{ fontWeight: 400 }}>Arquitectónica</p>
                        {Marcador.accesibilidad.arquitectonica.length > 0 ? (
                            Marcador.accesibilidad.arquitectonica.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                        ) : (
                            <li>No mencionado</li>
                        )}

                        <p style={{ fontWeight: 400 }}>Sensorial:</p>
                        {Marcador.accesibilidad.sensorial.length > 0 ? (
                            Marcador.accesibilidad.sensorial.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                        ) : (
                            <li>No mencionado</li>
                        )}
                        <p style={{ fontWeight: 400 }}>Cognitiva:</p>
                        {Marcador.accesibilidad.cognitiva.length > 0 ? (
                            Marcador.accesibilidad.cognitiva.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                        ) : (
                            <li>No mencionado</li>
                        )}




                    </>
                )}
            </div>)
    }


    function ListReviews() {
        const [Review, setReview] = useState<Review[]>([]);
        const [mostrarTodas, setMostrarTodas] = useState(false);

        useEffect(() => {
            const data: Review[] = [
                {
                    idresena: '1',
                    idmarcador: '123',
                    idusuario: 'u1',
                    fecha: '2025-04-06T10:30:00Z',
                    nombreusuario: 'Juan Pérez',
                    calificacion: 5,
                    comentario: 'Espectacular función y ambiente.'
                },
                {
                    idresena: '2',
                    idmarcador: '123',
                    idusuario: 'u2',
                    fecha: '2025-03-15T12:00:00Z',
                    nombreusuario: 'Ana Gómez',
                    calificacion: 4,
                    comentario: 'Muy buena experiencia, volvería sin dudas.'
                },
                {
                    idresena: '3',
                    idmarcador: '123',
                    idusuario: 'u3',
                    fecha: '2024-11-15T10:30:00Z',
                    nombreusuario: 'Pedro Rodríguez',
                    calificacion: 3,
                    comentario: 'Todo bien, pero hacía mucho calor en la sala.'
                }
            ];

            // Ordenar por fecha descendente (más reciente primero)
            const ordenadas = data.sort(
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );

            setReview(ordenadas);
        }, []);
        const reseñasAMostrar = mostrarTodas ? Review : Review.slice(0, 2);

        return (
            <div style={{ textAlign: 'center' }}>
                {reseñasAMostrar.map((resena) => (
                    <div key={resena.idresena} style={{ textAlign: 'left', borderBottom: '1px solid #ccc', margin: '10px 0px 10px 0px', padding: '10px' }}>
                        <p style={{ fontWeight: 400 }}>{resena.nombreusuario}</p>
                        <div style={{ display: 'flex', gap: 3 }}>
                            <p> <FontAwesomeIcon icon={faStar} size="2xs" style={{ color: "#FFD43B", }} /> {resena.calificacion} </p>

                            <p style={{ opacity: 0.5 }}> • <em>{formatDistanceToNow(new Date(resena.fecha), { addSuffix: true, locale: es })}</em></p>

                        </div>

                        <p style={{ textAlign: 'justify', fontSize: '0.9rem', marginTop: '10px' }}>{resena.comentario}</p>
                    </div>
                ))}

                {Review.length > 2 && (
                    <button className={styles.btnVerMas} onClick={() => setMostrarTodas(!mostrarTodas)}>
                        {mostrarTodas ? 'Ver menos' : 'Ver más'}
                    </button>
                )}
            </div>
        );
    }




    return (
        <div className={styles.container} style={{ width: width, height: height }}>
            <div className={styles.HeaderFijo}>
                <button className={styles.CerrarMarcador}>X</button>
                <img src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9eZeqiYZh_N6HddUd7JMb6o7pqX4RRnEi7nILjYXDI7kkYSnjc_vaeigx7oH_ya-PravH6AY-cDaK_Whg_xln3BIzCQQYzWkoH6xltRO771yV22JQs9BVH0mIQMcRyRveNe0Sd=w426-h240-k-no"
                    alt=""
                    className={styles.imagenMarcador}
                />
                <div className={styles.headerContenido}>
                    <div className={styles.info}>
                        <h2>{Marcador?.nombre}</h2>
                        <h4>{'> ' + Marcador?.tipo}</h4>
                        <p style={{ marginTop: '10px' }}> <FontAwesomeIcon icon={faStar} size="2xs" style={{ color: "#FFD43B", }} /> • 4.4 de la comunidad.</p>
                        <p>
                            <span style={{ opacity: 0.5, fontSize: '0.9rem' }}>
                                <FontAwesomeIcon icon={faStar} size="2xs" style={{ color: "#FFD43B", }} /> • 4.6 en Google Maps.
                            </span>
                        </p>
                    </div>
                    <div className={styles.containerButtons}>
                        <button >
                            <FontAwesomeIcon icon={faShareNodes} className={styles.icon} /> <p>Compartir</p>
                        </button>
                        <button >
                            <FontAwesomeIcon icon={faRoute} className={styles.icon} />
                            <p>Como llegar</p>
                        </button>
                        {!mostrarFormulario &&
                            <button onClick={() => setMostrarFormulario(true)}>
                                <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
                                <p>Escribir Reseña</p>
                            </button>
                        }

                    </div>
                </div>

            </div>


            <div className={styles.ContenedorInfo}>

                {!mostrarFormulario && (
                    <>
                        <div className={styles.headerInfo}>
                            <button
                                className={tabActiva === 'general' ? styles.tabActiva : ''}
                                onClick={() => setTabActiva('general')}
                            >
                                General
                            </button>
                            <button
                                className={tabActiva === 'resenas' ? styles.tabActiva : ''}
                                onClick={() => setTabActiva('resenas')}
                            >
                                Reseñas
                            </button>
                        </div>
                        <div className={styles.scrollSeccion}>
                            {tabActiva === 'general' ? <InfoMarcador /> : <ListReviews />}
                        </div>
                    </>
                )}
                {mostrarFormulario && (
                    <EscribirResena
                        onSubmit={(resena) => {
                            console.log('Reseña enviada:', resena);
                            setMostrarFormulario(false);
                        }}
                        onCancel={() => setMostrarFormulario(false)}
                    />
                )}
            </div>


        </div>
    )

}