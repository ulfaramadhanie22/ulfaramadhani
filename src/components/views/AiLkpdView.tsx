import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  FileSpreadsheet,
  Sparkles,
  Printer,
  Copy,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiLkpdView: React.FC = () => {
  const mapelList = db.getMapelList();
  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [topik, setTopik] = useState('Analisis Keamanan Siber & Etika Privasi Data Pribadi');
  const [fase, setFase] = useState('Fase E (Kelas X)');
  const [modelKbm, setModelKbm] = useState('Kolaborasi Kelompok & Penyelidikan Kasus Nyata');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Spesialis Desain Pembelajaran Aktif & LKPD Interaktif Kementerian Pendidikan Dasar dan Menengah RI.
Rancanglah LEMBAR KERJA PESERTA DIDIK (LKPD) TERSTRUKTUR & MENYENANGKAN (DEEP LEARNING: Meaningful & Joyful) berlandaskan regulasi resmi tunggal:
"${REGULASI_BSKAP_2025}".

Identitas:
- Mata Pelajaran: ${mapel}
- Fase: ${fase}
- Topik Pembelajaran: ${topik}
- Model Kerja: ${modelKbm}

SISTEMATIKA LKPD WAJIB:
1. KOP IDENTITAS KELOMPOK: Nama Anggota (1-5), Kelas, Tanggal, Peran Kelompok.
2. TUJUAN PEMBELAJARAN & INDIKATOR KETUNTASAN: Dituliskan ramah anak.
3. PETUNJUK PENGERJAAN: Langkah-langkah jelas dan memotivasi.
4. STIMULUS WACANA / KASUS DUNIA NYATA (Real-World Meaningful Hook): Artikel berita singkat, wacana masalah kontekstual, atau diagram fenomena menarik.
5. AKTIVITAS EKSPLORASI MANDIRI / KELOMPOK (Tahap Penyelidikan):
   - Tabel analisis data / lembar investigasi.
   - Pertanyaan pemantik tingkat tinggi (HOTS & Penalaran Kritis).
6. LEMBAR KREASI & SOLUSI: Tempat peserta didik menuangkan rancangan ide solusi.
7. LEMBAR REFLEKSI METAKOGNITIF (Mindful Reflection):
   - Apa hal baru paling berkesan yang saya pelajari hari ini?
   - Apa kesulitan yang saya hadapi dan bagaimana saya mengatasinya?
   - Skala kepuasan & perasaan belajar (Emoticon rating).
8. RUBRIK PENILAIAN LEMBAR KERJA (Format penilaian guru).

Sajikan dokumen yang siap dicetak langsung dan dibagikan ke meja belajar peserta didik.`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: 'Anda adalah Perancang Lembar Kerja Peserta Didik (LKPD) Unggulan Kurikulum Merdeka.',
      });
      setOutput(res);
      Swal.fire({
        icon: 'success',
        title: 'LKPD Siap Digunakan!',
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

  if (isPrintMode && output) {
    return (
      <OfficialPrintLayout
        title="LEMBAR KERJA PESERTA DIDIK (LKPD) DEEP LEARNING"
        subtitle={`MATA PELAJARAN: ${mapel.toUpperCase()} • TOPIK: ${topik.toUpperCase()}`}
        onBack={() => setIsPrintMode(false)}
      >
        <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed space-y-4">
          {output}
        </div>
      </OfficialPrintLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-600 text-white p-5 rounded-2xl shadow-md border-2 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-700 rounded-xl text-orange-200">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Generator LKPD AI (Lembar Kerja Siswa)
            </h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              LKPD Kontekstual Berbasis Kasus Nyata, Penyelidikan Kelompok, &amp; Refleksi Metakognitif
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
              Fase / Jenjang
            </label>
            <input
              type="text"
              value={fase}
              onChange={(e) => setFase(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Topik Pembelajaran / Kasus Penyelidikan
          </label>
          <input
            type="text"
            value={topik}
            onChange={(e) => setTopik(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Model Aktivitas
          </label>
          <select
            value={modelKbm}
            onChange={(e) => setModelKbm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
          >
            <option value="Kolaborasi Kelompok & Penyelidikan Kasus Nyata">Kolaborasi Kelompok &amp; Penyelidikan Kasus Nyata</option>
            <option value="Eksperimen Praktikum Mandiri Terbimbing">Eksperimen Praktikum Mandiri Terbimbing</option>
            <option value="Studi Kasus Kritis & Debat Peran Digital">Studi Kasus Kritis &amp; Debat Peran Digital</option>
          </select>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Menyusun Lembar LKPD...' : 'Generate Format LKPD Lengkap'}</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Naskah Lembar Kerja Peserta Didik (LKPD) Siap Cetak
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
              <button
                type="button"
                onClick={() => setIsPrintMode(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
              >
                <Printer className="w-3.5 h-3.5 inline mr-1" />
                Cetak LKPD
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-xs leading-relaxed whitespace-pre-wrap max-h-[550px] overflow-y-auto">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};
