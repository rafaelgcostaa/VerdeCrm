import React from 'react';
import { Lead } from '../types';

interface DashboardProps {
  leads: Lead[];
}

export const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const stats = [
    { label: 'Total de Leads', value: leads.length, icon: 'groups', color: 'bg-blue-50 text-blue-600' },
    { label: 'Leads Hoje', value: 12, icon: 'today', color: 'bg-green-50 text-green-600', trend: '+20%' },
    { label: 'Leads Quentes', value: leads.filter(l => l.tags.includes('t4')).length, icon: 'local_fire_department', color: 'bg-orange-50 text-orange-600' },
    { label: 'Taxa de Conversão', value: '4.2%', icon: 'trending_up', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Visão Geral</h2>
        <p className="text-neutral-500 mt-1">Bem-vindo de volta! Aqui está o resumo do seu pipeline hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-neutral-900">{stat.value}</h3>
              {stat.trend && (
                <span className="text-xs font-medium text-green-600 flex items-center mt-2">
                  <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
                  {stat.trend} vs ontem
                </span>
              )}
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <span className="material-symbols-outlined icon-filled">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-neutral-800">Atividade Recente</h3>
            <button className="text-sm text-primary-600 font-medium hover:underline">Ver tudo</button>
          </div>
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-start gap-4 p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-neutral-100">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      Novo lead <span className="font-bold">Ricardo M.</span> entrou via WhatsApp
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">Há {i * 15} minutos • Campanha Black Friday</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Novo</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-neutral-800 mb-6">Pipeline Rápido</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm font-medium">Novo Lead</span>
                </div>
                <span className="font-bold text-neutral-900">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-sm font-medium">Em Negociação</span>
                </div>
                <span className="font-bold text-neutral-900">5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-sm font-medium">Fechado</span>
                </div>
                <span className="font-bold text-neutral-900">28</span>
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                Ir para Kanban
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};