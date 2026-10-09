import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { Siswa } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { CreditCard, Printer, Filter, School } from 'lucide-react';

export const KartuSiswaView: React.FC = () => {
  const [siswaList, setSiswaList] = useState<Siswa[]>(db.getSiswaList());
  const [distinctKelas, setDistinctKelas] = useState<string[]>(db.getDistinctKelasList());
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const sekolah = db.getSekolah();

  useEffect(() => {
    const handleUpdate = () => {
      setSiswaList(db.getSiswaList());
      setDistinctKelas(db.getDistinctKelasList());
    };
    window.addEventListener('db-update', handleUpdate);
    return () => window.removeEventListener('db-update', handleUpdate);
  }, []);

  const filtered = selectedKelas === 'Semua' ? siswaList : siswaList.filter((s) => s.kelas === selectedKelas);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action header (hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-700 text-white p-5 rounded-2xl shadow-md border-2 border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-800 rounded-xl text-emerald-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Generator Kartu Pelajar Digital QR Code
            </h2>
            <p className="text-xs text-emerald-100">
              Format lembar kertas A4 standar cetak presisi (8 kartu per lembar siap potong)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter kelas */}
          <div className="flex items-center gap-1.5 bg-emerald-800/80 px-3 py-1.5 rounded-xl border border-emerald-500">
            <Filter className="w-4 h-4 text-emerald-200" />
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-hidden"
            >
              <option value="Semua" className="text-black">Semua Rombel</option>
              {distinctKelas.map((k) => (
                <option key={k} value={k} className="text-black">
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu A4 (Print)</span>
          </button>
        </div>
      </div>

      {/* Sheet A4 Container */}
      <div className="print-area bg-white text-slate-900 p-4 sm:p-6 rounded-2xl shadow-md border border-slate-300 max-w-5xl mx-auto">
        <div className="no-print mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
          <span>
            Menampilkan <strong>{filtered.length}</strong> kartu pelajar. Atur layout printer ke <strong>A4 Portrait</strong> dengan margin minimum untuk hasil cetak terbaik.
          </span>
          <span className="font-bold text-blue-700">8 Kartu / Lembar A4</span>
        </div>

        {/* Grid 2 cols for A4 sheet (each card standard 8.5 x 5.4 cm ratio) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
          {filtered.map((siswa) => {
            const qrPayload = JSON.stringify({
              sekolah: sekolah.nama,
              nisn: siswa.nisn,
              nis: siswa.nis,
              nama: siswa.nama,
              kelas: siswa.kelas,
              status: 'TERVERIFIKASI RESMI',
            });

            return (
              <div
                key={siswa.id}
                className="relative rounded-2xl overflow-hidden border-2 border-blue-800 shadow-md bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col justify-between p-3.5 print:break-inside-avoid print:shadow-none print:border-black min-h-[220px]"
              >
                {/* Header Kartu */}
                <div className="border-b-2 border-blue-800 pb-2 flex items-center justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                    {sekolah.logoUrl ? (
                      <img
                        src={sekolah.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <School className="w-5 h-5 text-blue-900" />
                    )}
                  </div>
                  <div className="flex-1 text-center">
                    <h4 className="text-[10px] font-black uppercase text-blue-950 tracking-wider">
                      KARTU TANDA PELAJAR
                    </h4>
                    <h5 className="text-[11px] font-black uppercase text-blue-800 leading-tight">
                      {sekolah.nama}
                    </h5>
                    <p className="text-[8px] text-slate-500">
                      NPSN: {sekolah.npsn} • {sekolah.kabupatenKota}
                    </p>
                  </div>
                  <div className="w-8 shrink-0"></div>
                </div>

                {/* Body Kartu */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  {/* Foto Siswa */}
                  <div className="w-20 h-24 rounded-xl border border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-inner">
                    {siswa.fotoUrl ? (
                      <img
                        src={siswa.fotoUrl}
                        alt={siswa.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-black text-sm mx-auto flex items-center justify-center mb-1">
                          {siswa.nama.charAt(0)}
                        </div>
                        <span className="text-[8px] uppercase font-bold text-slate-500">
                          {siswa.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Biodata */}
                  <div className="flex-1 text-[10px] space-y-1">
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase font-semibold">
                        Nama Lengkap
                      </span>
                      <strong className="text-slate-900 font-bold text-[11px] leading-tight block">
                        {siswa.nama}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[8px] uppercase font-semibold">
                          NISN
                        </span>
                        <strong className="font-mono text-blue-900">{siswa.nisn}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[8px] uppercase font-semibold">
                          NIS
                        </span>
                        <strong className="font-mono">{siswa.nis}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[8px] uppercase font-semibold">
                          Kelas
                        </span>
                        <strong className="font-extrabold text-blue-800">{siswa.kelas}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[8px] uppercase font-semibold">
                          Lahir
                        </span>
                        <span>{siswa.tempatLahir}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Verifikasi */}
                  <div className="shrink-0 flex flex-col items-center justify-center p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <QRCodeSVG
                      value={qrPayload}
                      size={54}
                      level="M"
                      includeMargin={false}
                    />
                    <span className="text-[7px] text-slate-500 font-mono mt-0.5 font-bold">
                      SCAN VERIFIKASI
                    </span>
                  </div>
                </div>

                {/* Footer Kartu & TTD */}
                <div className="pt-2 border-t border-slate-200 flex items-end justify-between text-[8px]">
                  <div>
                    <span className="text-[7px] text-slate-400 block">Masa Berlaku:</span>
                    <strong className="text-slate-700">Selama Menjadi Peserta Didik Aktif</strong>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] text-slate-500">Kepala Sekolah,</p>
                    <p className="font-bold underline text-slate-900 mt-3">{sekolah.kepalaSekolah}</p>
                    <p className="text-[7px] font-mono text-slate-500">NIP. {sekolah.nipKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
