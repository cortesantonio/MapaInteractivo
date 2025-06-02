import styles from './css/AgregarMarcador.module.css'
import { useState, useEffect, useRef } from 'react';
import { Marcador } from '../../interfaces/Marcador';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import NavbarAdmin from '../../components/NavbarAdmin';
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { APIProvider, Map as VisMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useNavigate } from 'react-router-dom';


interface TipoDeAccesibilidades {
  [tipo: string]: Accesibilidad[];
}
const LIBRARIES: ("places")[] = ['places'];

export default function AgregarMarcador() {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;
  const { user } = useAuth();
  const [accesibilidades, setAccesibilidades] = useState<TipoDeAccesibilidades>({});
  const [dataMarcador, setDataMarcador] = useState<Partial<Marcador>>({
    nombre_recinto: '',
    tipo_recinto: '',
    direccion: '',
    pagina_web: '',
    telefono: '',
    url_img: '',
    latitud: undefined,
    longitud: undefined,
    activo: true,
    info_adicional: '',
  });
  const [selecciones, setSelecciones] = useState<number[]>([]);
  const [tipoRecinto, setTipoRecinto] = useState<Tipo_Recinto[]>(); // almacena los recintos del llamado a la api
  const [newMarcador, setnewMarcador] = useState<Marcadorconaccesibilidad>(); // almacena el nuevo marcador que se va a agregar a la base de datos

  useEffect(() => {
    const fetchTipoRecinto = async () => {
      const { data, error } = await supabase.from('tipo_recinto').select('*');
      if (error) console.error('Error al obtener tipo recinto:', error);
      else {
        setTipoRecinto(data);
      }
    };

    fetchTipoRecinto();
  }, []);


  useEffect(() => { // LLAMADO A LA API PARA OBTNER TODOAS LAS ACCESIBILIDADES QUE HAY EN LA BASE DE DATOS Y LA CLASIFICA POR TIPO
    const fetchAccesibilidades = async () => {
      const { data, error } = await supabase.from('accesibilidad').select('*');
      if (error) console.error('Error al obtener accesibilidades:', error);
      else {
        const agrupadas: TipoDeAccesibilidades = {};
        data.forEach((acc: Accesibilidad) => {
          if (!agrupadas[acc.tipo]) agrupadas[acc.tipo] = [];
          agrupadas[acc.tipo].push(acc);
        });
        setAccesibilidades(agrupadas);

      }
    };
    fetchAccesibilidades();
  }, []);

  const handleCheckboxChange = (id: number) => { //MANEJA LOS IDS DE LAS ACCESIBILIDADES SELECIONADAS
    setSelecciones(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  type Marcadorconaccesibilidad = Marcador & {
    accesibilidades: number[]
  }

  const handleAgregarMarcador = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const envio: Marcadorconaccesibilidad = {
      ...(dataMarcador as Marcador),
      accesibilidades: selecciones,
    };

    setnewMarcador(envio);

  };

  const fechaHoraActual = new Date().toISOString();

  const Registro_cambios = async (idMarcador: number) => {
    const { data: registro_logs, error: errorLog } = await supabase
      .from('registro_logs')
      .insert([
        {
          id_usuario: user?.id,
          tipo_accion: 'Agregación de Marcador',
          detalle: `Se agregó un nuevo Marcador con ID ${idMarcador}`,
          fecha_hora: fechaHoraActual,
        }
      ]);

    if (errorLog) {
      console.error('Error al registrar en los logs:', errorLog);
    } else {
      console.log('Registro insertado en registro_logs correctamente', registro_logs);
    }
  };


  useEffect(() => {
    const guardarMarcador = async () => {
      if (!newMarcador) return;

      if (!direccionValida) {
        alert('Por favor, selecciona una dirección desde las sugerencias de Google Places.');
        return;
      }

      try {

        // 4. Se inserta el "registro_logs"
        console.log('Entró a actualizarMarcador');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('Usuario obtenido:', user);

        if (userError || !user) {
          console.error('No se pudo obtener el usuario:', userError);
          return;
        }
        const { data: marcadorInsertado, error: errorMarcador } = await supabase
          .from('marcador')
          .insert({
            nombre_recinto: newMarcador.nombre_recinto,
            tipo_recinto: newMarcador.tipo_recinto,
            direccion: newMarcador.direccion,
            pagina_web: newMarcador.pagina_web,
            telefono: newMarcador.telefono,
            latitud: newMarcador.latitud,
            longitud: newMarcador.longitud,
            activo: newMarcador.activo,
            url_img: newMarcador.url_img,
            id_usuario: user?.id,
            info_adicional: newMarcador.info_adicional,

          })
          .select()
          .single<Marcador>();

        if (errorMarcador) {
          console.error('Error al guardar marcador:', errorMarcador);
          return;
        }

        const relaciones = newMarcador.accesibilidades.map((idAcc) => ({
          id_marcador: marcadorInsertado.id,
          id_accesibilidad: idAcc,
        }));

        const { error: errorRelaciones } = await supabase
          .from('accesibilidad_marcador')
          .insert(relaciones);

        if (errorRelaciones) {
          console.error('Error al guardar relaciones de accesibilidad:', errorRelaciones);
          return;
        }
        await Registro_cambios(marcadorInsertado.id);

        alert('Agregado correctamente: ' + marcadorInsertado.nombre_recinto);
        navigate(-1);
      } catch (error) {
        console.error('Error general al guardar el marcador:', error);
      }
    };

    guardarMarcador();
  }, [newMarcador]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });


  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [direccionValida, setDireccionValida] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (loadError) return <div>Error cargando Places</div>;
  if (!isLoaded) return <div>Cargando Autocomplete...</div>;

  return (

    <>
      <NavbarAdmin />

      <div className={styles.container}>
        <div className={styles.titulo} style={{ marginTop: '25px' }} >
          <h2 style={{ textAlign: 'center' }}>
            Agregar marcador
          </h2>
        </div>

        <div style={{ margin: 'auto', padding: '30px' }}>
          <form className={styles.formulario} onSubmit={handleAgregarMarcador}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>

              <label className={styles.labelSeccion} >Nombre locación
                <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }} >  - ¿Como se llama el negocio?</span>
              </label>
              <input
                type="text"
                value={dataMarcador.nombre_recinto}
                onChange={(e) => setDataMarcador({ ...dataMarcador, nombre_recinto: e.target.value })}
                className={styles.inputText} required />


              <label style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }} className={styles.labelSeccion} htmlFor="">Dirección
                <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }} > - ¿Dónde está ubicado el negocio? (Dirección completa)</span>
              </label>

              <Autocomplete
                onLoad={ac => setAutocomplete(ac)}
                onPlaceChanged={() => {
                  if (!autocomplete) return;
                  const place = autocomplete.getPlace();
                  if (place.geometry?.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();

                    setPosition({ lat, lng });
                    setDireccionValida(true);

                    setDataMarcador(prev => ({
                      ...prev,
                      latitud: lat,
                      longitud: lng,
                      direccion: place.formatted_address || '',
                    }));
                  }
                }}
                options={{
                  types: ['address'],
                  fields: ['geometry', 'formatted_address'],
                  componentRestrictions: { country: 'cl' }
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe una dirección…"
                  className={styles.inputText}
                  onChange={() => {
                    setDireccionValida(false);
                    setPosition(null);
                  }}
                  required
                />
              </Autocomplete>

              <APIProvider apiKey={apiKey}>
                {position && (
                  <div style={{ paddingTop: "10px", border: "1px solid rgba(0, 0, 0, 0.2)", borderRadius: '5px', padding: '10px', marginTop: '10px' }}>
                    <VisMap
                      mapId="bf51a910020fa25a"
                      center={position}
                      defaultZoom={16}
                      disableDefaultUI={true}
                      zoomControl={true}
                      gestureHandling="greedy"
                      keyboardShortcuts={false}
                      style={{ width: '100%', height: '200px' }}
                    >
                      <AdvancedMarker position={position} />
                    </VisMap>
                  </div>
                )}
              </APIProvider>

              <label style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }} className={styles.labelSeccion} htmlFor="">Pagina web
                <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }} > - El URL perteneciente al local que se ingresará.</span>
              </label>

              <input
                type="text"
                value={dataMarcador.pagina_web}
                onChange={(e) => setDataMarcador({ ...dataMarcador, pagina_web: e.target.value })}
                className={styles.inputText} />

              <label className={styles.labelSeccion} htmlFor="">Teléfono
                <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }} > - Número de contacto del negocio.</span>
              </label>
              <div className={styles.ContainerinputTelefono}>
                <p className={styles.codTelfono}>+569</p>
                <input
                  type="number" value={dataMarcador.telefono}
                  onChange={(e) => setDataMarcador({ ...dataMarcador, telefono: e.target.value })} />
              </div>

              <label className={styles.labelSeccion} htmlFor="">Imagen de su local en URL
                <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }} >*Opcional - Un enlace a una imagen del negocio.</span>
              </label>
              <input
                type="text"
                value={dataMarcador.url_img}
                onChange={(e) => setDataMarcador({ ...dataMarcador, url_img: e.target.value })}
                className={styles.inputText} />

              <label className={styles.labelSeccion}>Tipo de recinto
                <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }} > - Selecciona a un tipo de recinto que pertenecera el local.</span>
              </label>
              <select name="tipo_recinto" value={dataMarcador.tipo_recinto} onChange={(e) => setDataMarcador({ ...dataMarcador, tipo_recinto: e.target.value })} className={styles.inputText} required>
                <option value="" >Selecciona un tipo de recinto</option>
                {tipoRecinto?.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                ))}
              </select>

            </div>

            {Object.entries(accesibilidades).map(([tipo, lista]) => (
              <div key={tipo} style={{ marginBottom: '20px' }}>
                <p>{`Accesibilidad ${tipo}`}</p>
                {lista.map(acc => (
                  <div className={styles.opt} key={acc.id}>
                    <input
                      type="checkbox"
                      className={styles.checkboxColor}
                      value={acc.id}
                      checked={selecciones.includes(acc.id)}
                      onChange={() => handleCheckboxChange(acc.id)}
                      id={acc.nombre}
                    />
                    <label htmlFor={acc.nombre} >{acc.nombre}</label>
                  </div>
                ))}
              </div>
            ))}

            <label className={styles.labelSeccion} htmlFor="">Información Adicional
              <span style={{ fontSize: '0.8rem', color: 'gray', fontStyle: 'italic' }} >*Opcional </span>
            </label>
          
            <textarea
              placeholder="Cuentanos como es tu recinto en pocas palabras..."
              value={dataMarcador.info_adicional}
              onChange={(e) => setDataMarcador({ ...dataMarcador, info_adicional: e.target.value })}
              className={styles.inputText}
              rows={4}
              style={{ resize: 'none', height: '100px' }}
              maxLength={250}
            />

            <div style={{textAlign:"right",color:"rgb(102, 102, 102)"}}>
              {dataMarcador.info_adicional?.length || 0}/250
            </div>


            <div className={styles.acciones}>
              <button type="submit" >Agregar Marcador</button>
            </div>
          </form>

        </div>
      </div>


    </>

  )

}




