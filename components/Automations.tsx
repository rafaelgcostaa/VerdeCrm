import React, { useState } from 'react';
import { Automation } from '../types';

interface AutomationsProps {
  automations: Automation[];
}

export const Automations: React.FC<AutomationsProps> = ({ automations }) => {
  const [localAutomations, setLocalAutomations] = useState(automations);

  const toggleAutomation = (id: string) => {
    setLocalAutomations(prev => prev.map(a => 
        a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Automações e Integrações</h2>
        <p className="text-neutral-500 mt-1">Configure os Webhooks para conectar seu CRM ao n8n e criar fluxos inteligentes.</p>
      </div>

      <div className="space-y-6">
        {localAutomations.map(auto => (
          <div key={auto.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
             <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-lg ${auto.active ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-400'}`}>
                            <span className="material-symbols-outlined icon-filled">
                                {auto.trigger === 'lead_created' ? 'person_add' : auto.trigger === 'stage_changed' ? 'move_down' : 'label'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900">{auto.name}</h3>
                            <p className="text-sm text-neutral-500">
                                Dispara quando: <span className="font-medium text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                                    {auto.trigger === 'lead_created' ? 'Novo Lead Criado' : auto.trigger === 'stage_changed' ? 'Card Movido no Kanban' : 'Etiqueta Adicionada'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${auto.status === 'healthy' ? 'bg-green-100 text-green-700' : auto.status === 'idle' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'}`}>
                            {auto.status === 'healthy' ? 'Online' : auto.status === 'idle' ? 'Inativo' : 'Erro'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={auto.active} onChange={() => toggleAutomation(auto.id)} />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Webhook URL (POST)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={auto.webhookUrl} 
                            readOnly
                            className="flex-1 bg-white border border-neutral-300 text-neutral-600 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 font-mono"
                        />
                        <button className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
                            Testar
                        </button>
                    </div>
                    {auto.lastRun && (
                        <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">history</span>
                            Última execução: {auto.lastRun}
                        </p>
                    )}
                </div>
             </div>
             
             {/* Response Feedback Area */}
             {auto.status === 'healthy' && (
                 <div className="bg-green-50 border-t border-green-100 px-6 py-2 flex items-center gap-2 text-xs text-green-700">
                     <span className="material-symbols-outlined text-sm">check_circle</span>
                     <span>Webhook respondendo com status 200 OK</span>
                 </div>
             )}
          </div>
        ))}

        <button className="w-full py-4 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add_circle</span>
            Adicionar Novo Gatilho
        </button>
      </div>
    </div>
  );
};