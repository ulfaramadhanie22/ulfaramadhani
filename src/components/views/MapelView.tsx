import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { Mapel } from '../../types';
import { BookOpen, Plus, Edit2, Trash2, X, Check, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

export const MapelView: React.FC = () => {
  const [mapelList, setMapelList] = useState<Mapel[]>(db.getMapelList());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<Mapel | null>(null);

  const [form, setForm] = useState<Omit<Mapel, 'id'>>({
    kode: '',
    nama: '',
    fase: 'Fase E',
    tingkat: 'Kelas X',
    alokasiJp: 4,
    elemen: '',
    capaianPembelajaran: '',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setMapelList(db.getMapelList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingMapel(null);
    setForm({
      kode: 'MAP-' + (mapelList.length + 1),
      nama: '',
      fase: 'Fase E',
      tingkat: 'Kelas X',
      alokasiJp: 4,
      elemen: '',
      capaianPembelajaran: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Mapel) => {
    setEditingMapel(m);
    setForm({
      kode: m.kode,
      nama: m.nama,
      fase: m.fase,
      tingkat: m.tingkat,
      alokasiJp: m.alokasiJp,
      elemen: m.elemen,
      capaianPembelajaran: m.capaianPembelajaran,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (m: Mapel) => {
    Swal.fire({
      title: 'Hapus Mata Pelajaran?',
      text: `Hapus mapel "${m.nama}" (${m.kode})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        db.deleteMapel(m.id);
        Swal.fire({
          icon: 'success',
          title: 'Mata Pelajaran Dihapus',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      Swal.fire({ icon: 'error', title: 'Nama mapel wajib diisi.' });
      return;
    }

    if (editingMapel) {
      db.saveMapel({ ...form, id: editingMapel.id });
      Swal.fire({ icon: 'success', title: 'Mapel Diperbarui', timer: 1500, showConfirmButton: false });
    } else {
      db.saveMapel({ ...form, id: 'map-' + Date.now() });
      Swal.fire({ icon: 'success', title: 'Mapel Ditambahkan', timer: 1500, showConfirmButton: false });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-700 text-white p-5 rounded-2xl shadow-md border-2 border-purple-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-800 rounded-xl text-purple-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Materi &amp; Mata Pelajaran
            </h2>
            <p className="text-xs text-purple-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Sinkronisasi Elemen CP Resmi SK BSKAP No. 046/H/KR/2025
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mata Pelajaran</span>
        </button>
      </div>

      {/* Grid Cards of Mapel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mapelList.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-purple-200 dark:border-purple-800 shadow-md space-y-4 hover:border-purple-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                  {m.kode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {m.nama}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {m.tingkat} • <span className="font-semibold text-purple-600 dark:text-purple-400">{m.fase}</span> • {m.alokasiJp} JP/Minggu
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(m)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                  title="Edit Mapel"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m)}
                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                  title="Hapus Mapel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                Elemen / Lingkup Materi:
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {m.elemen}
              </p>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900">
              <strong className="text-purple-900 dark:text-purple-200 block mb-1">
                Deskripsi Capaian Pembelajaran (CP SK 046/2025):
              </strong>
              {m.capaianPembelajaran}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white hover:bg-white/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Mapel
                  </label>
                  <input
                    type="text"
                    required
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alokasi Waktu (JP/Minggu)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.alokasiJp}
                    onChange={(e) => setForm({ ...form, alokasiJp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Mata Pelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Contoh: Informatika"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fase Kurikulum Merdeka
                  </label>
                  <select
                    value={form.fase}
                    onChange={(e) => setForm({ ...form, fase: e.target.value as any })}
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
                    Tingkat Kelas
                  </label>
                  <input
                    type="text"
                    value={form.tingkat}
                    onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
                    placeholder="Contoh: Kelas X"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Elemen Materi
                </label>
                <input
                  type="text"
                  value={form.elemen}
                  onChange={(e) => setForm({ ...form, elemen: e.target.value })}
                  placeholder="Contoh: Berpikir Komputasional"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Capaian Pembelajaran (CP) SK 046/H/KR/2025
                </label>
                <textarea
                  rows={3}
                  value={form.capaianPembelajaran}
                  onChange={(e) => setForm({ ...form, capaianPembelajaran: e.target.value })}
                  placeholder="Teks Capaian Pembelajaran resmi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
