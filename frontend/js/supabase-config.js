// ============================================================
// SUPABASE CONFIGURATION
// Replace both values with:
// Supabase Dashboard > Project Settings > API
// ============================================================

const SUPABASE_URL = "https://blrvstuqekuvrrtgorgu.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscnZzdHVxZWt1dnJydGdvcmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMTYxNjEsImV4cCI6MjEwNDg5MjE2MX0.PhoqeK5vlRUwVOlIZb6Ge6OsJcVBDYBiRQKEIklFv9Q";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);