import './App.css'
import { Routes, Route } from 'react-router-dom'

// vistas generales
import LoginUsuario from './screens/Login/loginUsuario'
import Home from './screens/Home'

// vistas administrador
import VistaAdministrador from './screens/vistaAdministrador/VistaAdministrador'

import List from './screens/marcadores/List'
import AgregarMarcador from './screens/marcadores/AgregarMarcador'
import InfoDetallada from './screens/marcadores/InfoDetallada'
import EditarLocation from './screens/marcadores/EditarLocacion'

import Gestion_Usuarios from './screens/usuarios/Gestion_Usuarios'
import Agregar_Usuarios from './screens/usuarios/Agregar_Usuarios'
import Editar_Usuarios from './screens/usuarios/Editar_Usuarios'
import Perfil_Usuario from './screens/usuarios/Perfil_Usuarios'

import AgregarAccesibilidad from './screens/accesibilidades/Agregar'
import ListAccesibilidades from './screens/accesibilidades/List'

import AgregarTipoRecinto from './screens/tipoRecinto/Agregar'
import ListTipoRecinto from './screens/tipoRecinto/List'

import Gestion_Resenas from './screens/resenas/Gestion_Resenas'
import Inspeccionar_Resenas from './screens/resenas/Inspeccionar_Resenas'

import AgregarSolicitud from './screens/solicitudes/AgregarSolicitud'
import ListSolicitudes from './screens/solicitudes/List'

import AuthCallback from './screens/AuthCallback'
import Ver from './screens/solicitudes/Ver'



function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginUsuario />} />

        <Route path='/colaborar' element={<AgregarSolicitud />} />


        <Route path='/panel-administrativo' element={<VistaAdministrador />} />

        <Route path='/panel-administrativo/marcadores' element={< List />} />
        <Route path='/panel-administrativo/marcadores/agregar' element={< AgregarMarcador />} />
        <Route path='/panel-administrativo/marcadores/informacion/:id' element={< InfoDetallada />} />
        <Route path='/panel-administrativo/marcadores/editar/:id' element={< EditarLocation />} />

        <Route path='/panel-administrativo/usuarios' element={< Gestion_Usuarios />} />
        <Route path='/usuario/perfil/:id' element={< Perfil_Usuario />} />
        <Route path='/panel-administrativo/usuarios/agregar' element={<Agregar_Usuarios />} />
        <Route path='/usuarios/editar/:id' element={<Editar_Usuarios />} />


        <Route path='/panel-administrativo/accesibilidades' element={< ListAccesibilidades />} />
        <Route path='/panel-administrativo/accesibilidades/agregar' element={< AgregarAccesibilidad />} />

        <Route path='/panel-administrativo/tipo-recinto' element={< ListTipoRecinto />} />
        <Route path='/panel-administrativo/tipo-recinto/agregar' element={< AgregarTipoRecinto />} />

        <Route path='/panel-administrativo/resenas' element={< Gestion_Resenas />} />
        <Route path='/panel-administrativo/resenas/inspeccionar/:id' element={< Inspeccionar_Resenas />} />

        <Route path='/panel-administrativo/solicitudes' element={<ListSolicitudes />} />
        <Route path='/panel-administrativo/solicitud/:id' element={<Ver />} />



        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path='*' element={<h1>404 NOT FOUND</h1>} />

      </Routes>
    </div>

  )
}

export default App
