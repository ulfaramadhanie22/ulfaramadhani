import {
  Siswa,
  Mapel,
  JadwalPelajaran,
  PresensiRecord,
  NilaiSiswa,
  AgendaMengajar,
  BimbinganSiswa,
  ProfilGuru,
  ProfilSekolah,
  AiGeneratedDoc,
} from '../types';

const STORAGE_KEYS = {
  GURU: 'app_guru_profil',
  SEKOLAH: 'app_sekolah_profil',
  SISWA: 'app_siswa_list',
  MAPEL: 'app_mapel_list',
  JADWAL: 'app_jadwal_list',
  PRESENSI: 'app_presensi_list',
  NILAI: 'app_nilai_list',
  AGENDA: 'app_agenda_list',
  BIMBINGAN: 'app_bimbingan_list',
  AI_DOCS: 'app_ai_docs_list',
  THEME: 'app_theme_mode',
};

// Default Official Teacher Profile
const DEFAULT_GURU: ProfilGuru = {
  nama: 'Ulfa Ramadhani',
  gelar: 'S.Pd., Gr.',
  nip: '19920514 201903 2 018',
  nuptk: '8451762663210082',
  nik: '3578015405920003',
  email: 'ulfa.ramadhani@guru.sma.belajar.id',
  telepon: '0812-3456-7890',
  pangkatGolongan: 'Penata Muda Tk. I / III/b',
  mapelUtama: 'Informatika & Rekayasa Perangkat Lunak',
  fotoUrl: '',
};

// Default Official School Profile
const DEFAULT_SEKOLAH: ProfilSekolah = {
  nama: 'SMAN 7 TORAJA UTARA',
  npsn: '40314488',
  nss: '301191807007',
  jenjang: 'SMA',
  alamat: 'Jl. Poros Rantepao - Sa\'dan',
  kelurahan: 'Sa\'dan Malimbong',
  kecamatan: 'Sa\'dan',
  kabupatenKota: 'Kabupaten Toraja Utara',
  provinsi: 'Sulawesi Selatan',
  kodePos: '91852',
  telepon: '(0423) 21007',
  website: 'https://sman7torajautara.sch.id',
  email: 'info@sman7torajautara.sch.id',
  kepalaSekolah: 'Drs. Yulius Rante, M.Pd.',
  nipKepalaSekolah: '19680315 199303 1 007',
  logoUrl: '',
  tahunAjaranAktif: '2024/2025',
  semesterAktif: 'Genap',
};

// Default sample Siswa
const DEFAULT_SISWA: Siswa[] = [
  {
    id: 'sis-01',
    nis: '23241001',
    nisn: '0078129011',
    nama: 'Aditya Pratama Putra',
    gender: 'L',
    kelas: 'X.1',
    tempatLahir: 'Rantepao',
    tanggalLahir: '2008-03-15',
    alamat: 'Jl. Poros Sa\'dan No. 12, Toraja Utara',
    kontakOrtu: '0813-3344-5566',
    status: 'Aktif',
  },
  {
    id: 'sis-02',
    nis: '23241002',
    nisn: '0089234120',
    nama: 'Anindya Putri Maharani',
    gender: 'P',
    kelas: 'X.1',
    tempatLahir: 'Makale',
    tanggalLahir: '2008-07-22',
    alamat: 'Jl. Ahmad Yani No. 5, Rantepao',
    kontakOrtu: '0812-4455-6677',
    status: 'Aktif',
  },
  {
    id: 'sis-03',
    nis: '23241003',
    nisn: '0076543219',
    nama: 'Bagas Firmansyah',
    gender: 'L',
    kelas: 'X.2',
    tempatLahir: 'Rantepao',
    tanggalLahir: '2007-11-09',
    alamat: 'Jl. Pongtiku No. 8, Rantepao',
    kontakOrtu: '0857-1122-3344',
    status: 'Aktif',
  },
  {
    id: 'sis-04',
    nis: '23241004',
    nisn: '0081239845',
    nama: 'Cantika Zahra Aurelia',
    gender: 'P',
    kelas: 'X.2',
    tempatLahir: 'Tallunglipu',
    tanggalLahir: '2008-01-30',
    alamat: 'Jl. Tagari No. 44, Tallunglipu',
    kontakOrtu: '0819-8877-6655',
    status: 'Aktif',
  },
  {
    id: 'sis-05',
    nis: '23241005',
    nisn: '0079988112',
    nama: 'Dimas Dwi Wicaksono',
    gender: 'L',
    kelas: 'X.3',
    tempatLahir: 'Sa\'dan',
    tanggalLahir: '2007-12-19',
    alamat: 'Jl. Poros Balusu No. 17, Toraja Utara',
    kontakOrtu: '0878-5544-3322',
    status: 'Aktif',
  },
  {
    id: 'sis-06',
    nis: '23241006',
    nisn: '0084561234',
    nama: 'Farah Nabila Syakieb',
    gender: 'P',
    kelas: 'X.3',
    tempatLahir: 'Rantepao',
    tanggalLahir: '2008-04-10',
    alamat: 'Jl. Sam Ratulangi No. 29, Rantepao',
    kontakOrtu: '0821-9988-7766',
    status: 'Aktif',
  },
  {
    id: 'sis-07',
    nis: '22232001',
    nisn: '0067891234',
    nama: 'Gilang Ramadhan',
    gender: 'L',
    kelas: 'XI 1',
    tempatLahir: 'Rantepao',
    tanggalLahir: '2007-05-18',
    alamat: 'Jl. Malimbong No. 8, Sa\'dan',
    kontakOrtu: '0812-7766-5544',
    status: 'Aktif',
  },
  {
    id: 'sis-08',
    nis: '22232002',
    nisn: '0069012345',
    nama: 'Hafizhah Khairunisa',
    gender: 'P',
    kelas: 'XI 1',
    tempatLahir: 'Makale',
    tanggalLahir: '2007-09-02',
    alamat: 'Jl. Diponegoro No. 15, Rantepao',
    kontakOrtu: '0856-4433-2211',
    status: 'Aktif',
  },
  {
    id: 'sis-09',
    nis: '21223001',
    nisn: '0057891100',
    nama: 'Jonathan Tandiarrang',
    gender: 'L',
    kelas: 'XII 1',
    tempatLahir: 'Tikala',
    tanggalLahir: '2006-08-14',
    alamat: 'Jl. Poros Tikala No. 19, Toraja Utara',
    kontakOrtu: '0812-4455-1199',
    status: 'Aktif',
  },
  {
    id: 'sis-10',
    nis: '21223002',
    nisn: '0058912233',
    nama: 'Maria Sombolinggi',
    gender: 'P',
    kelas: 'XII 1',
    tempatLahir: 'Rantepao',
    tanggalLahir: '2006-11-20',
    alamat: 'Jl. Sa\'dan Matallo No. 2, Toraja Utara',
    kontakOrtu: '0821-7788-9900',
    status: 'Aktif',
  },
];

// Default Mapel
const DEFAULT_MAPEL: Mapel[] = [
  {
    id: 'map-01',
    kode: 'INF-X',
    nama: 'Informatika',
    fase: 'Fase E',
    tingkat: 'Kelas X',
    alokasiJp: 4,
    elemen: 'Berpikir Komputasional & Algoritma Pemrograman',
    capaianPembelajaran:
      'Pada akhir Fase E (berdasarkan SK BSKAP 046/H/KR/2025), peserta didik mampu menerapkan strategi algoritmik standar untuk menghasilkan beberapa solusi persoalan dengan data diskrit bervolume tidak kecil pada kehidupan sehari-hari maupun implementasinya dalam program komputer.',
  },
  {
    id: 'map-02',
    kode: 'INF-XI',
    nama: 'Informatika & Pemrograman Web',
    fase: 'Fase F',
    tingkat: 'Kelas XI',
    alokasiJp: 5,
    elemen: 'Pemrograman Berorientasi Objek & Rekayasa Web',
    capaianPembelajaran:
      'Pada akhir Fase F (berdasarkan SK BSKAP 046/H/KR/2025), peserta didik mampu merancang, mengimplementasikan, dan menguji aplikasi web dinamis berarsitektur modern dengan menerapkan prinsip Deep Learning dan keamanan siber dasar.',
  },
  {
    id: 'map-03',
    kode: 'INF-XII',
    nama: 'Kecerdasan Buatan & Basis Data Lanjutan',
    fase: 'Fase F',
    tingkat: 'Kelas XII',
    alokasiJp: 4,
    elemen: 'Sistem Cerdas, Machine Learning Dasar, & Analisis Data',
    capaianPembelajaran:
      'Peserta didik mampu melakukan normalisasi data, memodelkan ERD, dan memanfaatkan logika machine learning untuk memecahkan masalah kontekstual masyarakat.',
  },
];

// Default Jadwal Pelajaran
const DEFAULT_JADWAL: JadwalPelajaran[] = [
  {
    id: 'jad-01',
    hari: 'Senin',
    jamMulai: '07:30',
    jamSelesai: '10:00',
    mapelId: 'map-01',
    mapelNama: 'Informatika',
    kelas: 'X.1',
    ruang: 'Lab Komputer 1',
  },
  {
    id: 'jad-02',
    hari: 'Senin',
    jamMulai: '10:15',
    jamSelesai: '12:45',
    mapelId: 'map-01',
    mapelNama: 'Informatika',
    kelas: 'X.2',
    ruang: 'Lab Komputer 2',
  },
  {
    id: 'jad-03',
    hari: 'Selasa',
    jamMulai: '07:30',
    jamSelesai: '10:00',
    mapelId: 'map-01',
    mapelNama: 'Informatika',
    kelas: 'X.3',
    ruang: 'Lab Komputer 1',
  },
  {
    id: 'jad-04',
    hari: 'Rabu',
    jamMulai: '07:30',
    jamSelesai: '11:15',
    mapelId: 'map-02',
    mapelNama: 'Informatika & Pemrograman Web',
    kelas: 'XI 1',
    ruang: 'Lab Komputer 2',
  },
  {
    id: 'jad-05',
    hari: 'Kamis',
    jamMulai: '07:30',
    jamSelesai: '10:30',
    mapelId: 'map-03',
    mapelNama: 'Kecerdasan Buatan & Basis Data Lanjutan',
    kelas: 'XII 1',
    ruang: 'Lab Komputer 1',
  },
  {
    id: 'jad-06',
    hari: 'Jumat',
    jamMulai: '07:30',
    jamSelesai: '09:45',
    mapelId: 'map-01',
    mapelNama: 'Informatika',
    kelas: 'X.1',
    ruang: 'Ruang Multimedia',
  },
];

// Default Agenda
const DEFAULT_AGENDA: AgendaMengajar[] = [
  {
    id: 'agn-01',
    tanggal: new Date().toISOString().split('T')[0],
    kelas: 'X.1',
    jamKe: '1 - 3 (07.30 - 10.00)',
    mapelNama: 'Informatika',
    materiPokok: 'Algoritma Pencarian & Pengurutan (Searching & Sorting)',
    tujuanPembelajaran: 'Peserta didik mampu menganalisis efisiensi algoritma bubble sort dan binary search pada studi kasus inventaris toko.',
    kegiatanKbm: 'Deep Learning (Joyful & Meaningful): Simulasi kartu angka fisik berkelompok, perumusan algoritma di lembar LKPD, implementasi kode Python.',
    hambatanCatatan: '2 siswa masih bingung membedakan best-case dan worst-case time complexity.',
    solusi: 'Diberikan scaffolding visual menggunakan diagram animasi perbandingan langkah.',
    status: 'Terlaksana',
  },
  {
    id: 'agn-02',
    tanggal: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    kelas: 'XI 1',
    jamKe: '1 - 5 (07.30 - 11.45)',
    mapelNama: 'Informatika & Pemrograman Web',
    materiPokok: 'REST API & State Management React',
    tujuanPembelajaran: 'Peserta didik mampu mengintegrasikan form frontend dengan backend Express API.',
    kegiatanKbm: 'Praktikum pair programming pembuatan aplikasi manajemen inventaris berbasis web.',
    hambatanCatatan: 'Koneksi lokal beberapa komputer sempat mengalami bentrok port.',
    solusi: 'Konfigurasi environment variable port alternatif.',
    status: 'Terlaksana',
  },
];

// Default Bimbingan
const DEFAULT_BIMBINGAN: BimbinganSiswa[] = [
  {
    id: 'bim-01',
    tanggal: new Date().toISOString().split('T')[0],
    siswaId: 'sis-03',
    siswaNama: 'Bagas Firmansyah',
    kelas: 'X.2',
    jenis: 'Konseling Akademik',
    deskripsiMasalah: 'Kesulitan fokus saat materi pemrograman logika rekursif, tampak sering mengantuk di jam ke-3.',
    tindakLanjut: 'Wawancara empati santai (pendekatan KBC). Ternyata siswa begadang membantu usaha orang tua.',
    hasilEvaluasi: 'Diberikan jadwal belajar fleksibel dan materi rekap video ringkas 5 menit.',
    status: 'Dalam Proses',
  },
  {
    id: 'bim-02',
    tanggal: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    siswaId: 'sis-02',
    siswaNama: 'Anindya Putri Maharani',
    kelas: 'X.1',
    jenis: 'Prestasi & Bakat',
    deskripsiMasalah: 'Minat kuat dalam kompetisi UI/UX Design LKS Tingkat Kabupaten Toraja Utara.',
    tindakLanjut: 'Pendampingan portofolio desain Figma dan pendaftaran seleksi delegasi sekolah.',
    hasilEvaluasi: 'Desain prototype selesai 90%, siap masuk karantina pembinaan intensif.',
    status: 'Selesai',
  },
];

// Default Nilai
const DEFAULT_NILAI: NilaiSiswa[] = [
  {
    id: 'nil-01',
    siswaId: 'sis-01',
    mapelId: 'map-01',
    semester: 'Genap',
    tahunAjaran: '2024/2025',
    tp1: 88,
    tp2: 85,
    tp3: 90,
    tp4: 92,
    sts: 88,
    sas: 91,
    kktp: 75,
    catatanCapaian: 'Sangat menguasai logika algoritma dan implementasi kode secara mandiri dan cermat.',
  },
  {
    id: 'nil-02',
    siswaId: 'sis-02',
    mapelId: 'map-01',
    semester: 'Genap',
    tahunAjaran: '2024/2025',
    tp1: 92,
    tp2: 90,
    tp3: 94,
    tp4: 95,
    sts: 93,
    sas: 96,
    kktp: 75,
    catatanCapaian: 'Memiliki pemahaman mendalam dan kreativitas tinggi dalam merancang solusi komputasional.',
  },
  {
    id: 'nil-03',
    siswaId: 'sis-03',
    mapelId: 'map-01',
    semester: 'Genap',
    tahunAjaran: '2024/2025',
    tp1: 76,
    tp2: 78,
    tp3: 75,
    tp4: 80,
    sts: 77,
    sas: 81,
    kktp: 75,
    catatanCapaian: 'Telah mencapai kriteria ketuntasan, perlu pengayaan lebih lanjut pada algoritma pengurutan data.',
  },
  {
    id: 'nil-04',
    siswaId: 'sis-04',
    mapelId: 'map-01',
    semester: 'Genap',
    tahunAjaran: '2024/2025',
    tp1: 85,
    tp2: 87,
    tp3: 86,
    tp4: 89,
    sts: 88,
    sas: 90,
    kktp: 75,
    catatanCapaian: 'Cakap dalam merumuskan langkah algoritma dan berkolaborasi aktif dalam tim.',
  },
];

class DbService {
  private notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('db-update'));
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // Initial Seed
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.GURU)) {
      this.setItem(STORAGE_KEYS.GURU, DEFAULT_GURU);
    }
    const currentSekolah = this.getItem<ProfilSekolah | null>(STORAGE_KEYS.SEKOLAH, null);
    if (!currentSekolah || currentSekolah.nama === 'SMK NEGERI 1 SURABAYA') {
      this.setItem(STORAGE_KEYS.SEKOLAH, {
        ...DEFAULT_SEKOLAH,
        logoUrl: currentSekolah?.logoUrl || '',
      });
    }

    // Auto-migrate classes if old RPL format exists
    const storedSiswa = this.getItem<Siswa[] | null>(STORAGE_KEYS.SISWA, null);
    if (!storedSiswa || storedSiswa.some((s) => s.kelas.includes('RPL'))) {
      this.setItem(STORAGE_KEYS.SISWA, DEFAULT_SISWA);
    }

    if (!localStorage.getItem(STORAGE_KEYS.MAPEL)) {
      this.setItem(STORAGE_KEYS.MAPEL, DEFAULT_MAPEL);
    }

    const storedJadwal = this.getItem<JadwalPelajaran[] | null>(STORAGE_KEYS.JADWAL, null);
    if (!storedJadwal || storedJadwal.some((j) => j.kelas.includes('RPL'))) {
      this.setItem(STORAGE_KEYS.JADWAL, DEFAULT_JADWAL);
    }

    const storedAgenda = this.getItem<AgendaMengajar[] | null>(STORAGE_KEYS.AGENDA, null);
    if (!storedAgenda || storedAgenda.some((a) => a.kelas.includes('RPL'))) {
      this.setItem(STORAGE_KEYS.AGENDA, DEFAULT_AGENDA);
    }

    const storedBimbingan = this.getItem<BimbinganSiswa[] | null>(STORAGE_KEYS.BIMBINGAN, null);
    if (!storedBimbingan || storedBimbingan.some((b) => b.kelas.includes('RPL'))) {
      this.setItem(STORAGE_KEYS.BIMBINGAN, DEFAULT_BIMBINGAN);
    }

    if (!localStorage.getItem(STORAGE_KEYS.NILAI)) {
      this.setItem(STORAGE_KEYS.NILAI, DEFAULT_NILAI);
    }
  }

  // Profil Guru
  getGuru(): ProfilGuru {
    return this.getItem(STORAGE_KEYS.GURU, DEFAULT_GURU);
  }
  updateGuru(data: Partial<ProfilGuru>): ProfilGuru {
    const current = this.getGuru();
    const updated = { ...current, ...data };
    this.setItem(STORAGE_KEYS.GURU, updated);
    return updated;
  }

  // Profil Sekolah
  getSekolah(): ProfilSekolah {
    return this.getItem(STORAGE_KEYS.SEKOLAH, DEFAULT_SEKOLAH);
  }
  updateSekolah(data: Partial<ProfilSekolah>): ProfilSekolah {
    const current = this.getSekolah();
    const updated = { ...current, ...data };
    this.setItem(STORAGE_KEYS.SEKOLAH, updated);
    return updated;
  }

  // Siswa
  getSiswaList(): Siswa[] {
    return this.getItem(STORAGE_KEYS.SISWA, DEFAULT_SISWA);
  }
  saveSiswa(siswa: Siswa): void {
    const list = this.getSiswaList();
    const index = list.findIndex((s) => s.id === siswa.id);
    if (index >= 0) {
      list[index] = siswa;
    } else {
      list.unshift(siswa);
    }
    this.setItem(STORAGE_KEYS.SISWA, list);
  }
  deleteSiswa(id: string): void {
    const list = this.getSiswaList().filter((s) => s.id !== id);
    this.setItem(STORAGE_KEYS.SISWA, list);
  }
  saveSiswaBulk(newSiswa: Siswa[]): void {
    const current = this.getSiswaList();
    const combined = [...newSiswa, ...current];
    // remove duplicates by NISN
    const uniqueMap = new Map();
    for (const item of combined) {
      if (!uniqueMap.has(item.nisn)) {
        uniqueMap.set(item.nisn, item);
      }
    }
    this.setItem(STORAGE_KEYS.SISWA, Array.from(uniqueMap.values()));
  }

  // Dynamic Distinct Classes list (Section 4 requirement)
  getDistinctKelasList(): string[] {
    const targetClasses = ['X.1', 'X.2', 'X.3', 'XI 1', 'XII 1'];
    const siswaList = this.getSiswaList();
    const classes = Array.from(new Set(siswaList.map((s) => s.kelas).filter(Boolean)));
    for (const d of targetClasses) {
      if (!classes.includes(d)) classes.push(d);
    }
    const valid = classes.filter((c) => !c.includes('RPL'));
    return valid.sort((a, b) => {
      const idxA = targetClasses.indexOf(a);
      const idxB = targetClasses.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });
  }

  // Mapel
  getMapelList(): Mapel[] {
    return this.getItem(STORAGE_KEYS.MAPEL, DEFAULT_MAPEL);
  }
  saveMapel(mapel: Mapel): void {
    const list = this.getMapelList();
    const index = list.findIndex((m) => m.id === mapel.id);
    if (index >= 0) {
      list[index] = mapel;
    } else {
      list.unshift(mapel);
    }
    this.setItem(STORAGE_KEYS.MAPEL, list);
  }
  deleteMapel(id: string): void {
    const list = this.getMapelList().filter((m) => m.id !== id);
    this.setItem(STORAGE_KEYS.MAPEL, list);
  }

  // Jadwal
  getJadwalList(): JadwalPelajaran[] {
    return this.getItem(STORAGE_KEYS.JADWAL, DEFAULT_JADWAL);
  }
  saveJadwal(jadwal: JadwalPelajaran): void {
    const list = this.getJadwalList();
    const index = list.findIndex((j) => j.id === jadwal.id);
    if (index >= 0) {
      list[index] = jadwal;
    } else {
      list.unshift(jadwal);
    }
    this.setItem(STORAGE_KEYS.JADWAL, list);
  }
  deleteJadwal(id: string): void {
    const list = this.getJadwalList().filter((j) => j.id !== id);
    this.setItem(STORAGE_KEYS.JADWAL, list);
  }

  // Presensi
  getPresensiList(): PresensiRecord[] {
    return this.getItem(STORAGE_KEYS.PRESENSI, []);
  }
  savePresensiBatch(records: PresensiRecord[]): void {
    const current = this.getPresensiList();
    // Replace records with matching tanggal, kelas, and siswaId
    const recordMap = new Map<string, PresensiRecord>();
    for (const r of current) {
      recordMap.set(`${r.tanggal}_${r.kelas}_${r.siswaId}`, r);
    }
    for (const r of records) {
      recordMap.set(`${r.tanggal}_${r.kelas}_${r.siswaId}`, r);
    }
    this.setItem(STORAGE_KEYS.PRESENSI, Array.from(recordMap.values()));
  }

  // Nilai
  getNilaiList(): NilaiSiswa[] {
    return this.getItem(STORAGE_KEYS.NILAI, DEFAULT_NILAI);
  }
  saveNilai(nilai: NilaiSiswa): void {
    const list = this.getNilaiList();
    const index = list.findIndex(
      (n) => n.siswaId === nilai.siswaId && n.mapelId === nilai.mapelId
    );
    if (index >= 0) {
      list[index] = nilai;
    } else {
      list.unshift(nilai);
    }
    this.setItem(STORAGE_KEYS.NILAI, list);
  }

  // Agenda
  getAgendaList(): AgendaMengajar[] {
    return this.getItem(STORAGE_KEYS.AGENDA, DEFAULT_AGENDA);
  }
  saveAgenda(agenda: AgendaMengajar): void {
    const list = this.getAgendaList();
    const index = list.findIndex((a) => a.id === agenda.id);
    if (index >= 0) {
      list[index] = agenda;
    } else {
      list.unshift(agenda);
    }
    this.setItem(STORAGE_KEYS.AGENDA, list);
  }
  deleteAgenda(id: string): void {
    const list = this.getAgendaList().filter((a) => a.id !== id);
    this.setItem(STORAGE_KEYS.AGENDA, list);
  }

  // Bimbingan
  getBimbinganList(): BimbinganSiswa[] {
    return this.getItem(STORAGE_KEYS.BIMBINGAN, DEFAULT_BIMBINGAN);
  }
  saveBimbingan(bimbingan: BimbinganSiswa): void {
    const list = this.getBimbinganList();
    const index = list.findIndex((b) => b.id === bimbingan.id);
    if (index >= 0) {
      list[index] = bimbingan;
    } else {
      list.unshift(bimbingan);
    }
    this.setItem(STORAGE_KEYS.BIMBINGAN, list);
  }
  deleteBimbingan(id: string): void {
    const list = this.getBimbinganList().filter((b) => b.id !== id);
    this.setItem(STORAGE_KEYS.BIMBINGAN, list);
  }

  // AI Generated Docs
  getAiDocs(): AiGeneratedDoc[] {
    return this.getItem(STORAGE_KEYS.AI_DOCS, []);
  }
  saveAiDoc(doc: AiGeneratedDoc): void {
    const list = this.getAiDocs();
    list.unshift(doc);
    this.setItem(STORAGE_KEYS.AI_DOCS, list);
  }
  deleteAiDoc(id: string): void {
    const list = this.getAiDocs().filter((d) => d.id !== id);
    this.setItem(STORAGE_KEYS.AI_DOCS, list);
  }

  // Theme
  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  }
  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.notify();
  }

  // Backup & Restore
  exportDatabaseJson(): string {
    const data = {
      guru: this.getGuru(),
      sekolah: this.getSekolah(),
      siswa: this.getSiswaList(),
      mapel: this.getMapelList(),
      jadwal: this.getJadwalList(),
      presensi: this.getPresensiList(),
      nilai: this.getNilaiList(),
      agenda: this.getAgendaList(),
      bimbingan: this.getBimbinganList(),
      aiDocs: this.getAiDocs(),
      exportedAt: new Date().toISOString(),
      appName: 'DASHBOARD ADMINISTRASI ULFA RAMADHANI',
    };
    return JSON.stringify(data, null, 2);
  }

  importDatabaseJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.guru) this.setItem(STORAGE_KEYS.GURU, data.guru);
      if (data.sekolah) this.setItem(STORAGE_KEYS.SEKOLAH, data.sekolah);
      if (data.siswa) this.setItem(STORAGE_KEYS.SISWA, data.siswa);
      if (data.mapel) this.setItem(STORAGE_KEYS.MAPEL, data.mapel);
      if (data.jadwal) this.setItem(STORAGE_KEYS.JADWAL, data.jadwal);
      if (data.presensi) this.setItem(STORAGE_KEYS.PRESENSI, data.presensi);
      if (data.nilai) this.setItem(STORAGE_KEYS.NILAI, data.nilai);
      if (data.agenda) this.setItem(STORAGE_KEYS.AGENDA, data.agenda);
      if (data.bimbingan) this.setItem(STORAGE_KEYS.BIMBINGAN, data.bimbingan);
      if (data.aiDocs) this.setItem(STORAGE_KEYS.AI_DOCS, data.aiDocs);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.GURU);
    localStorage.removeItem(STORAGE_KEYS.SEKOLAH);
    localStorage.removeItem(STORAGE_KEYS.SISWA);
    localStorage.removeItem(STORAGE_KEYS.MAPEL);
    localStorage.removeItem(STORAGE_KEYS.JADWAL);
    localStorage.removeItem(STORAGE_KEYS.PRESENSI);
    localStorage.removeItem(STORAGE_KEYS.NILAI);
    localStorage.removeItem(STORAGE_KEYS.AGENDA);
    localStorage.removeItem(STORAGE_KEYS.BIMBINGAN);
    localStorage.removeItem(STORAGE_KEYS.AI_DOCS);
    this.init();
    this.notify();
  }
}

export const db = new DbService();
db.init();
