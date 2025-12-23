import { db } from './database';
import { Lead } from '../types';
import { SYSTEM_API_KEY } from '../constants';

interface WebhookResponse {
  success: boolean;
  message: string;
  lead_id?: string;
  error?: string;
}

/**
 * Simula o POST /api/leads/inbound APENAS no lado do cliente (navegador)
 * Usado pelo componente de Configurações para testar a lógica visualmente.
 */
export const processInboundLeadSimulation = async (payload: any, apiKey?: string): Promise<WebhookResponse> => {
  // 1. Verificação de Segurança
  if (!apiKey || apiKey !== SYSTEM_API_KEY) {
    return {
        success: false,
        message: "Unauthorized",
        error: "Falha na Autenticação. Verifique o header 'Authorization: Bearer YOUR_KEY'."
    };
  }

  // 2. Validação
  if (!payload.nome || !payload.telefone) {
    return { 
        success: false, 
        message: "Bad Request", 
        error: "Campos obrigatórios: 'nome' e 'telefone' (ou 'phone')." 
    };
  }

  try {
    // 3. Normalização
    const tags = await db.getTags();
    const newLeadTag = tags.find(t => t.name === 'Novo Lead')?.id || 't1';
    
    // Lógica de auto-tagging
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
      createdAt: new Date().toISOString().split('T')[0]
    };

    // 4. Inserção no "Banco" (LocalStorage)
    await db.createLead(newLead);

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