import React, { useState, useMemo } from 'react';
import { Automation } from '../types';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, SortAscIcon, SortDescIcon } from './Icons';

interface AutomationTableProps {
  automations: Automation[];
  onAnalyze: (automation: Automation) => void;
}

type SortKey = 'conexao' | 'nome' | 'desativado';

const AutomationTable: React.FC<AutomationTableProps> = ({ automations, onAnalyze }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);

  const sortedAutomations = useMemo(() => {
    let sortableItems = [...automations];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          // FIX: Corrected typo from `sort-config` to `sortConfig`
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [automations, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <SortAscIcon /> : <SortDescIcon />;
  };

  const Th = ({ sortKey, label }: { sortKey: SortKey, label: string }) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer select-none"
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        {getSortIcon(sortKey)}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto bg-slate-800/50 backdrop-blur-sm border border-teal-500/20 rounded-lg shadow-xl">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-900/70">
          <tr>
            <Th sortKey="conexao" label="Conexão" />
            <Th sortKey="nome" label="Nome da Automação" />
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Função</th>
            <Th sortKey="desativado" label="Status" />
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Analisar</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {sortedAutomations.map((automation, index) => (
            <tr key={`${automation.nome}-${index}`} className="hover:bg-slate-700/50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-300">{automation.conexao}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{automation.nome}</td>
              <td className="px-6 py-4 text-sm text-gray-400 max-w-sm truncate" title={automation.funcao}>{automation.funcao}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${automation.desativado ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                    {automation.desativado ? <XCircleIcon /> : <CheckCircleIcon />}
                    {automation.desativado ? 'Desativado' : 'Ativo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                    onClick={() => onAnalyze(automation)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-teal-600/50 text-teal-200 rounded-md hover:bg-teal-600/80 hover:text-white transition-all duration-200"
                >
                    <SparklesIcon /> Analisar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AutomationTable;