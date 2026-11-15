// External database connection (based on user-provided config).
// The anon key is a publishable key and is safe in browser code.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iwasmcrdvuydctrigoll.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3YXNtY3JkdnV5ZGN0cmlnb2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1ODc5MjcsImV4cCI6MjExMDE2MzkyN30.TC2aK6RYS--EkQMrEG516v3ekuVLikVukqmzqwoELcA";

export const externalSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: { storageKey: "wtaa-external-auth", persistSession: typeof window !== "undefined" },
});
