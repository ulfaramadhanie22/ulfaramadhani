import React, { useState, useRef, useEffect } from 'react';
import { callGeminiChat, REGULASI_BSKAP_2025 } from '../../services/aiService';
import {
  BotMessageSquare,
  Send,
  User,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const AiChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Halo Ibu Ulfa Ramadhani! 👋 
Saya adalah Konsultan Ahli Kurikulum Nasional & Sahabat Guru 24/7 Anda. 

Saya siap membantu Anda dalam:
1. Bedah Regulasi Resmi **Salinan Keputusan Kepala BSKAP No. 046/H/KR/2025** (CP PAUD, Dikdas, Dikmen).
2. Perumusan TP, Alur Tujuan Pembelajaran (ATP), dan Modul Ajar Mendalam (*Deep Learning*).
3. Penentuan interval dan deskripsi KKTP rapor Kurikulum Merdeka.
4. Tips penanganan kasus kedisiplinan siswa di kelas dengan pendekatan kasih sayang (KBC).

Apa yang ingin kita diskusikan hari ini, Bu Guru?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const systemInstruction = `Anda adalah Konsultan Ahli Kurikulum Nasional Indonesia & Sahabat Pendidik Profesional 24/7. Anda berdialog langsung dengan Ibu Ulfa Ramadhani, guru profesional.
Anda menguasai secara mendalam:
1. Salinan Keputusan Kepala BSKAP Kemendikdasmen RI No. 046/H/KR/2025 tentang Capaian Pembelajaran.
2. Pendekatan Pembelajaran Mendalam (Deep Learning: Mindful, Meaningful, Joyful Learning).
3. Kurikulum Berbasis Kasih Sayang (KBC), pedagogi humanistik, dan kesehatan mental anak.
4. Panduan Pembelajaran & Asesmen (PPA) revisi terbaru.

Gaya Komunikasi:
- Hangat, santun, ilmiah, empatik, memberikan solusi taktis langkah demi langkah, dan menyemangati guru.
- Gunakan bahasa Indonesia baku namun luwes dan komunikatif.`;

      // Call Gemini Chat endpoint
      const reply = await callGeminiChat(
        newHistory.map((m) => ({ role: m.role, content: m.content })),
        systemInstruction
      );

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `Mohon maaf Ibu Guru, terjadi kendala saat memproses konsultasi: ${err.message}. Silakan periksa koneksi internet atau ulangi kembali pertanyaan Anda.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Bagaimana cara menentukan KKTP dengan pendekatan interval nilai?',
    'Jelaskan Capaian Pembelajaran Fase E Informatika menurut SK 046/H/KR/2025',
    'Tips menangani siswa yang sering pasif dan cemas saat presentasi kelas',
    'Berikan 3 ide ice breaking Deep Learning berdurasi 3 menit',
  ];

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-600 text-white p-5 rounded-2xl shadow-md border-2 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-700 rounded-xl text-orange-200">
            <BotMessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">
                Konsultan Ahli Kurikulum &amp; Sahabat Guru AI
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
                AKTIF 24/7
              </span>
            </div>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Tanya jawab seputar regulasi BSKAP 046/H/KR/2025, modul ajar, penulisan rapor, dan manajemen kelas
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 ml-1" />
        <span className="font-bold text-slate-500 shrink-0">Pertanyaan Populer:</span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:border-orange-300 transition-colors shrink-0 font-medium text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-4 sm:p-6 flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 font-black'
                }`}
              >
                {m.role === 'user' ? <User className="w-5 h-5" /> : <BotMessageSquare className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
                <div
                  className={`mt-1.5 text-[9px] font-mono text-right ${
                    m.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                <span>Konsultan AI sedang memikirkan jawaban terbaik...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan kurikulum, asesmen, atau konsultasi kelas..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
