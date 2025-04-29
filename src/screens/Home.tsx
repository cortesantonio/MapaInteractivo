import { useEffect, useState, CSSProperties } from "react";
import Map from "../components/Map";
import Footer from "../components/Footer";
import Buscador from "../components/Buscador";
import BotonEventos from "../components/botoneventos";
import VerMarcador from "../components/VerMarcador";

export default function Home() {
  const [marcadorSeleccionadoId, setMarcadorSeleccionadoId] = useState<number | null>(null);
  const [mostrarMarcador, setMostrarMarcador] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    zIndex: 10,
    bottom: isMobile ? "0px" : "60px",
    left: isMobile ? "0px" : "25px",
    width: isMobile ? "100%" : "auto",
    height: isMobile ? "85%" : "auto",
    transition: "bottom 0.3s ease-in-out",
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>

      <Buscador onSeleccionMarcador={(id: number) => {
        setMarcadorSeleccionadoId(id);
        setMostrarMarcador(true);
      }} />
      <BotonEventos />

      <Map
        onSeleccionMarcador={(id: number) => {
          setMarcadorSeleccionadoId(id);
          setMostrarMarcador(true);
        }}
      />

      {mostrarMarcador && marcadorSeleccionadoId !== null && (
        <div style={estilosMarcador}>
          <VerMarcador
            MarcadorSelectId={marcadorSeleccionadoId}
            CerrarMarcador={() => setMostrarMarcador(false)}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
