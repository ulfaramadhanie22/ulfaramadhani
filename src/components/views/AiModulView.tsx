import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { callGeminiGenerate, REGULASI_BSKAP_2025 } from '../../services/aiService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  Sparkles,
  Printer,
  Copy,
  Save,
  Check,
  RefreshCw,
  ShieldCheck,
  Heart,
  Smile,
  BookOpen,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const AiModulView: React.FC = () => {
  const mapelList = db.getMapelList();
  const distinctKelas = db.getDistinctKelasList();

  const [mapel, setMapel] = useState(mapelList[0]?.nama || 'Informatika');
  const [fase, setFase] = useState('Fase E');
  const [kelas, setKelas] = useState(distinctKelas[0] || 'X.1');
  const [alokasiWaktu, setAlokasiWaktu] = useState('2 x 45 Menit (1 Pertemuan)');
  const [elemenCp, setElemenCp] = useState('Berpikir Komputasional & Algoritma');
  const [topikMateri, setTopikMateri] = useState('Algoritma Pencarian & Pengurutan Berbasis Kasus Kehidupan Nyata');
  const [modelPembelajaran, setModelPembelajaran] = useState('Problem Based Learning (PBL)');
  const [dimensiProfil, setDimensiProfil] = useState('Bernalar Kritis, Kreatif, dan Gotong Royong');

  const [generatedDoc, setGeneratedDoc] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Anda adalah Tim Pengembang Kurikulum Kemendikdasmen RI dan Ahli Pendekatan Pembelajaran Mendalam (Deep Learning Framework).
Susunlah sebuah RENCANA PELAKSANAAN PEMBELAJARAN / MODUL AJAR MENDALAM (DEEP LEARNING: Mindful, Meaningful, Joyful Learning) yang sangat komprehensif, operasional, dan profesional untuk guru.

Wajib berlandaskan regulasi resmi tunggal:
"${REGULASI_BSKAP_2025}".

Identitas Modul yang Diinputkan Guru:
- Mata Pelajaran: ${mapel}
- Fase: ${fase}
- Kelas/Rombel: ${kelas}
- Alokasi Waktu: ${alokasiWaktu}
- Elemen Capaian Pembelajaran (CP 046/H/KR/2025): ${elemenCp}
- Topik / Materi Pembelajaran: ${topikMateri}
- Model Pembelajaran: ${modelPembelajaran}
- Dimensi Profil Pelajar Pancasila: ${dimensiProfil}

SISTEMATIKA DOKUMEN WAJIB 3 BAGIAN LENGKAP:
=== BAGIAN 1: IDENTITAS MODUL & PROFIL PEMBELAJAR ===
1. Informasi Umum (Nama Guru, Satuan Pendidikan, Fase/Kelas, Alokasi Waktu, Moda Pembelajaran).
2. Dimensi Profil Pelajar yang disasar secara eksplisit.
3. Sarana & Prasarana serta Karakteristik Peserta Didik (Scaffolding dan diferensiasi).

=== BAGIAN 2: DESAIN PEMBELAJARAN (DEEP LEARNING FRAMEWORK) ===
1. Capaian Pembelajaran Elemen (Kutipan Resmi SK 046/H/KR/2025).
2. Tujuan Pembelajaran (TP) yang terukur dan aplikatif.
3. Pemahaman Bermakna (Meaningful Learning: Menghubungkan konsep pelajaran dengan pemecahan masalah nyata siswa).
4. Pertanyaan Pemantik Kritis (Mindful Learning: Memantik rasa ingin tahu dan kesadaran berpikir mendalam).
5. Indikator Ketercapaian Tujuan Pembelajaran (KKTP deskriptif).

=== BAGIAN 3: LANGKAH KEGIATAN PEMBELAJARAN (MINDFUL, MEANINGFUL, JOYFUL) & ASESMEN ===
1. Kegiatan Pendahuluan (15 Menit):
   - Presensi berkesadaran (Mindful Greeting & Check-in Emosi Siswa).
   - Apersepsi kontekstual dan penyampaian tujuan yang menggembirakan (Joyful Hook).
2. Kegiatan Inti (60 Menit) - Sesuai Sintaks ${modelPembelajaran}:
   - Eksplorasi Konseptual (Mindful Observation).
   - Kolaborasi Kelompok & Pemecahan Masalah Nyata (Meaningful Collaboration).
   - Unjuk Kreasi / Karya Digital & Presentasi Gembira (Joyful Sharing & Feedback).
3. Kegiatan Penutup (15 Menit):
   - Refleksi 3-2-1 Metakognitif Peserta Didik.
   - Penguatan afektif oleh Guru dan apresiasi kelas.
4. Asesmen Pembelajaran Terpadu:
   - Asesmen Awal (Diagnostik non-kognitif & kognitif).
   - Asesmen Formatif (Observasi proses, checklist keaktifan, performa lembar kerja).
   - Asesmen Sumatif Lingkup Materi + Rubrik Penilaian Detail (Kriteria: Baru Berkembang, Layak, Cakap, Mahir).
5. Remedial dan Pengayaan Kontekstual.

Format sajian harus sangat rapi dengan tanda bullet, penomoran terstruktur, tabel atau rubrik jelas, dan bahasa Indonesia baku profesional pendidik.`;

      const result = await callGeminiGenerate({
        prompt,
        systemInstruction: `Anda adalah Ahli Kurikulum Nasional Indonesia & Perancang Modul Ajar Deep Learning berlandaskan SK BSKAP No. 046/H/KR/2025. Hasilkan modul ajar lengkap, siap pakai langsung di kelas, tanpa placeholder kosong.`,
        temperature: 0.7,
      });

      setGeneratedDoc(result);
      Swal.fire({
        icon: 'success',
        title: 'Modul Ajar Deep Learning Siap!',
        text: 'Rencana pembelajaran mendalam berbasis SK 046/H/KR/2025 berhasil disusun.',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyusun Modul',
        text: err.message || 'Terjadi gangguan saat memanggil Gemini AI.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    Swal.fire({
      icon: 'success',
      title: 'Teks Disalin',
      text: 'Naskah Modul Ajar telah disalin ke clipboard.',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleSaveToDocs = () => {
    db.saveAiDoc({
      id: 'doc-' + Date.now(),
      kategori: 'Modul Ajar Deep Learning',
      judul: `Modul Ajar - ${mapel} (${topikMateri.substring(0, 30)}...)`,
      tanggalDibuat: new Date().toISOString(),
      konten: generatedDoc,
      metadata: { mapel, fase, kelas, elemenCp },
    });
    Swal.fire({
      icon: 'success',
      title: 'Tersimpan di Dokumen AI',
      text: 'Modul telah disimpan permanen di database lokal Anda.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (isPrintMode && generatedDoc) {
    return (
      <OfficialPrintLayout
        title={`MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)`}
        subtitle={`MATA PELAJARAN: ${mapel.toUpperCase()} • KELAS: ${kelas} (${fase.toUpperCase()})`}
        onBack={() => setIsPrintMode(false)}
      >
        <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed space-y-4">
          {generatedDoc}
        </div>
      </OfficialPrintLayout>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-orange-600 text-white p-5 rounded-2xl shadow-md border-2 border-orange-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-700 rounded-xl text-orange-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">
                Generator Modul Ajar Deep Learning
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase">
                HOT SUITE
              </span>
            </div>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Mindful, Meaningful, &amp; Joyful Learning • Berlandaskan SK BSKAP No. 046/H/KR/2025
            </p>
          </div>
        </div>
      </div>

      {/* 3 Prinsip Deep Learning Info Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-orange-200 dark:border-orange-900 flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">1. Mindful Learning</h4>
            <p className="text-[10px] text-slate-500">Kesadaran diri, fokus penuh, dan refleksi mendalam.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">2. Meaningful Learning</h4>
            <p className="text-[10px] text-slate-500">Kontekstual, memecahkan masalah nyata dunia siswa.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">3. Joyful Learning</h4>
            <p className="text-[10px] text-slate-500">Menyenangkan, memicu gairah eksplorasi &amp; kolaborasi.</p>
          </div>
        </div>
      </div>

      {/* Form Input Generator */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
          Parameter Desain Modul Ajar
        </h3>

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
              Fase Kurikulum Merdeka
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alokasi Waktu
            </label>
            <input
              type="text"
              value={alokasiWaktu}
              onChange={(e) => setAlokasiWaktu(e.target.value)}
              placeholder="Contoh: 2 x 45 Menit (1 Pertemuan)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Model Pembelajaran
            </label>
            <select
              value={modelPembelajaran}
              onChange={(e) => setModelPembelajaran(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
            >
              <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
              <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
              <option value="Discovery / Inquiry Learning">Discovery / Inquiry Learning</option>
              <option value="Differentiated Cooperative Learning">Differentiated Cooperative Learning</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Elemen Capaian Pembelajaran (SK 046/H/KR/2025)
            </label>
            <input
              type="text"
              value={elemenCp}
              onChange={(e) => setElemenCp(e.target.value)}
              placeholder="Contoh: Berpikir Komputasional"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Topik Pokok / Studi Kasus Kontekstual
            </label>
            <input
              type="text"
              value={topikMateri}
              onChange={(e) => setTopikMateri(e.target.value)}
              placeholder="Contoh: Optimasi Jalur Ekspedisi Logistik Menggunakan Graph"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Dimensi Profil Pelajar Pancasila
          </label>
          <input
            type="text"
            value={dimensiProfil}
            onChange={(e) => setDimensiProfil(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Menyusun Modul Ajar Mendalam (Gemini AI)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Susun Modul Ajar Deep Learning Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Display Area */}
      {generatedDoc && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600 font-bold">
                <BookOpen className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Hasil Naskah Dokumen Modul Ajar Resmi
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
              >
                <Copy className="w-3.5 h-3.5" />
                Salin Teks
              </button>
              <button
                type="button"
                onClick={handleSaveToDocs}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsPrintMode(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Cetak Format Kop Resmi
              </button>
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 font-sans text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-[600px] overflow-y-auto">
            {generatedDoc}
          </div>
        </div>
      )}
    </div>
  );
};
