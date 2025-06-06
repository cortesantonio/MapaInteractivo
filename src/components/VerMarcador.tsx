import { useEffect, useState, useRef } from 'react';
import { Marcador } from '../interfaces/Marcador';
import { Review } from '../interfaces/Review';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // para español
import styles from './css/VerMarcador.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faRoute, faCommentDots, faStar, faLocationDot, faPhone, faEarthAmericas, faChevronUp, faChevronDown, faInfo, faCheck, faCopy, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import EscribirResena from '../components/EscribirResena';
import Compartir from './Compartir';
import { supabase } from '../services/supabase';
import { Horarios } from '../interfaces/Horarios';
import { Accesibilidad } from '../interfaces/Accesibilidad';
import ImagenConFallback from './ImagenConFallback';
import { useTheme } from "../components/Footer/Modo_Nocturno";
import Marca_Verificador from "../../public/img/verificado.png";
import { ClipLoader } from 'react-spinners';

interface Props {
    MarcadorSelectId: number;
    CerrarMarcador: () => void;
    establecerIdRutaMarcador: (id: number) => void;
}

export default function VerMarcador({ MarcadorSelectId, CerrarMarcador, establecerIdRutaMarcador }: Props) {
    const [cargando, setCargando] = useState<boolean>(true);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "100%" : "400px");
    const [height,] = useState("100vh");
    const [Marcador, setMarcador] = useState<Partial<Marcador>>({});
    const [horariosMarcador, setHorariosMarcador] = useState<Horarios[]>([]);
    const [accesibilidadMarcador, setAccesibilidadMarcador] = useState<Accesibilidad[]>([]);
    const [resenasMarcador, setResenasMarcador] = useState<Review[]>([]);
    const [tabActiva, setTabActiva] = useState<'general' | 'resenas'>('general');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [MostrarCompartir, setMostrarCompartir] = useState(false);
    const { modoNocturno } = useTheme();

    const [calificacion, setCalificacion] = useState<number>(0.0);
    const [estaAbierto, setEstaAbierto] = useState<boolean>(false);
    const [copiado, setCopiado] = useState(false);


    const [mostrarTodos, setMostrarTodos] = useState(false);
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const diasAMostrar = mostrarTodos ? diasSemana : diasSemana.slice(0, 3);
    // Función para volver a la vista del marcador
    const volverAMarcador = () => {
        setMostrarCompartir(false);
        setMostrarFormulario(false);
    };

    const verificarEstadoActual = () => {
        const ahora = new Date();
        const diaActual = ahora.toLocaleDateString('es-ES', { weekday: 'long' });
        const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        const horarioHoy = horariosMarcador.find(h =>
            h.dia.toLowerCase() === diaActual.toLowerCase()
        );

        if (horarioHoy) {
            const horaApertura = horarioHoy.apertura.slice(0, 5);
            const horaCierre = horarioHoy.cierre.slice(0, 5);
            setEstaAbierto(horaActual >= horaApertura && horaActual <= horaCierre);
        } else {
            setEstaAbierto(false);
        }
    };

    const copiarDireccion = async () => {
        if (Marcador?.direccion) {
            try {
                await navigator.clipboard.writeText(Marcador.direccion);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
            } catch (err) {
                console.error('Error al copiar la dirección:', err);
            }
        }
    };

    useEffect(() => {
        const fetchMarcador = async () => {
            const { data, error } = await supabase
                .from("marcador")
                .select("id, *, tipo_recinto(tipo),  horarios(*), accesibilidad_marcador(id_accesibilidad(*)), resenas(*, fecha, id_usuario(nombre)) ")
                .eq("id", MarcadorSelectId);

            if (error) {
                console.error("Error al obtener los marcadores:", error);
            } else if (data && data.length > 0) {

                const marcador = data[0];

                if (marcador) {
                    const marcadorFormateado: Partial<Marcador> = {
                        id: marcador.id,
                        nombre_recinto: marcador.nombre_recinto,
                        tipo_recinto: marcador.tipo_recinto.tipo,
                        latitud: marcador.latitud,
                        longitud: marcador.longitud,
                        direccion: marcador.direccion,
                        url_img: marcador.url_img,
                        pagina_web: marcador.pagina_web,
                        telefono: marcador.telefono,
                        activo: marcador.activo,
                        accesibilidad_certificada: marcador.accesibilidad_certificada,
                        info_adicional: marcador.info_adicional

                    };

                    setMarcador(marcadorFormateado);
                }

                setHorariosMarcador(marcador.horarios);


                if (marcador.accesibilidad_marcador && marcador.accesibilidad_marcador.length > 0) {
                    const accesibilidades = marcador.accesibilidad_marcador.map((item: any) => item.id_accesibilidad);
                    setAccesibilidadMarcador(accesibilidades);
                }

                if (marcador.resenas && marcador.resenas.length > 0) {
                    const resenasFormateadas: Review[] = marcador.resenas.map((resena: any) => ({
                        idresena: resena.id,
                        idusuario: resena.id_usuario.id,
                        nombreusuario: resena.id_usuario.nombre,
                        fecha: resena.fecha,
                        calificacion: resena.calificacion,
                        comentario: resena.comentario
                    }));

                    setResenasMarcador(resenasFormateadas);
                }
                let totalCalificaciones = marcador.resenas.length;
                let sumaCalificaciones = marcador.resenas.reduce((acumulador: number, resena: Review) => {
                    return acumulador + resena.calificacion;
                }, 0);
                let calificacionPromedio = totalCalificaciones > 0 ? sumaCalificaciones / totalCalificaciones : 0;
                setCalificacion(calificacionPromedio);
            }
            setCargando(false);
        };

        if (MarcadorSelectId) {
            fetchMarcador();
        }
    }, [MarcadorSelectId]);

    useEffect(() => {
        if (horariosMarcador.length > 0) {
            verificarEstadoActual();
            // Actualizar cada minuto
            const intervalo = setInterval(verificarEstadoActual, 60000);
            return () => clearInterval(intervalo);
        }
    }, [horariosMarcador]);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "100%" : "400px");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const accesibilidadAgrupada = accesibilidadMarcador.reduce((acc: Record<string, string[]>, item) => {
        if (!acc[item.tipo]) {
            acc[item.tipo] = [];
        }
        acc[item.tipo].push(item.nombre);
        return acc;
    }, {});


    function ListReviews() {
        const [mostrarTodas, setMostrarTodas] = useState(false);
        const reseñasAMostrar = mostrarTodas ? resenasMarcador : resenasMarcador.slice(0, 2);

        return (
            <div className={styles.resenasContainer}>
                {resenasMarcador.length === 0 ? (
                    <div className={styles.sinResenas}>
                        <FontAwesomeIcon icon={faCommentDots} size="2x" />
                        <p>No hay reseñas aún</p>
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className={styles.btnEscribirResena}
                        >
                            Escribir primera reseña
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={`${styles.resumenResenas} ${modoNocturno ? styles.resumenResenasOscuro : ''}`}>
                            <div className={styles.puntuacionPromedio}>
                                <FontAwesomeIcon icon={faStar} className={styles.estrellaGrande} />
                                <span className={styles.numeroPuntuacion}>{calificacion.toFixed(1)}</span>
                            </div>
                            <p className={styles.totalResenas}>
                                {resenasMarcador.length} {resenasMarcador.length === 1 ? 'reseña' : 'reseñas'}
                            </p>
                        </div>

                        <div className={styles.listaResenas}>
                            {reseñasAMostrar.map((resena) => (
                                <article key={resena.idresena} className={`${styles.resenaCard} ${modoNocturno ? styles.resenaCardOscuro : ''}`}>
                                    <div className={styles.resenaHeader}>
                                        <div className={styles.infoUsuario}>
                                            <h3 className={styles.nombreUsuario}>{resena.nombreusuario}</h3>
                                            <div className={styles.metaInfo}>
                                                <div className={styles.puntuacion}>
                                                    <FontAwesomeIcon icon={faStar} className={styles.estrella} />
                                                    <span>{resena.calificacion}</span>
                                                </div>
                                                <time dateTime={resena.fecha} className={styles.fecha}>
                                                    {formatDistanceToNow(new Date(resena.fecha), { addSuffix: true, locale: es })}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={styles.comentario}>{resena.comentario}</p>
                                </article>
                            ))}
                        </div>

                        {resenasMarcador.length > 2 && (
                            <button
                                onClick={() => setMostrarTodas(!mostrarTodas)}
                                className={styles.btnVerMas}
                                aria-expanded={mostrarTodas}
                            >
                                {mostrarTodas ? 'Ver menos reseñas' : 'Ver más reseñas'}
                            </button>
                        )}

                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className={styles.btnEscribirResena}
                        >
                            <FontAwesomeIcon icon={faCommentDots} />
                            Escribir Reseña
                        </button>
                    </>
                )}
            </div>
        );
    }

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Nuevo useEffect para manejar el scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            // Permitir scroll solo dentro del contenedor
            e.stopPropagation();
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.stopPropagation();
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <div className={styles.container} style={{ backgroundColor: modoNocturno ? "#2d2d2d" : "", width: width, height: height }}>
            <div className={styles.HeaderFijo}>
                <button onClick={CerrarMarcador} className={styles.CerrarMarcador}>X</button>
                {cargando ? (
                    <div className={styles.cargando}>
                        <ClipLoader color="#74C0FC" loading={cargando} size={50} />
                        <p>Cargando...</p>
                    </div>
                ) : (
                    <>
                        <ImagenConFallback
                            src={Marcador?.url_img}
                            alt="Imagen del recinto"
                            className={styles.imagenMarcador}
                        />
                        <div style={{ backgroundColor: modoNocturno ? "#2d2d2d" : "" }} className={styles.headerContenido}>
                            <div className={styles.info}>
                                <div className={styles.nombreVerificado}>
                                    <h2 style={{ color: modoNocturno ? "#fff" : "" }}>
                                        {cargando ? 'Cargando...' : Marcador?.nombre_recinto}
                                    </h2>
                                    {Marcador?.accesibilidad_certificada && (
                                        <div
                                            className={styles.tooltipContainer}
                                            title="Marcador verificado por municipalidad."
                                        >
                                            <img
                                                src={Marca_Verificador}
                                                alt="Verificado"
                                                className={styles.imgVerific}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.estadoActual}>
                                    <span className={`${styles.estado} ${estaAbierto ? styles.abierto : styles.cerrado}`}>
                                        {estaAbierto ? 'Abierto' : 'Cerrado'}
                                    </span>
                                </div>
                                <div className={`${styles.tipoRecintoContainer} ${modoNocturno ? styles.tipoRecintoContainerOscuro : ''}`}>
                                    <h4>{cargando ? 'Cargando...' : Marcador?.tipo_recinto}</h4>
                                </div>
                                <div className={`${styles.promedioResenasContainer} ${modoNocturno ? styles.promedioResenasContainerOscuro : ''}`}>
                                    {calificacion > 0 ? (
                                        <p>
                                            <FontAwesomeIcon icon={faStar} className={styles.estrella} />
                                            {calificacion.toFixed(1)} de la comunidad
                                        </p>
                                    ) : (
                                        <p className={styles.sinResenas}>Sin reseñas aún</p>
                                    )}
                                </div>
                            </div>
                            <div className={styles.containerButtons}>
                                {MostrarCompartir ? (
                                    // Botones cuando estás en modo Compartir
                                    <>
                                        <button onClick={volverAMarcador}>
                                            <FontAwesomeIcon icon={faInfo} style={{ width: "13px" }} className={styles.icon} />
                                            <p style={{ color: modoNocturno ? "#fff" : "" }}>Información</p>

                                        </button>
                                        <button onClick={() => {
                                            establecerIdRutaMarcador(Marcador.id as number);
                                            CerrarMarcador();
                                        }}>
                                            <FontAwesomeIcon icon={faRoute} className={styles.icon} />
                                            <p style={{ color: modoNocturno ? "#fff" : "" }}>Cómo llegar</p>
                                        </button>
                                        <button onClick={() => {
                                            setMostrarCompartir(false);
                                            setMostrarFormulario(true);
                                        }}>
                                            <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
                                            <p style={{ color: modoNocturno ? "#fff" : "" }}>Escribir Reseña</p>
                                        </button>
                                    </>
                                ) : (
                                    // Botones normales cuando NO estás en modo Compartir
                                    <>
                                        <button onClick={() => setMostrarCompartir(true)}>
                                            <FontAwesomeIcon icon={faShareNodes} className={styles.icon} />
                                            <p style={{ color: modoNocturno ? "#fff" : "" }} >Compartir</p>
                                        </button>
                                        <button onClick={() => {
                                            establecerIdRutaMarcador(Marcador.id as number);
                                            CerrarMarcador();
                                        }}>
                                            <FontAwesomeIcon icon={faRoute} className={styles.icon} />
                                            <p style={{ color: modoNocturno ? "#fff" : "" }}>Cómo llegar</p>
                                        </button>
                                        {!mostrarFormulario && (
                                            <button onClick={() => setMostrarFormulario(true)}>
                                                <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
                                                <p style={{ color: modoNocturno ? "#fff" : "" }}>Escribir Reseña</p>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>


            <div className={styles.ContenedorInfo}>
                {MostrarCompartir ? (
                    <Compartir idMarcador={MarcadorSelectId} />
                ) : mostrarFormulario ? (
                    <EscribirResena
                        onSubmit={(resena) => {
                            console.log('Reseña enviada:', resena);
                            setMostrarFormulario(false);
                        }}
                        onCancel={() => setMostrarFormulario(false)}
                        idMarcador={MarcadorSelectId}
                    />
                ) : (
                    <>
                        <nav className={`${styles.headerInfo} ${modoNocturno ? styles.headerInfoOscuro : ''}`} role="tablist" aria-label="Secciones de información">
                            <button
                                role="tab"
                                aria-selected={tabActiva === 'general'}
                                aria-controls="panel-general"
                                id="tab-general"
                                className={`${styles.tab} ${tabActiva === 'general' ? styles.tabActiva : ''} ${modoNocturno ? styles.tabNocturno : ''}`}
                                onClick={() => setTabActiva('general')}
                            >
                                <FontAwesomeIcon icon={faInfo} className={styles.tabIcon} />
                                General
                            </button>
                            <button
                                role="tab"
                                aria-selected={tabActiva === 'resenas'}
                                aria-controls="panel-resenas"
                                id="tab-resenas"
                                className={`${styles.tab} ${tabActiva === 'resenas' ? styles.tabActiva : ''}`}
                                onClick={() => setTabActiva('resenas')}
                            >
                                <FontAwesomeIcon icon={faCommentDots} className={styles.tabIcon} />
                                Reseñas
                            </button>
                        </nav>
                        <div
                            id="panel-general"
                            role="tabpanel"
                            aria-labelledby="tab-general"
                            hidden={tabActiva !== 'general'}
                            className={styles.tabPanel}
                        >
                            <>
                                <div className={`${styles.infoBasica} ${modoNocturno ? styles.infoBasicaOscuro : ''}`}>
                                    <div className={styles.direccionContainer}>
                                        <p style={{ color: modoNocturno ? "#fff" : "" }}>
                                            <FontAwesomeIcon icon={faLocationDot} style={{ color: "#74C0FC" }} /> {Marcador.direccion || 'Sin dirección'}
                                        </p>
                                        <button
                                            onClick={copiarDireccion}
                                            className={styles.btnCopiar}
                                            title="Copiar dirección"
                                        >
                                            <FontAwesomeIcon
                                                icon={copiado ? faCheckCircle : faCopy}
                                                className={copiado ? styles.iconoCopiado : ''}
                                            />
                                        </button>
                                    </div>
                                    <p style={{ color: modoNocturno ? "#fff" : "" }}>
                                        <FontAwesomeIcon icon={faPhone} style={{ color: "#74C0FC" }} /> {Marcador.telefono ? <a href={`tel:${Marcador.telefono}`} style={{ color: modoNocturno ? "#fff" : "" }}>{Marcador.telefono}</a> : 'Sin teléfono'}
                                    </p>
                                    <p style={{ color: modoNocturno ? "#fff" : "" }}>
                                        <FontAwesomeIcon icon={faEarthAmericas} style={{ color: "#74C0FC" }} />
                                        {Marcador.pagina_web ?
                                            <a href={Marcador.pagina_web} target="_blank" >
                                                {Marcador.pagina_web}
                                            </a>
                                            :
                                            <span>Sin página web</span>
                                        }
                                    </p>
                                </div>

                                <div className={`${styles.horariosSection} ${modoNocturno ? styles.horariosSectionOscuro : ''}`}>
                                    <h4 style={{ color: modoNocturno ? "#fff" : "" }}>Horarios</h4>
                                    <ul className={styles.horariosLista}>
                                        {diasAMostrar.map((dia, index) => {
                                            const horario = horariosMarcador.find((h: any) => h.dia.toLowerCase() === dia.toLowerCase());
                                            const esUltimoVisible = !mostrarTodos && index === 2;
                                            return (
                                                <li
                                                    key={index}
                                                    className={`${styles.horarioItem} ${esUltimoVisible ? styles.tercerdia : ''}`}
                                                    style={{ color: modoNocturno ? "#fff" : "" }}
                                                >
                                                    <span className={styles.dia}>{dia}</span>
                                                    <span className={styles.horario}>
                                                        {horario ? `${horario.apertura.slice(0, 5)} - ${horario.cierre.slice(0, 5)}` : 'Cerrado'}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <button onClick={() => setMostrarTodos(!mostrarTodos)} className={styles.fechaVerMas}>
                                        {mostrarTodos ? (
                                            <>
                                                <FontAwesomeIcon icon={faChevronUp} /> Ver menos días
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faChevronDown} /> Ver más días
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className={`${styles.accesibilidadSection} ${modoNocturno ? styles.accesibilidadSectionOscuro : ''}`}>
                                    <h4 style={{ color: modoNocturno ? "#fff" : "" }}>Accesibilidad</h4>
                                    {Object.keys(accesibilidadAgrupada).map((tipo, index) => (
                                        <div key={index} className={styles.accesibilidadTipo}>
                                            <h5 style={{ color: modoNocturno ? "#fff" : "" }}>{tipo}</h5>
                                            <div className={styles.accesibilidadLista}>
                                                {accesibilidadAgrupada[tipo].map((nombre, i) => (
                                                    <span key={i} className={styles.accesibilidadItem} style={{ color: modoNocturno ? "#fff" : "" }}>
                                                        <FontAwesomeIcon icon={faCheck} size="xs" />
                                                        {nombre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className={styles.infoAdicional}>
                                        <h4 style={{ color: modoNocturno ? "#fff" : "" }}>Información Adicional</h4>
                                        <p style={{ color: modoNocturno ? "#fff" : "#575757", marginTop: "10px" }}>{Marcador.info_adicional || '- No aporta información adicional.'}</p>
                                    </div>
                                </div>
                            </>
                        </div>
                        <div
                            id="panel-resenas"
                            role="tabpanel"
                            aria-labelledby="tab-resenas"
                            hidden={tabActiva !== 'resenas'}
                            className={styles.tabPanel}
                        >
                            <ListReviews />
                        </div>
                    </>
                )}
            </div>


        </div>
    )

}