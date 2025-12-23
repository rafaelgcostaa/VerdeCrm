import { Lead, Tag, Automation } from '../types';
import { INITIAL_LEADS, INITIAL_TAGS, INITIAL_AUTOMATIONS } from '../constants';

const DB_KEYS = {
  LEADS: 'verdecrm_leads',
  TAGS: 'verdecrm_tags',
  AUTOMATIONS: 'verdecrm_automations'
};

// Simulate Network Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  init: () => {
    if (!localStorage.getItem(DB_KEYS.LEADS)) {
      localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    }
    if (!localStorage.getItem(DB_KEYS.TAGS)) {
      localStorage.setItem(DB_KEYS.TAGS, JSON.stringify(INITIAL_TAGS));
    }
    if (!localStorage.getItem(DB_KEYS.AUTOMATIONS)) {
      localStorage.setItem(DB_KEYS.AUTOMATIONS, JSON.stringify(INITIAL_AUTOMATIONS));
    }
  },

  getLeads: async (): Promise<Lead[]> => {
    await delay(300);
    const data = localStorage.getItem(DB_KEYS.LEADS);
    return data ? JSON.parse(data) : [];
  },

  getTags: async (): Promise<Tag[]> => {
    await delay(100);
    const data = localStorage.getItem(DB_KEYS.TAGS);
    return data ? JSON.parse(data) : [];
  },

  createLead: async (data: Omit<Lead, 'id' | 'createdAt'> & { id?: string, createdAt?: string }): Promise<Lead> => {
    await delay(400);
    const leads = JSON.parse(localStorage.getItem(DB_KEYS.LEADS) || '[]');
    
    // Constrói o novo Lead garantindo ID único e Data formatada se não fornecidos
    const newLead: Lead = {
      ...data,
      id: data.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      tags: data.tags || []
    };

    const newLeads = [newLead, ...leads];
    localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(newLeads));
    return newLead;
  },

  updateLead: async (updatedLead: Lead): Promise<Lead> => {
    const leads = JSON.parse(localStorage.getItem(DB_KEYS.LEADS) || '[]');
    const newLeads = leads.map((l: Lead) => l.id === updatedLead.id ? updatedLead : l);
    localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(newLeads));
    return updatedLead;
  },
  
  // Specific method for Kanban drag-and-drop to handle tag switching logic
  moveLeadStage: async (leadId: string, newStageTagId: string, allTags: Tag[]): Promise<void> => {
    const leads = JSON.parse(localStorage.getItem(DB_KEYS.LEADS) || '[]');
    const stageTagIds = allTags.filter(t => t.isKanbanColumn).map(t => t.id);
    
    const newLeads = leads.map((lead: Lead) => {
        if (lead.id !== leadId) return lead;
        
        // Remove existing stage tags
        const cleanTags = lead.tags.filter(tId => !stageTagIds.includes(tId));
        // Add new stage tag
        return { ...lead, tags: [...cleanTags, newStageTagId] };
    });
    
    localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(newLeads));
  },

  reset: () => {
    localStorage.clear();
    window.location.reload();
  }
};

// Initialize DB on load
db.init();