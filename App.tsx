import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadProfile } from './components/LeadProfile';
import { Automations } from './components/Automations';
import { TagManager } from './components/TagManager';
import { Settings } from './components/Settings';
import { NewLeadModal } from './components/NewLeadModal';
import { INITIAL_TAGS, INITIAL_AUTOMATIONS } from './constants';
import { Page, Lead, Tag } from './types';
import { db } from './services/database';
import { processInboundLead } from './api/webhook';

function App() {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // App State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // In a real app, this would be fetched too
  const automations = INITIAL_AUTOMATIONS;

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [fetchedLeads, fetchedTags] = await Promise.all([
        db.getLeads(),
        db.getTags()
      ]);
      setLeads(fetchedLeads);
      setTags(fetchedTags);
      setIsLoading(false);
    };
    loadData();
  }, []);

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
  const handleLeadMove = async (leadId: string, newColumnTagId: string) => {
    // Optimistic UI Update
    setLeads(prevLeads => prevLeads.map(lead => {
      if (lead.id !== leadId) return lead;
      const columnTagIds = tags.filter(t => t.isKanbanColumn).map(t => t.id);
      const otherTags = lead.tags.filter(tId => !columnTagIds.includes(tId));
      return { ...lead, tags: [...otherTags, newColumnTagId] };
    }));

    // Persist to DB
    await db.moveLeadStage(leadId, newColumnTagId, tags);
  };

  // Logic to add a new lead (Manual)
  const handleCreateLead = async (data: any) => {
    const newLead: Lead = {
      id: `l${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      source: data.source,
      company: data.company,
      createdAt: new Date().toISOString().split('T')[0],
      tags: [tags[0].id] // Default to first column
    };
    
    // Optimistic Update
    setLeads(prev => [newLead, ...prev]);
    // Persist
    await db.createLead(newLead);
  };

  // Logic to simulate incoming webhook from N8N (via Settings Page)
  const handleWebhookSimulation = async (data: any, apiKey: string) => {
    // Call the simulated API endpoint with the provided Key
    const response = await processInboundLead(data, apiKey);
    
    if (response.success) {
        // Refresh data to show new lead
        const updatedLeads = await db.getLeads();
        setLeads(updatedLeads);
        return { success: true };
    } else {
        return { success: false, error: response.error };
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

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