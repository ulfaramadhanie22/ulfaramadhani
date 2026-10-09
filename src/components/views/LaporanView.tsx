import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  Printer,
  FileCheck,
  BookMarked,
  Award,
  Users,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const LaporanView: React.FC = () => {
  const guru = db.getGuru();
  const sekolah = db.getSekolah();
  const siswaList = db.getSiswaList();
  const agendaList = db.getAgendaList();
  const nilaiList = db.getNilaiList();

  const [activePrintType, setActivePrintType] = useState<string | null>(null);

  const reportItems = [
    {
      id: 'cover-bk1',
      title: 'Cover & Halaman Judul Buku Kerja Guru 1',
      desc: 'Standar Dokumen SKL, CP (SK 046/2025), TP, ATP, dan Modul Ajar Deep Learning.',
      badge: 'BUKU KERJA 1',
    },
    {
      id: 'cover-bk2',
      title: 'Cover & Halaman Judul Buku Kerja Guru 2',
      desc: 'Dokumen Program Tahunan (Prota), Program Semester (Prosem), Silabus, dan KKTP.',
      badge: 'BUKU KERJA 2',
    },
    {
      id: 'cover-bk3',
      title: 'Cover & Halaman Judul Buku Kerja Guru 3',
      desc: 'Daftar Hadir Siswa, Nilai Rapor/Leger, Catatan Penilaian Sikap, dan Jurnal Mengajar.',
      badge: 'BUKU KERJA 3',
    },
    {
      id: 'cover-bk4',
      title: 'Cover & Halaman Judul Buku Kerja Guru 4',
      desc: 'Daftar Evaluasi Diri Guru dan Rencana Pengembangan Keprofesian Berkelanjutan (PKB).',
      badge: 'BUKU KERJA 4',
    },
    {
      id: 'rekap-absensi',
      title: 'Rekapitulasi Presensi Siswa Semester Genap',
      desc: 'Daftar kompilasi kehadiran bulanan seluruh siswa rombel.',
      badge: 'PRESENSI',
    },
    {
      id: 'buku-agenda',
      title: 'Kompilasi Jurnal Harian Mengajar Guru',
      desc: 'Rekam jejak seluruh pelaksanaan KBM di kelas beserta kendala dan solusinya.',
      badge: 'JURNAL GURU',
    },
  ];

  if (activePrintType) {
    let docTitle = 'BUKU ADMINISTRASI GURU PROFESIONAL';
    let docSubtitle = `${sekolah.nama} • TAHUN PELAJARAN ${sekolah.tahunAjaranAktif}`;

    if (activePrintType === 'cover-bk1') docTitle = 'BUKU KERJA GURU I (STANDAR PERANGKAT PEMBELAJARAN)';
    if (activePrintType === 'cover-bk2') docTitle = 'BUKU KERJA GURU II (PROTA, PROSEM, & KKTP)';
    if (activePrintType === 'cover-bk3') docTitle = 'BUKU KERJA GURU III (PRESENSI, NILAI, & JURNAL KBM)';
    if (activePrintType === 'cover-bk4') docTitle = 'BUKU KERJA GURU IV (EVALUASI DIRI & PKB GURU)';
    if (activePrintType === 'rekap-absensi') docTitle = 'REKAPITULASI KEHADIRAN SISWA SATU SEMESTER';
    if (activePrintType === 'buku-agenda') docTitle = 'BUKU JURNAL AGENDA HARIAN KBM KELAS';

    return (
      <OfficialPrintLayout
        title={docTitle}
        subtitle={docSubtitle}
        onBack={() => setActivePrintType(null)}
      >
        {activePrintType.startsWith('cover') ? (
          <div className="py-12 text-center space-y-8 font-serif">
            <div className="space-y-3">
              <h1 className="text-2xl font-black uppercase tracking-wider text-black">
                {docTitle}
              </h1>
              <p className="text-sm font-semibold tracking-wide text-slate-700">
                KURIKULUM MERDEKA - PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)
              </p>
              <p className="text-xs text-slate-600 italic">
                Berlandaskan Salinan Keputusan Kepala BSKAP Kemendikdasmen No. 046/H/KR/2025
              </p>
            </div>

            <div className="w-36 h-36 mx-auto rounded-full p-2 border-2 border-black flex items-center justify-center">
              {sekolah.logoUrl ? (
                <img src={sekolah.logoUrl} alt="Logo" className="max-h-28 object-contain" />
              ) : (
                <span className="font-bold text-xs uppercase">TUT WURI HANDAYANI</span>
              )}
            </div>

            <div className="max-w-md mx-auto p-6 border-2 border-black rounded-xl text-left font-sans text-xs space-y-2 bg-slate-50">
              <div className="flex justify-between">
                <span className="text-slate-600">Nama Guru:</span>
                <strong className="font-bold">{guru.nama}, {guru.gelar}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">NIP:</span>
                <span className="font-mono">{guru.nip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Mata Pelajaran:</span>
                <strong>{guru.mapelUtama}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Satuan Pendidikan:</span>
                <strong>{sekolah.nama}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tahun Pelajaran:</span>
                <strong>{sekolah.tahunAjaranAktif} (Semester {sekolah.semesterAktif})</strong>
              </div>
            </div>
          </div>
        ) : activePrintType === 'rekap-absensi' ? (
          <div className="space-y-4 font-sans text-xs">
            <p>Daftar persentase kehadiran peserta didik di seluruh rombongan belajar:</p>
            <table className="w-full text-left border-collapse border border-black">
              <thead>
                <tr className="bg-slate-200 border-b border-black font-bold">
                  <th className="p-2 border border-black text-center w-10">No</th>
                  <th className="p-2 border border-black text-center w-24">NISN</th>
                  <th className="p-2 border border-black">Nama Peserta Didik</th>
                  <th className="p-2 border border-black text-center w-16">Kelas</th>
                  <th className="p-2 border border-black text-center w-20">Kehadiran</th>
                  <th className="p-2 border border-black text-center w-28">Status Kedisiplinan</th>
                </tr>
              </thead>
              <tbody>
                {siswaList.map((s, idx) => (
                  <tr key={s.id} className="border-b border-black">
                    <td className="p-2 border border-black text-center">{idx + 1}</td>
                    <td className="p-2 border border-black text-center font-mono">{s.nisn}</td>
                    <td className="p-2 border border-black font-semibold">{s.nama}</td>
                    <td className="p-2 border border-black text-center">{s.kelas}</td>
                    <td className="p-2 border border-black text-center font-bold">98%</td>
                    <td className="p-2 border border-black text-center text-emerald-800 font-bold">Sangat Baik</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4 font-sans text-xs">
            <p>Rekapitulasi Jurnal Mengajar Harian Guru:</p>
            <table className="w-full text-left border-collapse border border-black">
              <thead>
                <tr className="bg-slate-200 border-b border-black font-bold">
                  <th className="p-2 border border-black text-center w-10">No</th>
                  <th className="p-2 border border-black text-center w-24">Tanggal</th>
                  <th className="p-2 border border-black text-center w-16">Kelas</th>
                  <th className="p-2 border border-black">Materi Pokok &amp; TP</th>
                  <th className="p-2 border border-black">Aktivitas KBM Deep Learning</th>
                  <th className="p-2 border border-black text-center w-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {agendaList.map((a, idx) => (
                  <tr key={a.id} className="border-b border-black">
                    <td className="p-2 border border-black text-center">{idx + 1}</td>
                    <td className="p-2 border border-black text-center font-mono">{a.tanggal}</td>
                    <td className="p-2 border border-black text-center font-bold">{a.kelas}</td>
                    <td className="p-2 border border-black">{a.materiPokok}</td>
                    <td className="p-2 border border-black text-[11px]">{a.kegiatanKbm}</td>
                    <td className="p-2 border border-black text-center font-bold">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </OfficialPrintLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-500 text-slate-950 p-5 rounded-2xl shadow-md border-2 border-yellow-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600 rounded-xl text-slate-950 font-black">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Pusat Cetak &amp; Laporan Administrasi 1-Klik
            </h2>
            <p className="text-xs text-slate-900 font-semibold flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-900" />
              Cover Buku Kerja Guru 1, 2, 3, 4 &amp; Rekapitulasi Rapor Siap Supervisi Pengawas
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-amber-200 dark:border-amber-800/80 shadow-md space-y-4 hover:border-amber-400 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-black uppercase">
                {item.badge}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePrintType(item.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Buka &amp; Cetak</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
