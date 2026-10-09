import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { ActiveMenu } from '../../types';
import {
  Users,
  BookOpen,
  Calendar,
  Sparkles,
  CreditCard,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (menu: ActiveMenu) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [data, setData] = useState({
    guru: db.getGuru(),
    sekolah: db.getSekolah(),
    siswa: db.getSiswaList(),
    mapel: db.getMapelList(),
    jadwal: db.getJadwalList(),
    agenda: db.getAgendaList(),
    nilai: db.getNilaiList(),
    presensi: db.getPresensiList(),
  });

  useEffect(() => {
    const handleUpdate = () => {
      setData({
        guru: db.getGuru(),
        sekolah: db.getSekolah(),
        siswa: db.getSiswaList(),
        mapel: db.getMapelList(),
        jadwal: db.getJadwalList(),
        agenda: db.getAgendaList(),
        nilai: db.getNilaiList(),
        presensi: db.getPresensiList(),
      });
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const totalSiswa = data.siswa.length;
  const siswaL = data.siswa.filter((s) => s.gender === 'L').length;
  const siswaP = data.siswa.filter((s) => s.gender === 'P').length;
  const totalMapel = data.mapel.length;

  // Calculate attendance rate
  const totalPresensi = data.presensi.length;
  const hadirCount = data.presensi.filter((p) => p.status === 'H').length;
  const avgKehadiran = totalPresensi > 0 ? Math.round((hadirCount / totalPresensi) * 100) : 98;

  // Jadwal Hari Ini
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayDayName = dayNames[new Date().getDay()];
  const jadwalHariIni = data.jadwal.filter((j) => j.hari === todayDayName);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-700/50">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-400/40 text-[11px] font-bold text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Standardisasi Resmi: SK BSKAP No. 046/H/KR/2025
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Selamat Bertugas, Ibu {data.guru.nama}, {data.guru.gelar}!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Dashboard Administrasi Guru Kurikulum Merdeka dengan pendekatan <strong className="text-amber-300 font-semibold">Deep Learning (Mindful, Meaningful, Joyful Learning)</strong>. Kelola administrasi mengajar, leger nilai, presensi harian, dan ciptakan modul ajar berdaya tinggi dalam hitungan detik.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-blue-200">
              <span className="font-semibold text-white">Instansi: {data.sekolah.nama}</span>
              <span>•</span>
              <span>TA: {data.sekolah.tahunAjaranAktif} ({data.sekolah.semesterAktif})</span>
              <span>•</span>
              <span className="font-mono text-amber-300">NIP: {data.guru.nip}</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('ai-modul')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Buat Modul Ajar Deep Learning
            </button>
            <button
              type="button"
              onClick={() => onNavigate('perangkat-unduh')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-800/90 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl border border-blue-600 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              Salinan SK 046/H/KR/2025
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Aksi Pintas Cepat (Quick Actions)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('presensi')}
            className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100">Presensi Hari Ini</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300">Set kehadiran 1-klik</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('nilai')}
            className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-300 dark:border-purple-800 transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-950 dark:text-purple-100">Input &amp; Leger Nilai</p>
              <p className="text-[10px] text-purple-700 dark:text-purple-300">Formatif, Sumatif, KKTP</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('kartu-siswa')}
            className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-300 dark:border-cyan-800 transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-cyan-950 dark:text-cyan-100">Cetak Kartu Siswa QR</p>
              <p className="text-[10px] text-cyan-700 dark:text-cyan-300">Format lembar A4 (8 kartu)</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ai-soal')}
            className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-300 dark:border-orange-800 transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-950 dark:text-orange-100">Buat Soal &amp; LJS</p>
              <p className="text-[10px] text-orange-700 dark:text-orange-300">HOTS + Kisi-kisi resmi</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Siswa */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-cyan-300 dark:border-cyan-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
              Peserta Didik
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalSiswa}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              L: <strong className="text-cyan-600 font-bold">{siswaL}</strong> • P: <strong className="text-pink-600 font-bold">{siswaP}</strong> anak
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Mata Pelajaran */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-purple-300 dark:border-purple-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Mata Pelajaran
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalMapel}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Fase E &amp; F Kurikulum Merdeka
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Rata-rata Kehadiran */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Rerata Kehadiran
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1">
              {avgKehadiran}%
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Disiplin kelas terpantau prima
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Kelengkapan Administrasi */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Perangkat Ajar
            </span>
            <div className="text-3xl font-black text-amber-500 dark:text-amber-400">
              100%
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Sesuai SK BSKAP 046/2025
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4. Jadwal KBM Hari Ini & Aktivitas Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jadwal Hari Ini (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Jadwal Mengajar Hari Ini ({todayDayName})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sesi KBM aktif sesuai pembagian jam kurikulum
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('jadwal')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {jadwalHariIni.length > 0 ? (
            <div className="space-y-3">
              {jadwalHariIni.map((j) => (
                <div
                  key={j.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold shrink-0">
                      {j.jamMulai} - {j.jamSelesai}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {j.mapelNama}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Kelas: <span className="font-bold text-rose-700 dark:text-rose-400">{j.kelas}</span> • Ruang: {j.ruang}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('presensi')}
                      className="px-3 py-1 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      Absensi
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('agenda')}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Isi Jurnal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Tidak ada jadwal mengajar tetap untuk hari ini ({todayDayName}).
              </p>
              <button
                type="button"
                onClick={() => onNavigate('jadwal')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Atur atau Lihat Jadwal Mingguan Lengkap
              </button>
            </div>
          )}
        </div>

        {/* Aktivitas Terakhir (1 Col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Log Jurnal Terakhir
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('agenda')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Semua
            </button>
          </div>

          <div className="space-y-3">
            {data.agenda.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {a.kelas} • {a.mapelNama}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">{a.tanggal}</span>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                  {a.materiPokok}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Catatan Regulasi & Pengingat Tugas Guru */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100">
              Pemberitahuan Regulasi Nasional (BSKAP Kemendikdasmen RI)
            </h4>
            <p className="text-xs text-amber-900/90 dark:text-amber-200/90 mt-0.5">
              Seluruh Capaian Pembelajaran (CP) dan penyusunan modul ajar di sistem ini telah disinkronkan secara ketat dengan <strong>Salinan Keputusan Kepala BSKAP Nomor 046/H/KR/2025</strong>. Anda dapat langsung mengunduh naskah otentik regulasi atau memanfaatkannya pada Suite AI.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('perangkat-unduh')}
          className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Akses Dokumen SK 046
        </button>
      </div>
    </div>
  );
};
