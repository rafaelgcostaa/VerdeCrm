import React, { useState } from 'react';
import { Lead, Tag } from '../types';

interface KanbanBoardProps {
  leads: Lead[];
  tags: Tag[];
  onLeadClick: (lead: Lead) => void;
  onLeadMove: (leadId: string, newTagId: string) => void;
  onRefresh: () => void;
  lastSync: Date;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, tags, onLeadClick, onLeadMove, onRefresh, lastSync }) => {
  // Filter tags that are kanban columns
  const columns = tags.filter(t => t.isKanbanColumn);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper to get leads for a column
  const getLeadsForColumn = (tagId: string) => {
    return leads.filter(lead => lead.tags.includes(tagId));
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData('leadId', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      onLeadMove(leadId, columnId);
    }
    setDraggedLeadId(null);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-neutral-900">Pipeline de Vendas</h2>
            <div className="flex items-center gap-2 mt-1">
                 <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-green-400 animate-pulse' : 'bg-green-500'}`}></span>
                 <p className="text-xs text-neutral-500">
                    Sincronizado: {lastSync.toLocaleTimeString()} • Realtime Ativo
                 </p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4">
                {[1,2,3].map(i => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://picsum.photos/id/${i+50}/100/100`} alt="User" />
                ))}
            </div>
            
            <button 
                onClick={handleManualRefresh}
                className={`bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all ${isRefreshing ? 'opacity-70 cursor-wait' : ''}`}
                disabled={isRefreshing}
            >
                <span className={`material-symbols-outlined text-lg ${isRefreshing ? 'animate-spin' : ''}`}>sync</span>
                Atualizar Leads
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full gap-6 min-w-max">
          {columns.map(col => {
            const colLeads = getLeadsForColumn(col.id);
            return (
              <div 
                key={col.id} 
                className="w-80 flex flex-col bg-neutral-100/50 rounded-xl border border-neutral-200/60 max-h-full transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-neutral-200/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${col.type === 'automatic' ? 'bg-neutral-400' : 'bg-primary-500'}`}></div>
                    <span className="font-bold text-neutral-700 text-sm">{col.name}</span>
                    <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium text-neutral-500 border border-neutral-200">{colLeads.length}</span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {colLeads.length === 0 ? (
                     <div className="h-24 border-2 border-dashed border-neutral-200 rounded-lg flex items-center justify-center text-neutral-400 text-sm">
                        Vazio
                     </div>
                  ) : (
                    colLeads.map(lead => (
                        <div 
                            key={lead.id} 
                            onClick={() => onLeadClick(lead)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            className={`bg-white p-4 rounded-lg shadow-sm border border-neutral-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary-300 transition-all group ${draggedLeadId === lead.id ? 'opacity-50' : ''}`}
                        >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-neutral-800 text-sm truncate pr-2">{lead.name}</span>
                            {/* Source Icon */}
                            <span className="text-neutral-400 flex-shrink-0" title={lead.source}>
                                {lead.source.includes('WhatsApp') ? (
                                    <span className="material-symbols-outlined text-green-500 text-sm">chat</span>
                                ) : lead.source.includes('Facebook') ? (
                                    <span className="material-symbols-outlined text-blue-600 text-sm">public</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm">link</span>
                                )}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-neutral-500 text-xs mb-3">
                            <span className="material-symbols-outlined text-sm">business</span>
                            <span className="truncate">{lead.company || 'Sem empresa'}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {lead.tags.filter(tid => tid !== col.id).slice(0, 2).map(tid => {
                                const t = tags.find(tag => tag.id === tid);
                                if(!t) return null;
                                return (
                                    <span key={tid} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] uppercase font-bold rounded">
                                        {t.name}
                                    </span>
                                )
                            })}
                             {lead.tags.length > 3 && (
                                <span className="px-1.5 py-0.5 bg-neutral-50 text-neutral-400 text-[10px] rounded">+{lead.tags.length - 1}</span>
                             )}
                        </div>

                        <div className="flex items-center justify-between border-t border-neutral-50 pt-3 mt-1">
                            <div className="flex gap-2">
                                <button className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                                    <span className="material-symbols-outlined text-sm">call</span>
                                </button>
                                <button className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                </button>
                            </div>
                            <span className="text-[10px] text-neutral-400">{lead.createdAt}</span>
                        </div>
                        </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};