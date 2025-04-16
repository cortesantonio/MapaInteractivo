import './App.css'
import Buscador from './components/Buscador';
import BotonEventos from './components/botoneventos';
import Map from './components/Map';
import Footer from './components/Footer';

// Solicitudes
/* 
import AgregarSolicitud from './screens/solicitudes/AgregarSolicitud';
import List from './screens/solicitudes/List'; */

//ACCESIBILIDADES

/* import AgregarAccesibilidad from './screens/accesibilidades/Agregar';
import ListAccesibilidades from './screens/accesibilidades/List';

 */


//LOGIN 
/* import LoginUsuario from './screens/Login/loginUsuario'; */

//MARCADORES
/* import VerMarcador from './screens/marcadores/VerMarcador';
 */

import AgregarTipoRecinto from './screens/tipoRecinto/Agregar';
import ListTipoRecinto from './screens/tipoRecinto/List';

function App() {

  return (
    <div style={{ height: '100%', width: '100%', position: 'fixed' }}>

      {/* <Map />
      <Buscador />
      <BotonEventos />
      <Footer /> */}

      {/* <AgregarSolicitud />
      <List /> */}


      {/*  <AgregarAccesibilidad />
      <ListAccesibilidades /> */}

      {/* <LoginUsuario /> */}

      {/* <VerMarcador /> */}

        {/* < AgregarTipoRecinto />
      <ListTipoRecinto /> */}
      
    </div>

  )
}

export default App
