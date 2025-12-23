import React from 'react';

export const Settings: React.FC = () => {
  const handleResetDB = () => {
      if(confirm('Tem certeza? Isso limpará o cache local (LocalStorage) e recarregará a página. Dados do Supabase não serão afetados.')) {
          localStorage.clear();
          window.location.reload();
      }
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-neutral-900">Configurações do Sistema</h2>
            <p className="text-neutral-500 mt-1">Gerencie preferências e dados locais.</p>
        </div>
        <div className="text-xs text-neutral-400 font-mono bg-neutral-100 px-3 py-1 rounded-full">
            Versão: <span className="text-neutral-900 font-bold">2.0 (Supabase Driven)</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Section */}
        <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600">cloud_done</span>
                Status da Conexão
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800 font-bold mb-1">Supabase Realtime</p>
                    <p className="text-xs text-green-600">Ativo e escutando por novos leads.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800 font-bold mb-1">Sincronização Automática</p>
                    <p className="text-xs text-blue-600">Polling a cada 60 segundos.</p>
                </div>
            </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                Zona de Perigo
            </h3>
            <p className="text-sm text-neutral-500 mb-6">Ações aqui afetam o comportamento local da sua aplicação.</p>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div>
                    <p className="font-bold text-red-900 text-sm">Limpar Cache Local</p>
                    <p className="text-xs text-red-700 mt-1">Remove configurações salvas no navegador (não apaga leads do banco).</p>
                </div>
                <button 
                    onClick={handleResetDB}
                    className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors shadow-sm"
                >
                    Resetar Aplicação
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};