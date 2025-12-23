import type { VercelRequest, VercelResponse } from "@vercel/node";

const CRM_API_KEY = process.env.CRM_API_KEY || "sk_live_vrm_9823_secure_x1y2z3";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. Configurar CORS (Crítico para n8n e fetch externo)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // 2. Responder imediatamente a requisições OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Validar Método (Apenas POST é permitido)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // 4. Autenticação Bearer Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Bearer token missing." });
    }

    const apiKey = authHeader.replace("Bearer ", "");

    if (apiKey !== CRM_API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // 5. Processamento do Body
    const {
      nome,
      telefone,
      email,
      mensagem,
      origem,
      campanha
    } = req.body || {};

    // 6. Validação
    if (!nome || !telefone) {
      return res.status(400).json({
        error: "Nome e telefone são obrigatórios"
      });
    }

    // Em produção: Salvar no Supabase/Postgres
    console.log("✅ Lead recebido via API:", { nome, telefone, origem });

    // 7. Resposta de Sucesso
    return res.status(201).json({
      success: true,
      message: "Lead recebido com sucesso",
      lead_id: `lead_${Date.now()}`
    });

  } catch (error) {
    console.error("Erro interno:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}