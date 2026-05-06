import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iqwpccaklgcetfwbkalb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxd3BjY2FrbGdjZXRmd2JrYWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDEwMTEsImV4cCI6MjA5MzU3NzAxMX0.BfYpyIk8zrlxYGpIlcww2zH5KyID53pZcRaFc-ChEfM'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('hero_countdown')
    .insert([
      { title: 'Test Event', event_date: '2026-05-25 10:00:00+05:30', location: 'Test Location', is_active: true }
    ])
    
  console.log('Insert Data:', data)
  console.log('Insert Error:', error)
}

test()
