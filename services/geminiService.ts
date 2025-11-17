import { GoogleGenAI } from "@google/genai";
import { Automation } from '../types.ts';

// A API Key foi fornecida para uso interno.
const API_KEY = "AIzaSyByTvMWBOCa1TKUuVAM5z6NyoIT7JjrVWM";

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeAutomationWithGemini(automation: Automation): Promise<string> {
  const prompt = `
    Você é um especialista sênior em automação da plataforma Unnichat.
    Analise os detalhes da automação a seguir e forneça uma resposta estruturada em markdown.

    **Nome da Automação:** "${automation.nome}"
    **Conexão:** ${automation.conexao}
    **Função Descrita:** "${automation.funcao}"

    Sua resposta DEVE seguir este formato:
    **Análise:** Um resumo claro e conciso da função principal da automação.
    **Sugestão de Melhoria:** Uma sugestão prática e acionável para otimizar ou melhorar a automação. Se nenhuma melhoria for óbvia, sugira um ponto de verificação ou uma boa prática relacionada.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return "**Erro na Análise**\n\nDesculpe, não foi possível obter uma análise da IA neste momento. Verifique o console do navegador para mais detalhes técnicos.";
  }
}