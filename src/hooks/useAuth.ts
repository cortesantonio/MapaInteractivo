import { useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'


export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true) // ⬅️ nuevo estado
  const [userEstado, setuserEstado] = useState<boolean>()
  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        fetchUserRole_Estado(data.session.user)
      } else {
        setAuthLoading(false) // No hay sesión, ya no estamos cargando
      }
    })

    // Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        if (newSession?.user) {
          fetchUserRole_Estado(newSession.user)
        } else {
          setUserRole(null)
          setAuthLoading(false) // No hay usuario, ya no estamos cargando
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchUserRole_Estado = async (user: User) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('rol , activo')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error al obtener el rol:', error.message)
    }
    setuserEstado(data?.activo)
    setUserRole(data?.rol || 'usuario')
    setAuthLoading(false) // 
  }


  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error al cerrar sesión:', error.message)
  }

  return { session, user: session?.user, userRole, signOut, authLoading, userEstado }
}
