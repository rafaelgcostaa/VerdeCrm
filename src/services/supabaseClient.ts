import { createClient } from '@supabase/supabase-js';

// Helper seguro para pegar variáveis de ambiente em diferentes contextos (Vite vs Node)
const getEnvVar = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key] || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

// Credenciais fornecidas pelo usuário
// Nota: Em produção, mantenha estas chaves no arquivo .env
const HARDCODED_URL = 'https://rivobekwkmctfpvqxebr.supabase.co';
const HARDCODED_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdm9iZWt3a21jdGZwdnF4ZWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTYzMDIsImV4cCI6MjA4MTgzMjMwMn0.0nbzpF1yBeyb7Qx0bx8tRFEXxZeCjY23lshaw-hn6po';

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || HARDCODED_URL;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || HARDCODED_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase Keys não encontradas. O CRM funcionará em modo offline/demo.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);