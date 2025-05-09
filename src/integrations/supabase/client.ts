
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://xtganknrrjjqutxeugxh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z2Fua25ycmpqcXV0eGV1Z3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNjU4MDEsImV4cCI6MjA2MTk0MTgwMX0.MFAFWR743gjqyg6o6wy97KtgYub1PenAb1kLNibwzvA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
