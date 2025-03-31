import './App.css'
import Buscador from './components/Buscador';
import ShowData from './components/showData';
function App() {

  return (
    <>
      <  Buscador />
      <div>
        <h1>Datos de Supabase</h1>
        <ShowData />
      </div>    </>
  )
}

export default App
