export interface Tag {
  id: string;
  name: string;
  color: string;
  type: 'automatic' | 'manual';
  isKanbanColumn: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  createdAt: string;
  tags: string[]; // Array of Tag IDs
  avatar?: string;
  company?: string;
  campaign?: string;
  message?: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: 'lead_created' | 'tag_added' | 'stage_changed';
  webhookUrl: string;
  active: boolean;
  lastRun?: string;
  status: 'healthy' | 'error' | 'idle';
}

export enum Page {
  DASHBOARD = 'dashboard',
  KANBAN = 'kanban',
  LEAD_PROFILE = 'lead_profile',
  AUTOMATIONS = 'automations',
  TAGS = 'tags',
  SETTINGS = 'settings'
}