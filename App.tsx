import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadProfile } from './components/LeadProfile';
import { Automations } from './components/Automations';
import { TagManager } from './components/TagManager';
import { Settings } from './components/Settings';
import { NewLeadModal } from './components/NewLeadModal';
import { INITIAL_TAGS, INITIAL_LEADS, INITIAL_AUTOMATIONS } from './constants';
import { Page, Lead, Tag } from './types';

function App() {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // App State
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const automations = INITIAL_AUTOMATIONS;

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    if (page !== Page.LEAD_PROFILE) {
        setSelectedLead(null);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setActivePage(Page.LEAD_PROFILE);
  };

  // Logic to move a lead between columns
  const handleLeadMove = (leadId: string, newColumnTagId: string) => {
    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id !== leadId) return lead;

      // Remove any existing column tags
      const columnTagIds = tags.filter(t => t.isKanbanColumn).map(t => t.id);
      const otherTags = lead.tags.filter(tId => !columnTagIds.includes(tId));
      
      // Add the new column tag
      return {
        ...lead,
        tags: [...otherTags, newColumnTagId]
      };
    }));
  };

  // Logic to add a new lead (Manual)
  const handleCreateLead = (data: any) => {
    const newLead: Lead = {
      id: `l${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      source: data.source,
      company: data.company,
      createdAt: new Date().toISOString().split('T')[0],
      // Default to first column (Novo Lead)
      tags: [tags[0].id] 
    };
    setLeads(prev => [newLead, ...prev]);
  };

  // Logic to simulate incoming webhook from N8N
  const handleWebhookSimulation = (data: any) => {
    const newLead: Lead = {
      id: `l-webhook-${Date.now()}`,
      name: data.nome,
      phone: data.telefone,
      email: data.email,
      source: data.origem,
      company: 'Empresa (Webhook)',
      campaign: data.campanha,
      message: data.mensagem,
      createdAt: new Date().toISOString().split('T')[0],
      // Apply logic based on prompt: "Novo Lead", "Facebook Ads" (if applicable), etc.
      tags: [tags[0].id] // Start in 'Novo Lead'
    };
    
    // Optional: Add extra tags based on source
    if (data.origem === 'Facebook Ads') {
        const fbTag = tags.find(t => t.name === 'Facebook Ads');
        if (fbTag) newLead.tags.push(fbTag.id);
    }
    if (data.origem === 'WhatsApp') {
        const wppTag = tags.find(t => t.name === 'WhatsApp');
        if (wppTag) newLead.tags.push(wppTag.id);
    }

    setLeads(prev => [newLead, ...prev]);
    // Optional: Auto-navigate to show result, or just let notification handle it
  };

  const renderContent = () => {
    if (selectedLead && activePage === Page.LEAD_PROFILE) {
        return <LeadProfile lead={selectedLead} allTags={tags} onBack={() => setActivePage(Page.KANBAN)} />;
    }

    switch (activePage) {
      case Page.DASHBOARD:
        return <Dashboard leads={leads} />;
      case Page.KANBAN:
        return <KanbanBoard 
            leads={leads} 
            tags={tags} 
            onLeadClick={handleLeadClick} 
            onLeadMove={handleLeadMove}
            onNewLead={() => setIsNewLeadModalOpen(true)}
        />;
      case Page.LEAD_PROFILE:
        return <div className="text-center py-20 text-neutral-500">Selecione um lead no Kanban para ver detalhes.</div>;
      case Page.TAGS:
        return <TagManager tags={tags} />;
      case Page.AUTOMATIONS:
        return <Automations automations={automations} />;
      case Page.SETTINGS:
        return <Settings onSimulateWebhook={handleWebhookSimulation} />;
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      {renderContent()}
      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => setIsNewLeadModalOpen(false)} 
        onSubmit={handleCreateLead}
      />
    </Layout>
  );
}

export default App;