import React, { useState } from 'react';
import { Lead } from '../types';

interface SettingsProps {
  onSimulateWebhook: (data: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSimulateWebhook }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'api'>('api');
  const [jsonInput, setJsonInput] = useState(`{
  "nome": "Novo Lead Teste",
  "telefone": "5511999990000",
  "email": "teste@exemplo.com",
  "mensagem": "Olá, vim pelo anúncio do Facebook.",
  "origem": "Facebook Ads",
  "campanha": "Promoção de Verão"
}`);
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSimulate = () => {
    try {
      const data = JSON.parse(jsonInput);
      onSimulateWebhook(data);
      setSimulationStatus('success');
      setTimeout(() => setSimulationStatus('idle'), 3000);
    } catch (e) {
      setSimulationStatus('error');
      setTimeout(() => setSimulationStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">Configurações</h2>

      <div className="flex border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Geral
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'api'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Integração API (Entrada de Leads)
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500">
          <span className="material-symbols-outlined text-4xl mb-2 text-neutral-300">build</span>
          <p>Configurações gerais da conta (nome, logo, usuários) estariam aqui.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Documentation Section */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-600">webhook</span>
              Recebimento de Leads (Incoming Webhook)
            </h3>
            <p className="text-sm text-neutral-600 mb-6">
              Para integrar com n8n, Zapier ou Typeform, envie uma requisição <strong>POST</strong> para o endpoint abaixo. 
              Os leads serão criados automaticamente no Kanban com a etiqueta "Novo Lead".
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Endpoint URL</label>
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-mono text-sm text-neutral-700">
                  <span className="text-green-600 font-bold">POST</span>
                  <span className="flex-1">https://api.verdecrm.com/v1/leads/inbound</span>
                  <button className="text-neutral-400 hover:text-primary-600">
                    <span className="material-symbols-outlined text-lg">content_copy</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Header de Autenticação</label>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-mono text-sm text-neutral-700">
                  Authorization: Bearer <span className="blur-sm select-none">sk_live_123456789</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simulator Section */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Simulador de Webhook</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Teste a criação de leads simulando uma requisição vinda do n8n.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Payload JSON</label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-64 font-mono text-sm bg-neutral-900 text-green-400 p-4 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  spellCheck={false}
                />
                <div className="mt-2 text-xs text-neutral-400 flex justify-between">
                    <span>Campos suportados: nome, telefone, email, mensagem, origem, campanha</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-start space-y-4 bg-neutral-50 rounded-lg p-6 border border-neutral-200 border-dashed">
                <p className="text-sm text-neutral-600">
                  Ao clicar em enviar, o sistema processará o JSON e criará um card na coluna <strong>Novo Lead</strong> do Kanban, simulando exatamente o comportamento da API.
                </p>
                
                <button
                  onClick={handleSimulate}
                  disabled={simulationStatus === 'success'}
                  className={`px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 ${
                    simulationStatus === 'success' 
                      ? 'bg-green-500 text-white cursor-default'
                      : simulationStatus === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {simulationStatus === 'success' ? (
                    <>
                      <span className="material-symbols-outlined">check</span>
                      Sucesso! Lead Criado
                    </>
                  ) : simulationStatus === 'error' ? (
                    <>
                      <span className="material-symbols-outlined">error</span>
                      JSON Inválido
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Enviar POST Request
                    </>
                  )}
                </button>
                
                {simulationStatus === 'success' && (
                  <p className="text-xs text-green-600 font-medium animate-pulse">
                    Verifique o Dashboard ou Kanban para ver o novo lead.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};