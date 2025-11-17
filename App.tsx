import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Automation } from './types';
import { SearchIcon, GoogleIcon } from './components/Icons';
import AutomationTable from './components/AutomationTable';
import AnalysisModal from './components/AnalysisModal';

// ==========================================================================================
// AÇÃO NECESSÁRIA: Configure seu Client ID e a Planilha aqui
// ==========================================================================================
// 1. CLIENT_ID:
//    - Vá para https://console.cloud.google.com/apis/credentials
//    - Crie ou selecione um projeto.
//    - Clique em "+ CREATE CREDENTIALS" -> "OAuth client ID".
//    - Selecione "Web application".
//    - Em "Authorized JavaScript origins", adicione a URL onde a aplicação será hospedada.
//      (Para desenvolvimento local, use "http://localhost:5173" ou a porta que estiver usando).
//      (Para a preview do AI Studio, use "https://aistudio.google.com").
//    - Clique em "CREATE" e copie o "Your Client ID" para a constante abaixo.
const CLIENT_ID = "845183132675-5rgsvbh42vbgk266osp901jnas840hfo.apps.googleusercontent.com";

// 2. SPREADSHEET_ID:
//    - É o ID da sua planilha Google. Ex: https://docs.google.com/spreadsheets/d/ID_DA_PLANILHA/edit
const SPREADSHEET_ID = "1C1GOZ_v91sb3E8bIGnNHF-f29a_nvk2HDdzfFtFcJpM";
// ==========================================================================================

// Escopo de permissão: Apenas leitura das planilhas.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';


const toBoolean = (str: string): boolean => {
    if (!str) return false;
    const s = str.trim().toLowerCase();
    return s === 'sim' || s === 'true' || s === '✔' || s === 'ok' || s === 'verdadeiro';
};

const App: React.FC = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isSignedIn, setIsSignedIn] = useState(false);
  // @ts-ignore
  const [tokenClient, setTokenClient] = useState<google.accounts.oauth2.TokenClient | null>(null);

  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

  const handleAnalyze = (automation: Automation) => {
    setSelectedAutomation(automation);
    setIsModalOpen(true);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await (window as any).gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'A2:F', // Começa da linha 2 para ignorar o cabeçalho
      });
      
      const rows = response.result.values || [];
      const parsedAutomations: Automation[] = rows
        .map((row: any[]) => {
          if (row.length >= 3 && row[2]?.trim()) {
            return {
              conexao: row[0]?.trim() || 'N/A',
              pasta: row[1]?.trim() || '',
              nome: row[2]?.trim() || 'Sem nome',
              desativado: toBoolean(row[3]),
              exportadoJson: toBoolean(row[4]),
              funcao: row[5]?.trim() || 'Sem descrição'
            };
          }
          return null;
        })
        .filter((item): item is Automation => item !== null);

      if (parsedAutomations.length === 0) {
        setError("Nenhuma automação válida foi encontrada na planilha. Verifique se ela não está vazia ou se o formato está correto.");
      } else {
        setAutomations(parsedAutomations);
      }
    } catch (err: any) {
      console.error("Erro ao buscar dados da planilha:", err);
      setError(`Falha ao carregar dados: ${err.result?.error?.message || err.message}. Verifique se o ID da planilha está correto e se você tem permissão de acesso.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito para inicializar as APIs do Google
  useEffect(() => {
    // Função a ser chamada quando o script GAPI (Google API) carregar
    const gapiLoaded = () => {
      (window as any).gapi.load('client', async () => {
        await (window as any).gapi.client.init({
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
        setGapiReady(true);
      });
    };

    // Função a ser chamada quando o script GIS (Google Identity Services) estiver pronto
    const gisLoaded = () => {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                    setIsSignedIn(true);
                } else {
                    setError("Falha na autenticação. O token de acesso não foi recebido.");
                }
            },
        });
        setTokenClient(client);
        setGisReady(true);
    };

    // Carrega o script GAPI dinamicamente
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = gapiLoaded;
    document.body.appendChild(gapiScript);

    // O script GIS já está no index.html, então verificamos periodicamente se ele carregou
    const gisInterval = setInterval(() => {
        if ((window as any).google && (window as any).google.accounts) {
            clearInterval(gisInterval);
            gisLoaded();
        }
    }, 100);

    // Função de limpeza para remover o script e o intervalo quando o componente for desmontado
    return () => {
        document.body.removeChild(gapiScript);
        clearInterval(gisInterval);
    };
  }, []);

  // Efeito para buscar os dados quando o usuário estiver logado e a API estiver pronta
  useEffect(() => {
    if (isSignedIn && gapiReady) {
      loadData();
    }
  }, [isSignedIn, gapiReady, loadData]);


  const handleAuthClick = () => {
    if (CLIENT_ID.startsWith("COLE_SEU_CLIENT_ID_AQUI")) {
        alert("Erro de configuração: O CLIENT_ID ainda não foi configurado no arquivo App.tsx. Siga as instruções no código para gerar e adicionar sua chave.");
        return;
    }
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  };

  const filteredAutomations = useMemo(() => {
    if (!searchTerm) {
      return automations;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return automations.filter(
      (automation) =>
        automation.nome.toLowerCase().includes(lowercasedFilter) ||
        automation.funcao.toLowerCase().includes(lowercasedFilter) ||
        automation.conexao.toLowerCase().includes(lowercasedFilter) ||
        automation.pasta.toLowerCase().includes(lowercasedFilter)
    );
  }, [automations, searchTerm]);

  if (!isSignedIn) {
    return (
        <div className="min-h-screen bg-transparent text-white font-sans flex items-center justify-center">
            <div className="text-center bg-slate-800/50 backdrop-blur-sm border border-teal-500/20 rounded-lg p-12 shadow-2xl shadow-black/50">
                <h1 className="text-3xl font-bold text-white mb-2">Painel de Automações</h1>
                <p className="text-gray-400 mb-8">Conecte-se com sua conta Google para carregar os dados.</p>
                <button
                    onClick={handleAuthClick}
                    disabled={!gisReady}
                    className="inline-flex items-center gap-3 px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <GoogleIcon />
                    {gisReady ? 'Conectar com Google' : 'Carregando...'}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-400 drop-shadow-[0_2px_4px_rgba(0,255,255,0.2)]">
            Painel de Automações Unnichat
          </h1>
          <p className="text-gray-400 mt-2 text-lg">v4.0 - Conectado. Busque, ordene e analise com IA.</p>
        </header>

        {error && (
            <div className="my-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md" role="alert">
              <p className="font-bold">Ocorreu um erro</p>
              <p className="text-sm">{error}</p>
            </div>
        )}

        {(loading || !gapiReady) && automations.length === 0 ? (
            <div className="text-center py-16">
                <svg className="animate-spin h-8 w-8 text-teal-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg text-gray-300">{!gapiReady ? 'Inicializando APIs do Google...' : 'Carregando dados da planilha...'}</p>
            </div>
        ) : automations.length > 0 && !error ? (
          <div className="mt-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4 sticky top-4 z-10 bg-slate-900/60 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-slate-700/50">
                <div className="relative w-full md:w-2/3">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome, função, conexão..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
                        aria-label="Campo de busca de automações"
                    />
                </div>
                <p className="text-gray-400 text-sm w-full md:w-auto text-center md:text-right">
                    Exibindo <strong className="text-white">{filteredAutomations.length}</strong> de <strong className="text-white">{automations.length}</strong> automações.
                </p>
            </div>
            
            <AutomationTable automations={filteredAutomations} onAnalyze={handleAnalyze} />

            {filteredAutomations.length === 0 && searchTerm && (
                <div className="text-center py-16">
                    <p className="text-2xl text-gray-300 mb-2">🤔</p>
                    <p className="text-gray-400">Nenhuma automação encontrada com o termo <strong className="text-teal-400">"{searchTerm}"</strong>.</p>
                </div>
            )}
          </div>
        ) : null}
      </div>
      <AnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} automation={selectedAutomation} />
    </div>
  );
};

export default App;
