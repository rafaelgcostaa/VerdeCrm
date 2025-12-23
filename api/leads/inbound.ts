import { VercelRequest, VercelResponse } from '@vercel/node';

// Hardcoded for this environment to ensure it works without complex env setups in the demo
const SYSTEM_API_KEY = "sk_live_vrm_9823_secure_x1y2z3";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS Setup
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed. Only POST is supported.' });
  }

  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({ error: "Unauthorized. Missing or invalid Bearer token." });
    }

    const apiKey = authHeader.replace("Bearer ", "");

    if (apiKey !== SYSTEM_API_KEY) {
      return response.status(401).json({ error: "Invalid API key" });
    }

    const { nome, telefone, email, mensagem, origem, campanha } = request.body;

    if (!nome || !telefone) {
      return response.status(400).json({ error: "Campos obrigatórios: nome, telefone" });
    }

    // NOTE: This serverless function runs on Vercel's Edge/Node infrastructure.
    // It cannot access the client-side LocalStorage where the demo app stores data.
    // In a real production app, you would insert this data into a database (Postgres, Mongo, etc.) here.
    
    console.log("Lead Received via API:", { nome, telefone, origem });

    return response.status(201).json({
      success: true,
      message: "Lead received successfully (Serverless Function).",
      lead_id: `lead_${Date.now()}_server`,
      note: "Data received by server. Since this is a demo using LocalStorage, this lead will not appear in the dashboard until a real database is connected."
    });

  } catch (error) {
    console.error("API Error:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}