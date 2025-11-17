import React, { useState } from 'react';
import { Automation } from '../types.ts';
import { analyzeAutomationWithGemini } from '../services/geminiService.ts';
import { CheckCircleIcon, XCircleIcon, SparklesIcon } from './Icons.tsx';

interface AutomationCardProps {
  automation: Automation;
}

const AutomationCard: React.FC<AutomationCardProps> = ({ automation }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzeClick = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      const result = await analyzeAutomationWithGemini(automation);
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisError("Falha ao obter análise.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderMarkdown = (text: string) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <div className="bg-slate-800/70 rounded-lg shadow-lg p-6 border border-slate-700 hover:border-teal-400 hover:shadow-teal-500/10 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-teal-400 font-medium">{automation.conexao}</p>
          <h3 className="text-xl font-bold text-white mt-1">{automation.nome}</h3>
          {automation.pasta && <p className="text-xs text-gray-400 mt-1">Pasta: {automation.pasta}</p>}
        </div>
        <div className="flex space-x-3 text-sm">
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${automation.desativado ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {automation.desativado ? <XCircleIcon /> : <CheckCircleIcon />}
            {automation.desativado ? 'Desativado' : 'Ativo'}
          </span>
        </div>
      </div>
      <p className="text-gray-300 mt-4 text-sm h-16 overflow-y-auto">{automation.funcao}</p>
      <div className="mt-6">
        <button
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-800 disabled:cursor-not-allowed shadow-md shadow-teal-900/50"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analisando...
            </>
          ) : (
            <>
              <SparklesIcon />
              Analisar com IA
            </>
          )}
        </button>
      </div>
      {analysisResult && (
        <div className="mt-4 p-4 bg-slate-900/70 border border-slate-700 rounded-md text-gray-300 text-sm">
          <h4 className="font-bold text-white mb-2">Análise da IA:</h4>
          <div dangerouslySetInnerHTML={renderMarkdown(analysisResult)} />
        </div>
      )}
      {analysisError && <p className="mt-4 text-red-400 text-sm">{analysisError}</p>}
    </div>
  );
};

export default AutomationCard;