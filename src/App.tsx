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


import ProtectedRoute from './components/ProtectedRoute'
import Info from "./screens/solicitudes/Info"
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginUsuario />} />
        <Route path='/info' element= {<Info />}/>
        <Route path='/colaborar' element={<AgregarSolicitud />} />

        {/* Panel administrativo protegido */}
        <Route path='/panel-administrativo' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <VistaAdministrador />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/marcadores' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <List />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/marcadores/agregar' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <AgregarMarcador />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/marcadores/informacion/:id' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <InfoDetallada />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/marcadores/editar/:id' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <EditarLocation />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/usuarios' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <Gestion_Usuarios />
          </ProtectedRoute>
        } />

        <Route path='/usuario/perfil/:id' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor', 'usuario']}>
            <Perfil_Usuario />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/usuarios/agregar' element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <Agregar_Usuarios />
          </ProtectedRoute>
        } />

        <Route path='/usuarios/editar/:id' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor', 'usuario']}>
            <Editar_Usuarios />
          </ProtectedRoute>
        } />

        {/* Accesibilidades protegidas */}
        <Route path='/panel-administrativo/accesibilidades' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <ListAccesibilidades />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/accesibilidades/agregar' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <AgregarAccesibilidad />
          </ProtectedRoute>
        } />

        {/* Tipos de recinto protegidos */}
        <Route path='/panel-administrativo/tipo-recinto' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <ListTipoRecinto />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/tipo-recinto/agregar' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <AgregarTipoRecinto />
          </ProtectedRoute>
        } />

        {/* Reseñas protegidas */}
        <Route path='/panel-administrativo/resenas' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <Gestion_Resenas />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/resenas/inspeccionar/:id' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <Inspeccionar_Resenas />
          </ProtectedRoute>
        } />

        {/* Solicitudes protegidas */}
        <Route path='/panel-administrativo/solicitudes/:estado?' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <ListSolicitudes />
          </ProtectedRoute>
        } />

        <Route path='/panel-administrativo/solicitud/:id' element={
          <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
            <Ver />
          </ProtectedRoute>
        } />

        {/* Callback auth y 404 sin protección */}
        <Route path='/auth/callback' element={<AuthCallback />} />
        <Route path='*' element={<h1>404 NOT FOUND</h1>} />
      </Routes>
    </div>
  )
}

export default App;
