import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import {
  MonitorPlay,
  Sparkles,
  Copy,
  Printer,
  RefreshCw,
  Gamepad2,
  PieChart,
  Layers,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiMediaView: React.FC = () => {
  const mapelList = db.getMapelList();
  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [topik, setTopik] = useState('Konsep Struktur Data Tree & Graph dalam Jaringan Komputer');
  const [jenisMedia, setJenisMedia] = useState('Game Interaktif & Gamifikasi Kelas');
  const [targetSiswa, setTargetSiswa] = useState('Siswa SMK/SMA Fase E - Generasi Visual Digital');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Ahli Desain Media Pembelajaran Interaktif & Teknologi Pendidikan Nasional.
Rancanglah sebuah PANDUAN PENGEMBANGAN MEDIA PEMBELAJARAN INTERAKTIF KREATIF berprinsip Deep Learning (Joyful & Meaningful Learning) berlandaskan regulasi resmi:
"${REGULASI_BSKAP_2025}".

Spesifikasi:
- Mata Pelajaran: ${mapel}
- Topik Bahasan: ${topik}
- Jenis Media yang Diminta: ${jenisMedia}
- Target Peserta Didik: ${targetSiswa}

Struktur Dokumen Rekomendasi Media:
1. Konsep & Filosofi Media (Keterkaitan dengan CP SK 046/H/KR/2025 & Deep Learning).
2. Cetak Biru (Storyboard / Alur Kerja Media):
   - Scene/Tahap 1: Pengenalan Masalah Nyata (Hook).
   - Scene/Tahap 2: Eksplorasi Interaktif & Simulasi Konsep.
   - Scene/Tahap 3: Uji Pemahaman Mandiri / Tantangan Permainan.
3. Petunjuk Langkah demi Langkah bagi Guru untuk Mengimplementasikannya di Kelas (Bisa menggunakan alat digital gratis seperti Canva, Wordwall, PhET, GeoGebra, Scratch, Figma, atau simulator web).
4. Lembar Kerja Interaktif / Prompt Interaksi Siswa.
5. Rubrik Evaluasi Keterlibatan Siswa (Engagement & Joyful Learning Score).

Berikan output yang sangat terperinci, aplikatif, dan mudah dieksekusi oleh guru di kelas.`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: 'Anda adalah Pengembang Media Edukasi Digital Unggulan.',
      });
      setOutput(res);
      Swal.fire({
        icon: 'success',
        title: 'Rancangan Media Siap!',
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
    navigator.clipboard.writeText(output);
    Swal.fire({ icon: 'success', title: 'Teks Disalin', timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-600 text-white p-5 rounded-2xl shadow-md border-2 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-700 rounded-xl text-orange-200">
            <MonitorPlay className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">
                Media Pembelajaran Interaktif AI
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase">
                BARU
              </span>
            </div>
            <p className="text-xs text-orange-100 mt-0.5">
              Rancang simulasi, game edukatif, infografis kontekstual, dan aktivitas joyful learning
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              Format / Bentuk Media
            </label>
            <select
              value={jenisMedia}
              onChange={(e) => setJenisMedia(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            >
              <option value="Game Interaktif & Gamifikasi Kelas">Game Interaktif &amp; Gamifikasi Kelas</option>
              <option value="Simulasi Konsep & Animasi Visual">Simulasi Konsep &amp; Animasi Visual</option>
              <option value="Rancangan Infografis & Peta Konsep Digital">Rancangan Infografis &amp; Peta Konsep Digital</option>
              <option value="Lembar Aktivitas Eksplorasi Digital Terpadu">Lembar Aktivitas Eksplorasi Digital Terpadu</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Topik Materi Bahasan
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
            <span>{loading ? 'Merancang Media Interaktif...' : 'Buat Rancangan Media Pembelajaran'}</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Cetak Biru Media Pembelajaran Interaktif
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg"
              >
                <Copy className="w-3.5 h-3.5 inline mr-1" />
                Salin
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-xs leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};
