import React, { useState } from 'react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
    { id: Page.KANBAN, label: 'Kanban', icon: 'view_kanban' },
    { id: Page.LEAD_PROFILE, label: 'Leads', icon: 'group' }, // Using Lead Profile as generic list for simplicity in this demo
    { id: Page.TAGS, label: 'Etiquetas', icon: 'label' },
    { id: Page.AUTOMATIONS, label: 'Automações (n8n)', icon: 'webhook' },
    { id: Page.SETTINGS, label: 'Configurações', icon: 'settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-neutral-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col flex-shrink-0 z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-primary-700">
            <span className="material-symbols-outlined text-3xl icon-filled">eco</span>
            <span className="font-bold text-xl tracking-tight text-neutral-800">Verde CRM</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activePage === item.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <span className={`material-symbols-outlined ${activePage === item.id ? 'icon-filled' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-1">Status do Sistema</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
              <span className="text-sm font-bold">n8n Conectado</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 bg-grid-pattern relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-neutral-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center text-neutral-500 text-sm">
             <span className="material-symbols-outlined mr-2">domain</span>
             <span>Workspace Principal</span>
             <span className="mx-2">/</span>
             <span className="font-medium text-neutral-800">
                {navItems.find(i => i.id === activePage)?.label}
             </span>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2 text-neutral-400 hover:text-primary-600 transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             
             <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-neutral-900">Admin User</p>
                    <p className="text-xs text-neutral-500">admin@verde.crm</p>
                  </div>
                  <img 
                    src="https://picsum.photos/100/100" 
                    alt="User" 
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                  <span className="material-symbols-outlined text-neutral-400">expand_more</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 text-sm font-medium text-neutral-700 animate-fade-in z-50">
                    <a href="#" className="block px-4 py-2 hover:bg-neutral-50">Perfil</a>
                    <a href="#" className="block px-4 py-2 hover:bg-neutral-50">Configurações</a>
                    <div className="h-px bg-neutral-100 my-1"></div>
                    <a href="#" className="block px-4 py-2 hover:bg-neutral-50 text-red-600">Sair</a>
                  </div>
                )}
             </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};