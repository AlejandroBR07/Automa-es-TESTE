import React from 'react';
import { InfoIcon } from './Icons';

const Instructions: React.FC = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-teal-500/20 rounded-lg p-6 mt-4 text-gray-300">
      <h3 className="text-lg font-semibold text-white flex items-center mb-3">
        <InfoIcon />
        <span className="ml-2">Como carregar seus dados</span>
      </h3>
      <p className="mb-4">
        Como sua planilha é restrita, a forma mais segura e fácil de carregar os dados é copiando e colando diretamente aqui. Siga os passos:
      </p>
      <ol className="list-decimal list-inside space-y-2">
        <li>Abra a sua planilha no Google Sheets.</li>
        <li>Clique no pequeno quadrado no canto superior esquerdo (entre o 'A' da coluna e o '1' da linha) para <strong className="text-teal-400">selecionar todos os dados</strong>.</li>
        <li>Copie os dados selecionados (use o atalho <strong className="text-teal-400">Ctrl+C</strong> ou <strong className="text-teal-400">Cmd+C</strong>).</li>
        <li>Volte para esta página e cole os dados na caixa de texto abaixo (use o atalho <strong className="text-teal-400">Ctrl+V</strong> ou <strong className="text-teal-400">Cmd+V</strong>).</li>
        <li>Clique no botão <strong className="text-green-500">Carregar Dados</strong>.</li>
      </ol>
      <p className="mt-4 text-sm text-yellow-400/80">
        <strong>Privacidade garantida:</strong> Os dados que você cola ficam apenas no seu navegador e não são enviados para nenhum servidor. É totalmente seguro.
      </p>
    </div>
  );
};

export default Instructions;