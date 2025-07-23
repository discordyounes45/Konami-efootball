import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hbcpwlgrvhztgvvubxyd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiY3B3bGdydmh6dGd2dnVieHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjU0OTYsImV4cCI6MjA2NjkwMTQ5Nn0._51dcJ5y5GpTrWjUk09qfb8oBBeHGgPw5jfgQB10uhM'

export const supabase = createClient(supabaseUrl, supabaseKey)
