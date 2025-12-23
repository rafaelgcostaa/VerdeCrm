import { Lead, Tag } from '../types';
import { supabase } from '../services/supabaseClient';
import { INITIAL_TAGS, INITIAL_LEADS } from '../constants';

const DB_KEYS = {
  LEADS: 'verdecrm_leads',
  TAGS: 'verdecrm_tags',
  AUTOMATIONS: 'verdecrm_automations'
};

// Helper para converter formato do Banco (Snake Case) para Frontend (Camel Case)
const mapLeadFromDB = (row: any): Lead => ({
  id: row.id,
  name: row.nome,
  phone: row.telefone,
  email: row.email || '',
  source: row.origem || 'Desconhecido',
  company: row.empresa,
  campaign: row.campanha,
  message: row.mensagem,
  createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  tags: row.etiquetas || [] // Array de IDs de tags (strings)
});

export const db = {
  init: () => {
    // Inicializa dados locais básicos de configuração (Tags)
    if (!localStorage.getItem(DB_KEYS.TAGS)) {
      localStorage.setItem(DB_KEYS.TAGS, JSON.stringify(INITIAL_TAGS));
    }
  },

  /**
   * Busca leads diretamente do Supabase (Fonte da Verdade)
   */
  getLeads: async (): Promise<Lead[]> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(mapLeadFromDB);
    } catch (error: any) {
      console.warn('⚠️ Erro ao buscar leads (Supabase):', error.message);
      // Fallback visual apenas se não houver conexão, mas idealmente mostra estado vazio ou erro
      const localData = localStorage.getItem(DB_KEYS.LEADS);
      return localData ? JSON.parse(localData) : [];
    }
  },

  getTags: async (): Promise<Tag[]> => {
    // Mantendo tags no LocalStorage por enquanto para simplicidade do MVP
    const data = localStorage.getItem(DB_KEYS.TAGS);
    return data ? JSON.parse(data) : INITIAL_TAGS;
  },

  /**
   * Atualiza as etiquetas (estágio) do lead no Supabase
   */
  moveLeadStage: async (leadId: string, newStageTagId: string): Promise<void> => {
    try {
      // 1. Busca tags atuais para não perder histórico
      const { data: currentLead, error: fetchError } = await supabase
        .from('leads')
        .select('etiquetas')
        .eq('id', leadId)
        .single();
      
      if (fetchError) throw fetchError;

      const allTags = await db.getTags();
      const stageTagIds = allTags.filter(t => t.isKanbanColumn).map(t => t.id);
      const currentTagsDb: string[] = currentLead.etiquetas || [];
      
      // Remove tags de colunas anteriores e adiciona a nova
      const cleanTagsDb = currentTagsDb.filter(tId => !stageTagIds.includes(tId));
      const newTagsDb = [...cleanTagsDb, newStageTagId];

      const { error: updateError } = await supabase
        .from('leads')
        .update({ etiquetas: newTagsDb })
        .eq('id', leadId);

      if (updateError) throw updateError;

    } catch (error: any) {
      console.error('⚠️ Falha ao atualizar estágio no Supabase:', error.message);
      throw error; // Propaga erro para a UI reverter se necessário
    }
  },

  /**
   * Inscreve-se para mudanças em tempo real na tabela 'leads'
   */
  subscribeToLeads: (onInsert: (lead: Lead) => void, onUpdate: (lead: Lead) => void) => {
    return supabase
      .channel('leads-realtime-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('🔔 Realtime Insert:', payload);
          onInsert(mapLeadFromDB(payload.new));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('🔔 Realtime Update:', payload);
          onUpdate(mapLeadFromDB(payload.new));
        }
      )
      .subscribe();
  },

  reset: () => {
    localStorage.clear();
    window.location.reload();
  }
};

db.init();