import Map from "../components/Map";
import Footer from "../components/Footer";
import Buscador from "../components/Buscador";
import BotonEventos from "../components/botoneventos";

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>

      <Buscador />
      <BotonEventos />

      <Map />
      <Footer />
    </div >
  );
}
