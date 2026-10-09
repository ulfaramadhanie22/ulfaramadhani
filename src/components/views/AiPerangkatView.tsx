import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  FileCode2,
  Sparkles,
  Printer,
  Copy,
  Save,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiPerangkatView: React.FC = () => {
  const mapelList = db.getMapelList();
  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [fase, setFase] = useState('Fase E');
  const [tingkat, setTingkat] = useState('Kelas X');
  const [jenisDokumen, setJenisDokumen] = useState<'CP-TP-ATP' | 'PROTA' | 'PROSEM' | 'KKTP'>('CP-TP-ATP');
  const [alokasiJp, setAlokasiJp] = useState('72 JP (2 Semester)');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Tim Ahli Kurikulum Nasional Kementerian Pendidikan Dasar dan Menengah RI.
Susunlah dokumen perangkat administrasi mengajar resmi Kurikulum Merdeka berlandaskan regulasi resmi tunggal:
"${REGULASI_BSKAP_2025}".

Identitas:
- Mata Pelajaran: ${mapel}
- Fase: ${fase}
- Tingkat: ${tingkat}
- Jenis Dokumen yang Disusun: ${jenisDokumen}
- Alokasi Jam Pertemuan: ${alokasiJp}

Petunjuk Spesifik Jenis Dokumen:
${
  jenisDokumen === 'CP-TP-ATP'
    ? `1. Analisis Elemen Capaian Pembelajaran (CP) berdasarkan SK BSKAP 046/H/KR/2025.
2. Penurunan Capaian Pembelajaran menjadi Tujuan Pembelajaran (TP) yang memuat Kompetensi dan Lingkup Materi.
3. Penyusunan Alur Tujuan Pembelajaran (ATP) terurut logis dari yang konkret ke abstrak (Fase Deep Learning), dilengkapi alokasi JP per TP, profil pelajar, dan asesmen rencana.`
    : jenisDokumen === 'PROTA'
    ? `Penyusunan Program Tahunan (PROTA) lengkap untuk Semester 1 (Ganjil) dan Semester 2 (Genap), memuat No, Elemen CP (SK 046/2025), Capaian Pembelajaran, Alur Tujuan Pembelajaran (ATP), dan Alokasi Jam Pelajaran (JP).`
    : jenisDokumen === 'PROSEM'
    ? `Penyusunan Program Semester (PROSEM) memuat distribusi minggu efektif per bulan (Juli - Desember atau Januari - Juni), materi pokok per TP, jadwal STS, SAS, remedial, dan cadangan waktu.`
    : `Penyusunan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) lengkap dengan 3 pendekatan:
1. Deskripsi Kriteria Ketercapaian.
2. Rubrik Skala 4 Level (Baru Berkembang, Layak, Cakap, Mahir).
3. Interval Nilai (0-60, 61-74, 75-84, 85-100) dan tindak lanjut intervensi guru.`
}

Format dokumen harus formal, menggunakan penomoran tabel baku, siap dicetak untuk Buku Kerja Pengawas dan Kepala Sekolah.`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: `Anda adalah Spesialis Administrasi Guru Kurikulum Merdeka RI berlandaskan SK BSKAP 046/H/KR/2025.`,
      });

      setOutput(res);
      Swal.fire({
        icon: 'success',
        title: 'Perangkat Pembelajaran Disusun!',
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

  const handleSaveDoc = () => {
    db.saveAiDoc({
      id: 'doc-' + Date.now(),
      kategori: `Perangkat ${jenisDokumen}`,
      judul: `${jenisDokumen} - ${mapel} (${tingkat})`,
      tanggalDibuat: new Date().toISOString(),
      konten: output,
    });
    Swal.fire({ icon: 'success', title: 'Tersimpan di Dokumen AI', timer: 1500, showConfirmButton: false });
  };

  if (isPrintMode && output) {
    return (
      <OfficialPrintLayout
        title={`DOKUMEN ${jenisDokumen} KURIKULUM MERDEKA`}
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
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Suite CP, TP, ATP, Prota, Prosem, &amp; KKTP
            </h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Buku Kerja Guru 1 &amp; 2 • Rujukan Otentik SK BSKAP No. 046/H/KR/2025
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Jenis Dokumen */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'CP-TP-ATP', label: '1. Analisis CP, TP & Alur (ATP)' },
          { id: 'PROTA', label: '2. Program Tahunan (PROTA)' },
          { id: 'PROSEM', label: '3. Program Semester (PROSEM)' },
          { id: 'KKTP', label: '4. Kriteria Ketuntasan (KKTP)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setJenisDokumen(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              jenisDokumen === tab.id
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-md ring-2 ring-orange-300'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-orange-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Settings */}
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
            <select
              value={fase}
              onChange={(e) => setFase(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            >
              <option value="Fase A">Fase A (SD Kelas 1-2)</option>
              <option value="Fase B">Fase B (SD Kelas 3-4)</option>
              <option value="Fase C">Fase C (SD Kelas 5-6)</option>
              <option value="Fase D">Fase D (SMP Kelas 7-9)</option>
              <option value="Fase E">Fase E (SMA/SMK Kelas 10)</option>
              <option value="Fase F">Fase F (SMA/SMK Kelas 11-12)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tingkat Kelas
            </label>
            <input
              type="text"
              value={tingkat}
              onChange={(e) => setTingkat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
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
            <span>{loading ? 'Menyusun Dokumen Regulasi...' : `Generate Dokumen ${jenisDokumen}`}</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Naskah Resmi {jenisDokumen}
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
                onClick={handleSaveDoc}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                <Save className="w-3.5 h-3.5 inline mr-1" />
                Simpan
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
