import { db } from '../services/database';
import { Lead } from '../types';
import { SYSTEM_API_KEY } from '../constants';

interface WebhookResponse {
  success: boolean;
  message: string;
  lead_id?: string;
  error?: string;
}

/**
 * Simulates POST /api/leads/inbound
 * This function mimics the logic that would run on Vercel Serverless Functions
 */
export const processInboundLead = async (payload: any, apiKey?: string): Promise<WebhookResponse> => {
  // 1. Security Check (REAL PRODUCTION SIMULATION)
  // Checks if the provided key matches the System Key
  if (!apiKey || apiKey !== SYSTEM_API_KEY) {
    return {
        success: false,
        message: "Unauthorized",
        error: "Falha na Autenticação. Verifique o header 'Authorization: Bearer YOUR_KEY'."
    };
  }

  // 2. Validation
  if (!payload.nome || !payload.telefone) {
    return { 
        success: false, 
        message: "Bad Request", 
        error: "Campos obrigatórios: 'nome' e 'telefone' (ou 'phone')." 
    };
  }

  try {
    // 3. Data Normalization
    const tags = await db.getTags();
    const newLeadTag = tags.find(t => t.name === 'Novo Lead')?.id || 't1';
    
    // Auto-tagging logic based on payload
    const automaticTags = [newLeadTag];
    
    if (payload.origem === 'Facebook Ads') {
        const fbTag = tags.find(t => t.name === 'Facebook Ads')?.id;
        if (fbTag) automaticTags.push(fbTag);
    }
    
    if (payload.origem === 'WhatsApp') {
        const wppTag = tags.find(t => t.name === 'WhatsApp')?.id;
        if (wppTag) automaticTags.push(wppTag);
    }

    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: payload.nome,
      phone: payload.telefone,
      email: payload.email || "",
      source: payload.origem || "API",
      company: payload.empresa || "",
      campaign: payload.campanha || "",
      message: payload.mensagem || "",
      tags: automaticTags,
      createdAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    // 4. Database Insertion
    await db.createLead(newLead);

    // 5. Success Response
    return {
      success: true,
      message: "Lead created successfully",
      lead_id: newLead.id
    };

  } catch (error) {
    return {
      success: false,
      message: "Internal Server Error",
      error: "Falha ao processar dados no banco."
    };
  }
};