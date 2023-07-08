import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseUrl = 'https://irxitbuuforjmrqqlxfe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeGl0YnV1Zm9yam1ycXFseGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc3NTEzODAsImV4cCI6MjAwMzMyNzM4MH0.LywiVR-CvsBNeIObMlsKVUXBN5rklyN1Agk3TZOQV6g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
