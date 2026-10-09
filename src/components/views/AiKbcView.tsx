import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  Heart,
  Sparkles,
  Printer,
  Copy,
  RefreshCw,
  ShieldCheck,
  Smile,
  Users,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiKbcView: React.FC = () => {
  const mapelList = db.getMapelList();
  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [fokusKasihSayang, setFokusKasihSayang] = useState('Membangun Kepercayaan Diri Siswa Pemalu & Cemas Akademik');
  const [topik, setTopik] = useState('Kolaborasi Proyek Pemrograman dengan Saling Menghargai & Anti-Bullying');
  const [alokasi, setAlokasi] = useState('2 JP (90 Menit)');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Pakar Pedagogi Humanistik & Penggagas Kurikulum Berbasis Cinta (KBC) dan Kasih Sayang Nasional.
Susunlah sebuah RANCANGAN KEGIATAN PEMBELAJARAN BERBASIS KASIH SAYANG (KBC / Compassionate & Heartful Pedagogy) yang terintegrasi harmonis dengan kurikulum nasional:
"${REGULASI_BSKAP_2025}".

Spesifikasi:
- Mata Pelajaran: ${mapel}
- Topik Pembelajaran: ${topik}
- Fokus Dimensi Kasih Sayang: ${fokusKasihSayang}
- Alokasi Waktu: ${alokasi}

Sistematika Dokumen Rencana KBC:
1. Filosofi & Niat Guru (Heartful Intention): Menghubungkan hati guru dengan hati peserta didik sebelum materi kognitif disampaikan.
2. Identifikasi Emosional Peserta Didik (Check-in Zone): Cara mendeteksi kesiapan mental, kecemasan, atau kelelahan siswa.
3. Praktik Sadar Penuh & Penerimaan (Mindful Compassion): Latihan pernapasan 2 menit (STOP technique: Stop, Take a breath, Observe, Proceed) dan afirmasi positif.
4. Desain Pembelajaran Humanis & Inklusif:
   - Bahasa Guru: Kalimat-kalimat apresiatif dan bebas labeling negatif.
   - Aktivitas Saling Mendukung: Pembagian peran kelompok yang memanusiakan setiap anak.
   - Penanganan Kesalahan: Mengubah kesalahan berpikir menjadi momentum perayaan belajar ("Error is a portal of discovery").
5. Refleksi Emosional Penutup: Ungkapan rasa syukur dan pelukan moral/apresiasi guru terhadap kerja keras anak.
6. Rubrik Observasi Iklim Kelas Penuh Kasih Sayang (Indikator: Rasa Aman Siswa, Gotong Royong Tanpa Syarat, Komunikasi Santun).

Gunakan bahasa yang menggetarkan, penuh kelembutan, santun, namun tetap terstruktur ilmiah dan operasional untuk dipraktikkan guru.`;

      const res = await callGeminiGenerate({
        prompt,
        systemInstruction: 'Anda adalah Konselor Pendidikan Humanistik dan Pelopor Kurikulum Berbasis Cinta (KBC).',
      });
      setOutput(res);
      Swal.fire({
        icon: 'success',
        title: 'Perangkat KBC Siap!',
        text: 'Rancangan pembelajaran berbasis kasih sayang berhasil disusun.',
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
        title="RANCANGAN PEMBELAJARAN BERBASIS KASIH SAYANG (KBC)"
        subtitle={`MATA PELAJARAN: ${mapel.toUpperCase()} • FOKUS: ${fokusKasihSayang.toUpperCase()}`}
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
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Perangkat Pembelajaran Berbasis Cinta (KBC)
            </h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Pedagogi Kasih Sayang, Empati Guru, Ikatan Hati, &amp; Kesehatan Mental Murid
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
              Fokus Dimensi Kasih Sayang (KBC)
            </label>
            <input
              type="text"
              value={fokusKasihSayang}
              onChange={(e) => setFokusKasihSayang(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Materi Pelajaran / Topik Kasus Kelas
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
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4 fill-slate-950" />}
            <span>{loading ? 'Menyusun Rencana Kasih Sayang...' : 'Generate Rencana Pembelajaran KBC'}</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              Dokumen Pembelajaran Kasih Sayang (KBC)
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
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-xs leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};
