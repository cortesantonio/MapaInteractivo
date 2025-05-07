import { useEffect, useState, CSSProperties } from "react";
import Map from "../components/Map";
import Footer from "../components/Footer/Footer";
import Buscador from "../components/Buscador";
import BotonEventos from "../components/botoneventos";
import VerMarcador from "../components/VerMarcador";
import NavbarUser from "../components/NavbarUser";


export default function Home() {
  const [marcadorSeleccionadoId, setMarcadorSeleccionadoId] = useState<number | null>(null);
  const [mostrarMarcador, setMostrarMarcador] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStreetViewActive, setIsStreetViewActive] = useState(false);

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
    position: "absolute",
    zIndex: 1,
    bottom: isMobile ? "0px" : "60px",
    left: isMobile ? "0px" : "25px",
    width: isMobile ? "100%" : "auto",
    height: isMobile ? "85%" : "auto",
    transition: "bottom 0.3s ease-in-out",
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>

      <Map
        onSeleccionMarcador={(id: number) => {
          setMarcadorSeleccionadoId(id);
          setMostrarMarcador(true);
        }}
        onStreetViewChange={(isActive) => setIsStreetViewActive(isActive)}
      />

      {!isStreetViewActive && (
        <>
          <div style={{
            position: 'absolute', top: 0, right: 0, zIndex: 1, width: '100%', display: 'flex', justifyContent: 'space-between', padding: 25, pointerEvents: 'none', flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 10, pointerEvents: 'auto' }}>
              <Buscador onSeleccionMarcador={(id: number) => {
                setMarcadorSeleccionadoId(id);
                setMostrarMarcador(true);
              }} />
              <BotonEventos />
            </div>

            <NavbarUser />
          </div>

          <Footer onSeleccionMarcador={(id: number) => {
            setMarcadorSeleccionadoId(id);
            setMostrarMarcador(true);
          }} />


          {mostrarMarcador && marcadorSeleccionadoId !== null && (
            <div style={estilosMarcador}>
              <VerMarcador
                MarcadorSelectId={marcadorSeleccionadoId}
                CerrarMarcador={() => setMostrarMarcador(false)}
              />
            </div>
          )}




        </>
      )
      }
    </div >
  );
}
