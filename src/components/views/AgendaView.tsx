import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { AgendaMengajar, Mapel } from '../../types';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import { BookMarked, Plus, Printer, Edit2, Trash2, X, Check } from 'lucide-react';
import Swal from 'sweetalert2';

export const AgendaView: React.FC = () => {
  const [agendaList, setAgendaList] = useState<AgendaMengajar[]>(db.getAgendaList());
  const [mapelList, setMapelList] = useState<Mapel[]>(db.getMapelList());
  const [distinctKelas, setDistinctKelas] = useState<string[]>(db.getDistinctKelasList());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<AgendaMengajar | null>(null);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const [form, setForm] = useState<Omit<AgendaMengajar, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    kelas: distinctKelas[0] || 'X.1',
    jamKe: '1 - 3 (07.30 - 10.00)',
    mapelNama: mapelList[0]?.nama || 'Informatika',
    materiPokok: '',
    tujuanPembelajaran: '',
    kegiatanKbm: '',
    hambatanCatatan: '',
    solusi: '',
    status: 'Terlaksana',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setAgendaList(db.getAgendaList());
      setMapelList(db.getMapelList());
      setDistinctKelas(db.getDistinctKelasList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingAgenda(null);
    setForm({
      tanggal: new Date().toISOString().split('T')[0],
      kelas: distinctKelas[0] || 'X.1',
      jamKe: '1 - 3 (07.30 - 10.00)',
      mapelNama: mapelList[0]?.nama || 'Informatika',
      materiPokok: '',
      tujuanPembelajaran: '',
      kegiatanKbm: '',
      hambatanCatatan: '',
      solusi: '',
      status: 'Terlaksana',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: AgendaMengajar) => {
    setEditingAgenda(a);
    setForm({
      tanggal: a.tanggal,
      kelas: a.kelas,
      jamKe: a.jamKe,
      mapelNama: a.mapelNama,
      materiPokok: a.materiPokok,
      tujuanPembelajaran: a.tujuanPembelajaran,
      kegiatanKbm: a.kegiatanKbm,
      hambatanCatatan: a.hambatanCatatan,
      solusi: a.solusi,
      status: a.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (a: AgendaMengajar) => {
    Swal.fire({
      title: 'Hapus Agenda?',
      text: `Hapus catatan jurnal tanggal ${a.tanggal} kelas ${a.kelas}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((res) => {
      if (res.isConfirmed) {
        db.deleteAgenda(a.id);
        Swal.fire({ icon: 'success', title: 'Agenda Dihapus', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.materiPokok.trim()) {
      Swal.fire({ icon: 'error', title: 'Materi pokok wajib diisi.' });
      return;
    }

    if (editingAgenda) {
      db.saveAgenda({ ...form, id: editingAgenda.id });
      Swal.fire({ icon: 'success', title: 'Agenda Diperbarui', timer: 1500, showConfirmButton: false });
    } else {
      db.saveAgenda({ ...form, id: 'agn-' + Date.now() });
      Swal.fire({ icon: 'success', title: 'Agenda Ditambahkan', timer: 1500, showConfirmButton: false });
    }
    setIsModalOpen(false);
  };

  if (isPrintMode) {
    return (
      <OfficialPrintLayout
        title="BUKU JURNAL AGENDA HARIAN MENGAJAR GURU"
        subtitle="SEMESTER GENAP TAHUN PELAJARAN 2024/2025"
        onBack={() => setIsPrintMode(false)}
      >
        <div className="space-y-4">
          <table className="w-full text-left text-xs border-collapse border border-black">
            <thead>
              <tr className="bg-slate-200 text-black border-b border-black font-bold">
                <th className="p-2 border border-black text-center w-10">No</th>
                <th className="p-2 border border-black text-center w-24">Hari / Tgl</th>
                <th className="p-2 border border-black text-center w-16">Kelas</th>
                <th className="p-2 border border-black text-center w-20">Jam Ke-</th>
                <th className="p-2 border border-black">Materi Pokok &amp; TP</th>
                <th className="p-2 border border-black">Kegiatan KBM (Deep Learning)</th>
                <th className="p-2 border border-black">Hambatan &amp; Solusi</th>
                <th className="p-2 border border-black text-center w-20">Keterlaksanaan</th>
              </tr>
            </thead>
            <tbody>
              {agendaList.map((item, idx) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="p-2 border border-black text-center">{idx + 1}</td>
                  <td className="p-2 border border-black text-center font-mono">{item.tanggal}</td>
                  <td className="p-2 border border-black text-center font-bold">{item.kelas}</td>
                  <td className="p-2 border border-black text-center font-mono text-[10px]">{item.jamKe}</td>
                  <td className="p-2 border border-black">
                    <p className="font-bold">{item.materiPokok}</p>
                    <p className="text-[10px] text-slate-700">{item.tujuanPembelajaran}</p>
                  </td>
                  <td className="p-2 border border-black text-[11px] leading-tight">{item.kegiatanKbm}</td>
                  <td className="p-2 border border-black text-[10px]">
                    <p className="text-red-700 font-semibold">{item.hambatanCatatan || '-'}</p>
                    <p className="text-emerald-700 font-semibold mt-1">Solusi: {item.solusi || '-'}</p>
                  </td>
                  <td className="p-2 border border-black text-center font-bold">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OfficialPrintLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-800 text-white p-5 rounded-2xl shadow-md border-2 border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-900 rounded-xl text-emerald-200">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Buku Jurnal Agenda Mengajar Guru
            </h2>
            <p className="text-xs text-emerald-100">
              Dokumentasi pelaksanaan KBM harian, ketercapaian tujuan, kendala siswa, dan tindak lanjut
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrintMode(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors border border-emerald-400/50 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Buku Jurnal</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Jurnal Baru</span>
          </button>
        </div>
      </div>

      {/* Grid of Journal Cards */}
      <div className="grid grid-cols-1 gap-4">
        {agendaList.map((a) => (
          <div
            key={a.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                  Kelas {a.kelas}
                </span>
                <span className="font-mono text-xs text-slate-500">{a.tanggal}</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {a.mapelNama} ({a.jamKe})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    a.status === 'Terlaksana'
                      ? 'bg-emerald-100 text-emerald-800'
                      : a.status === 'Tertunda'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {a.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(a)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(a)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {a.materiPokok}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                TP: {a.tujuanPembelajaran}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white block mb-1">
                Aktivitas Pembelajaran (Deep Learning):
              </strong>
              {a.kegiatanKbm}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-200">
                <strong>Hambatan / Catatan Siswa:</strong>
                <p className="mt-0.5">{a.hambatanCatatan || '-'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200">
                <strong>Solusi &amp; Tindak Lanjut:</strong>
                <p className="mt-0.5">{a.solusi || '-'}</p>
              </div>
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
                {editingAgenda ? 'Edit Jurnal Agenda Mengajar' : 'Catat Jurnal Agenda Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal KBM
                  </label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas / Rombel
                  </label>
                  <select
                    value={form.kelas}
                    onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-700"
                  >
                    {distinctKelas.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={form.mapelNama}
                    onChange={(e) => setForm({ ...form, mapelNama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    {mapelList.map((m) => (
                      <option key={m.id} value={m.nama}>
                        {m.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Ke-
                  </label>
                  <input
                    type="text"
                    value={form.jamKe}
                    onChange={(e) => setForm({ ...form, jamKe: e.target.value })}
                    placeholder="Contoh: 1 - 3 (07.30 - 10.00)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Materi Pokok Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={form.materiPokok}
                  onChange={(e) => setForm({ ...form, materiPokok: e.target.value })}
                  placeholder="Materi pokok bahasan KBM hari ini"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tujuan Pembelajaran (TP)
                </label>
                <input
                  type="text"
                  value={form.tujuanPembelajaran}
                  onChange={(e) => setForm({ ...form, tujuanPembelajaran: e.target.value })}
                  placeholder="TP yang ingin dicapai"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kegiatan Pembelajaran (Aktivitas Deep Learning)
                </label>
                <textarea
                  rows={2}
                  value={form.kegiatanKbm}
                  onChange={(e) => setForm({ ...form, kegiatanKbm: e.target.value })}
                  placeholder="Ringkasan kegiatan pembuka, inti bermakna, dan penutup reflektif"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hambatan / Catatan Siswa
                  </label>
                  <input
                    type="text"
                    value={form.hambatanCatatan}
                    onChange={(e) => setForm({ ...form, hambatanCatatan: e.target.value })}
                    placeholder="Kendala di kelas jika ada"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Solusi &amp; Tindak Lanjut
                  </label>
                  <input
                    type="text"
                    value={form.solusi}
                    onChange={(e) => setForm({ ...form, solusi: e.target.value })}
                    placeholder="Langkah penyelesaian"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status KBM
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
                >
                  <option value="Terlaksana">Terlaksana (Tatap Muka)</option>
                  <option value="Tertunda">Tertunda</option>
                  <option value="Daring">Daring (Online / LMS)</option>
                </select>
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
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
