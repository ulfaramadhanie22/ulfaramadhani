import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { Siswa, Mapel, NilaiSiswa } from '../../types';
import { OfficialPrintLayout } from '../OfficialPrintLayout';
import {
  Award,
  Printer,
  Save,
  Check,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

export const NilaiView: React.FC = () => {
  const [siswaList, setSiswaList] = useState<Siswa[]>(db.getSiswaList());
  const [mapelList, setMapelList] = useState<Mapel[]>(db.getMapelList());
  const [nilaiList, setNilaiList] = useState<NilaiSiswa[]>(db.getNilaiList());
  const [distinctKelas, setDistinctKelas] = useState<string[]>(db.getDistinctKelasList());

  const [selectedKelas, setSelectedKelas] = useState<string>(distinctKelas[0] || 'X.1');
  const [selectedMapelId, setSelectedMapelId] = useState<string>(mapelList[0]?.id || '');
  const [kktpDefault, setKktpDefault] = useState<number>(75);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Local state for table editing
  const [scores, setScores] = useState<
    Record<
      string,
      {
        tp1: number;
        tp2: number;
        tp3: number;
        tp4: number;
        sts: number;
        sas: number;
      }
    >
  >({});

  useEffect(() => {
    const handleUpdate = () => {
      setSiswaList(db.getSiswaList());
      setMapelList(db.getMapelList());
      setNilaiList(db.getNilaiList());
      setDistinctKelas(db.getDistinctKelasList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const classStudents = siswaList.filter((s) => s.kelas === selectedKelas);
  const selectedMapel = mapelList.find((m) => m.id === selectedMapelId) || mapelList[0];

  // Sync scores state
  useEffect(() => {
    const map: Record<
      string,
      {
        tp1: number;
        tp2: number;
        tp3: number;
        tp4: number;
        sts: number;
        sas: number;
      }
    > = {};

    for (const s of classStudents) {
      const existing = nilaiList.find(
        (n) => n.siswaId === s.id && n.mapelId === (selectedMapel?.id || '')
      );
      map[s.id] = {
        tp1: existing ? existing.tp1 : 80,
        tp2: existing ? existing.tp2 : 82,
        tp3: existing ? existing.tp3 : 85,
        tp4: existing ? existing.tp4 : 85,
        sts: existing ? existing.sts : 84,
        sas: existing ? existing.sas : 86,
      };
    }
    setScores(map);
  }, [selectedKelas, selectedMapelId, siswaList, nilaiList]);

  const handleScoreChange = (
    siswaId: string,
    field: 'tp1' | 'tp2' | 'tp3' | 'tp4' | 'sts' | 'sas',
    val: number
  ) => {
    const clamped = Math.max(0, Math.min(100, val || 0));
    setScores((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        [field]: clamped,
      },
    }));
  };

  // Calculate NA (Nilai Akhir) with standard formula: 50% Formatif + 25% STS + 25% SAS
  const calculateNa = (sc: {
    tp1: number;
    tp2: number;
    tp3: number;
    tp4: number;
    sts: number;
    sas: number;
  }) => {
    const avgFormatif = (sc.tp1 + sc.tp2 + sc.tp3 + sc.tp4) / 4;
    return Math.round(avgFormatif * 0.5 + sc.sts * 0.25 + sc.sas * 0.25);
  };

  const getPredikat = (na: number) => {
    if (na >= 90) return { predikat: 'A', label: 'Sangat Mahir' };
    if (na >= 80) return { predikat: 'B', label: 'Cakap' };
    if (na >= kktpDefault) return { predikat: 'C', label: 'Layak (Tuntas)' };
    return { predikat: 'D', label: 'Perlu Bimbingan' };
  };

  const generateDeskripsi = (nama: string, na: number) => {
    if (na >= 90) {
      return `Menunjukkan penguasaan sangat tinggi dalam mencapai tujuan pembelajaran pada materi ${selectedMapel?.nama || 'mapel'}, aktif berkolaborasi dan mandiri.`;
    }
    if (na >= 80) {
      return `Menunjukkan pemahaman yang baik dalam mencapai tujuan pembelajaran, mampu menyelesaikan tugas praktikum dengan cermat.`;
    }
    if (na >= kktpDefault) {
      return `Telah mencapai kriteria ketuntasan minimal tujuan pembelajaran, perlu ditingkatkan konsistensi dalam penugasan mandiri.`;
    }
    return `Perlu pendampingan intensif dan remedial untuk mencapai tujuan pembelajaran pada materi ${selectedMapel?.elemen || 'pokok'}.`;
  };

  const handleSaveAll = () => {
    if (!selectedMapel) return;
    for (const s of classStudents) {
      const sc = scores[s.id] || { tp1: 80, tp2: 80, tp3: 80, tp4: 80, sts: 80, sas: 80 };
      const na = calculateNa(sc);
      const deskripsi = generateDeskripsi(s.nama, na);

      db.saveNilai({
        id: `nil-${s.id}-${selectedMapel.id}`,
        siswaId: s.id,
        mapelId: selectedMapel.id,
        semester: 'Genap',
        tahunAjaran: '2024/2025',
        tp1: sc.tp1,
        tp2: sc.tp2,
        tp3: sc.tp3,
        tp4: sc.tp4,
        sts: sc.sts,
        sas: sc.sas,
        kktp: kktpDefault,
        catatanCapaian: deskripsi,
      });
    }

    Swal.fire({
      icon: 'success',
      title: 'Leger Nilai Tersimpan!',
      text: `Nilai ${classStudents.length} siswa untuk mapel ${selectedMapel.nama} berhasil diperbarui.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (isPrintMode) {
    return (
      <OfficialPrintLayout
        title="LEGER ASESMEN & NILAI RAPOR KURIKULUM MERDEKA"
        subtitle={`MATA PELAJARAN: ${selectedMapel?.nama.toUpperCase()} • KELAS: ${selectedKelas} • KKTP: ${kktpDefault}`}
        onBack={() => setIsPrintMode(false)}
      >
        <div className="space-y-4">
          <table className="w-full text-left text-xs border-collapse border border-black">
            <thead>
              <tr className="bg-slate-200 text-black border-b border-black font-bold">
                <th className="p-2 border border-black text-center w-10" rowSpan={2}>No</th>
                <th className="p-2 border border-black text-center w-24" rowSpan={2}>NISN</th>
                <th className="p-2 border border-black" rowSpan={2}>Nama Peserta Didik</th>
                <th className="p-1 border border-black text-center" colSpan={4}>Formatif (TP)</th>
                <th className="p-1 border border-black text-center" colSpan={2}>Sumatif</th>
                <th className="p-2 border border-black text-center w-14" rowSpan={2}>NA</th>
                <th className="p-2 border border-black text-center w-14" rowSpan={2}>Predikat</th>
                <th className="p-2 border border-black" rowSpan={2}>Deskripsi Capaian Kompetensi</th>
              </tr>
              <tr className="bg-slate-100 text-black border-b border-black font-bold text-center">
                <th className="p-1 border border-black w-10">TP1</th>
                <th className="p-1 border border-black w-10">TP2</th>
                <th className="p-1 border border-black w-10">TP3</th>
                <th className="p-1 border border-black w-10">TP4</th>
                <th className="p-1 border border-black w-10">STS</th>
                <th className="p-1 border border-black w-10">SAS</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((s, idx) => {
                const sc = scores[s.id] || { tp1: 0, tp2: 0, tp3: 0, tp4: 0, sts: 0, sas: 0 };
                const na = calculateNa(sc);
                const pred = getPredikat(na);
                const desc = generateDeskripsi(s.nama, na);

                return (
                  <tr key={s.id} className="border-b border-black">
                    <td className="p-2 border border-black text-center">{idx + 1}</td>
                    <td className="p-2 border border-black text-center font-mono">{s.nisn}</td>
                    <td className="p-2 border border-black font-semibold">{s.nama}</td>
                    <td className="p-1 border border-black text-center font-mono">{sc.tp1}</td>
                    <td className="p-1 border border-black text-center font-mono">{sc.tp2}</td>
                    <td className="p-1 border border-black text-center font-mono">{sc.tp3}</td>
                    <td className="p-1 border border-black text-center font-mono">{sc.tp4}</td>
                    <td className="p-1 border border-black text-center font-mono">{sc.sts}</td>
                    <td className="p-1 border border-black text-center font-mono">{sc.sas}</td>
                    <td className="p-2 border border-black text-center font-bold text-sm">{na}</td>
                    <td className="p-2 border border-black text-center font-bold">{pred.predikat}</td>
                    <td className="p-2 border border-black text-[10px] leading-tight">{desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Buku Leger Asesmen &amp; Nilai Rapor
            </h2>
            <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Sesuai Panduan Pembelajaran &amp; Asesmen (PPA) SK BSKAP 046/H/KR/2025
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
            <span>Cetak Leger Rapor</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Nilai</span>
          </button>
        </div>
      </div>

      {/* Filter and settings */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Pilih Rombel:
            </label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400"
            >
              {distinctKelas.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Mata Pelajaran:
            </label>
            <select
              value={selectedMapelId}
              onChange={(e) => setSelectedMapelId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold"
            >
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} ({m.tingkat})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              KKTP Satuan Pendidikan:
            </label>
            <input
              type="number"
              min={60}
              max={95}
              value={kktpDefault}
              onChange={(e) => setKktpDefault(Number(e.target.value))}
              className="w-20 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-center"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
          <Calculator className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Rumus NA: <strong>50% Rerata Formatif + 25% STS + 25% SAS</strong>
          </span>
        </div>
      </div>

      {/* Table Nilai */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-b border-emerald-200 dark:border-emerald-800 uppercase font-black tracking-wider">
              <tr>
                <th className="p-3 text-center w-12" rowSpan={2}>No</th>
                <th className="p-3" rowSpan={2}>Nama Peserta Didik</th>
                <th className="p-2 text-center" colSpan={4}>Asesmen Formatif (TP)</th>
                <th className="p-2 text-center" colSpan={2}>Asesmen Sumatif</th>
                <th className="p-3 text-center w-16" rowSpan={2}>NA</th>
                <th className="p-3 text-center w-20" rowSpan={2}>Predikat</th>
                <th className="p-3" rowSpan={2}>Narasi Rapor Kurikulum Merdeka</th>
              </tr>
              <tr className="bg-emerald-100/60 dark:bg-emerald-900/40 text-center font-bold">
                <th className="p-2 w-16">TP1</th>
                <th className="p-2 w-16">TP2</th>
                <th className="p-2 w-16">TP3</th>
                <th className="p-2 w-16">TP4</th>
                <th className="p-2 w-16">STS</th>
                <th className="p-2 w-16">SAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {classStudents.map((siswa, idx) => {
                const sc = scores[siswa.id] || { tp1: 80, tp2: 80, tp3: 80, tp4: 80, sts: 80, sas: 80 };
                const na = calculateNa(sc);
                const pred = getPredikat(na);
                const desc = generateDeskripsi(siswa.nama, na);

                return (
                  <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{siswa.nama}</div>
                      <div className="text-[10px] text-slate-400 font-mono">NISN: {siswa.nisn}</div>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={sc.tp1}
                        onChange={(e) => handleScoreChange(siswa.id, 'tp1', Number(e.target.value))}
                        className="w-14 p-1 text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={sc.tp2}
                        onChange={(e) => handleScoreChange(siswa.id, 'tp2', Number(e.target.value))}
                        className="w-14 p-1 text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={sc.tp3}
                        onChange={(e) => handleScoreChange(siswa.id, 'tp3', Number(e.target.value))}
                        className="w-14 p-1 text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={sc.tp4}
                        onChange={(e) => handleScoreChange(siswa.id, 'tp4', Number(e.target.value))}
                        className="w-14 p-1 text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={sc.sts}
                        onChange={(e) => handleScoreChange(siswa.id, 'sts', Number(e.target.value))}
                        className="w-14 p-1 text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={sc.sas}
                        onChange={(e) => handleScoreChange(siswa.id, 'sas', Number(e.target.value))}
                        className="w-14 p-1 text-center font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {na}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          pred.predikat === 'A'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : pred.predikat === 'B'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : pred.predikat === 'C'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {pred.predikat}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-600 dark:text-slate-300 leading-tight max-w-xs">
                      {desc}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
