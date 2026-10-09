import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  FileQuestion,
  Sparkles,
  Printer,
  Copy,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiSoalView: React.FC = () => {
  const mapelList = db.getMapelList();
  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [fase, setFase] = useState('Fase E (Kelas X)');
  const [lingkupMateri, setLingkupMateri] = useState('Algoritma Pemrograman, Searching, & Logika Rekursif');
  const [tingkatKesukaran, setTingkatKesukaran] = useState('Dominan HOTS (Level Kognitif C4, C5, C6)');
  const [jumlahPg, setJumlahPg] = useState(10);
  const [jumlahUraian, setJumlahUraian] = useState(5);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Tim Penulis Soal Asesmen Standar Nasional Kemendikdasmen RI.
Susunlah sebuah PAKET SOAL ASESMEN SUMATIF / UJIAN SEKOLAH KOMPREHENSIF BERBASIS HOTS (Higher Order Thinking Skills) berlandaskan regulasi resmi tunggal:
"${REGULASI_BSKAP_2025}".

Spesifikasi Paket Ujian:
- Mata Pelajaran: ${mapel}
- Fase / Jenjang: ${fase}
- Lingkup Materi Pokok: ${lingkupMateri}
- Tingkat Kesukaran: ${tingkatKesukaran}
- Komposisi Butir Soal:
  * ${jumlahPg} Butir Soal Objektif (Pilihan Ganda 5 Opsi A, B, C, D, E + Pilihan Ganda Kompleks + Menjodohkan)
  * ${jumlahUraian} Butir Soal Uraian / Isian Kritis Penalaran Mendalam (Deep Learning Challenge)

STRUKTUR DOKUMEN WAJIB 3 BAGIAN:
=== BAGIAN 1: NASKAH SOAL UJIAN (SIAP DIKERJAKAN SISWA) ===
- Petunjuk Umum Pengerjaan.
- Butir-butir soal bernomor dengan stimulus kontekstual berupa wacana nyata, tabel data, infografis naratif, atau kasus kehidupan sehari-hari (stimulus anti-hafalan).

=== BAGIAN 2: KUNCI JAWABAN & PEMBAHASAN KOMPREHENSIF ===
- Tabel Kunci Jawaban Objektif beserta skor nilai per nomor.
- Pembahasan analitis logis mendalam untuk setiap opsi jawaban (mengapa opsi itu benar dan opsi lain salah).
- Pedoman penskoran & rubrik kriteria jawaban uraian (Skor maksimum, kata kunci, bobot nilai).

=== BAGIAN 3: LEMBAR JAWABAN SISWA (LJS) SIAP CETAK ===
- Kop identitas LJS (Nama Siswa, No. Ujian, Kelas, Tanggal, Paraf).
- Kotak pilihan ganda A, B, C, D, E berderet rapi.
- Kolom khusus lembar jawaban uraian bergaris.

Bahasa Indonesia baku, lugas, mengedepankan stimulus bermakna, dan bebas dari ambiguitas soal.`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: 'Anda adalah Pakar Evaluasi Pendidikan dan Penulis Paket Soal Asesmen Standar Nasional.',
      });
      setOutput(res);
      Swal.fire({
        icon: 'success',
        title: 'Paket Soal & LJS Siap!',
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
        title="NASKAH SOAL ASESMEN SUMATIF & LEMBAR JAWABAN (LJS)"
        subtitle={`MATA PELAJARAN: ${mapel.toUpperCase()} • ${fase.toUpperCase()}`}
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
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Paket Soal Asesmen HOTS &amp; LJS Siap Cetak
            </h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              PG, PG Kompleks, Menjodohkan, Uraian Kritis + Kunci &amp; Lembar Jawaban Siswa
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
              Fase / Jenjang
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
              Tingkat Kesukaran
            </label>
            <select
              value={tingkatKesukaran}
              onChange={(e) => setTingkatKesukaran(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
            >
              <option value="Dominan HOTS (Level Kognitif C4, C5, C6)">Dominan HOTS (Level C4, C5, C6)</option>
              <option value="Proporsional Seimbang (30% LOTS, 40% MOTS, 30% HOTS)">Proporsional (30% LOTS, 40% MOTS, 30% HOTS)</option>
              <option value="Asesmen Diagnostik & Pemahaman Dasar">Asesmen Diagnostik &amp; Pemahaman Dasar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Lingkup Materi Pokok &amp; Stimulus Kontekstual
          </label>
          <input
            type="text"
            value={lingkupMateri}
            onChange={(e) => setLingkupMateri(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jumlah Butir Soal Objektif
            </label>
            <input
              type="number"
              min={5}
              max={40}
              value={jumlahPg}
              onChange={(e) => setJumlahPg(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jumlah Butir Soal Uraian / Isian
            </label>
            <input
              type="number"
              min={2}
              max={15}
              value={jumlahUraian}
              onChange={(e) => setJumlahUraian(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Menyusun Soal & Pembahasan...' : 'Generate Naskah Soal, Kunci, & LJS'}</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Paket Soal Ujian, Pembahasan, &amp; LJS
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
                Cetak Naskah Ujian &amp; LJS
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
