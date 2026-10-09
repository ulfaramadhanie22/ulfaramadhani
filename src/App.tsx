import React, { useState, useEffect } from 'react';
import { db } from './services/dbService';
import { ActiveMenu, ProfilGuru, ProfilSekolah } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Views
import { DashboardView } from './components/views/DashboardView';
import { SiswaView } from './components/views/SiswaView';
import { MapelView } from './components/views/MapelView';
import { JadwalView } from './components/views/JadwalView';
import { PresensiView } from './components/views/PresensiView';
import { KartuSiswaView } from './components/views/KartuSiswaView';
import { NilaiView } from './components/views/NilaiView';
import { AgendaView } from './components/views/AgendaView';
import { BimbinganView } from './components/views/BimbinganView';
import { PerangkatUnduhView } from './components/views/PerangkatUnduhView';
import { AiModulView } from './components/views/AiModulView';
import { AiMediaView } from './components/views/AiMediaView';
import { AiPerangkatView } from './components/views/AiPerangkatView';
import { AiKbcView } from './components/views/AiKbcView';
import { AiKokurikulerView } from './components/views/AiKokurikulerView';
import { AiSoalView } from './components/views/AiSoalView';
import { AiKartuSoalView } from './components/views/AiKartuSoalView';
import { AiLkpdView } from './components/views/AiLkpdView';
import { AiPptView } from './components/views/AiPptView';
import { AiChatView } from './components/views/AiChatView';
import { LaporanView } from './components/views/LaporanView';
import { PengaturanView } from './components/views/PengaturanView';

import { Menu } from 'lucide-react';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('dashboard');
  const [guru, setGuru] = useState<ProfilGuru>(db.getGuru());
  const [sekolah, setSekolah] = useState<ProfilSekolah>(db.getSekolah());
  const [theme, setTheme] = useState<'light' | 'dark'>(db.getTheme());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Apply initial theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleUpdate = () => {
      setGuru(db.getGuru());
      setSekolah(db.getSekolah());
      setTheme(db.getTheme());
    };

    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    db.setTheme(next);
  };

  const renderActiveView = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardView onNavigate={(m) => setActiveMenu(m)} />;
      case 'siswa':
        return <SiswaView />;
      case 'mapel':
        return <MapelView />;
      case 'jadwal':
        return <JadwalView />;
      case 'presensi':
        return <PresensiView />;
      case 'kartu-siswa':
        return <KartuSiswaView />;
      case 'nilai':
        return <NilaiView />;
      case 'agenda':
        return <AgendaView />;
      case 'bimbingan':
        return <BimbinganView />;
      case 'perangkat-unduh':
        return <PerangkatUnduhView />;
      case 'ai-modul':
        return <AiModulView />;
      case 'ai-media':
        return <AiMediaView />;
      case 'ai-perangkat':
        return <AiPerangkatView />;
      case 'ai-kbc':
        return <AiKbcView />;
      case 'ai-kokurikuler':
        return <AiKokurikulerView />;
      case 'ai-soal':
        return <AiSoalView />;
      case 'ai-kartu-soal':
        return <AiKartuSoalView />;
      case 'ai-lkpd':
        return <AiLkpdView />;
      case 'ai-ppt':
        return <AiPptView />;
      case 'ai-chat':
        return <AiChatView />;
      case 'laporan':
        return <LaporanView />;
      case 'pengaturan':
        return <PengaturanView />;
      default:
        return <DashboardView onNavigate={(m) => setActiveMenu(m)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Header
        guru={guru}
        sekolah={sekolah}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateProfile={() => setActiveMenu('pengaturan')}
      />

      {/* Mobile Menu Toggle Bar */}
      <div className="no-print lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between sticky top-[68px] z-30 shadow-xs">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800"
        >
          <Menu className="w-4 h-4" />
          <span>Buka Menu Navigasi</span>
        </button>
        <span className="text-xs font-bold text-slate-500 uppercase">
          {activeMenu.replace('ai-', 'Suite AI: ')}
        </span>
      </div>

      <div className="flex-1 flex w-full">
        {/* Sharp Saturated Multi-Color Block Sidebar */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={(menu) => setActiveMenu(menu)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
