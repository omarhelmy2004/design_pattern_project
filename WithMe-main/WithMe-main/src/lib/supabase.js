import { createClient } from '@supabase/supabase-js';

// 👇 Replace these with your own from supabase.com (free account)
const SUPABASE_URL = 'https://fpxxymeschkrpmjlltbj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZweHh5bWVzY2hrcnBtamxsdGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTgxMzksImV4cCI6MjA4ODk5NDEzOX0.CEbuATrJNjyb_qtFRodb6jsNW0GjM-2zYUnDjkqOJgc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
