import React from 'react';
import { Tag } from '../types';

interface TagManagerProps {
  tags: Tag[];
}

export const TagManager: React.FC<TagManagerProps> = ({ tags }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-neutral-900">Gerenciamento de Etiquetas</h2>
            <p className="text-neutral-500 mt-1">Controle as etiquetas que organizam seu funil e segmentam seus leads.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Nova Etiqueta
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Nome da Etiqueta</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">Kanban</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-neutral-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
                {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tag.color}`}>
                                    {tag.name}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {tag.type === 'automatic' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                                    <span className="material-symbols-outlined text-[14px] mr-1 text-neutral-500">lock</span>
                                    Automática
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                    Manual
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {tag.isKanbanColumn ? (
                                <span className="flex items-center text-sm text-green-600 font-medium">
                                    <span className="material-symbols-outlined text-[18px] mr-1">check_circle</span>
                                    Coluna Ativa
                                </span>
                            ) : (
                                <span className="text-sm text-neutral-400">Oculto</span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {tag.type === 'manual' ? (
                                <div className="flex justify-end gap-2">
                                    <button className="text-primary-600 hover:text-primary-900 p-1 hover:bg-primary-50 rounded">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            ) : (
                                <span className="text-neutral-400 text-xs italic">Bloqueado pelo sistema</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};