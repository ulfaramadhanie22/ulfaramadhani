import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  ClipboardList,
  Sparkles,
  Printer,
  Copy,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiKartuSoalView: React.FC = () => {
  const mapelList = db.getMapelList();
  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [fase, setFase] = useState('Fase E');
  const [tingkat, setTingkat] = useState('Kelas X');
  const [elemenCp, setElemenCp] = useState('Analisis Data & Basis Data Relasional');
  const [jumlahButir, setJumlahButir] = useState(5);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Tim Penyusun Kisi-Kisi dan Kartu Soal Standar Pengawas & Ujian Sekolah Kemendikdasmen RI.
Buatlah DOKUMEN TABEL KISI-KISI SOAL UJIAN dan KARTU SOAL RESMI BERSTANDAR BSKAP berlandaskan regulasi resmi tunggal:
"${REGULASI_BSKAP_2025}".

Identitas:
- Mata Pelajaran: ${mapel}
- Fase: ${fase}
- Tingkat Kelas: ${tingkat}
- Elemen Capaian Pembelajaran: ${elemenCp}
- Jumlah Butir Sampel yang Dituliskan Detail: ${jumlahButir} butir soal

STRUKTUR DOKUMEN:
1. TABEL KISI-KISI PENULISAN SOAL STANDAR NASIONAL (Format Kolom Lengkap):
   - No.
   - Capaian Pembelajaran (Kutipan SK 046/H/KR/2025)
   - Lingkup Materi
   - Indikator Soal (Memuat stimulus kontekstual)
   - Level Kognitif (Level 1: Pengetahuan & Pemahaman, Level 2: Aplikasi, Level 3: Penalaran/HOTS)
   - Bentuk Soal (Pilihan Ganda / Uraian)
   - Nomor Soal

2. FORMAT KARTU SOAL RESMI PER BUTIR SOAL:
   Untuk setiap butir soal (${jumlahButir} butir), buat format kartu soal formal berbingkai:
   - Identitas Kartu (Mata Pelajaran, Kelas/Semester, Kurikulum, Bentuk Tes, Penyusun: Ulfa Ramadhani, S.Pd., Gr.)
   - Kompetensi yang Diuji / CP (SK 046/2025)
   - Indikator Soal
   - Buku Sumber / Referensi
   - Naskah Butir Soal (Lengkap dengan stimulus kontekstual wacana/kasus dunia nyata)
   - Kunci Jawaban & Pembahasan Singkat
   - Kriteria Penskoran / Bobot

Format rapi, formal, siap cetak untuk portofolio supervisi pengawas kurikulum.`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: 'Anda adalah Pengembang Kisi-Kisi dan Kartu Soal Evaluasi Pendidikan Kemendikdasmen RI.',
      });
      setOutput(res);
      Swal.fire({
        icon: 'success',
        title: 'Kisi-Kisi & Kartu Soal Siap!',
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
        title="KISI-KISI DAN KARTU SOAL ASESMEN RESMI"
        subtitle={`MATA PELAJARAN: ${mapel.toUpperCase()} • ${tingkat.toUpperCase()} (${fase.toUpperCase()})`}
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
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Format Kisi-Kisi &amp; Kartu Soal Resmi
            </h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Format Standar Supervisi Pengawas &amp; Ujian Sekolah • SK BSKAP No. 046/H/KR/2025
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
              Fase
            </label>
            <input
              type="text"
              value={fase}
              onChange={(e) => setFase(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jumlah Sampel Butir Kartu
            </label>
            <input
              type="number"
              min={3}
              max={15}
              value={jumlahButir}
              onChange={(e) => setJumlahButir(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Elemen Capaian Pembelajaran (CP SK 046/2025)
          </label>
          <input
            type="text"
            value={elemenCp}
            onChange={(e) => setElemenCp(e.target.value)}
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
            <span>{loading ? 'Menyusun Kisi-Kisi & Kartu Soal...' : 'Generate Kisi-Kisi & Kartu Soal'}</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Tabel Kisi-Kisi &amp; Kartu Soal Standar
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
                Cetak Format Kop
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
