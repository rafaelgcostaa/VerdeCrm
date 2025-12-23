import React, { useState } from 'react';
import { SYSTEM_API_KEY } from '../constants';

interface SettingsProps {
  onSimulateWebhook: (data: any, apiKey: string) => Promise<{ success: boolean; error?: string }>;
}

export const Settings: React.FC<SettingsProps> = ({ onSimulateWebhook }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'api'>('api');
  const [showKey, setShowKey] = useState(false);
  
  // Simulator State
  const [apiKeyInput, setApiKeyInput] = useState(SYSTEM_API_KEY);
  const [jsonInput, setJsonInput] = useState(`{
  "nome": "Cliente VIP",
  "telefone": "5511988887777",
  "email": "vip@empresa.com",
  "mensagem": "Interesse no plano Enterprise",
  "origem": "Facebook Ads",
  "campanha": "Q4 High Ticket"
}`);
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSimulate = async () => {
    setSimulationStatus('loading');
    setErrorMessage('');
    
    try {
      const data = JSON.parse(jsonInput);
      const result = await onSimulateWebhook(data, apiKeyInput);
      
      if (result.success) {
        setSimulationStatus('success');
        setTimeout(() => setSimulationStatus('idle'), 3000);
      } else {
        setSimulationStatus('error');
        setErrorMessage(result.error || 'Erro desconhecido');
      }
    } catch (e) {
      setSimulationStatus('error');
      setErrorMessage('JSON Inválido. Verifique a sintaxe.');
    }
  };

  const handleResetDB = () => {
      if(confirm('Tem certeza? Isso apagará todos os leads criados e restaurará o padrão.')) {
          localStorage.clear();
          window.location.reload();
      }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado para área de transferência!");
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Configurações</h2>
        <div className="text-xs text-neutral-400 font-mono">
            Vercel Env: <span className="text-green-600 font-bold">Production</span>
        </div>
      </div>

      <div className="flex border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'api'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Integração API & n8n
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Geral & Dados
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Zona de Perigo</h3>
                <p className="text-sm text-neutral-500 mb-4">Resetar o banco de dados local irá restaurar os leads de exemplo.</p>
                <button 
                    onClick={handleResetDB}
                    className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm"
                >
                    Resetar Database (LocalStorage)
                </button>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* API Key Section */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
             <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">key</span>
                        Chave de API (Authorization)
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">Use esta chave no cabeçalho <code>Authorization</code> do seu n8n HTTP Request.</p>
                </div>
             </div>
             
             <div className="mt-4 flex items-center gap-3">
                 <div className="flex-1 bg-neutral-900 rounded-lg px-4 py-3 font-mono text-sm text-neutral-300 flex items-center justify-between">
                     <span>{showKey ? SYSTEM_API_KEY : '••••••••••••••••••••••••••••••••••••••'}</span>
                     <button onClick={() => setShowKey(!showKey)} className="text-neutral-500 hover:text-white">
                        <span className="material-symbols-outlined text-lg">{showKey ? 'visibility_off' : 'visibility'}</span>
                     </button>
                 </div>
                 <button 
                    onClick={() => copyToClipboard(SYSTEM_API_KEY)}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
                 >
                    <span className="material-symbols-outlined text-lg">content_copy</span>
                    Copiar
                 </button>
             </div>
          </div>

          {/* Documentation Section */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-primary-600">cloud_upload</span>
              Endpoint de Entrada
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                <div className="lg:col-span-2 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Method & URL</label>
                        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-3 font-mono text-sm text-white">
                        <span className="text-green-400 font-bold">POST</span>
                        <span className="flex-1 opacity-80">https://rafaocrm.vercel.app/api/leads/inbound</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Headers Obrigatórios</label>
                        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-mono text-xs text-neutral-600 space-y-1">
                            <div className="flex justify-between border-b border-neutral-200 pb-1 mb-1">
                                <span>Content-Type</span>
                                <span className="text-neutral-900">application/json</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Authorization</span>
                                <span className="text-green-700 font-bold">Bearer {SYSTEM_API_KEY}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Campos JSON
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                        <li><strong>nome</strong> (Obrigatório)</li>
                        <li><strong>telefone</strong> (Obrigatório)</li>
                        <li>email</li>
                        <li>origem (Ex: WhatsApp)</li>
                        <li>campanha</li>
                        <li>mensagem</li>
                    </ul>
                </div>
            </div>
          </div>

          {/* Simulator Section */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900">Console de Teste (Simulador)</h3>
                <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded text-neutral-600">Ambiente: Localhost</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Simular Authorization Header</label>
                    <input 
                        type="text" 
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-xs text-neutral-700 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">Altere este valor para testar o erro 401 Unauthorized.</p>
                 </div>
                <div className="relative">
                    <div className="absolute top-0 right-0 px-2 py-1 bg-neutral-800 text-neutral-400 text-[10px] rounded-bl-lg rounded-tr-lg">JSON Body</div>
                    <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-48 font-mono text-sm bg-neutral-900 text-green-400 p-4 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    spellCheck={false}
                    />
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 mb-4 flex-1">
                    <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Log de Resposta</p>
                    {simulationStatus === 'idle' && <p className="text-sm text-neutral-400 italic">Aguardando envio...</p>}
                    {simulationStatus === 'loading' && <p className="text-sm text-primary-600 animate-pulse">Processando requisição...</p>}
                    {simulationStatus === 'success' && (
                        <div className="text-sm text-green-700">
                            <p className="font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check</span> 200 OK</p>
                            <pre className="mt-2 text-xs opacity-80">{`{\n  "success": true,\n  "lead_id": "uuid..."\n}`}</pre>
                        </div>
                    )}
                    {simulationStatus === 'error' && (
                        <div className="text-sm text-red-700">
                            <p className="font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> {errorMessage.includes('Auth') ? '401 Unauthorized' : '400 Bad Request'}</p>
                            <pre className="mt-2 text-xs opacity-80 whitespace-pre-wrap">{`{\n  "error": "${errorMessage}"\n}`}</pre>
                        </div>
                    )}
                </div>
                
                <button
                  onClick={handleSimulate}
                  disabled={simulationStatus === 'loading' || simulationStatus === 'success'}
                  className={`w-full py-3 rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                    simulationStatus === 'success' 
                      ? 'bg-green-500 text-white cursor-default'
                      : simulationStatus === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  } disabled:opacity-70`}
                >
                  {simulationStatus === 'loading' ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : simulationStatus === 'success' ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      Lead Criado
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Enviar POST Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};