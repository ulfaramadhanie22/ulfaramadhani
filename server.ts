import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Main generation endpoint
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction, temperature } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'Anda adalah Konsultan Kurikulum Nasional dan Ahli Administrasi Guru Profesional Indonesia berlandaskan SK BSKAP Kemendikdasmen No. 046/H/KR/2025.',
        temperature: typeof temperature === 'number' ? temperature : 0.7,
      },
    });

    const text = response.text || '';
    return res.json({ text });
  } catch (err: any) {
    console.error('Error generating AI content:', err);
    return res.status(500).json({
      error: err.message || 'Terjadi kesalahan saat memproses permintaan AI.',
    });
  }
});

// Chat endpoint with conversation history
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getAiClient();

    // Map messages into Gemini contents format
    const contents = messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemInstruction || 'Anda adalah Konsultan Pendidikan Nasional & Sahabat Guru 24/7. Anda menguasai Kurikulum Merdeka, Deep Learning (Mindful, Meaningful, Joyful Learning), dan Salinan SK Kepala BSKAP Kemendikdasmen Nomor 046/H/KR/2025. Jawablah dengan bahasa Indonesia yang ramah, santun, ilmiah, praktis, dan memotivasi para guru.',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    return res.json({ text });
  } catch (err: any) {
    console.error('Error in AI chat:', err);
    return res.status(500).json({
      error: err.message || 'Terjadi kesalahan saat konsultasi AI.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 Server berjalan di http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
