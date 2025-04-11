import './App.css'
import Buscador from './components/Buscador';
import List from './screens/solicitudes/List';
import BotonEventos from './components/botoneventos';
import Map from './components/Map';
import Footer from './components/Footer';

function App() {

  return (
    <div style={{height: '100%', width: '100%', position: 'fixed'}}>
      <Map />
      <Buscador />
      <BotonEventos />
      <Footer />
    </div>
    
  )
}

export default App
