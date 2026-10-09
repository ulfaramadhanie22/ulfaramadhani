import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { ProfilGuru, ProfilSekolah } from '../../types';
import { LogoUploadModal } from '../LogoUploadModal';
import {
  Settings,
  User,
  School,
  Database,
  Download,
  Upload,
  RotateCcw,
  Check,
  Copy,
  Code2,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const PengaturanView: React.FC = () => {
  const [guruForm, setGuruForm] = useState<ProfilGuru>(db.getGuru());
  const [sekolahForm, setSekolahForm] = useState<ProfilSekolah>(db.getSekolah());
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [appsScriptTab, setAppsScriptTab] = useState<'code' | 'index'>('code');

  // Google Apps Script code templates (Section 6 Requirement)
  const codeTxt = `// ==========================================
// GOOGLE APPS SCRIPT: Code.gs (code.txt)
// DASHBOARD ADMINISTRASI ULFA RAMADHANI
// ==========================================

function doGet(e) {
  var action = e.parameter.action;
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "getSiswa") {
    var data = sheet.getSheetByName("DataSiswa").getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === "getNilai") {
    var data = sheet.getSheetByName("LegerNilai").getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Dashboard Administrasi Ulfa Ramadhani")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    if (postData.action === "syncPresensi") {
      var ws = sheet.getSheetByName("PresensiHarian") || sheet.insertSheet("PresensiHarian");
      postData.records.forEach(function(r) {
        ws.appendRow([r.tanggal, r.kelas, r.siswaId, r.status, r.catatan, new Date()]);
      });
      return ContentService.createTextOutput(JSON.stringify({ status: "success", count: postData.records.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const indexTxt = `<!-- ========================================== -->
<!-- GOOGLE APPS SCRIPT: index.html (index.txt)  -->
<!-- DASHBOARD ADMINISTRASI ULFA RAMADHANI        -->
<!-- ========================================== -->
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <title>Dashboard Administrasi Ulfa Ramadhani</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background: #071328; color: #ffffff; text-align: center; }
    .card { background: #0d2240; border: 2px solid #2563eb; border-radius: 16px; padding: 32px; max-width: 600px; margin: 40px auto; }
    h1 { color: #fcd34d; margin-bottom: 8px; font-size: 24px; font-weight: 900; }
    p { color: #bfdbfe; font-size: 14px; line-height: 1.6; }
    .btn { display: inline-block; background: #ea580c; color: #fff; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>DASHBOARD ADMINISTRASI ULFA RAMADHANI</h1>
    <p>Endpoint Web App Terintegrasi Google Apps Script & Google Sheets aktif.</p>
    <p>Sinkronisasi data presensi harian, buku nilai rapor, dan agenda pembelajaran tersimpan otomatis di Google Drive instansi Anda.</p>
    <div style="margin-top: 20px; font-size: 12px; color: #93c5fd;">
      Standardisasi Capaian Pembelajaran: SK BSKAP Kemendikdasmen No. 046/H/KR/2025
    </div>
  </div>
</body>
</html>`;

  const handleSaveGuru = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateGuru(guruForm);
    Swal.fire({
      icon: 'success',
      title: 'Profil Guru Tersimpan',
      text: 'Informasi pendidik berhasil diperbarui.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleSaveSekolah = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSekolah(sekolahForm);
    Swal.fire({
      icon: 'success',
      title: 'Profil Sekolah Tersimpan',
      text: 'Informasi satuan pendidikan berhasil diperbarui.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleExportBackup = () => {
    const jsonStr = db.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Dashboard_Ulfa_Ramadhani_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Cadangan Database Berhasil!',
      text: 'File JSON database berhasil diekspor.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleImportRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = db.importDatabaseJson(content);
      if (success) {
        setGuruForm(db.getGuru());
        setSekolahForm(db.getSekolah());
        Swal.fire({
          icon: 'success',
          title: 'Pemulihan Berhasil!',
          text: 'Data aplikasi berhasil dipulihkan dari file JSON cadangan.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Format Salah',
          text: 'File JSON yang diunggah tidak valid.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDemo = () => {
    Swal.fire({
      title: 'Reset ke Data Contoh Asli?',
      text: 'Tindakan ini akan mengembalikan seluruh data siswa, jadwal, dan nilai ke data bawaan sistem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Reset Data',
      cancelButtonText: 'Batal',
    }).then((res) => {
      if (res.isConfirmed) {
        db.resetToDefault();
        setGuruForm(db.getGuru());
        setSekolahForm(db.getSekolah());
        Swal.fire({
          icon: 'success',
          title: 'Database Direset',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({ icon: 'success', title: 'Kode Disalin!', timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-500 text-slate-950 p-5 rounded-2xl shadow-md border-2 border-yellow-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600 rounded-xl text-slate-950 font-black">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Pengaturan Profil Guru, Satuan Pendidikan, &amp; Database
            </h2>
            <p className="text-xs text-slate-900 font-semibold flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-900" />
              Kelola Identitas Resmi, Logo Kop Surat, Cadangan JSON, &amp; Integrasi Google Sheets
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLogoModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>Ganti Logo Sekolah Resmi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Profil Guru */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Data Profil Guru Kelas / Mapel
            </h3>
          </div>

          <form onSubmit={handleSaveGuru} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={guruForm.nama}
                  onChange={(e) => setGuruForm({ ...guruForm, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Gelar Akademik
                </label>
                <input
                  type="text"
                  value={guruForm.gelar}
                  onChange={(e) => setGuruForm({ ...guruForm, gelar: e.target.value })}
                  placeholder="S.Pd., Gr."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  NIP Pegawai
                </label>
                <input
                  type="text"
                  value={guruForm.nip}
                  onChange={(e) => setGuruForm({ ...guruForm, nip: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  NUPTK
                </label>
                <input
                  type="text"
                  value={guruForm.nuptk}
                  onChange={(e) => setGuruForm({ ...guruForm, nuptk: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Email belajar.id
                </label>
                <input
                  type="email"
                  value={guruForm.email}
                  onChange={(e) => setGuruForm({ ...guruForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={guruForm.telepon}
                  onChange={(e) => setGuruForm({ ...guruForm, telepon: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Pangkat / Golongan
                </label>
                <input
                  type="text"
                  value={guruForm.pangkatGolongan}
                  onChange={(e) => setGuruForm({ ...guruForm, pangkatGolongan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Mata Pelajaran Utama
                </label>
                <input
                  type="text"
                  value={guruForm.mapelUtama}
                  onChange={(e) => setGuruForm({ ...guruForm, mapelUtama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                <Check className="w-4 h-4" />
                Simpan Profil Guru
              </button>
            </div>
          </form>
        </div>

        {/* Form Profil Sekolah */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <School className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Data Satuan Pendidikan Resmi
            </h3>
          </div>

          <form onSubmit={handleSaveSekolah} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Nama Sekolah (Satuan Pendidikan)
              </label>
              <input
                type="text"
                required
                value={sekolahForm.nama}
                onChange={(e) => setSekolahForm({ ...sekolahForm, nama: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-black uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  NPSN
                </label>
                <input
                  type="text"
                  value={sekolahForm.npsn}
                  onChange={(e) => setSekolahForm({ ...sekolahForm, npsn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  NSS
                </label>
                <input
                  type="text"
                  value={sekolahForm.nss}
                  onChange={(e) => setSekolahForm({ ...sekolahForm, nss: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Alamat Lengkap Sekolah
              </label>
              <input
                type="text"
                value={sekolahForm.alamat}
                onChange={(e) => setSekolahForm({ ...sekolahForm, alamat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={sekolahForm.kecamatan}
                  onChange={(e) => setSekolahForm({ ...sekolahForm, kecamatan: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Kabupaten/Kota</label>
                <input
                  type="text"
                  value={sekolahForm.kabupatenKota}
                  onChange={(e) => setSekolahForm({ ...sekolahForm, kabupatenKota: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={sekolahForm.provinsi}
                  onChange={(e) => setSekolahForm({ ...sekolahForm, provinsi: e.target.value })}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={sekolahForm.kepalaSekolah}
                  onChange={(e) => setSekolahForm({ ...sekolahForm, kepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={sekolahForm.nipKepalaSekolah}
                  onChange={(e) => setSekolahForm({ ...sekolahForm, nipKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                <Check className="w-4 h-4" />
                Simpan Profil Sekolah
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Database Management & Google Apps Script Readiness */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Manajemen Database Cadangan &amp; Sinkronisasi Google Sheets
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
            OFFLINE &amp; CLOUD READY
          </span>
        </div>

        {/* Action Buttons Backup, Restore, Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 text-blue-900 dark:text-blue-100 font-bold text-xs transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Cadangkan Data (Backup JSON)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-100 font-bold text-xs cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Pulihkan Data (Restore JSON)</span>
            <input type="file" accept=".json" onChange={handleImportRestore} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleResetDemo}
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 hover:bg-red-100 text-red-900 dark:text-red-100 font-bold text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>Reset ke Data Demo Asli</span>
          </button>
        </div>

        {/* Google Apps Script Export Code Box (Section 6 Requirement) */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-500" />
                Script Sinkronisasi Google Sheets (Apps Script Ready)
              </h4>
              <p className="text-[11px] text-slate-500">
                Salin kode ini ke Google Apps Script (ekstensi Spreadsheet) untuk sinkronisasi cloud dua arah di Google Drive belajar.id.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAppsScriptTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  appsScriptTab === 'code' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                Code.gs (code.txt)
              </button>
              <button
                type="button"
                onClick={() => setAppsScriptTab('index')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  appsScriptTab === 'index' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                index.html (index.txt)
              </button>
              <button
                type="button"
                onClick={() => handleCopyCode(appsScriptTab === 'code' ? codeTxt : indexTxt)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold rounded-lg"
              >
                <Copy className="w-3.5 h-3.5" />
                Salin
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-56">
            {appsScriptTab === 'code' ? codeTxt : indexTxt}
          </pre>
        </div>
      </div>

      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </div>
  );
};
