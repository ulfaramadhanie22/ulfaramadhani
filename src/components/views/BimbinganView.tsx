import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { BimbinganSiswa, Siswa } from '../../types';
import { HeartHandshake, Plus, Edit2, Trash2, X, Check, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

export const BimbinganView: React.FC = () => {
  const [bimbinganList, setBimbinganList] = useState<BimbinganSiswa[]>(db.getBimbinganList());
  const [siswaList, setSiswaList] = useState<Siswa[]>(db.getSiswaList());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBimbingan, setEditingBimbingan] = useState<BimbinganSiswa | null>(null);

  const [form, setForm] = useState<Omit<BimbinganSiswa, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: siswaList[0]?.id || '',
    siswaNama: siswaList[0]?.nama || '',
    kelas: siswaList[0]?.kelas || '',
    jenis: 'Konseling Akademik',
    deskripsiMasalah: '',
    tindakLanjut: '',
    hasilEvaluasi: '',
    status: 'Dalam Proses',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setBimbinganList(db.getBimbinganList());
      setSiswaList(db.getSiswaList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingBimbingan(null);
    const s = siswaList[0];
    setForm({
      tanggal: new Date().toISOString().split('T')[0],
      siswaId: s ? s.id : '',
      siswaNama: s ? s.nama : '',
      kelas: s ? s.kelas : '',
      jenis: 'Konseling Akademik',
      deskripsiMasalah: '',
      tindakLanjut: '',
      hasilEvaluasi: '',
      status: 'Dalam Proses',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BimbinganSiswa) => {
    setEditingBimbingan(b);
    setForm({
      tanggal: b.tanggal,
      siswaId: b.siswaId,
      siswaNama: b.siswaNama,
      kelas: b.kelas,
      jenis: b.jenis,
      deskripsiMasalah: b.deskripsiMasalah,
      tindakLanjut: b.tindakLanjut,
      hasilEvaluasi: b.hasilEvaluasi,
      status: b.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (b: BimbinganSiswa) => {
    Swal.fire({
      title: 'Hapus Rekam Konseling?',
      text: `Hapus rekam konseling untuk ${b.siswaNama}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((res) => {
      if (res.isConfirmed) {
        db.deleteBimbingan(b.id);
        Swal.fire({ icon: 'success', title: 'Data Dihapus', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const handleSiswaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const found = siswaList.find((s) => s.id === id);
    setForm({
      ...form,
      siswaId: id,
      siswaNama: found ? found.nama : '',
      kelas: found ? found.kelas : '',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deskripsiMasalah.trim()) {
      Swal.fire({ icon: 'error', title: 'Deskripsi konseling/kasus wajib diisi.' });
      return;
    }

    if (editingBimbingan) {
      db.saveBimbingan({ ...form, id: editingBimbingan.id });
      Swal.fire({ icon: 'success', title: 'Data Diperbarui', timer: 1500, showConfirmButton: false });
    } else {
      db.saveBimbingan({ ...form, id: 'bim-' + Date.now() });
      Swal.fire({ icon: 'success', title: 'Rekam Bimbingan Ditambahkan', timer: 1500, showConfirmButton: false });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-800 text-white p-5 rounded-2xl shadow-md border-2 border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-900 rounded-xl text-emerald-200">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Bimbingan Konseling &amp; Wali Kelas (KBC)
            </h2>
            <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
              <Shield className="w-4 h-4 text-emerald-300" />
              Rekam jejak pembinaan empati, pendampingan akademik, dan advokasi siswa
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Catatan Bimbingan</span>
        </button>
      </div>

      {/* Grid of Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bimbinganList.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    b.jenis === 'Prestasi & Bakat'
                      ? 'bg-purple-100 text-purple-700'
                      : b.jenis === 'Kasus Disiplin'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {b.jenis}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {b.siswaNama}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kelas {b.kelas} • Tanggal: {b.tanggal}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(b)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <strong className="text-slate-800 dark:text-slate-200 block">
                Uraian Kejadian / Situasi:
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {b.deskripsiMasalah}
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl text-xs space-y-1 border border-emerald-100 dark:border-emerald-900/40">
              <strong className="text-emerald-900 dark:text-emerald-200 block">
                Tindak Lanjut &amp; Solusi (Pendekatan Kasih Sayang):
              </strong>
              <p className="text-emerald-800 dark:text-emerald-300">
                {b.tindakLanjut}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500">
                Evaluasi: {b.hasilEvaluasi || 'Dalam pemantauan'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  b.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            <div className="bg-emerald-800 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingBimbingan ? 'Edit Rekam Konseling' : 'Tambah Catatan Bimbingan Siswa'}
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
                    Pilih Siswa *
                  </label>
                  <select
                    value={form.siswaId}
                    onChange={handleSiswaChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
                  >
                    {siswaList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.kelas})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Layanan / Kasus
                  </label>
                  <select
                    value={form.jenis}
                    onChange={(e) => setForm({ ...form, jenis: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="Konseling Akademik">Konseling Akademik</option>
                    <option value="Konseling Pribadi">Konseling Pribadi</option>
                    <option value="Kasus Disiplin">Kasus Disiplin</option>
                    <option value="Prestasi & Bakat">Prestasi &amp; Bakat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Situasi / Masalah *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.deskripsiMasalah}
                  onChange={(e) => setForm({ ...form, deskripsiMasalah: e.target.value })}
                  placeholder="Detail latar belakang dan kondisi siswa"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tindak Lanjut &amp; Pendekatan (Kurikulum Berbasis Cinta)
                </label>
                <textarea
                  rows={2}
                  value={form.tindakLanjut}
                  onChange={(e) => setForm({ ...form, tindakLanjut: e.target.value })}
                  placeholder="Bimbingan personal, dialog empati, kontak orang tua, dsb."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hasil Evaluasi
                  </label>
                  <input
                    type="text"
                    value={form.hasilEvaluasi}
                    onChange={(e) => setForm({ ...form, hasilEvaluasi: e.target.value })}
                    placeholder="Perkembangan perilaku siswa"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Rujukan BK">Rujukan Guru BK</option>
                  </select>
                </div>
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
