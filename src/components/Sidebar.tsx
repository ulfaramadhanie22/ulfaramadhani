import React from 'react';
import { ActiveMenu } from '../types';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  CheckSquare,
  CreditCard,
  Award,
  BookMarked,
  HeartHandshake,
  DownloadCloud,
  Sparkles,
  Presentation,
  FileCode2,
  Heart,
  Compass,
  FileQuestion,
  ClipboardList,
  FileSpreadsheet,
  MonitorPlay,
  BotMessageSquare,
  Printer,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeMenu: ActiveMenu;
  onSelectMenu: (menu: ActiveMenu) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  isOpenMobile,
  onCloseMobile,
}) => {
  const handleItemClick = (menu: ActiveMenu) => {
    onSelectMenu(menu);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-[68px] bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } p-3 space-y-4`}
      >
        {/* GRUP 1: MENU UTAMA (Biru Tajam) */}
        <div className="space-y-1.5">
          <div className="bg-blue-700 text-white border-2 border-blue-400 shadow-md rounded-xl px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase">
              1. MENU UTAMA
            </span>
            <span className="text-[10px] font-extrabold bg-blue-900/90 text-blue-200 px-2 py-0.5 rounded-md border border-blue-300/40">
              BIRU TAJAM
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleItemClick('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'dashboard'
                ? 'bg-blue-600 text-white border-2 border-blue-300 shadow-lg shadow-blue-600/30 ring-2 ring-blue-400 font-extrabold scale-[1.02]'
                : 'bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-600 hover:text-white font-bold'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard Utama</span>
          </button>
        </div>

        {/* GRUP 2: MENU AKADEMIK (Emerald & Multi-Warna) */}
        <div className="space-y-1.5">
          <div className="bg-emerald-800 text-white border-2 border-emerald-400 shadow-md rounded-xl px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase">
              2. MENU AKADEMIK
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-950 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-300/40">
              MULTI WARNA
            </span>
          </div>

          {/* Siswa - Cyan */}
          <button
            type="button"
            onClick={() => handleItemClick('siswa')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'siswa'
                ? 'bg-cyan-600 text-white border-2 border-cyan-300 shadow-lg shadow-cyan-600/30 ring-2 ring-cyan-400 font-extrabold scale-[1.02]'
                : 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-950 dark:text-cyan-100 border-2 border-cyan-300 dark:border-cyan-700 hover:bg-cyan-600 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 shrink-0" />
              <span>Kelola Peserta Didik</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-cyan-200 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-200 font-semibold">
              Rombel
            </span>
          </button>

          {/* Mapel - Ungu */}
          <button
            type="button"
            onClick={() => handleItemClick('mapel')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'mapel'
                ? 'bg-purple-600 text-white border-2 border-purple-300 shadow-lg shadow-purple-600/30 ring-2 ring-purple-400 font-extrabold scale-[1.02]'
                : 'bg-purple-50 dark:bg-purple-950/70 text-purple-950 dark:text-purple-100 border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-600 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Materi &amp; Mata Pelajaran</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 font-semibold">
              CP 2025
            </span>
          </button>

          {/* Jadwal - Rose */}
          <button
            type="button"
            onClick={() => handleItemClick('jadwal')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'jadwal'
                ? 'bg-rose-600 text-white border-2 border-rose-300 shadow-lg shadow-rose-600/30 ring-2 ring-rose-400 font-extrabold scale-[1.02]'
                : 'bg-rose-50 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100 border-2 border-rose-300 dark:border-rose-700 hover:bg-rose-600 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Jadwal Pelajaran KBM</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 font-semibold">
              Dinamis
            </span>
          </button>

          {/* Presensi - Emerald */}
          <button
            type="button"
            onClick={() => handleItemClick('presensi')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'presensi'
                ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400 font-extrabold scale-[1.02]'
                : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Kehadiran Siswa (Presensi)</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-semibold">
              Harian
            </span>
          </button>

          {/* Kartu Siswa QR */}
          <button
            type="button"
            onClick={() => handleItemClick('kartu-siswa')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'kartu-siswa'
                ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-lg font-extrabold scale-[1.02]'
                : 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white font-bold'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Cetak Kartu Siswa QR</span>
          </button>

          {/* Asesmen & Nilai */}
          <button
            type="button"
            onClick={() => handleItemClick('nilai')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'nilai'
                ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-lg font-extrabold scale-[1.02]'
                : 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white font-bold'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>Asesmen &amp; Leger Nilai</span>
          </button>

          {/* Jurnal Agenda Mengajar */}
          <button
            type="button"
            onClick={() => handleItemClick('agenda')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'agenda'
                ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-lg font-extrabold scale-[1.02]'
                : 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white font-bold'
            }`}
          >
            <BookMarked className="w-4 h-4 shrink-0" />
            <span>Jurnal Agenda Mengajar</span>
          </button>

          {/* Bimbingan BK */}
          <button
            type="button"
            onClick={() => handleItemClick('bimbingan')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'bimbingan'
                ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-lg font-extrabold scale-[1.02]'
                : 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white font-bold'
            }`}
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span>Bimbingan Wali / BK</span>
          </button>

          {/* Unduh Perangkat Ajar */}
          <button
            type="button"
            onClick={() => handleItemClick('perangkat-unduh')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'perangkat-unduh'
                ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-lg font-extrabold scale-[1.02]'
                : 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DownloadCloud className="w-4 h-4 shrink-0" />
              <span>Unduh Perangkat Ajar</span>
            </div>
            <span className="text-[9px] bg-emerald-900 text-emerald-200 px-1 py-0.2 rounded font-bold">
              SK 046
            </span>
          </button>
        </div>

        {/* GRUP 3: MENU SUITE AI (Oranye Tajam) */}
        <div className="space-y-1.5">
          <div className="bg-orange-600 text-white border-2 border-orange-400 shadow-md rounded-xl px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase">
              3. MENU SUITE AI
            </span>
            <span className="text-[10px] font-extrabold bg-orange-950 text-orange-200 px-2 py-0.5 rounded-md border border-orange-300/40">
              ORANGE TAJAM
            </span>
          </div>

          {/* Rencana Pembelajaran Mendalam [HOT] */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-modul')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-modul'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Rencana Modul Mendalam</span>
            </div>
            <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
              HOT
            </span>
          </button>

          {/* Media Pembelajaran [BARU] */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-media')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-media'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MonitorPlay className="w-4 h-4 shrink-0" />
              <span>Media Pembelajaran</span>
            </div>
            <span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.2 rounded-full uppercase">
              BARU
            </span>
          </button>

          {/* CP, TP, ATP, Prota, KKTP */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-perangkat')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-perangkat'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <FileCode2 className="w-4 h-4 shrink-0" />
            <span>CP, TP, ATP, Prota, KKTP</span>
          </button>

          {/* Perangkat Kasih Sayang (KBC) */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-kbc')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-kbc'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <Heart className="w-4 h-4 shrink-0" />
            <span>Perangkat Berbasis Cinta</span>
          </button>

          {/* Kokurikuler & 7 Kebiasaan */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-kokurikuler')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-kokurikuler'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 shrink-0" />
              <span>Kokurikuler &amp; 7 Kebiasaan</span>
            </div>
            <span className="text-[9px] font-black bg-amber-600 text-white px-1.5 py-0.2 rounded-full uppercase">
              7 KEBIASAAN
            </span>
          </button>

          {/* Paket Soal Ujian & LJS */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-soal')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-soal'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <FileQuestion className="w-4 h-4 shrink-0" />
            <span>Paket Soal Ujian &amp; LJS</span>
          </button>

          {/* Kartu Soal & Kisi-Kisi */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-kartu-soal')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-kartu-soal'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span>Kartu Soal &amp; Kisi-Kisi</span>
          </button>

          {/* Generator LKPD AI */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-lkpd')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-lkpd'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Generator LKPD AI</span>
          </button>

          {/* Generator Presentasi PPT */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-ppt')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-ppt'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <Presentation className="w-4 h-4 shrink-0" />
            <span>Generator Presentasi PPT</span>
          </button>

          {/* Asisten Chat Konsultan AI */}
          <button
            type="button"
            onClick={() => handleItemClick('ai-chat')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'ai-chat'
                ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 font-extrabold scale-[1.02]'
                : 'bg-orange-50/90 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100 border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-500 hover:text-white font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BotMessageSquare className="w-4 h-4 shrink-0" />
              <span>Chat Konsultan Guru</span>
            </div>
            <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.2 rounded-full">
              24/7
            </span>
          </button>
        </div>

        {/* GRUP 4: MENU LAPORAN & PENGATURAN (Kuning/Amber Tajam) */}
        <div className="space-y-1.5 pb-6">
          <div className="bg-amber-500 text-slate-950 border-2 border-yellow-300 shadow-md rounded-xl px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase">
              4. LAPORAN &amp; SISTEM
            </span>
            <span className="text-[10px] font-black bg-amber-200 text-slate-900 px-2 py-0.5 rounded-md border border-amber-600">
              KUNING TAJAM
            </span>
          </div>

          {/* Pusat Laporan & Cetak */}
          <button
            type="button"
            onClick={() => handleItemClick('laporan')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'laporan'
                ? 'bg-amber-400 text-slate-950 border-2 border-amber-600 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300 font-black scale-[1.02]'
                : 'bg-amber-50/90 dark:bg-amber-950/70 text-amber-950 dark:text-amber-100 border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-400 hover:text-slate-950 font-bold'
            }`}
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Pusat Laporan &amp; Cetak</span>
          </button>

          {/* Pengaturan & Database */}
          <button
            type="button"
            onClick={() => handleItemClick('pengaturan')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
              activeMenu === 'pengaturan'
                ? 'bg-amber-400 text-slate-950 border-2 border-amber-600 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300 font-black scale-[1.02]'
                : 'bg-amber-50/90 dark:bg-amber-950/70 text-amber-950 dark:text-amber-100 border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-400 hover:text-slate-950 font-bold'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Pengaturan &amp; Database</span>
          </button>
        </div>
      </aside>
    </>
  );
};
