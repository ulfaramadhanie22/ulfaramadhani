import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { Siswa } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  X,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const SiswaView: React.FC = () => {
  const [siswaList, setSiswaList] = useState<Siswa[]>(db.getSiswaList());
  const [search, setSearch] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

  // Form State
  const [form, setForm] = useState<Omit<Siswa, 'id'>>({
    nis: '',
    nisn: '',
    nama: '',
    gender: 'L',
    kelas: 'X.1',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    kontakOrtu: '',
    status: 'Aktif',
    fotoUrl: '',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setSiswaList(db.getSiswaList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const distinctKelas = db.getDistinctKelasList();

  const filteredList = siswaList.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.nisn.includes(search) ||
      s.nis.includes(search);
    const matchKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
    return matchSearch && matchKelas;
  });

  const handleOpenAdd = () => {
    setEditingSiswa(null);
    setForm({
      nis: '',
      nisn: '',
      nama: '',
      gender: 'L',
      kelas: distinctKelas[0] || 'X.1',
      tempatLahir: '',
      tanggalLahir: '',
      alamat: '',
      kontakOrtu: '',
      status: 'Aktif',
      fotoUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setForm({
      nis: siswa.nis,
      nisn: siswa.nisn,
      nama: siswa.nama,
      gender: siswa.gender,
      kelas: siswa.kelas,
      tempatLahir: siswa.tempatLahir,
      tanggalLahir: siswa.tanggalLahir,
      alamat: siswa.alamat,
      kontakOrtu: siswa.kontakOrtu,
      status: siswa.status,
      fotoUrl: siswa.fotoUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (siswa: Siswa) => {
    Swal.fire({
      title: 'Hapus Data Siswa?',
      text: `Apakah Anda yakin ingin menghapus "${siswa.nama}" (NISN: ${siswa.nisn})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        db.deleteSiswa(siswa.id);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Dihapus',
          text: `Data siswa ${siswa.nama} telah dihapus.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.nisn.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Form Belum Lengkap',
        text: 'Nama lengkap dan NISN wajib diisi.',
      });
      return;
    }

    if (editingSiswa) {
      db.saveSiswa({
        ...form,
        id: editingSiswa.id,
      });
      Swal.fire({
        icon: 'success',
        title: 'Data Diperbarui',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      const newSiswa: Siswa = {
        ...form,
        id: 'sis-' + Date.now(),
      };
      db.saveSiswa(newSiswa);
      Swal.fire({
        icon: 'success',
        title: 'Siswa Ditambahkan',
        timer: 1500,
        showConfirmButton: false,
      });
    }
    setIsModalOpen(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'NIS', 'NISN', 'Nama', 'Gender', 'Kelas', 'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'Kontak Ortu', 'Status'];
    const rows = filteredList.map((s) => [
      s.id,
      s.nis,
      s.nisn,
      `"${s.nama}"`,
      s.gender,
      s.kelas,
      `"${s.tempatLahir}"`,
      s.tanggalLahir,
      `"${s.alamat}"`,
      s.kontakOrtu,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Siswa_${selectedKelas}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: 'Ekspor Berhasil',
      text: `${filteredList.length} data siswa berhasil diunduh dalam format CSV.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Import CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        Swal.fire({
          icon: 'error',
          title: 'Format File Tidak Sesuai',
          text: 'File CSV harus memiliki baris judul dan minimal 1 baris data siswa.',
        });
        return;
      }

      const importedSiswa: Siswa[] = [];
      // skip header
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 4) {
          importedSiswa.push({
            id: parts[0] || 'sis-' + (Date.now() + i),
            nis: parts[1] || `2324${i + 100}`,
            nisn: parts[2] || `008${Date.now()}${i}`,
            nama: parts[3] || `Siswa Baru ${i}`,
            gender: (parts[4] === 'P' ? 'P' : 'L') as 'L' | 'P',
            kelas: parts[5] || 'X.1',
            tempatLahir: parts[6] || 'Rantepao',
            tanggalLahir: parts[7] || '2008-01-01',
            alamat: parts[8] || 'Alamat Siswa',
            kontakOrtu: parts[9] || '0812-0000-0000',
            status: 'Aktif',
          });
        }
      }

      if (importedSiswa.length > 0) {
        db.saveSiswaBulk(importedSiswa);
        Swal.fire({
          icon: 'success',
          title: 'Import Berhasil!',
          text: `${importedSiswa.length} data siswa berhasil diimpor ke sistem.`,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cyan-700 text-white p-5 rounded-2xl shadow-md border-2 border-cyan-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-800 rounded-xl text-cyan-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Buku Induk Data Peserta Didik
            </h2>
            <p className="text-xs text-cyan-100">
              Kelola NIS, NISN, rombongan belajar, dan data orang tua siswa
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-800 hover:bg-cyan-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors border border-cyan-400/50 shadow-sm">
            <Upload className="w-4 h-4" />
            <span>Impor CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-800 hover:bg-cyan-900 text-white text-xs font-bold rounded-xl transition-colors border border-cyan-400/50 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-transform active:scale-95 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NISN, atau NIS..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Filter Rombel */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
            Rombel:
          </span>
          <button
            type="button"
            onClick={() => setSelectedKelas('Semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedKelas === 'Semua'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua ({siswaList.length})
          </button>
          {distinctKelas.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedKelas(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                selectedKelas === k
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {k} ({siswaList.filter((s) => s.kelas === k).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table Data Siswa */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cyan-50 dark:bg-cyan-950/50 text-cyan-950 dark:text-cyan-200 border-b border-cyan-200 dark:border-cyan-800 uppercase font-black tracking-wider">
              <tr>
                <th className="p-3.5 text-center w-12">No</th>
                <th className="p-3.5">NIS / NISN</th>
                <th className="p-3.5">Nama Peserta Didik</th>
                <th className="p-3.5 text-center">L/P</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">Tempat &amp; Tgl Lahir</th>
                <th className="p-3.5">Kontak Ortu</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredList.length > 0 ? (
                filteredList.map((siswa, idx) => (
                  <tr
                    key={siswa.id}
                    className="hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20 transition-colors"
                  >
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{siswa.nisn}</div>
                      <div className="text-[10px] text-slate-500">NIS: {siswa.nis}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                          {siswa.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{siswa.nama}</p>
                          <p className="text-[10px] text-slate-400">{siswa.alamat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          siswa.gender === 'L'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300'
                        }`}
                      >
                        {siswa.gender}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-cyan-700 dark:text-cyan-300">
                      {siswa.kelas}
                    </td>
                    <td className="p-3 text-[11px]">
                      {siswa.tempatLahir}, {siswa.tanggalLahir}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {siswa.kontakOrtu}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {siswa.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(siswa)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(siswa)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data peserta didik yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-700 to-blue-800 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingSiswa ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NISN *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nisn}
                    onChange={(e) => setForm({ ...form, nisn: e.target.value })}
                    placeholder="Contoh: 0078129011"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIS Sekolah
                  </label>
                  <input
                    type="text"
                    value={form.nis}
                    onChange={(e) => setForm({ ...form, nis: e.target.value })}
                    placeholder="Contoh: 23241001"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Nama lengkap sesuai akta / ijazah"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas / Rombel *
                  </label>
                  <select
                    value={form.kelas}
                    onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-cyan-700 dark:text-cyan-300"
                  >
                    {distinctKelas.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
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
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                    <option value="Mutasi">Mutasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={form.tempatLahir}
                    onChange={(e) => setForm({ ...form, tempatLahir: e.target.value })}
                    placeholder="Kota lahir"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={form.tanggalLahir}
                    onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kontak WhatsApp / No. HP Orang Tua
                </label>
                <input
                  type="text"
                  value={form.kontakOrtu}
                  onChange={(e) => setForm({ ...form, kontakOrtu: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  placeholder="Alamat domisili peserta didik"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black rounded-xl shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
