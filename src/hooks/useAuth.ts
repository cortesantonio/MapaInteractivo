import { useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true) // ⬅️ nuevo estado

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        fetchUserRole(data.session.user)
      } else {
        setAuthLoading(false) // No hay sesión, ya no estamos cargando
      }
    })

    // Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        if (newSession?.user) {
          fetchUserRole(newSession.user)
        } else {
          setUserRole(null)
          setAuthLoading(false) // No hay usuario, ya no estamos cargando
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (user: User) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error al obtener el rol:', error.message)
    }

    setUserRole(data?.rol || 'usuario')
    setAuthLoading(false) // 
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error al cerrar sesión:', error.message)
  }

  return { session, user: session?.user, userRole, signOut, authLoading }
}
