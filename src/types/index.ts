// User types
export interface User {
  id: string;
  email: string;
  nama: string;
  avatar: string | null;
  role: "ADMIN" | "USER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Kategori types
export interface Kategori {
  id: string;
  nama: string;
  icon: string | null;
  createdAt: string;
  _count?: {
    cerita: number;
  };
}

// Cerita types
export interface Cerita {
  id: string;
  judul: string;
  deskripsi: string | null;
  thumbnail: string | null;
  status: "DRAFT" | "PUBLISHED";
  views: number;
  kategoriId: string;
  createdAt: string;
  updatedAt: string;
  kategori?: Kategori;
  scenes?: Scene[];
  quizzes?: Quiz[];
  _count?: {
    scenes: number;
    quizzes: number;
    favorit: number;
  };
}

// Scene types
export interface Scene {
  id: string;
  urutan: number;
  gambar: string | null;
  teks: string;
  audio: string | null;
  ceritaId: string;
  createdAt: string;
  updatedAt: string;
}

// Quiz types
export interface Quiz {
  id: string;
  pertanyaan: string;
  urutan: number;
  ceritaId: string;
  createdAt: string;
  pilihan: PilihanJawaban[];
}

export interface PilihanJawaban {
  id: string;
  teks: string;
  isBenar: boolean;
  quizId: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Settings types
export interface AppSetting {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

// Statistics types
export interface DashboardStats {
  totalUsers: number;
  totalCerita: number;
  totalKategori: number;
  publishedCerita: number;
}
