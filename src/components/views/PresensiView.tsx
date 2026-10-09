import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { Siswa, PresensiRecord } from '../../types';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  CheckSquare,
  Calendar,
  CheckCircle2,
  Printer,
  Users,
  Check,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const PresensiView: React.FC = () => {
  const [siswaList, setSiswaList] = useState<Siswa[]>(db.getSiswaList());
  const [presensiList, setPresensiList] = useState<PresensiRecord[]>(db.getPresensiList());
  const [distinctKelas, setDistinctKelas] = useState<string[]>(db.getDistinctKelasList());

  const todayStr = new Date().toISOString().split('T')[0];
  const [tanggal, setTanggal] = useState(todayStr);
  const [selectedKelas, setSelectedKelas] = useState<string>(distinctKelas[0] || 'X.1');
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Local editable state for current day & class
  const [attendanceState, setAttendanceState] = useState<
    Record<string, { status: 'H' | 'S' | 'I' | 'A'; catatan: string }>
  >({});

  useEffect(() => {
    const handleUpdate = () => {
      setSiswaList(db.getSiswaList());
      setPresensiList(db.getPresensiList());
      setDistinctKelas(db.getDistinctKelasList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  // Filter students by selected class
  const classStudents = siswaList.filter((s) => s.kelas === selectedKelas);

  // Load existing records or default to 'H'
  useEffect(() => {
    const state: Record<string, { status: 'H' | 'S' | 'I' | 'A'; catatan: string }> = {};
    for (const siswa of classStudents) {
      const existing = presensiList.find(
        (p) => p.tanggal === tanggal && p.kelas === selectedKelas && p.siswaId === siswa.id
      );
      state[siswa.id] = {
        status: existing ? existing.status : 'H',
        catatan: existing?.catatan || '',
      };
    }
    setAttendanceState(state);
  }, [tanggal, selectedKelas, siswaList]);

  // Set Semua Hadir
  const handleSetAllPresent = () => {
    const updated: Record<string, { status: 'H' | 'S' | 'I' | 'A'; catatan: string }> = {};
    for (const s of classStudents) {
      updated[s.id] = {
        status: 'H',
        catatan: attendanceState[s.id]?.catatan || '',
      };
    }
    setAttendanceState(updated);
    Swal.fire({
      icon: 'success',
      title: 'Semua Siswa Diset Hadir',
      text: `${classStudents.length} siswa diset Hadir (H).`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleStatusChange = (siswaId: string, status: 'H' | 'S' | 'I' | 'A') => {
    setAttendanceState((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        status,
      },
    }));
  };

  const handleCatatanChange = (siswaId: string, catatan: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        catatan,
      },
    }));
  };

  const handleSaveAttendance = () => {
    const recordsToSave: PresensiRecord[] = classStudents.map((s) => ({
      id: `pre-${tanggal}-${selectedKelas}-${s.id}`,
      tanggal,
      kelas: selectedKelas,
      siswaId: s.id,
      status: attendanceState[s.id]?.status || 'H',
      catatan: attendanceState[s.id]?.catatan || '',
    }));

    db.savePresensiBatch(recordsToSave);
    Swal.fire({
      icon: 'success',
      title: 'Presensi Tersimpan!',
      text: `Presensi kelas ${selectedKelas} tanggal ${tanggal} berhasil disimpan.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Calculate summaries
  const totalInClass = classStudents.length;
  const countH = Object.values(attendanceState).filter((v) => v.status === 'H').length;
  const countS = Object.values(attendanceState).filter((v) => v.status === 'S').length;
  const countI = Object.values(attendanceState).filter((v) => v.status === 'I').length;
  const countA = Object.values(attendanceState).filter((v) => v.status === 'A').length;
  const percentHadir = totalInClass > 0 ? Math.round((countH / totalInClass) * 100) : 100;

  if (isPrintMode) {
    return (
      <OfficialPrintLayout
        title="REKAPITULASI DAFTAR HADIR (PRESENSI) SISWA"
        subtitle={`KELAS / ROMBEL: ${selectedKelas} • TANGGAL KBM: ${tanggal}`}
        onBack={() => setIsPrintMode(false)}
      >
        <div className="space-y-4">
          <table className="w-full text-left text-xs border-collapse border border-black">
            <thead>
              <tr className="bg-slate-200 text-black border-b border-black font-bold">
                <th className="p-2 border border-black text-center w-10">No</th>
                <th className="p-2 border border-black text-center w-28">NISN</th>
                <th className="p-2 border border-black">Nama Peserta Didik</th>
                <th className="p-2 border border-black text-center w-12">L/P</th>
                <th className="p-2 border border-black text-center w-24">Kehadiran</th>
                <th className="p-2 border border-black">Keterangan / Catatan KBM</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((s, idx) => {
                const rec = attendanceState[s.id] || { status: 'H', catatan: '' };
                const label =
                  rec.status === 'H'
                    ? 'Hadir'
                    : rec.status === 'S'
                    ? 'Sakit'
                    : rec.status === 'I'
                    ? 'Izin'
                    : 'Alpa';
                return (
                  <tr key={s.id} className="border-b border-black">
                    <td className="p-2 border border-black text-center">{idx + 1}</td>
                    <td className="p-2 border border-black text-center font-mono">{s.nisn}</td>
                    <td className="p-2 border border-black font-semibold">{s.nama}</td>
                    <td className="p-2 border border-black text-center">{s.gender}</td>
                    <td className="p-2 border border-black text-center font-bold">{label} ({rec.status})</td>
                    <td className="p-2 border border-black text-[11px]">{rec.catatan || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Rekap Angka */}
          <div className="p-3 border border-black bg-slate-50 text-xs flex justify-around font-bold">
            <span>Hadir (H): {countH} ({percentHadir}%)</span>
            <span>Sakit (S): {countS}</span>
            <span>Izin (I): {countI}</span>
            <span>Alpa (A): {countA}</span>
            <span>Total Siswa: {totalInClass}</span>
          </div>
        </div>
      </OfficialPrintLayout>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-800 text-white p-5 rounded-2xl shadow-md border-2 border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-900 rounded-xl text-emerald-200">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Presensi &amp; Kehadiran Harian Siswa
            </h2>
            <p className="text-xs text-emerald-100">
              Pencatatan kedisiplinan belajar tatap muka kelas, status H/S/I/A, dan catatan perilaku
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSetAllPresent}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors border border-emerald-400/50 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Set Semua Hadir</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPrintMode(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors border border-emerald-400/50 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAttendance}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-transform active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Presensi</span>
          </button>
        </div>
      </div>

      {/* Control bar: Tanggal & Kelas selection */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tanggal:</span>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
            />
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Kelas / Rombel:</span>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400"
            >
              {distinctKelas.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
            H: {countH}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
            S: {countS}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
            I: {countI}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200">
            A: {countA}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Tingkat Hadir: {percentHadir}%
          </span>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-b border-emerald-200 dark:border-emerald-800 uppercase font-black tracking-wider">
              <tr>
                <th className="p-3.5 text-center w-12">No</th>
                <th className="p-3.5">NISN / Nama Siswa</th>
                <th className="p-3.5 text-center w-12">L/P</th>
                <th className="p-3.5 text-center w-64">Status Kehadiran</th>
                <th className="p-3.5">Catatan Khusus / Keterlambatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {classStudents.length > 0 ? (
                classStudents.map((siswa, idx) => {
                  const currentStatus = attendanceState[siswa.id]?.status || 'H';
                  const currentCatatan = attendanceState[siswa.id]?.catatan || '';
                  return (
                    <tr
                      key={siswa.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {siswa.nama}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          NISN: {siswa.nisn}
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-600 dark:text-slate-400">
                        {siswa.gender}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 gap-1 border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(siswa.id, 'H')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'H'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            Hadir (H)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(siswa.id, 'S')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'S'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            Sakit (S)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(siswa.id, 'I')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'I'
                                ? 'bg-amber-500 text-slate-950 shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            Izin (I)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(siswa.id, 'A')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                              currentStatus === 'A'
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            Alpa (A)
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <input
                          type="text"
                          value={currentCatatan}
                          onChange={(e) => handleCatatanChange(siswa.id, e.target.value)}
                          placeholder="Catatan kedisiplinan / terlambat..."
                          className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada siswa yang terdaftar di rombel {selectedKelas}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
