import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  Compass,
  Sparkles,
  Printer,
  Copy,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
  Sun,
  BookMarked,
  Activity,
  Heart,
  Users2,
  Moon,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiKokurikulerView: React.FC = () => {
  const distinctKelas = db.getDistinctKelasList();
  const [fase, setFase] = useState('Fase E');
  const [kelas, setKelas] = useState(distinctKelas[0] || 'X.1');
  const [fokusKebiasaan, setFokusKebiasaan] = useState('Integrasi 7 Kebiasaan Lengkap');
  const [durasi, setDurasi] = useState('Program Pembiasaan 1 Bulan (4 Pekan)');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const kebiasaanList = [
    { no: 1, title: 'Bangun Pagi', icon: Sun, desc: 'Memulai hari dengan semangat dan kesiapan mental prima.' },
    { no: 2, title: 'Beribadah Tepat Waktu', icon: Heart, desc: 'Meningkatkan ketakwaan kepada Tuhan YME dan rasa syukur.' },
    { no: 3, title: 'Berolahraga Teratur', icon: Activity, desc: 'Menjaga kebugaran fisik, stamina belajar, dan imunitas tubuh.' },
    { no: 4, title: 'Gemar Membaca (Literasi)', icon: BookMarked, desc: 'Membaca minimal 15 menit setiap hari untuk memperluas wawasan.' },
    { no: 5, title: 'Makan Makanan Sehat & Bergizi', icon: CheckCircle, desc: 'Memilih asupan gizi seimbang dan membawa bekal sehat.' },
    { no: 6, title: 'Bermasyarakat & Gotong Royong', icon: Users2, desc: 'Peduli lingkungan sosial, santun, dan aktif membantu sesama.' },
    { no: 7, title: 'Tidur Cepat & Tepat Waktu', icon: Moon, desc: 'Istirahat cukup 7-8 jam tanpa kecanduan gawai di malam hari.' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Tim Pengembang Kokurikuler & Karakter Pelajar Kementerian Pendidikan Dasar dan Menengah RI.
Rancanglah MODUL KOKURIKULER PENGUATAN KARAKTER: "7 KEBIASAAN ANAK INDONESIA HEBAT" yang operasional, lengkap dengan LEMBAR OBSERVASI HARIAN DAN JURNAL PENILAIAN PERILAKU SISWA.

Landasan Resmi:
"${REGULASI_BSKAP_2025}".

Identitas Modul Kokurikuler:
- Jenjang/Fase: ${fase}
- Rombongan Belajar: ${kelas}
- Fokus Pembiasaan: ${fokusKebiasaan}
- Durasi Pelaksanaan: ${durasi}

Komponen Wajib Dokumen:
1. Rasional & Tujuan Kokurikuler: Mengapa 7 Kebiasaan Anak Indonesia Hebat penting bagi pembentukan profil pelajar berkarakter kuat dan sehat mental.
2. Penjabaran Operasional 7 Pilar Kebiasaan:
   (1) Bangun Pagi (Indikator & Target Perilaku)
   (2) Beribadah (Indikator & Target Perilaku)
   (3) Berolahraga (Indikator & Target Perilaku)
   (4) Gemar Membaca (Indikator & Target Perilaku)
   (5) Makan Makanan Sehat & Bergizi (Indikator & Target Perilaku)
   (6) Bermasyarakat / Gotong Royong (Indikator & Target Perilaku)
   (7) Tidur Cepat / Tepat Waktu (Indikator & Target Perilaku)
3. Alur Kegiatan Pembiasaan Mingguan (Pekan 1 s.d. Pekan 4).
4. Instrumen Lembar Observasi Harian Siswa (Format tabel checklist centang Senin-Minggu dengan kolom paraf orang tua).
5. Format Jurnal Refleksi Mingguan Peserta Didik & Catatan Pembimbingan Wali Kelas.
6. Rubrik Penilaian Portofolio Karakter (Kategori: Mulai Terbiasa, Berkembang, Membudaya).

Sajikan dalam format dokumen formal yang siap dicetak dan dibagikan kepada peserta didik dan orang tua siswa.`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: 'Anda adalah Pengembang Karakter Anak Bangsa & Kurikulum Kokurikuler Kemendikdasmen.',
      });
      setOutput(res);
      Swal.fire({
        icon: 'success',
        title: 'Modul 7 Kebiasaan Siap!',
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
        title="MODUL KOKURIKULER 7 KEBIASAAN ANAK INDONESIA HEBAT"
        subtitle={`KELAS / ROMBEL: ${kelas} (${fase.toUpperCase()}) • TAHUN AJARAN 2024/2025`}
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
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">
                Kokurikuler &amp; 7 Kebiasaan Anak Indonesia Hebat
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                7 KEBIASAAN
              </span>
            </div>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Program Pembiasaan Karakter Unggul &amp; Lembar Observasi Harian Siswa
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 7 Habits Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {kebiasaanList.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.no}
              className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-orange-200 dark:border-orange-900/60 shadow-xs flex flex-col items-center text-center space-y-1.5"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                Pilar {k.no}
              </span>
              <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                {k.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Form Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              Kelas / Rombel
            </label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-orange-600"
            >
              {distinctKelas.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Fokus Pembiasaan
            </label>
            <select
              value={fokusKebiasaan}
              onChange={(e) => setFokusKebiasaan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            >
              <option value="Integrasi 7 Kebiasaan Lengkap">Integrasi 7 Kebiasaan Lengkap (Utuh)</option>
              <option value="Fokus Bangun Pagi, Olahraga, & Gizi Sehat">Fokus Fisik: Bangun Pagi, Olahraga, &amp; Gizi</option>
              <option value="Fokus Gemar Membaca & Bermasyarakat">Fokus Intelektual &amp; Sosial: Membaca &amp; Gotong Royong</option>
              <option value="Fokus Ibadah & Manajemen Tidur">Fokus Spiritual &amp; Istirahat Berkualitas</option>
            </select>
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
            <span>{loading ? 'Menyusun Modul Kokurikuler...' : 'Susun Modul & Lembar Observasi 7 Kebiasaan'}</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Naskah Modul &amp; Instrumen Lembar Observasi
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
                Cetak Lembar Observasi
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
