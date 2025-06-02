import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faClock, faArrowUpRightFromSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from "./css/Ver.module.css";
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Marcador } from '../../interfaces/Marcador';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ImagenConFallback from '../../components/ImagenConFallback';
import { Horarios } from '../../interfaces/Horarios';
import { useAuth } from '../../hooks/useAuth';


function VerHorarioMarcador() {
  const { id } = useParams();
  const { user } = useAuth();
  const [marcador, setMarcador] = useState<Marcador | null>(null);
  const [horarios, setHorarios] = useState<Horarios[]>([]);
  const [nuevoHorario, setNuevoHorario] = useState({ dia: '', apertura: '', cierre: '' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [diasSemana, setDiasSemana] = useState([
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ]);

  const Registro_cambios = async (tipo_accion: string, detalle: string) => {
    const fechaHoraActual = new Date().toISOString(); // <-- mover aquí

    const { data: registro_logs, error: errorLog } = await supabase
      .from('registro_logs')
      .insert([
        {
          id_usuario: user?.id,
          tipo_accion,
          detalle,
          fecha_hora: fechaHoraActual,
        }
      ]);

    if (errorLog) {
      console.error('Error al registrar en los logs:', errorLog);
      return;
    }

    console.log('Registro insertado en registro_logs correctamente', registro_logs);
  };




  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!id) return;

      const { data: marcadorData } = await supabase
        .from('marcador')
        .select('*, tipo_recinto(*)')
        .eq('id', id)
        .single();

      const { data: horariosData } = await supabase
        .from('horarios')
        .select('*')
        .eq('id_marcador', id);

      setMarcador(marcadorData);
      setHorarios(horariosData || []);
      if (horariosData) {
        const diasRegistrados = horariosData.map(h => h.dia);
        setDiasSemana(prevDias => prevDias.filter(dia => !diasRegistrados.includes(dia)));
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const abrirModalAgregar = () => {
    setNuevoHorario({ dia: '', apertura: '', cierre: '' });
    setModoEdicion(false);
    setShowModal(true);
  };

  const abrirModalEditar = (dia: string) => {
    const horario = horarios.find(h => h.dia === dia);
    if (!horario) return;

    setNuevoHorario({
      dia: horario.dia,
      apertura: horario.apertura,
      cierre: horario.cierre,
    });
    setModoEdicion(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setNuevoHorario({ dia: '', apertura: '', cierre: '' });
    setModoEdicion(false);
  };



  const guardarHorario = async () => {
    if (!id) return;

    if (modoEdicion) {
      const horarioExistente = horarios.find((h) => h.dia === nuevoHorario.dia);
      if (!horarioExistente) return;
      if (nuevoHorario.dia === '' || nuevoHorario.apertura === '' || nuevoHorario.cierre === '') {
        alert("Por favor, completa todos los campos antes de guardar.");
        return;
      }
      const aperturaAnterior = horarioExistente.apertura;
      const cierreAnterior = horarioExistente.cierre;

      const { error } = await supabase
        .from('horarios')
        .update({
          apertura: nuevoHorario.apertura,
          cierre: nuevoHorario.cierre,
        })
        .eq('id', horarioExistente.id);

      if (!error) {
        const actualizados = horarios.map(h =>
          h.id === horarioExistente.id ? { ...h, ...nuevoHorario } : h
        );
        setHorarios(actualizados);
        Registro_cambios('Modificación de un horario', `Se editó el horario del día ${horarioExistente.dia}. Apertura: ${aperturaAnterior} → ${nuevoHorario.apertura}, Cierre: ${cierreAnterior} → ${nuevoHorario.cierre} en el marcador con ID ${id}`);
      }
    } else {
      const existe = horarios.some(h => h.dia === nuevoHorario.dia);
      if (existe) {
        alert("Ese día ya tiene un horario. Haz clic en él para editarlo.");
        return;
      }
      if (nuevoHorario.dia === '' || nuevoHorario.apertura === '' || nuevoHorario.cierre === '') {
        alert("Por favor, completa todos los campos antes de guardar.");
        return;
      }

      const { data, error } = await supabase
        .from('horarios')
        .insert([{
          id_marcador: id,
          dia: nuevoHorario.dia,
          apertura: nuevoHorario.apertura,
          cierre: nuevoHorario.cierre
        }]).select('*');

      if (!error && data) {
        setHorarios([...horarios, ...data]);
        await Registro_cambios('Creación de un horario', `Se agregó el horario del día ${nuevoHorario.dia}. Apertura: ${nuevoHorario.apertura}, Cierre: ${nuevoHorario.cierre} en el marcador con ID ${id}`);
        window.location.reload();

      }
      if (error) {
        console.error("Error al guardar el horario:", error);
        alert("Hubo un error al guardar el horario");
      }
    }

    cerrarModal();
  };

  // Eliminación de un dia de la semana en el horario que tiene el maracdor
  const eliminarHorario = async (idHorario: number, dia: string) => {
    const confirmacion = window.confirm(`¿Estás seguro que deseas eliminar el horario del día ${dia}?`);

    if (!confirmacion) return;

    const { error } = await supabase
      .from('horarios')
      .delete()
      .eq('id', idHorario);

    if (error) {
      console.error("Error al eliminar el horario:", error);
      alert("Hubo un error al eliminar el horario");
      return;
    }

    setHorarios(horarios.filter(h => h.id !== idHorario));
    setDiasSemana(prevDias => [...prevDias, dia]);

    await Registro_cambios('Eliminación de un horario', `Se eliminó el horario del día ${dia} en el marcador con ID ${id}`);
  };





  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.imagen}>
          <ImagenConFallback
            src={marcador?.url_img}
            alt="Imagen del recinto"
            className={styles.imagenMarcador}
          />
        </div>
        <button className={styles.botonatras} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faReply} />
        </button>
        <div className={styles.Titulo} >
          <h2>Horario del marcador</h2>
        </div>
        <div className={styles.locacionTitulo}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <h4 onClick={() => navigate(`/panel-administrativo/marcadores/informacion/${marcador?.id}`)}>
              {marcador?.nombre_recinto || "Cargando..."} <FontAwesomeIcon size="2xs" icon={faArrowUpRightFromSquare} />
            </h4>
          </div>
          <p>{'>'} {(marcador?.tipo_recinto as any)?.tipo || "Cargando tipo..."}</p>
          <h2>{marcador?.direccion || "Cargando..."}</h2>
        </div>

      </div>
      {/* Listado de horarios */}
      <div className={styles.inspeccionar_reseñas}>
        <div className={styles.contenido_reseña}>

          <div className={styles.titulo_reseña}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>Horarios <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic', marginLeft: '5px' }}>
                - No agregues el día si el local no abre.
              </span></h4>
              <button onClick={abrirModalAgregar} className={styles.agregarHorario}><FontAwesomeIcon icon={faClock} />+ Agregar horario</button>
            </div>

            <hr />
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <ul className={styles.listaHorarios}>
                {horarios
                  .slice()
                  .sort((a, b) => {
                    const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                    return ordenDias.indexOf(a.dia) - ordenDias.indexOf(b.dia);
                  })
                  .map((h) => (
                    <li key={h.id} className={styles.card} >
                      <div className={styles.horarioItem}>
                        <div className={styles.horarioHeader}>
                          <h3>{h.dia}</h3>
                          <div className={styles.trash_button}>
                            <button style={{ border: "none", color: "red", backgroundColor: "transparent", width: "100%", height: "100%" }} onClick={() => eliminarHorario(h.id, h.dia)}>
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>

                        <p>Apertura: {h.apertura}hrs.</p>
                        <p>Cierre: {h.cierre}hrs.</p>
                        <hr />
                        <button className={styles.buttonEditar} onClick={() => abrirModalEditar(h.dia)}>Editar</button>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{modoEdicion ? `Editar horario del día ${nuevoHorario.dia}` : 'Agregar horario'}</h2>
              <button className={styles.modalCloseButton} onClick={cerrarModal}><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            {!modoEdicion && (
              <div>
                <label>Día:</label>
                <select
                  className={styles.selectDia}
                  disabled={modoEdicion}
                  value={nuevoHorario.dia}
                  onChange={(e) => setNuevoHorario({ ...nuevoHorario, dia: e.target.value })}
                  required
                >
                  <option value="">Seleccione un día</option>
                  {diasSemana.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

            )}

            <div style={{ marginTop: '20px' }}>
              <label>Apertura:</label>
              <input
                type="time"
                value={nuevoHorario.apertura}
                onChange={(e) => setNuevoHorario({ ...nuevoHorario, apertura: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <label>Cierre:</label>
              <input
                type="time"
                value={nuevoHorario.cierre}
                onChange={(e) => setNuevoHorario({ ...nuevoHorario, cierre: e.target.value })}
              />
            </div>
            <div className={styles.botonesModal}>
              <button onClick={cerrarModal} className={styles.botonCancelar}>
                Cancelar
              </button>
              <button onClick={guardarHorario} className={styles.botonGuardar}>
                {modoEdicion ? 'Guardar cambios' : 'Agregar'}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerHorarioMarcador;