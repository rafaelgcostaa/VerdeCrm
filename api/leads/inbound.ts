import { VercelRequest, VercelResponse } from '@vercel/node';

// Usando a chave definida no prompt para garantir compatibilidade imediata
const CRM_API_KEY = process.env.CRM_API_KEY || "sk_live_vrm_9823_secure_x1y2z3";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // 1. Tratamento de CORS (Essencial para n8n/testes externos)
  // Nota: Os headers também estão no vercel.json, mas reforçamos aqui para a resposta da função
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // 2. Responder imediatamente a requisições OPTIONS (Preflight)
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 3. Validar Método
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    // 4. Autenticação Bearer Token
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({ error: "Unauthorized. Missing Bearer token." });
    }

    const apiKey = authHeader.replace("Bearer ", "");

    if (apiKey !== CRM_API_KEY) {
      return response.status(401).json({ error: "Invalid API key" });
    }

    // 5. Processamento do Body
    const { nome, telefone, email, mensagem, origem, campanha } = request.body || {};

    // 6. Validação de Campos Obrigatórios
    if (!nome || !telefone) {
      return response.status(400).json({ 
        error: "Campos obrigatórios ausentes",
        required: ["nome", "telefone"],
        received: request.body
      });
    }

    // LOG: Simula inserção no banco (Em produção, conectaria ao Supabase/Postgres aqui)
    console.log("✅ Lead Recebido:", { nome, telefone, origem });

    // 7. Resposta de Sucesso
    return response.status(201).json({
      success: true,
      message: "Lead recebido com sucesso.",
      data: {
        id: `lead_${Date.now()}`,
        nome,
        status: "queued"
      }
    });

  } catch (error) {
    console.error("❌ Erro no inbound:", error);
    return response.status(500).json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}