import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth
      .exchangeCodeForSession(window.location.href)
      .then(({ error }) => {
        if (error) {
          console.error('OAuth error:', error.message)
        }
        navigate('/', { replace: true })
      })
  }, [navigate])

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Conectando con tu cuenta…</h2>
    </main>
  )
}

export default AuthCallback
