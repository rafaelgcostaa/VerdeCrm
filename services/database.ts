import { Lead, Tag } from '../types';
import { supabase } from '../src/services/supabaseClient';
import { INITIAL_TAGS, INITIAL_LEADS } from '../constants';

const DB_KEYS = {
  LEADS: 'verdecrm_leads',
  TAGS: 'verdecrm_tags',
  AUTOMATIONS: 'verdecrm_automations'
};

// Helper para obter leads locais (Fallback)
const getLocalLeads = (): Lead[] => {
  const data = localStorage.getItem(DB_KEYS.LEADS);
  return data ? JSON.parse(data) : INITIAL_LEADS;
};

// Helper para salvar leads locais
const saveLocalLeads = (leads: Lead[]) => {
  localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(leads));
};

export const db = {
  init: () => {
    // Inicializa dados locais para garantir funcionamento offline/demo
    if (!localStorage.getItem(DB_KEYS.TAGS)) {
      localStorage.setItem(DB_KEYS.TAGS, JSON.stringify(INITIAL_TAGS));
    }
    if (!localStorage.getItem(DB_KEYS.LEADS)) {
      localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    }
  },

  getLeads: async (): Promise<Lead[]> => {
    try {
      // Tenta buscar leads do Supabase
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapeia os campos do Banco (Português/Snake_case) para o Frontend (Inglês/CamelCase)
      const mappedLeads = (data || []).map((row: any) => ({
        id: row.id,
        name: row.nome,
        phone: row.telefone,
        email: row.email || '',
        source: row.origem || 'Desconhecido',
        company: row.empresa,
        campaign: row.campanha,
        message: row.mensagem,
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        tags: row.etiquetas || []
      }));
      
      // Sincroniza dados do banco com o local para cache/backup
      if (mappedLeads.length > 0) {
        saveLocalLeads(mappedLeads);
      }
      
      return mappedLeads;

    } catch (error: any) {
      console.warn('⚠️ Supabase indisponível (Usando dados locais):', error.message || error);
      return getLocalLeads();
    }
  },

  getTags: async (): Promise<Tag[]> => {
    // Simulação local para Tags (Foco no MVP de Leads no Supabase)
    const data = localStorage.getItem(DB_KEYS.TAGS);
    return data ? JSON.parse(data) : INITIAL_TAGS;
  },

  createLead: async (data: Omit<Lead, 'id' | 'createdAt'> & { id?: string, createdAt?: string }): Promise<Lead> => {
    // Objeto formatado para Frontend
    const newLeadFrontend: Lead = {
      ...data,
      id: data.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      tags: data.tags || []
    };

    try {
      // Tenta salvar no Supabase
      const dbPayload = {
        nome: data.name,
        telefone: data.phone,
        email: data.email,
        origem: data.source,
        mensagem: data.message,
        campanha: data.campaign,
        etiquetas: data.tags,
        created_at: new Date().toISOString()
      };

      const { data: insertedData, error } = await supabase
        .from('leads')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;

      // Retorna com ID real do banco se sucesso
      return {
        ...newLeadFrontend,
        id: insertedData.id,
        createdAt: insertedData.created_at.split('T')[0]
      };

    } catch (error: any) {
      console.warn('⚠️ Falha ao salvar no Supabase (Salvando localmente):', error.message || error);
      
      // Fallback: Salva no LocalStorage
      const currentLeads = getLocalLeads();
      saveLocalLeads([newLeadFrontend, ...currentLeads]);
      
      return newLeadFrontend;
    }
  },

  moveLeadStage: async (leadId: string, newStageTagId: string): Promise<void> => {
    const allTags = await db.getTags();
    // Atualiza localmente primeiro (Optimistic UI já feito no componente, mas garantimos persistência local)
    const currentLeads = getLocalLeads();
    const stageTagIds = allTags.filter(t => t.isKanbanColumn).map(t => t.id);
    
    const updatedLeads = currentLeads.map(lead => {
        if (lead.id !== leadId) return lead;
        const cleanTags = lead.tags.filter(tId => !stageTagIds.includes(tId));
        return { ...lead, tags: [...cleanTags, newStageTagId] };
    });
    saveLocalLeads(updatedLeads);

    try {
      // Tenta atualizar no Supabase
      // 1. Buscar lead atual para pegar as tags atuais do banco (para não sobrescrever errado em caso de race condition)
      const { data: currentLead, error: fetchError } = await supabase
        .from('leads')
        .select('etiquetas')
        .eq('id', leadId)
        .single();
      
      if (fetchError) throw fetchError;

      const currentTagsDb: string[] = currentLead.etiquetas || [];
      const cleanTagsDb = currentTagsDb.filter(tId => !stageTagIds.includes(tId));
      const newTagsDb = [...cleanTagsDb, newStageTagId];

      const { error: updateError } = await supabase
        .from('leads')
        .update({ etiquetas: newTagsDb })
        .eq('id', leadId);

      if (updateError) throw updateError;

    } catch (error: any) {
      console.warn('⚠️ Falha ao atualizar Supabase (Estado salvo localmente):', error.message || error);
    }
  },

  reset: () => {
    localStorage.clear();
    window.location.reload();
  }
};

db.init();