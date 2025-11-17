import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// ==========================================================================================
// TIPOS (do antigo types.ts)
// ==========================================================================================
interface Automation {
  conexao: string;
  pasta: string;
  nome: string;
  desativado: boolean;
  exportadoJson: boolean;
  funcao: string;
}

// ==========================================================================================
// ÍCONES (do antigo components/Icons.tsx)
// ==========================================================================================
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const SortAscIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const SortDescIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const ExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


// ==========================================================================================
// COMPONENTE TABELA DE AUTOMAÇÕES (do antigo components/AutomationTable.tsx)
// ==========================================================================================
interface AutomationTableProps {
  automations: Automation[];
}

type SortKey = 'conexao' | 'nome' | 'desativado';

type SortConfig = {
  key: SortKey;
  direction: 'ascending' | 'descending';
};

const AutomationTable: React.FC<AutomationTableProps> = ({ automations }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'nome', direction: 'ascending' });

  const sortedAutomations = useMemo(() => {
    let sortableItems = [...automations];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
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

  const Th = ({ sortKey, label, widthClass }: { sortKey: SortKey, label: string, widthClass?: string }) => (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer select-none ${widthClass}`}
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
      <table className="min-w-full divide-y divide-slate-700 table-fixed">
        <thead className="bg-slate-900/70">
          <tr>
            <Th sortKey="nome" label="Nome da Automação" widthClass="w-1/3" />
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/2">Função</th>
            <Th sortKey="desativado" label="Status" widthClass="w-1/6" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {sortedAutomations.map((automation, index) => (
            <tr key={`${automation.nome}-${index}`} className="hover:bg-slate-700/50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white truncate w-1/3">{automation.nome}</td>
              <td className="px-6 py-4 text-sm text-gray-300 whitespace-normal w-1/2">{automation.funcao}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm w-1/6">
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${automation.desativado ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                    {automation.desativado ? <XCircleIcon /> : <CheckCircleIcon />}
                    {automation.desativado ? 'Desativado' : 'Ativo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==========================================================================================
// COMPONENTE PRINCIPAL (do antigo App.tsx)
// ==========================================================================================
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

  const [duplicates, setDuplicates] = useState<Record<string, Automation[]>>({});
  const [openConnections, setOpenConnections] = useState<Record<string, boolean>>({});
  const [showDuplicates, setShowDuplicates] = useState(false);
  
  const CLIENT_ID = "845183132675-5rgsvbh42vbgk266osp901jnas840hfo.apps.googleusercontent.com";
  const SPREADSHEET_ID = "1C1GOZ_v91sb3E8bIGnNHF-f29a_nvk2HDdzfFtFcJpM";
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

  const toBoolean = (str: string): boolean => {
      if (!str) return false;
      const s = str.trim().toLowerCase();
      return s === 'sim' || s === 'true' || s === '✔' || s === 'ok' || s === 'verdadeiro';
  };
  
  const findDuplicates = (automations: Automation[]): Record<string, Automation[]> => {
    const nameMap: Record<string, Automation[]> = {};
    automations.forEach(auto => {
      const key = `${auto.conexao.toLowerCase().trim()}|||${auto.nome.toLowerCase().trim()}`;
      if (!nameMap[key]) {
        nameMap[key] = [];
      }
      nameMap[key].push(auto);
    });

    const duplicatesOnly: Record<string, Automation[]> = {};
    for (const key in nameMap) {
      if (nameMap[key].length > 1) {
        duplicatesOnly[key] = nameMap[key];
      }
    }
    return duplicatesOnly;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await (window as any).gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'A2:F',
      });
      
      const rows = response.result.values || [];
      const parsedAutomations: Automation[] = rows
        .map((row: any) => {
          if (Array.isArray(row) && row.length >= 3 && row[2]?.trim()) {
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
        setError("Nenhuma automação válida foi encontrada na planilha.");
      } else {
        setAutomations(parsedAutomations);
        setDuplicates(findDuplicates(parsedAutomations));
      }
    } catch (err: any) {
      console.error("Erro ao buscar dados da planilha:", err);
      setError(`Falha ao carregar dados: ${err.result?.error?.message || err.message}. Verifique se o ID da planilha está correto e se você tem permissão de acesso.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const gapiLoaded = () => {
      (window as any).gapi.load('client', async () => {
        await (window as any).gapi.client.init({
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
        setGapiReady(true);
      });
    };

    const gisLoaded = () => {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                    (window as any).gapi.client.setToken(tokenResponse);
                    setIsSignedIn(true);
                } else {
                    setError("Falha na autenticação. O token de acesso não foi recebido.");
                }
            },
        });
        setTokenClient(client);
        setGisReady(true);
    };

    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = gapiLoaded;
    document.body.appendChild(gapiScript);

    const gisInterval = setInterval(() => {
        if ((window as any).google && (window as any).google.accounts) {
            clearInterval(gisInterval);
            gisLoaded();
        }
    }, 100);

    return () => {
        document.body.removeChild(gapiScript);
        clearInterval(gisInterval);
    };
  }, []);

  useEffect(() => {
    if (isSignedIn && gapiReady) {
      loadData();
    }
  }, [isSignedIn, gapiReady, loadData]);

  const handleAuthClick = () => {
    if (CLIENT_ID.startsWith("COLE_SEU_CLIENT_ID_AQUI")) {
        alert("Erro de configuração: O CLIENT_ID ainda não foi configurado.");
        return;
    }
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  };

  const filteredAutomations = useMemo(() => {
    if (!searchTerm) return automations;
    const lowercasedFilter = searchTerm.toLowerCase();
    return automations.filter(
      (auto) =>
        auto.nome.toLowerCase().includes(lowercasedFilter) ||
        auto.funcao.toLowerCase().includes(lowercasedFilter) ||
        auto.conexao.toLowerCase().includes(lowercasedFilter) ||
        auto.pasta.toLowerCase().includes(lowercasedFilter)
    );
  }, [automations, searchTerm]);
  
  const groupedAutomations = useMemo(() => {
    return filteredAutomations.reduce((acc, automation) => {
        const key = automation.conexao;
        if (!acc[key]) acc[key] = [];
        acc[key].push(automation);
        return acc;
    }, {} as Record<string, Automation[]>);
  }, [filteredAutomations]);
  
  const handleToggleConnection = (connectionName: string) => {
    setOpenConnections(prev => ({ ...prev, [connectionName]: !prev[connectionName] }));
  };

  const handleToggleAll = (expand: boolean) => {
    const allConnectionStates: Record<string, boolean> = {};
    Object.keys(groupedAutomations).forEach(name => {
        allConnectionStates[name] = expand;
    });
    setOpenConnections(allConnectionStates);
  };

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
          <p className="text-gray-400 mt-2 text-lg">v5.2 - Removida análise com IA e coluna 'Função' expandida.</p>
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
          <div className="mt-8 space-y-8">
            {Object.keys(duplicates).length > 0 && (
                <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg">
                    <button
                        className="w-full flex justify-between items-center p-4 text-left"
                        onClick={() => setShowDuplicates(prev => !prev)}
                    >
                        <div className="flex items-center gap-3">
                            <ExclamationIcon />
                            <h2 className="text-lg font-bold text-amber-300">Análise de Duplicados</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 text-xs font-semibold text-amber-900 bg-amber-400 rounded-full">
                                {Object.keys(duplicates).length} grupo(s) encontrado(s)
                            </span>
                            <ChevronDownIcon isOpen={showDuplicates} />
                        </div>
                    </button>
                    {showDuplicates && (
                        <div className="p-4 space-y-4 border-t border-amber-500/50">
                            {/* FIX: Explicitly type `duplicateGroup` to avoid TypeScript inference issues. */}
                            {Object.values(duplicates).map((duplicateGroup: Automation[]) => (
                                <div key={duplicateGroup[0].nome}>
                                    <h3 className="text-md font-semibold text-white mb-2">
                                        "{duplicateGroup[0].nome}" na conexão "{duplicateGroup[0].conexao}" ({duplicateGroup.length}x)
                                    </h3>
                                    <AutomationTable automations={duplicateGroup} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div>
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4 sticky top-4 z-10 bg-slate-900/60 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-slate-700/50">
                  <div className="relative w-full md:flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <SearchIcon />
                      </div>
                      <input
                          type="text"
                          placeholder="Buscar em todas as conexões..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors"
                          aria-label="Campo de busca de automações"
                      />
                  </div>
                  <div className="flex items-center gap-2">
                      <button onClick={() => handleToggleAll(true)} className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded-md transition">Expandir Tudo</button>
                      <button onClick={() => handleToggleAll(false)} className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded-md transition">Recolher Tudo</button>
                  </div>
                  <p className="text-gray-400 text-sm w-full md:w-auto text-center md:text-right">
                      Exibindo <strong className="text-white">{filteredAutomations.length}</strong> de <strong className="text-white">{automations.length}</strong>
                  </p>
              </div>
              
              <div className="space-y-4">
                  {Object.keys(groupedAutomations).sort().map(connectionName => {
                      const automationsInGroup = groupedAutomations[connectionName];
                      const isOpen = openConnections[connectionName] || false;

                      return (
                          <div key={connectionName} className="bg-slate-800/50 backdrop-blur-sm border border-teal-500/20 rounded-lg overflow-hidden">
                              <button
                                  className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-700/50 transition-colors"
                                  onClick={() => handleToggleConnection(connectionName)}
                                  aria-expanded={isOpen}
                              >
                                  <h2 className="text-lg font-bold text-teal-300">{connectionName}</h2>
                                  <div className="flex items-center gap-4">
                                      <span className="px-3 py-1 text-xs font-semibold text-slate-800 bg-slate-300 rounded-full">
                                          {automationsInGroup.length} automação(ões)
                                      </span>
                                      <ChevronDownIcon isOpen={isOpen} />
                                  </div>
                              </button>
                              {isOpen && (
                                  <div className="p-4 border-t border-teal-500/20">
                                      <AutomationTable automations={automationsInGroup} />
                                  </div>
                              )}
                          </div>
                      );
                  })}
              </div>

              {filteredAutomations.length === 0 && searchTerm && (
                  <div className="text-center py-16">
                      <p className="text-2xl text-gray-300 mb-2">🤔</p>
                      <p className="text-gray-400">Nenhuma automação encontrada com o termo <strong className="text-teal-400">"{searchTerm}"</strong>.</p>
                  </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ==========================================================================================
// RENDERIZAÇÃO DA APLICAÇÃO (do antigo index.tsx)
// ==========================================================================================
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento 'root' não encontrado para montar a aplicação.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
