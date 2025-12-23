import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';

const CRM_API_KEY = process.env.CRM_API_KEY || "sk_live_vrm_9823_secure_x1y2z3";

// Credenciais do Supabase (Fallback para hardcoded se não houver ENV)
// Usamos a Service Role Key aqui no backend para garantir permissão de escrita irrestrita
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rivobekwkmctfpvqxebr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdm9iZWt3a21jdGZwdnF4ZWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjI1NjMwMiwiZXhwIjoyMDgxODMyMzAyfQ.v0MD5dtSsrSWmc74xf4I0wwVG1LfDtfb4eFlQ3rMt_4';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

  try {
    // 2. Auth da API do CRM
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Bearer token missing." });
    }
    const apiKey = authHeader.replace("Bearer ", "");
    if (apiKey !== CRM_API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // 3. Validação e Payload
    const { nome, telefone, email, mensagem, origem, campanha } = req.body || {};

    if (!nome || !telefone) {
      return res.status(400).json({ error: "Nome e telefone são obrigatórios" });
    }

    // 4. Salvar no Supabase
    let savedLeadId = `lead_simulated_${Date.now()}`;
    
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          nome,
          telefone,
          email,
          mensagem,
          origem: origem || 'API',
          campanha,
          etiquetas: ['t1'], // ID da tag padrão 'Novo Lead' (Mapeado no frontend) ou array vazio {}
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(`Database insertion failed: ${error.message}`);
      }
      savedLeadId = data.id;
    } else {
      console.warn('Supabase credentials missing. Running in simulation mode.');
    }

    console.log("✅ Lead processado e salvo:", { nome, telefone, id: savedLeadId });

    return res.status(201).json({
      success: true,
      message: "Lead recebido e salvo com sucesso no Supabase",
      lead_id: savedLeadId
    });

  } catch (error: any) {
    console.error("Erro interno:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}