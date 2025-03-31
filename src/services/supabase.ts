import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnttauavodfqkekncxbz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudHRhdWF2b2RmcWtla25jeGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTM3NTIsImV4cCI6MjA1ODU2OTc1Mn0.mKu5crNJgEkfvj5vDW9aRm3suudqW7oMESnmR0lZUzo'
export const supabase = createClient(supabaseUrl, supabaseKey)


// creacion de instancia de llamado a supabase. 