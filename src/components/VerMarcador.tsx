import { useEffect, useState } from 'react';
import { Marcador } from '../interfaces/Marcador';
import { Review } from '../interfaces/Review';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // para español
import styles from './css/VerMarcador.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes, faRoute, faCommentDots, faStar, faLocationDot, faPhone, faEarthAmericas, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import EscribirResena from '../components/EscribirResena';
import { supabase } from '../services/supabase';
import { Horarios } from '../interfaces/Horarios';
import { Accesibilidad } from '../interfaces/Accesibilidad';

interface Props {
    MarcadorSelectId: number;
    CerrarMarcador:  () => void;
  }

export default function VerMarcador({ MarcadorSelectId, CerrarMarcador }: Props) {
    const [cargando, setCargando] = useState<boolean>(true);
    const [width, setWidth] = useState(window.innerWidth <= 768 ? "100%" : "350px");
    const [height, setHeight] = useState(window.innerWidth <= 768 ? "100%" : "fit-content");
    const [Marcador, setMarcador] = useState<Partial<Marcador>>({});
    const [horariosMarcador, setHorariosMarcador] = useState<Horarios[]>([]);
    const [accesibilidadMarcador, setAccesibilidadMarcador] = useState<Accesibilidad[]>([]);
    const [resenasMarcador, setResenasMarcador] = useState<Review[]>([]);
    const [tabActiva, setTabActiva] = useState<'general' | 'resenas'>('general');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);


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
                  direccion: marcador.direccion,
                  pagina_web: marcador.pagina_web,
                  telefono: marcador.telefono,
                  activo: marcador.activo
                };
              
                setMarcador(marcadorFormateado);
              }
            
            if (marcador.horarios && marcador.horarios.length > 0) {
                setHorariosMarcador(marcador.horarios);
            }

            if (marcador.accesibilidad_marcador && marcador.accesibilidad_marcador.length > 0) {
                const accesibilidades = marcador.accesibilidad_marcador.map((item: any) => item.id_accesibilidad);
                setAccesibilidadMarcador(accesibilidades);
            }

            if (marcador.resenas && marcador.resenas.length > 0) {
                const resenasFormateadas: Review[] = marcador.resenas.map((resena: any) => ({
                    idresena: resena.id, 
                    idusuario: resena.id_usuario.id , 
                    nombreusuario: resena.id_usuario.nombre,
                    fecha: resena.fecha,
                    calificacion: resena.calificacion,
                    comentario: resena.comentario
                }));
                
                setResenasMarcador(resenasFormateadas);
            }
          }
          setCargando(false);
        };
      
        if (MarcadorSelectId) {
          fetchMarcador();
        }
      }, [MarcadorSelectId]);
      

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth <= 768 ? "100%" : "350px");
            setHeight(window.innerWidth <= 768 ? "100%" : "fit-content");
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },);

    const accesibilidadAgrupada = accesibilidadMarcador.reduce((acc: Record<string, string[]>, item) => {
        if (!acc[item.tipo]) {
          acc[item.tipo] = [];
        }
        acc[item.tipo].push(item.nombre);
        return acc;
      }, {});


      function InfoMarcador() {

        const [mostrarTodos, setMostrarTodos] = useState(false);

        const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        const diasAMostrar = mostrarTodos ? diasSemana : diasSemana.slice(0, 3);
        return (
            <div className={styles.InfoMarcador}>
                {cargando ? (  
                    <div className={styles.cargando}>Cargando...</div> 
                ) : (  
                    Marcador && (
                        <>
                            <p><FontAwesomeIcon icon={faLocationDot} style={{ color: "#74C0FC" }} /> {Marcador.direccion}</p>
                            <p><FontAwesomeIcon icon={faPhone} style={{ color: "#74C0FC" }} /> {Marcador.telefono}</p>
                            <p><FontAwesomeIcon icon={faEarthAmericas} style={{ color: "#74C0FC" }} /> {Marcador.pagina_web}</p>
    
                            <h4>Horarios</h4>
                            <ul style={{ paddingLeft: '20px' }}>
                            {diasAMostrar.map((dia, index) => {
                                const horario = horariosMarcador.find((h: any) => h.dia.toLowerCase() === dia.toLowerCase());
                                const esUltimoVisible = !mostrarTodos && index === 2; 
                                return (
                                <li
                                    key={index}
                                    className={esUltimoVisible ? styles.tercerdia : ''}
                                >
                                    {dia}: {horario ? `${horario.apertura.slice(0,5)} - ${horario.cierre.slice(0,5)}` : 'Cerrado'}
                                </li>
                                );
                            })}
                            </ul>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
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

                            <h4>Accesibilidad</h4>
                            {Object.keys(accesibilidadAgrupada).map((tipo, index) => (
                                <div key={index}>
                                    <p style={{ fontWeight: 400 }}>{tipo}:</p>
                                    {accesibilidadAgrupada[tipo].length > 0 ? (
                                        <ul style={{ paddingLeft: '20px' }}>
                                            {accesibilidadAgrupada[tipo].map((nombre, i) => (
                                                <li key={i}>{nombre}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <ul>
                                            <li>No mencionado</li>
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </>
                    )
                )}
            </div>
        );
    }
    

    


    function ListReviews() {
        const [mostrarTodas, setMostrarTodas] = useState(false);

        const reseñasAMostrar = mostrarTodas ? resenasMarcador : resenasMarcador.slice(0, 2);

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

                {resenasMarcador.length > 2 && (
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
                <button onClick={CerrarMarcador} className={styles.CerrarMarcador}>X</button>
                <img src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9eZeqiYZh_N6HddUd7JMb6o7pqX4RRnEi7nILjYXDI7kkYSnjc_vaeigx7oH_ya-PravH6AY-cDaK_Whg_xln3BIzCQQYzWkoH6xltRO771yV22JQs9BVH0mIQMcRyRveNe0Sd=w426-h240-k-no"
                    alt=""
                    className={styles.imagenMarcador}
                />
                <div className={styles.headerContenido}>
                    <div className={styles.info}>
                        <h2>{cargando ? 'Cargando...' : Marcador?.nombre_recinto}</h2>
                        <h4>{cargando ? 'Cargando...' : '> ' + Marcador?.tipo_recinto}</h4>
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
                            console.log('Reseña enviada:', resena,);
                            setMostrarFormulario(false);
                        }}
                        onCancel={() => setMostrarFormulario(false)}
                        idMarcador={MarcadorSelectId} 
                    />
                )}
            </div>


        </div>
    )

}