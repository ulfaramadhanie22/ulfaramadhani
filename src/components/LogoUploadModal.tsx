import React, { useState } from 'react';
import { db } from '../services/dbService';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({ isOpen, onClose }) => {
  const sekolah = db.getSekolah();
  const [preview, setPreview] = useState<string>(sekolah.logoUrl || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Ukuran Terlalu Besar',
          text: 'Ukuran file gambar maksimal 2 MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    db.updateSekolah({ logoUrl: preview });
    setLoading(false);
    Swal.fire({
      icon: 'success',
      title: 'Logo Tersimpan!',
      text: 'Logo sekolah resmi berhasil diperbarui dan diterapkan ke seluruh dokumen cetak.',
      timer: 2000,
      showConfirmButton: false,
    });
    onClose();
  };

  const handleRemove = () => {
    setPreview('');
    db.updateSekolah({ logoUrl: '' });
    Swal.fire({
      icon: 'info',
      title: 'Logo Dihapus',
      text: 'Logo dikembalikan ke lambang default.',
      timer: 1500,
      showConfirmButton: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Unggah Logo Sekolah</h3>
              <p className="text-xs text-blue-200">Tampil pada Kop Dokumen &amp; Kartu Siswa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview Logo"
                  className="w-28 h-28 object-contain rounded-xl p-2 bg-white shadow-md border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setPreview('')}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                  title="Hapus gambar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Upload className="w-10 h-10" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Klik tombol di bawah untuk memilih file PNG / JPG / WebP
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Maksimum ukuran 2 MB</p>
              </div>
            )}

            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              <span>{preview ? 'Ganti File Gambar' : 'Pilih File Logo'}</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3 text-[11px] text-amber-900 dark:text-amber-200">
            <strong>Catatan:</strong> Logo akan disimpan secara permanen di database lokal aplikasi dan otomatis terpasang pada seluruh format cetak resmi (Kop Surat, Leger Nilai, Jurnal Mengajar, dan Kartu Pelajar QR).
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {sekolah.logoUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
            >
              Hapus Logo
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              Simpan Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
