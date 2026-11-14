import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Only the public anon/publishable key belongs in a browser app.
// Row Level Security in Supabase protects all private operations.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
