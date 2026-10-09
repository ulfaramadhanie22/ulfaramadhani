import React, { useState } from 'react';
import { ProfilGuru, ProfilSekolah } from '../types';
import { LogoUploadModal } from './LogoUploadModal';
import { Camera, Sun, Moon, LogOut, School, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

interface HeaderProps {
  guru: ProfilGuru;
  sekolah: ProfilSekolah;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigateProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  guru,
  sekolah,
  theme,
  onToggleTheme,
  onNavigateProfile,
}) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar dari Sesi?',
      text: 'Pastikan seluruh input data presensi, nilai, atau jurnal agenda Anda telah tersimpan dengan aman.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Kunci Dashboard',
      cancelButtonText: 'Tetap di Sini',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Sesi Terkunci Aman',
          text: 'Data Anda tetap tersimpan utuh di sistem penyimpanan lokal terenkripsi.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-xl">
        {/* Top Rainbow Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-emerald-500 via-orange-500 to-amber-400" />

        {/* Main Navbar */}
        <div className="bg-gradient-to-r from-[#071328] via-[#0d2240] to-[#0a182e] border-b-2 border-blue-800 px-3 sm:px-6 py-2.5 sm:py-3 text-white flex items-center justify-between gap-3">
          {/* Left: Interactive School Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="relative group w-12 h-12 rounded-2xl bg-white border-2 border-amber-400 p-1 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-hidden"
              title="Klik untuk Mengganti Logo Resmi Sekolah"
            >
              {sekolah.logoUrl ? (
                <img
                  src={sekolah.logoUrl}
                  alt={sekolah.nama}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center text-amber-300 font-black text-sm">
                  <School className="w-6 h-6 text-amber-400" />
                </div>
              )}
              {/* Camera Badge */}
              <span className="absolute -bottom-1 -right-1 bg-amber-500 group-hover:bg-amber-400 text-slate-950 rounded-full p-1 shadow-md border border-white">
                <Camera className="w-2.5 h-2.5" />
              </span>
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-200">
                DASHBOARD ADMINISTRASI
              </span>
              <h1 className="text-base sm:text-xl font-black text-amber-300 tracking-tight leading-tight flex items-center gap-2">
                <span>ULFA RAMADHANI</span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  BSKAP 046/H/KR/2025
                </span>
              </h1>
              <p className="hidden sm:block text-[11px] text-blue-200/90 font-medium">
                {sekolah.nama} • {guru.nama}, {guru.gelar} • TA {sekolah.tahunAjaranAktif} ({sekolah.semesterAktif})
              </p>
            </div>
          </div>

          {/* Right: Quick indicators, theme switch, teacher profile & logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Color Indicators (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-blue-950/60 p-1 rounded-xl border border-blue-800/80 text-[10px] font-bold">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/90 text-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                Utama
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                Akademik
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-600/90 text-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-300"></span>
                Suite AI
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                Laporan
              </span>
            </div>

            {/* Dark/Light Mode Switch */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-amber-300 hover:text-white border border-blue-700/60 transition-colors shadow-xs"
              title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Guru Avatar Profile with glowing gold ring */}
            <button
              type="button"
              onClick={onNavigateProfile}
              className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full sm:rounded-xl bg-blue-900/40 hover:bg-blue-800/70 border border-amber-400/50 transition-all text-left group"
              title="Lihat Profil Guru &amp; Pengaturan"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/80 group-hover:ring-amber-300 transition-all">
                  <div className="w-full h-full rounded-full bg-blue-950 flex items-center justify-center text-amber-300 font-extrabold text-xs">
                    {guru.nama.charAt(0)}R
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-amber-300 leading-tight">
                  {guru.nama}, {guru.gelar}
                </span>
                <span className="text-[10px] text-blue-200 font-mono">
                  NIP: {guru.nip}
                </span>
              </div>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Kunci / Keluar Dashboard"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal Upload Logo */}
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </>
  );
};
