import React, { useState, useEffect } from 'react';
import { Automation } from '../types';
import { analyzeAutomationWithGemini } from '../services/geminiService';
import { CloseIcon, SparklesIcon } from './Icons';

interface AnalysisModalProps {
  automation: Automation | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ automation, isOpen, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && automation) {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      analyzeAutomationWithGemini(automation)
        .then(result => {
          setAnalysisResult(result);
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    }
  }, [isOpen, automation]);

  if (!isOpen || !automation) return null;

  const renderMarkdown = (text: string) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-300">$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800/80 border border-teal-500/30 rounded-xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <SparklesIcon />
            <h2 className="text-lg font-bold text-white">Análise da IA</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          <div className="mb-4">
            <p className="text-sm text-teal-400">{automation.conexao}</p>
            <h3 className="text-xl font-bold text-white">{automation.nome}</h3>
          </div>
          
          <div className="mt-4 text-gray-300 text-sm space-y-4">
            {isAnalyzing && (
              <div className="flex items-center justify-center p-8">
                <svg className="animate-spin h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-4 text-lg">Analisando com Gemini...</p>
              </div>
            )}
            {analysisResult && (
              <div className="p-4 bg-slate-900/50 rounded-md border border-slate-700">
                <div dangerouslySetInnerHTML={renderMarkdown(analysisResult)} />
              </div>
            )}
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default AnalysisModal;
