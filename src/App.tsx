import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadProfile } from './components/LeadProfile';
import { Automations } from './components/Automations';
import { TagManager } from './components/TagManager';
import { Settings } from './components/Settings';
import { INITIAL_AUTOMATIONS } from './constants';
import { Page, Lead, Tag } from './types';
import { db } from './services/database';
import { supabase } from './services/supabaseClient';

function App() {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // App State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // In a real app, this would be fetched too
  const automations = INITIAL_AUTOMATIONS;

  // Função centralizada de carregamento de dados
  const fetchLeadsData = async (background = false) => {
    if (!background) setIsLoading(true);
    try {
      const [fetchedLeads, fetchedTags] = await Promise.all([
        db.getLeads(),
        db.getTags()
      ]);
      setLeads(fetchedLeads);
      if (!background) setTags(fetchedTags);
      setLastSync(new Date());
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
    } finally {
      if (!background) setIsLoading(false);
    }
  };

  // 1. Initial Load & Realtime Subscription
  useEffect(() => {
    fetchLeadsData();

    // Inscreve no Realtime do Supabase
    const subscription = db.subscribeToLeads(
      (newLead) => {
        setLeads(prev => {
          // Evita duplicatas caso o polling tenha acabado de rodar
          if (prev.some(l => l.id === newLead.id)) return prev;
          return [newLead, ...prev];
        });
      },
      (updatedLead) => {
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
      }
    );

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // 2. Polling Fallback (60s)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('🔄 Polling automático executando...');
      fetchLeadsData(true);
    }, 60000); // 60 segundos

    return () => clearInterval(intervalId);
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
    try {
      await db.moveLeadStage(leadId, newColumnTagId);
    } catch (e) {
      // Revert Optimistic UI if failed (Opcional: Adicionar toast de erro)
      console.error("Falha ao mover card, revertendo UI...");
      fetchLeadsData(true); 
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-neutral-500 text-sm animate-pulse">Sincronizando com Supabase...</p>
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
            onRefresh={() => fetchLeadsData(true)}
            lastSync={lastSync}
        />;
      case Page.LEAD_PROFILE:
        return <div className="text-center py-20 text-neutral-500">Selecione um lead no Kanban para ver detalhes.</div>;
      case Page.TAGS:
        return <TagManager tags={tags} />;
      case Page.AUTOMATIONS:
        return <Automations automations={automations} />;
      case Page.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
}

export default App;