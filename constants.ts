import { Tag, Lead, Automation } from './types';

export const SYSTEM_API_KEY = "sk_live_vrm_9823_secure_x1y2z3";

export const INITIAL_TAGS: Tag[] = [
  { id: 't1', name: 'Novo Lead', color: 'bg-blue-100 text-blue-800', type: 'automatic', isKanbanColumn: true },
  { id: 't2', name: 'Facebook Ads', color: 'bg-indigo-100 text-indigo-800', type: 'automatic', isKanbanColumn: true },
  { id: 't3', name: 'WhatsApp', color: 'bg-green-100 text-green-800', type: 'automatic', isKanbanColumn: true },
  { id: 't4', name: 'Lead Quente', color: 'bg-orange-100 text-orange-800', type: 'manual', isKanbanColumn: true },
  { id: 't5', name: 'Cliente', color: 'bg-emerald-100 text-emerald-800', type: 'manual', isKanbanColumn: true },
  { id: 't6', name: 'Sem Resposta', color: 'bg-gray-200 text-gray-700', type: 'manual', isKanbanColumn: false },
  { id: 't7', name: 'Reunião Agendada', color: 'bg-purple-100 text-purple-800', type: 'manual', isKanbanColumn: false },
];

export const INITIAL_LEADS: Lead[] = [
  { id: 'l1', name: 'João Silva', phone: '+55 11 99999-1234', email: 'joao.silva@gmail.com', source: 'Facebook Ads', createdAt: '2023-10-25', tags: ['t1', 't2', 't4'], company: 'Silva Comércio', campaign: 'Black Friday 2023', message: 'Tenho interesse no plano anual.' },
  { id: 'l2', name: 'Maria Souza', phone: '+55 21 98888-5678', email: 'maria.s@hotmail.com', source: 'WhatsApp', createdAt: '2023-10-26', tags: ['t1', 't3'], company: 'Souza Design', campaign: 'Instagram Orgânico', message: 'Gostaria de saber preços.' },
  { id: 'l3', name: 'Carlos Oliveira', phone: '+55 31 97777-4321', email: 'carlos.oliveira@empresa.com.br', source: 'Indicação', createdAt: '2023-10-24', tags: ['t5'], company: 'Tech Solutions', campaign: 'Indicação Clientes', message: 'Já conversamos por telefone.' },
  { id: 'l4', name: 'Ana Pereira', phone: '+55 41 96666-8765', email: 'ana.p@outlook.com', source: 'Instagram', createdAt: '2023-10-27', tags: ['t1', 't6'], company: 'Freelancer', campaign: 'Ads Stories', message: 'Como funciona a integração?' },
  { id: 'l5', name: 'Roberto Santos', phone: '+55 11 95555-0987', email: 'beto@santos.adv.br', source: 'Facebook Ads', createdAt: '2023-10-27', tags: ['t2', 't4', 't7'], company: 'Santos Adv', campaign: 'Google Search Institucional', message: 'Preciso de um CRM urgente.' },
];

export const INITIAL_AUTOMATIONS: Automation[] = [
  { id: 'a1', name: 'Disparo Inicial WhatsApp', trigger: 'lead_created', webhookUrl: 'https://n8n.meudominio.com/webhook/lead-novo', active: true, lastRun: '10 min atrás', status: 'healthy' },
  { id: 'a2', name: 'Sincronizar Pipedrive', trigger: 'stage_changed', webhookUrl: 'https://n8n.meudominio.com/webhook/update-crm', active: true, lastRun: '1h atrás', status: 'healthy' },
  { id: 'a3', name: 'Notificar Slack Venda', trigger: 'tag_added', webhookUrl: 'https://n8n.meudominio.com/webhook/venda-fechada', active: false, lastRun: '2 dias atrás', status: 'idle' },
];