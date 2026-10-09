export type ActiveMenu =
  // Menu Utama (Biru)
  | 'dashboard'
  // Menu Akademik (Emerald/Multi)
  | 'siswa'
  | 'mapel'
  | 'jadwal'
  | 'presensi'
  | 'kartu-siswa'
  | 'nilai'
  | 'agenda'
  | 'bimbingan'
  | 'perangkat-unduh'
  // Menu Suite AI (Oranye)
  | 'ai-modul'
  | 'ai-media'
  | 'ai-perangkat'
  | 'ai-kbc'
  | 'ai-kokurikuler'
  | 'ai-soal'
  | 'ai-kartu-soal'
  | 'ai-lkpd'
  | 'ai-ppt'
  | 'ai-chat'
  // Menu Laporan & Pengaturan (Kuning)
  | 'laporan'
  | 'pengaturan';

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  gender: 'L' | 'P';
  kelas: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  kontakOrtu: string;
  status: 'Aktif' | 'Non-Aktif' | 'Mutasi';
  fotoUrl?: string;
}

export interface Mapel {
  id: string;
  kode: string;
  nama: string;
  fase: 'Fase A' | 'Fase B' | 'Fase C' | 'Fase D' | 'Fase E' | 'Fase F';
  tingkat: string;
  alokasiJp: number; // JP per minggu
  elemen: string;
  capaianPembelajaran: string;
}

export interface JadwalPelajaran {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulai: string;
  jamSelesai: string;
  mapelId: string;
  mapelNama: string;
  kelas: string;
  ruang: string;
}

export interface PresensiRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelas: string;
  mapelId?: string;
  siswaId: string;
  status: 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa
  catatan?: string;
}

export interface NilaiSiswa {
  id: string;
  siswaId: string;
  mapelId: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  // Formatif (Tugas, Kuis, LKPD)
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  // Sumatif
  sts: number; // Sumatif Tengah Semester
  sas: number; // Sumatif Akhir Semester
  kktp: number; // Kriteria Ketercapaian Tujuan Pembelajaran (default 75)
  catatanCapaian?: string;
}

export interface AgendaMengajar {
  id: string;
  tanggal: string;
  kelas: string;
  jamKe: string;
  mapelNama: string;
  materiPokok: string;
  tujuanPembelajaran: string;
  kegiatanKbm: string;
  hambatanCatatan: string;
  solusi: string;
  status: 'Terlaksana' | 'Tertunda' | 'Daring';
}

export interface BimbinganSiswa {
  id: string;
  tanggal: string;
  siswaId: string;
  siswaNama: string;
  kelas: string;
  jenis: 'Kasus Disiplin' | 'Konseling Akademik' | 'Konseling Pribadi' | 'Prestasi & Bakat';
  deskripsiMasalah: string;
  tindakLanjut: string;
  hasilEvaluasi: string;
  status: 'Selesai' | 'Dalam Proses' | 'Rujukan BK';
}

export interface ProfilGuru {
  nama: string;
  gelar: string;
  nip: string;
  nuptk: string;
  nik: string;
  email: string;
  telepon: string;
  pangkatGolongan: string;
  mapelUtama: string;
  fotoUrl?: string;
}

export interface ProfilSekolah {
  nama: string;
  npsn: string;
  nss: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  website: string;
  email: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  logoUrl: string;
  tahunAjaranAktif: string;
  semesterAktif: 'Ganjil' | 'Genap';
}

export interface AiGeneratedDoc {
  id: string;
  kategori: string;
  judul: string;
  tanggalDibuat: string;
  konten: string;
  metadata?: Record<string, any>;
}
