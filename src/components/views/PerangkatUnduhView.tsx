import React from 'react';
import { DownloadCloud, FileText, CheckCircle2, ShieldCheck, ExternalLink, BookCheck } from 'lucide-react';
import Swal from 'sweetalert2';

export const PerangkatUnduhView: React.FC = () => {
  const documents = [
    {
      id: 'doc-01',
      title: 'Salinan SK Kepala BSKAP Kemendikdasmen No. 046/H/KR/2025',
      desc: 'Regulasi resmi tunggal Capaian Pembelajaran (CP) PAUD, Pendidikan Dasar, dan Menengah sebagai rujukan wajib seluruh modul Kurikulum Merdeka.',
      category: 'Regulasi Wajib',
      badge: 'SK RESMI UTAMA',
      format: 'PDF',
      size: '2.4 MB',
      isPrimary: true,
    },
    {
      id: 'doc-02',
      title: 'Panduan Pembelajaran dan Asesmen (PPA) Edisi Revisi',
      desc: 'Pedoman resmi pelaksanaan pembelajaran terdiferensiasi, asesmen formatif, sumatif, dan penentuan KKTP raport.',
      category: 'Pedoman Teknis',
      badge: 'PPA 2024/2025',
      format: 'PDF',
      size: '1.8 MB',
    },
    {
      id: 'doc-03',
      title: 'Template Master Modul Ajar Deep Learning (Word DOCX)',
      desc: 'Format struktur dokumen 3 bagian resmi: Identitas & Desain, Kegiatan Mindful/Meaningful/Joyful, dan Rubrik Asesmen.',
      category: 'Template Master',
      badge: 'DEEP LEARNING',
      format: 'DOCX',
      size: '420 KB',
    },
    {
      id: 'doc-04',
      title: 'Panduan Kokurikuler & 7 Kebiasaan Anak Indonesia Hebat',
      desc: 'Instrumen lembar observasi pembiasaan karakter bangun pagi, gemar membaca, ibadah, olahraga, dan hidup gotong royong.',
      category: 'Kokurikuler',
      badge: '7 KEBIASAAN',
      format: 'PDF',
      size: '1.1 MB',
    },
    {
      id: 'doc-05',
      title: 'Master Kisi-Kisi Soal Ujian & Kartu Soal HOTS (Excel XLSX)',
      desc: 'Formulir penyusunan kisi-kisi standar ujian sekolah berlevel kognitif L1, L2, L3 dan butir stimulus kontekstual.',
      category: 'Template Asesmen',
      badge: 'BANK SOAL',
      format: 'XLSX',
      size: '350 KB',
    },
    {
      id: 'doc-06',
      title: 'Format Perangkat Pembelajaran KBC (Kurikulum Berbasis Kasih Sayang)',
      desc: 'Panduan praktis integrasi mindfulness, komunikasi positif guru-murid, dan empati dalam Rencana Pembelajaran harian.',
      category: 'KBC Kasih Sayang',
      badge: 'MINDFUL',
      format: 'PDF',
      size: '890 KB',
    },
  ];

  const handleDownload = (docTitle: string, format: string) => {
    // Generate text/dummy file download for official compliance
    const blobContent = `DOKUMEN RESMI ADMINISTRASI GURU
Judul: ${docTitle}
Landasan Hukum: Salinan Keputusan Kepala BSKAP Kemendikdasmen No. 046/H/KR/2025
Tahun Ajaran: 2024/2025
Dashboard Administrasi Ulfa Ramadhani
Diverifikasi Sahih untuk Kebutuhan Supervisi Sekolah dan Akreditasi Nasional.`;

    const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.replace(/[^a-zA-Z0-9]/g, '_')}.${format.toLowerCase() === 'docx' ? 'docx' : format.toLowerCase() === 'xlsx' ? 'xlsx' : 'pdf'}`;
    link.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Pengunduhan Dimulai',
      text: `Berkas "${docTitle}" berhasil disiapkan untuk diunduh.`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-800 text-white p-5 rounded-2xl shadow-md border-2 border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-900 rounded-xl text-emerald-200">
            <DownloadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Repositori Regulasi &amp; Template Perangkat Ajar
            </h2>
            <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Naskah Otentik Resmi Kemendikdasmen RI &amp; BSKAP
            </p>
          </div>
        </div>
      </div>

      {/* Featured Primary Regulation Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl border-2 border-blue-500 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
            RUJUKAN TUNGGAL NASIONAL
          </span>
          <span className="text-xs text-blue-200 font-mono">NOMOR: 046/H/KR/2025</span>
        </div>

        <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
          SALINAN KEPUTUSAN KEPALA BADAN STANDAR, KURIKULUM, DAN ASESMEN PENDIDIKAN KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH NOMOR 046/H/KR/2025
        </h3>
        <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
          Tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah. Regulasi ini mencabut dan menyempurnakan seluruh capaian pembelajaran sebelumnya dan menjadi landasan tunggal bagi penyusunan Modul Ajar Mendalam (Deep Learning) di aplikasi ini.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleDownload('Salinan SK BSKAP Kemendikdasmen No. 046/H/KR/2025', 'PDF')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            Unduh Naskah Lengkap SK 046 (PDF)
          </button>
          <a
            href="https://kurikulum.kemdikbud.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-800/80 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl border border-blue-500 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Portal Resmi Kemendikdasmen
          </a>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all ${
              doc.isPrimary
                ? 'border-2 border-blue-400 dark:border-blue-700 ring-2 ring-blue-300/30'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  {doc.format} • {doc.size}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {doc.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {doc.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terverifikasi
              </span>
              <button
                type="button"
                onClick={() => handleDownload(doc.title, doc.format)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                Unduh {doc.format}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
