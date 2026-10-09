import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import {
  Presentation,
  Sparkles,
  Copy,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import Swal from 'sweetalert2';

interface ParsedSlide {
  title: string;
  points: string[];
  visualPrompt: string;
  speakerNotes: string;
}

export const AiPptView: React.FC = () => {
  const mapelList = db.getMapelList();
  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [topik, setTopik] = useState('Arsitektur Komputer Modern & Siklus Pemrosesan Data');
  const [targetAudience, setTargetAudience] = useState('Siswa SMK/SMA Kelas X');
  const [jumlahSlide, setJumlahSlide] = useState(12);
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState('');
  const [slides, setSlides] = useState<ParsedSlide[]>([]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Spesialis Desain Slide Pembelajaran Interaktif (PowerPoint / Canva Deck) Kemendikdasmen RI.
Buatlah RANCANGAN SLIDE DECK PRESENTASI KELAS (10 - 15 Slide) yang memukau, berbasis prinsip Deep Learning (Meaningful & Joyful Learning), berlandaskan regulasi resmi tunggal:
"${REGULASI_BSKAP_2025}".

Identitas:
- Mata Pelajaran: ${mapel}
- Topik Bahasan: ${topik}
- Target Peserta Didik: ${targetAudience}
- Jumlah Slide: ${jumlahSlide} slide

FORMAT OUTPUT WAJIB:
Untuk setiap slide (Slide 1 hingga Slide ${jumlahSlide}), gunakan pemisah persis "=== SLIDE X ===" dengan format berikut:
=== SLIDE [Nomor] ===
JUDUL: [Judul Slide Ringkas & Catchy]
POIN KONTEN:
- [Poin materi 1]
- [Poin materi 2]
- [Poin materi 3]
SARAN VISUAL/INFOGRAFIS: [Deskripsi ilustrasi, gambar, diagram alur, atau ikon visual yang harus ditampilkan pada slide ini]
CATATAN GURU (SPEAKER NOTES): [Narasi kata-kata yang diucapkan guru saat menampilkan slide ini untuk memancing antusiasme dan pemikiran kritis murid]

Struktur Urutan Slide:
- Slide 1: Cover Judul & Hook Menarik
- Slide 2: Tujuan Pembelajaran Kontekstual & Makna Nyata
- Slide 3: Pertanyaan Pemantik Kritis (Mindful Hook)
- Slide 4-9: Inti Materi & Studi Kasus Dunia Nyata
- Slide 10: Kuis Cepat / Polling Interaktif Kelas
- Slide 11: Rangkuman & Peta Pikiran
- Slide 12: Refleksi & Penugasan Portofolio Menyenangkan`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: 'Anda adalah Pengembang Presentasi Slide Edukasi Kelas Interaktif.',
      });

      setRawText(res);

      // Parse text into slide structures
      const parts = res.split(/=== SLIDE\s*\d+\s*===/i).filter((p) => p.trim().length > 0);
      const parsed: ParsedSlide[] = parts.map((part, idx) => {
        const titleMatch = part.match(/JUDUL:\s*(.*)/i);
        const title = titleMatch ? titleMatch[1].trim() : `Slide ${idx + 1}`;

        const visualMatch = part.match(/SARAN VISUAL\/INFOGRAFIS:\s*([\s\S]*?)(?=CATATAN GURU|$)/i);
        const visualPrompt = visualMatch ? visualMatch[1].trim() : '';

        const speakerMatch = part.match(/CATATAN GURU \(SPEAKER NOTES\):\s*([\s\S]*?)$/i);
        const speakerNotes = speakerMatch ? speakerMatch[1].trim() : '';

        const pointsMatch = part.match(/POIN KONTEN:\s*([\s\S]*?)(?=SARAN VISUAL|$)/i);
        const points = pointsMatch
          ? pointsMatch[1]
              .split('\n')
              .map((l) => l.replace(/^[-*•]\s*/, '').trim())
              .filter((l) => l.length > 0)
          : [];

        return {
          title,
          points,
          visualPrompt,
          speakerNotes,
        };
      });

      setSlides(parsed);
      setActiveSlideIdx(0);

      Swal.fire({
        icon: 'success',
        title: 'Presentasi Siap!',
        text: `${parsed.length || jumlahSlide} slide telah digenerate.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e: any) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    Swal.fire({ icon: 'success', title: 'Teks Disalin', timer: 1200, showConfirmButton: false });
  };

  const currentSlide = slides[activeSlideIdx];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-600 text-white p-5 rounded-2xl shadow-md border-2 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-700 rounded-xl text-orange-200">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Generator Presentasi Pembelajaran (PPT Deck)
            </h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              10-15 Slide Lengkap: Hook Interaktif, Materi Konseptual, Speaker Notes, &amp; Kuis Cepat
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mata Pelajaran
            </label>
            <select
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
            >
              {mapelList.map((m) => (
                <option key={m.id} value={m.nama}>
                  {m.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jumlah Slide Target
            </label>
            <input
              type="number"
              min={8}
              max={20}
              value={jumlahSlide}
              onChange={(e) => setJumlahSlide(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sasaran Audiens Murid
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Topik Bahasan Presentasi
          </label>
          <input
            type="text"
            value={topik}
            onChange={(e) => setTopik(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Merancang Slide Deck...' : 'Generate Slide Presentasi Interaktif'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Deck Viewer */}
      {slides.length > 0 && currentSlide && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Presentation className="w-5 h-5 text-orange-600" />
              <span>Pratinjau Slide Player Interaktif</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Slide {activeSlideIdx + 1} dari {slides.length}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg"
              >
                <Copy className="w-3.5 h-3.5 inline mr-1" />
                Salin Semua Teks
              </button>
            </div>
          </div>

          {/* 16:9 Presentation Canvas */}
          <div className="aspect-video w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-8 sm:p-12 shadow-2xl border-4 border-slate-800 flex flex-col justify-between relative overflow-hidden">
            {/* Top Bar of Canvas */}
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300">
                {mapel} • {topik}
              </span>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full font-bold">
                {activeSlideIdx + 1} / {slides.length}
              </span>
            </div>

            {/* Slide Body */}
            <div className="my-auto space-y-4">
              <h2 className="text-xl sm:text-3xl font-black text-amber-300 tracking-tight leading-tight">
                {currentSlide.title}
              </h2>

              <ul className="space-y-2 text-xs sm:text-base text-slate-100">
                {currentSlide.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {currentSlide.visualPrompt && (
                <div className="mt-4 p-2.5 rounded-xl bg-white/10 text-[11px] text-blue-200 border border-white/10 flex items-center gap-2">
                  <span className="font-bold text-amber-300 shrink-0">Saran Visual:</span>
                  <span className="italic">{currentSlide.visualPrompt}</span>
                </div>
              )}
            </div>

            {/* Bottom Bar of Canvas */}
            <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-slate-400">
              <span>Kurikulum Merdeka Deep Learning • Ulfa Ramadhani</span>
              <span>SK BSKAP 046/H/KR/2025</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              type="button"
              disabled={activeSlideIdx === 0}
              onClick={() => setActiveSlideIdx((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Slide Sebelumnya
            </button>

            {/* Thumbnails dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto px-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                    activeSlideIdx === idx
                      ? 'bg-orange-500 text-white scale-110 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={activeSlideIdx === slides.length - 1}
              onClick={() => setActiveSlideIdx((prev) => Math.min(slides.length - 1, prev + 1))}
              className="inline-flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors"
            >
              Slide Berikutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speaker Notes Box */}
          {currentSlide.speakerNotes && (
            <div className="max-w-4xl mx-auto p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-1">
              <strong className="block text-[11px] font-black uppercase text-amber-900 dark:text-amber-300">
                🎙️ Catatan Guru (Speaker Notes) Saat Menampilkan Slide Ini:
              </strong>
              <p className="leading-relaxed">{currentSlide.speakerNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
