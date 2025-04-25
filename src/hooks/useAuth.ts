import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error al cerrar sesión:', error.message)
  }

  return { session, user: session?.user, signOut }
}
