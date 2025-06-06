import { useEffect, useState, CSSProperties, useCallback } from "react";
import { lazy, Suspense } from 'react';
const Map = lazy(() => import('../components/Map')); import Footer from "../components/Footer/Footer";
import Buscador from "../components/Buscador";
import BotonEventos from "../components/botoneventos";
const VerMarcador = lazy(() => import("../components/VerMarcador"));
import NavbarUser from "../components/NavbarUser";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../components/Footer/Modo_Nocturno";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalPerfilIncompleto from "../components/ModalPerfilIncompleto";
import { supabase } from "../services/supabase";
import { useSearchParams } from "react-router-dom";


export default function Home() {
  const [searchParams] = useSearchParams();
  const shared = searchParams.get('shared');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ignorarModal, setIgnorarModal] = useState(false);
  const [marcadorSeleccionadoId, setMarcadorSeleccionadoId] = useState<string | number | null>(null);
  const [mostrarMarcador, setMostrarMarcador] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStreetViewActive, setIsStreetViewActive] = useState(false);
  const [modoViaje, setModoViaje] = useState<'DRIVING' | 'BICYCLING' | 'WALKING' | 'TRANSIT'>('DRIVING');
  const [destino, setDestino] = useState<{ lat: number; lng: number } | null>(null);
  const [ubicacionActiva, setUbicacionActiva] = useState(false);
  const [Idrutamarcador, setIdrutamarcador] = useState<number | null>(null);
  const [onIndicaciones, setOnIndicaciones] = useState<string[]>([]);
  const { userEstado, signOut } = useAuth()
  const [yaVerificado, setYaVerificado] = useState(false);
  const [mapacentrado, setMapacentrado] = useState(false);
  const { modoNocturno } = useTheme();
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState<{ nombre: string; tipo: string }[]>([]);

  useEffect(() => {
    if (userEstado === false && !yaVerificado) {
      setYaVerificado(true);
      signOut();
      alert("Su cuenta está desactivada. Por favor, contacta a soporte.");
    }
  }, [userEstado]);


  // El modal aparece solo si hay campos del perfil sin completar, al completar todos los campos requeridos el modal desaparece por completo del Home.
  useEffect(() => {
    const verificarDatosObligatorios = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const email = sessionData?.user?.email;

      // Si no hay sesión activa, no mostrar el modal ni validar nada
      if (!email) {
        setMostrarModal(false);
        return;
      }

      // Si hay sesión, validar los datos del perfil
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", email)
        .single();

      if (!usuario) return;

      const { data: discapacidad } = await supabase
        .from("discapacidad")
        .select("*")
        .eq("id_usuario", usuario.id)
        .single();

      const datosCompletos =
        usuario.nombre?.trim() &&
        usuario.correo?.trim() &&
        usuario.rut?.trim() &&
        (!discapacidad || (
          discapacidad.nombre?.trim() &&
          discapacidad.tipo?.trim() &&
          discapacidad.id_accesibilidad
        ));

      if (!datosCompletos) {
        setMostrarModal(true);
      } else {
        setMostrarModal(false);
      }
    };

    verificarDatosObligatorios();
  }, []);


  const establecerDestino = useCallback((lat: number | null, lng: number | null) => {
    if (lat !== null && lng !== null) {
      setDestino({ lat, lng });
    } else {
      setDestino(null);
    }
  }, []);

  const handleUbicacionActiva = (activa: boolean) => {
    setUbicacionActiva(activa);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    handleResize();

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const estilosMarcador: CSSProperties = {
    zIndex: 10,
    width: isMobile ? "100%" : "fit-content",
    transition: "bottom 0.3s ease-in-out",
    pointerEvents: 'auto'
  };

  useEffect(() => {
    if (shared) {
      setMarcadorSeleccionadoId(shared);
      setMostrarMarcador(true);
    }
  }, [shared]);

  return (

    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Suspense fallback={<div>Cargando mapa...</div>}>

        <Map
          onSeleccionMarcador={(id: number) => {
            setMarcadorSeleccionadoId(id);
            setMostrarMarcador(true);
          }}
          onStreetViewChange={(isActive) => setIsStreetViewActive(isActive)}
          modoViaje={modoViaje}
          destinoRuta={destino}
          onUbicacionActiva={handleUbicacionActiva}
          onIndicaciones={setOnIndicaciones}
          mapacentrado={mapacentrado}
          setMapacentrado={setMapacentrado}
          onSeleccionFiltro={filtrosSeleccionados}

        />
      </Suspense >
      {!isStreetViewActive && (
        <>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '100%', height: 'fit-content',
            padding: '25px', display: 'flex', pointerEvents: 'none', flexDirection: 'row', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '10px', pointerEvents: 'none', width: '80%', zIndex: 20, position: 'relative' }}>
              <Buscador onSeleccionMarcador={(id: number) => {
                setMarcadorSeleccionadoId(id);
                setMostrarMarcador(true);
              }}

                onSeleccionFiltro={(filtros: { nombre: string; tipo: string }[]) => {
                  setFiltrosSeleccionados(filtros);

                }}
              />
              <BotonEventos />
            </div>

            <div style={{ width: '30%', display: 'flex', justifyContent: 'end', gap: '10px', height: '50px', zIndex: 10, flexWrap: 'wrap', position: 'relative' }} >
              <img
                style={{
                  width: "150px",
                  height: "auto",
                  maxWidth: "150px",
                  maxHeight: "60px",
                  objectFit: "contain",
                  aspectRatio: "auto 3 / 1",
                  display: "block",
                  zIndex: 10,
                  position: 'relative'
                }}
                src="../../img/logoConCurico.png"
                alt=""
              />
              <NavbarUser />
            </div>


          </div>

          {mostrarMarcador && marcadorSeleccionadoId !== null && (
            <div style={estilosMarcador}>
              <Suspense fallback={<div>Cargando marcador...</div>}>
                <VerMarcador
                  MarcadorSelectId={marcadorSeleccionadoId as number}
                  CerrarMarcador={() => setMostrarMarcador(false)}
                  establecerIdRutaMarcador={(id) => setIdrutamarcador(id)}
                />
              </Suspense>
            </div>
          )}
          <Footer onSeleccionMarcador={(id: number) => {
            setMarcadorSeleccionadoId(id);
            setMostrarMarcador(true);
          }}
            cambiarModoViaje={setModoViaje}
            establecerDestino={establecerDestino}
            ubicacionActiva={ubicacionActiva}
            Idrutamarcador={Idrutamarcador}
            limpiarRutaMarcador={() => setIdrutamarcador(null)}
            InformacionDestino={destino}
            onIndicaciones={onIndicaciones}
          />

          <div style={{
            position: "absolute",
            bottom: window.innerWidth < 768 ? "20%" : "15%",
            right: "10px",
          }}>
            <button
              onClick={() => {
                if (ubicacionActiva) {
                  setMapacentrado(!mapacentrado);
                }
              }}
              title={
                !ubicacionActiva
                  ? "Ubicación desactivada"
                  : mapacentrado
                    ? "Desactivar seguimiento"
                    : "Activar seguimiento"
              }
              disabled={!ubicacionActiva}
              style={{
                background: modoNocturno ? "#2d2d2d" : "",
                backgroundColor: !ubicacionActiva
                  ? modoNocturno ? "#666" : "#ccc" : mapacentrado ? "#4285F4" : modoNocturno ? "#2d2d2d" : "#fff",
                border: "none",
                borderRadius: "5px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                width: "40px",
                height: "40px",
                cursor: ubicacionActiva ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s",
              }}
            >
              <FontAwesomeIcon
                icon={faLocationCrosshairs}
                color={!ubicacionActiva ? "#888" : mapacentrado ? "#fff" : (modoNocturno ? "#ddd" : "#666")}
                style={{ width: "22px", height: "22px" }}
              />
            </button>
          </div>



        </>
      )
      }
      {mostrarModal && !ignorarModal && <ModalPerfilIncompleto onCerrar={() => setIgnorarModal(true)} />}

    </div >
  );
}
