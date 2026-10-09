import React from 'react';
import { db } from '../services/dbService';
import { Printer, ArrowLeft } from 'lucide-react';

interface OfficialPrintLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  showSignatures?: boolean;
}

export const OfficialPrintLayout: React.FC<OfficialPrintLayoutProps> = ({
  title,
  subtitle,
  children,
  onBack,
  showSignatures = true,
}) => {
  const sekolah = db.getSekolah();
  const guru = db.getGuru();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top action bar (hidden during print) */}
      <div className="no-print flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          )}
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Pratinjau Berkas Cetak Resmi (Kop Sekolah Standar Kemendikdasmen)
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          Cetak Dokumen Sekarang (Ctrl+P)
        </button>
      </div>

      {/* Printable Paper Area (A4 style) */}
      <div className="print-area bg-white text-black p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-300 max-w-4xl mx-auto font-serif">
        {/* KOP SURAT RESMI */}
        <div className="border-b-4 border-double border-black pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-24 h-24 shrink-0 flex items-center justify-center">
              {sekolah.logoUrl ? (
                <img
                  src={sekolah.logoUrl}
                  alt="Logo Sekolah"
                  className="max-h-20 max-w-20 object-contain"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center font-bold text-center text-[10px] p-1 uppercase">
                  TUT WURI HANDAYANI
                </div>
              )}
            </div>
            <div className="flex-1 text-center font-sans space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                PEMERINTAH PROVINSI {sekolah.provinsi.toUpperCase()}
              </h4>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h4>
              <h2 className="text-xl font-black uppercase text-black tracking-wide">
                {sekolah.nama}
              </h2>
              <p className="text-[11px] text-slate-700">
                {sekolah.alamat}, Kel. {sekolah.kelurahan}, Kec. {sekolah.kecamatan}, {sekolah.kabupatenKota} - {sekolah.kodePos}
              </p>
              <p className="text-[10px] text-slate-600">
                Telp: {sekolah.telepon} | NPSN: {sekolah.npsn} | NSS: {sekolah.nss} | Website: {sekolah.website}
              </p>
            </div>
            <div className="w-24 shrink-0 hidden sm:block"></div>
          </div>
        </div>

        {/* JUDUL DOKUMEN */}
        <div className="text-center my-6 space-y-1">
          <h3 className="text-lg font-bold uppercase underline tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium text-slate-800">
              {subtitle}
            </p>
          )}
          <p className="text-[10px] text-slate-600 italic">
            Tahun Ajaran: {sekolah.tahunAjaranAktif} • Semester: {sekolah.semesterAktif}
          </p>
        </div>

        {/* KONTEN DOKUMEN */}
        <div className="text-sm leading-relaxed min-h-[300px]">
          {children}
        </div>

        {/* TITIMANGSA & TANDA TANGAN */}
        {showSignatures && (
          <div className="mt-12 pt-6 font-sans text-xs">
            <div className="flex justify-between items-start">
              {/* Kepala Sekolah */}
              <div className="text-center w-64 space-y-1">
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala {sekolah.nama}</p>
                <div className="h-20"></div>
                <p className="font-bold underline text-sm">{sekolah.kepalaSekolah}</p>
                <p className="text-[11px] font-mono">NIP. {sekolah.nipKepalaSekolah}</p>
              </div>

              {/* Guru Mapel */}
              <div className="text-center w-64 space-y-1">
                <p>{sekolah.kabupatenKota}, {today}</p>
                <p className="font-semibold">Guru Mata Pelajaran,</p>
                <div className="h-20"></div>
                <p className="font-bold underline text-sm">{guru.nama}, {guru.gelar}</p>
                <p className="text-[11px] font-mono">NIP. {guru.nip}</p>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER REGULASI RESMI */}
        <div className="mt-8 pt-3 border-t border-slate-300 text-center text-[9px] text-slate-500 font-sans">
          Dokumen Administrasi Guru Sahih • Berlandaskan Salinan Keputusan Kepala BSKAP Kemendikdasmen No. 046/H/KR/2025 • Dashboard Administrasi Ulfa Ramadhani
        </div>
      </div>
    </div>
  );
};
