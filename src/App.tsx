import './App.css'
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Rutas que se usan de inmediato
const LoginUsuario = lazy(() => import("./screens/Login/loginUsuario"))
import Home from './screens/Home'
import AuthCallback from './screens/AuthCallback'
import NotFound from './screens/NotFound'

// Lazy load para vistas menos críticas
const Modo_Compacto = lazy(() => import('./screens/modoCompacto/Home'))
const TrazadoRuta = lazy(() => import('./screens/modoCompacto/Trazado_Compacto'))

const VistaAdministrador = lazy(() => import('./screens/vistaAdministrador/VistaAdministrador'))
const List = lazy(() => import('./screens/marcadores/List'))
const AgregarMarcador = lazy(() => import('./screens/marcadores/AgregarMarcador'))
const InfoDetallada = lazy(() => import('./screens/marcadores/InfoDetallada'))
const EditarLocation = lazy(() => import('./screens/marcadores/EditarLocacion'))

const VerHorarioMarcador = lazy(() => import('./screens/horarios/Ver'))
const ListHorarioMarcador = lazy(() => import('./screens/horarios/List'))

const Gestion_Usuarios = lazy(() => import('./screens/usuarios/Gestion_Usuarios'))
const Agregar_Usuarios = lazy(() => import('./screens/usuarios/Agregar_Usuarios'))
const Editar_Usuarios = lazy(() => import('./screens/usuarios/Editar_Usuarios'))
const Perfil_Usuario = lazy(() => import('./screens/usuarios/Perfil_Usuarios'))

const AgregarAccesibilidad = lazy(() => import('./screens/accesibilidades/Agregar'))
const ListAccesibilidades = lazy(() => import('./screens/accesibilidades/List'))

const AgregarTipoRecinto = lazy(() => import('./screens/tipoRecinto/Agregar'))
const ListTipoRecinto = lazy(() => import('./screens/tipoRecinto/List'))

const RegistroLogs = lazy(() => import('./screens/registrosLogs/RegistroLogs'))

const Gestion_Resenas = lazy(() => import('./screens/resenas/Gestion_Resenas'))
const Inspeccionar_Resenas = lazy(() => import('./screens/resenas/Inspeccionar_Resenas'))

const AgregarSolicitud = lazy(() => import('./screens/solicitudes/AgregarSolicitud'))
const ListSolicitudes = lazy(() => import('./screens/solicitudes/List'))
const Ver = lazy(() => import('./screens/solicitudes/Ver'))
const Info = lazy(() => import('./screens/solicitudes/Info'))

const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))

import { PropagateLoader } from 'react-spinners'

function App() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', textAlign: 'center',
        flexDirection: 'column'
      }}>
        <PropagateLoader
          color='#29482a' size={40}
        />

        <p style={{ color: '#29482a', fontSize: '1.2rem', marginTop: '50px', paddingLeft: '50px' }}>Cargando...</p>
      </div>}>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginUsuario />} />
          <Route path='/info' element={<Info />} />
          <Route path='/colaborar' element={<AgregarSolicitud />} />
          <Route path='/modocompacto' element={<Modo_Compacto />} />
          <Route path='/modocompacto/trazadoruta/:id' element={<TrazadoRuta />} />

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
            <ProtectedRoute allowedRoles={['administrador', 'gestor', 'usuario']}>
              <InfoDetallada />
            </ProtectedRoute>
          } />
          <Route path='/panel-administrativo/marcadores/editar/:id' element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor', 'usuario']}>
              <EditarLocation />
            </ProtectedRoute>
          } />
          <Route path='/panel-administrativo/marcadores/horarios' element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
              <ListHorarioMarcador />
            </ProtectedRoute>
          } />
          <Route path='/panel-administrativo/marcadores/horario/:id' element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
              <VerHorarioMarcador />
            </ProtectedRoute>
          } />
          {/* Usuarios */}
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
          {/* Accesibilidades */}
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
          {/* Tipo Recinto */}
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
          {/* Logs */}
          <Route path='/panel-administrativo/registrosLogs' element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
              <RegistroLogs />
            </ProtectedRoute>
          } />
          {/* Reseñas */}
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
          {/* Solicitudes */}
          <Route path='/panel-administrativo/solicitudes/:estado?' element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor']}>
              <ListSolicitudes />
            </ProtectedRoute>
          } />
          <Route path='/panel-administrativo/solicitud/:id' element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor', 'usuario']}>
              <Ver />
            </ProtectedRoute>
          } />
          <Route path='/auth/callback' element={<AuthCallback />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Suspense >
  )
}

export default App
