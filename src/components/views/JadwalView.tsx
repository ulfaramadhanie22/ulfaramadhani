import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { JadwalPelajaran, Mapel } from '../../types';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  Calendar,
  Plus,
  Clock,
  Printer,
  Trash2,
  Edit2,
  X,
  Check,
  Building,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const JadwalView: React.FC = () => {
  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>(db.getJadwalList());
  const [mapelList, setMapelList] = useState<Mapel[]>(db.getMapelList());
  const [distinctKelas, setDistinctKelas] = useState<string[]>(db.getDistinctKelasList());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalPelajaran | null>(null);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Form state
  const [form, setForm] = useState<Omit<JadwalPelajaran, 'id'>>({
    hari: 'Senin',
    jamMulai: '07:30',
    jamSelesai: '09:45',
    mapelId: '',
    mapelNama: '',
    kelas: '',
    ruang: 'Lab Komputer 1',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setJadwalList(db.getJadwalList());
      setMapelList(db.getMapelList());
      setDistinctKelas(db.getDistinctKelasList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const days: Array<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'> = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const handleOpenAdd = () => {
    setEditingJadwal(null);
    const firstMapel = mapelList[0];
    const initialKelas = distinctKelas[0] || 'X.1';
    setForm({
      hari: 'Senin',
      jamMulai: '07:30',
      jamSelesai: '09:45',
      mapelId: firstMapel ? firstMapel.id : '',
      mapelNama: firstMapel ? firstMapel.nama : '',
      kelas: initialKelas,
      ruang: 'Lab Komputer 1',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (j: JadwalPelajaran) => {
    setEditingJadwal(j);
    setForm({
      hari: j.hari,
      jamMulai: j.jamMulai,
      jamSelesai: j.jamSelesai,
      mapelId: j.mapelId,
      mapelNama: j.mapelNama,
      kelas: j.kelas,
      ruang: j.ruang,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (j: JadwalPelajaran) => {
    Swal.fire({
      title: 'Hapus Jadwal?',
      text: `Hapus sesi ${j.mapelNama} hari ${j.hari} untuk kelas ${j.kelas}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        db.deleteJadwal(j.id);
        Swal.fire({ icon: 'success', title: 'Jadwal Dihapus', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const handleMapelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = mapelList.find((m) => m.id === selectedId);
    setForm({
      ...form,
      mapelId: selectedId,
      mapelNama: found ? found.nama : '',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mapelNama || !form.kelas) {
      Swal.fire({ icon: 'error', title: 'Data Belum Lengkap', text: 'Mata pelajaran dan kelas wajib dipilih.' });
      return;
    }

    if (editingJadwal) {
      db.saveJadwal({ ...form, id: editingJadwal.id });
      Swal.fire({ icon: 'success', title: 'Jadwal Diperbarui', timer: 1500, showConfirmButton: false });
    } else {
      db.saveJadwal({ ...form, id: 'jad-' + Date.now() });
      Swal.fire({ icon: 'success', title: 'Jadwal Ditambahkan', timer: 1500, showConfirmButton: false });
    }
    setIsModalOpen(false);
  };

  if (isPrintMode) {
    return (
      <OfficialPrintLayout
        title="JADWAL PELAJARAN DAN TUGAS MENGAJAR GURU"
        subtitle="SEMESTER GENAP TAHUN PELAJARAN 2024/2025"
        onBack={() => setIsPrintMode(false)}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-700">
            Berikut ini adalah jadwal pelaksanaan Kegiatan Belajar Mengajar (KBM) tatap muka resmi untuk mata pelajaran yang diampu oleh guru bersangkutan:
          </p>

          <table className="w-full text-left text-xs border-collapse border border-black">
            <thead>
              <tr className="bg-slate-200 text-black border-b border-black font-bold">
                <th className="p-2 border border-black text-center w-12">No</th>
                <th className="p-2 border border-black text-center w-24">Hari</th>
                <th className="p-2 border border-black text-center w-28">Waktu (WIB)</th>
                <th className="p-2 border border-black">Mata Pelajaran</th>
                <th className="p-2 border border-black text-center w-24">Kelas/Rombel</th>
                <th className="p-2 border border-black">Ruang / Lab</th>
              </tr>
            </thead>
            <tbody>
              {jadwalList.map((item, idx) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="p-2 border border-black text-center">{idx + 1}</td>
                  <td className="p-2 border border-black text-center font-bold">{item.hari}</td>
                  <td className="p-2 border border-black text-center font-mono">
                    {item.jamMulai} - {item.jamSelesai}
                  </td>
                  <td className="p-2 border border-black font-semibold">{item.mapelNama}</td>
                  <td className="p-2 border border-black text-center font-bold">{item.kelas}</td>
                  <td className="p-2 border border-black">{item.ruang}</td>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-700 text-white p-5 rounded-2xl shadow-md border-2 border-rose-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-800 rounded-xl text-rose-200">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Jadwal Pelajaran KBM Mingguan
            </h2>
            <p className="text-xs text-rose-100">
              Pengaturan sesi mengajar interaktif dengan pilihan rombel dinamis dari database siswa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrintMode(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold rounded-xl transition-colors border border-rose-400/50 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Jadwal</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sesi Jadwal</span>
          </button>
        </div>
      </div>

      {/* Grid of Days (Senin - Sabtu) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {days.map((day) => {
          const itemsOfDay = jadwalList.filter((j) => j.hari === day);
          return (
            <div
              key={day}
              className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 shadow-md overflow-hidden flex flex-col"
            >
              {/* Day Header */}
              <div className="bg-rose-50 dark:bg-rose-950/50 p-3.5 border-b border-rose-200 dark:border-rose-900 flex items-center justify-between">
                <span className="font-black text-rose-900 dark:text-rose-200 text-sm uppercase tracking-wide">
                  {day}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                  {itemsOfDay.length} Sesi
                </span>
              </div>

              {/* Sesi List */}
              <div className="p-3 space-y-2.5 flex-1">
                {itemsOfDay.length > 0 ? (
                  itemsOfDay.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 group hover:border-rose-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" />
                          {item.jamMulai} - {item.jamSelesai}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-md"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                        {item.mapelNama}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="font-extrabold text-cyan-700 dark:text-cyan-300">
                          Kelas {item.kelas}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {item.ruang}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full min-h-[120px] flex items-center justify-center text-center p-4 text-xs text-slate-400 italic">
                    Tidak ada jadwal mengajar pada hari {day}.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal with Dynamic Dropdown for Class / Rombel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-rose-700 to-pink-800 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingJadwal ? 'Edit Sesi Jadwal' : 'Tambah Sesi Jadwal KBM'}
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
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hari KBM *
                </label>
                <select
                  value={form.hari}
                  onChange={(e) => setForm({ ...form, hari: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mata Pelajaran *
                </label>
                <select
                  value={form.mapelId}
                  onChange={handleMapelChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {mapelList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.kode} - {m.tingkat})
                    </option>
                  ))}
                </select>
              </div>

              {/* CRITICAL: DYNAMIC DROPDOWN FOR KELAS / ROMBEL FROM DATABASE */}
              <div className="bg-cyan-50 dark:bg-cyan-950/40 p-3 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <label className="block text-xs font-black text-cyan-950 dark:text-cyan-200 mb-1">
                  Kelas / Rombongan Belajar (Dropdown Dinamis) *
                </label>
                <select
                  required
                  value={form.kelas}
                  onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-2 border-cyan-400 dark:border-cyan-700 rounded-xl text-xs font-bold text-cyan-900 dark:text-cyan-100 focus:ring-2 focus:ring-cyan-500"
                >
                  {distinctKelas.map((k) => (
                    <option key={k} value={k}>
                      {k} (Siswa terdaftar di database)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-cyan-700 dark:text-cyan-300 mt-1">
                  * Otomatis terintegrasi dari data induk siswa untuk mencegah kesalahan ketik.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Mulai *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.jamMulai}
                    onChange={(e) => setForm({ ...form, jamMulai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Selesai *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.jamSelesai}
                    onChange={(e) => setForm({ ...form, jamSelesai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ruang Pembelajaran / Laboratorium
                </label>
                <input
                  type="text"
                  value={form.ruang}
                  onChange={(e) => setForm({ ...form, ruang: e.target.value })}
                  placeholder="Contoh: Lab Komputer 1 / Ruang Teori 12"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Simpan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
