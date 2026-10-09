// AI Service communicating with server-side /api/gemini endpoints

export interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
}

export const REGULASI_BSKAP_2025 =
  'SALINAN KEPUTUSAN KEPALA BADAN STANDAR, KURIKULUM, DAN ASESMEN PENDIDIKAN KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH (BSKAP KEMENDIKDASMEN) NOMOR 046/H/KR/2025 TENTANG CAPAIAN PEMBELAJARAN PADA PENDIDIKAN ANAK USIA DINI, PENDIDIKAN DASAR, DAN PENDIDIKAN MENENGAH';

export async function callGeminiGenerate(options: GenerateOptions): Promise<string> {
  const response = await fetch('/api/gemini/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}

export async function callGeminiChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemInstruction?: string
): Promise<string> {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, systemInstruction }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}
