import React from 'react';
import { Lead, Tag } from '../types';

interface LeadProfileProps {
  lead: Lead;
  allTags: Tag[];
  onBack: () => void;
}

export const LeadProfile: React.FC<LeadProfileProps> = ({ lead, allTags, onBack }) => {
  const activeTags = allTags.filter(t => lead.tags.includes(t.id));
  const autoTags = activeTags.filter(t => t.type === 'automatic');
  const manualTags = activeTags.filter(t => t.type === 'manual');

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center text-neutral-500 hover:text-neutral-800 mb-6 transition-colors">
        <span className="material-symbols-outlined mr-1">arrow_back</span>
        Voltar para lista
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary-600 to-green-400 relative">
                 <div className="absolute -bottom-10 left-8">
                    <div className="w-20 h-20 rounded-full border-4 border-white bg-neutral-200 flex items-center justify-center text-2xl font-bold text-neutral-500">
                        {lead.name.charAt(0)}
                    </div>
                 </div>
            </div>
            <div className="pt-12 px-8 pb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">{lead.name}</h1>
                        <p className="text-neutral-500">{lead.company || 'Sem empresa vinculada'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-sm hover:bg-primary-700 transition-colors">
                            Conversar
                        </button>
                        <button className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600">
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Telefone / WhatsApp</p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-600">chat</span>
                            <span className="text-neutral-900 font-medium">{lead.phone}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Email</p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-neutral-400">mail</span>
                            <span className="text-neutral-900 font-medium">{lead.email}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Origem</p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">ads_click</span>
                            <span className="text-neutral-900 font-medium">{lead.source}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-xs font-bold text-neutral-400 uppercase mb-1">Data Criação</p>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-neutral-400">calendar_today</span>
                            <span className="text-neutral-900 font-medium">{lead.createdAt}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <h3 className="font-bold text-lg text-neutral-800 mb-4">Histórico de Atividades</h3>
            <div className="space-y-6 pl-4 border-l-2 border-neutral-100">
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-white"></div>
                    <p className="text-sm font-medium text-neutral-900">Lead criado via {lead.source}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{lead.createdAt}</p>
                </div>
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                    <p className="text-sm font-medium text-neutral-900">Etiqueta "Novo Lead" aplicada automaticamente</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{lead.createdAt}</p>
                </div>
                 <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                    <p className="text-sm font-medium text-neutral-900">Mensagem automática enviada via WhatsApp</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{lead.createdAt}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tags */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                <h3 className="font-bold text-lg text-neutral-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-neutral-400">smart_toy</span>
                    Etiquetas Automáticas
                </h3>
                <div className="flex flex-wrap gap-2">
                    {autoTags.length > 0 ? autoTags.map(tag => (
                        <span key={tag.id} className={`px-3 py-1 rounded-full text-xs font-bold border ${tag.color.replace('bg-', 'border-').replace('text-', 'text-opacity-80 text-')} bg-opacity-10 cursor-default flex items-center gap-1`}>
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            {tag.name}
                        </span>
                    )) : (
                        <span className="text-sm text-neutral-400 italic">Nenhuma etiqueta automática.</span>
                    )}
                </div>
                <p className="text-xs text-neutral-400 mt-3">Gerenciadas pelo sistema n8n com base na origem e comportamento.</p>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-neutral-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-neutral-400">label</span>
                        Etiquetas Manuais
                    </h3>
                </div>
                
                <div className="relative mb-4">
                    <span className="absolute left-3 top-2.5 material-symbols-outlined text-neutral-400 text-lg">search</span>
                    <input 
                        type="text" 
                        placeholder="Adicionar etiqueta..." 
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {manualTags.map(tag => (
                        <span key={tag.id} className={`px-3 py-1 rounded-full text-xs font-bold ${tag.color} flex items-center gap-1 group cursor-pointer hover:opacity-80`}>
                            {tag.name}
                            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">close</span>
                        </span>
                    ))}
                    <button className="px-3 py-1 rounded-full border border-dashed border-neutral-300 text-neutral-400 text-xs font-medium hover:border-primary-400 hover:text-primary-600 transition-colors">
                        + Criar nova
                    </button>
                </div>
            </div>
            
            <div className="bg-neutral-100 rounded-xl p-4 border border-neutral-200">
                <h4 className="font-bold text-sm text-neutral-700 mb-2">Notas Internas</h4>
                <textarea 
                    className="w-full p-3 rounded-lg border border-neutral-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    rows={4}
                    placeholder="Escreva uma nota sobre este lead..."
                ></textarea>
                <button className="mt-2 w-full py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                    Salvar Nota
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};