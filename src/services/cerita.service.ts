import api from "@/lib/api";
import { ApiResponse, PaginatedResponse, Cerita, Scene, Quiz } from "@/types";

export interface CeritaFilters {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED";
  kategoriId?: string;
  search?: string;
}

export interface CeritaData {
  judul: string;
  deskripsi?: string | null;
  thumbnail?: string | null;
  status?: "DRAFT" | "PUBLISHED";
  kategoriId: string;
}

export interface SceneData {
  urutan?: number;
  gambar?: string | null;
  teks: string;
  audio?: string | null;
  ceritaId: string;
}

export interface QuizData {
  pertanyaan: string;
  urutan?: number;
  ceritaId: string;
  pilihan: {
    teks: string;
    isBenar: boolean;
  }[];
}

export const ceritaService = {
  async getAll(filters: CeritaFilters = {}): Promise<PaginatedResponse<Cerita>> {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.kategoriId) params.append("kategoriId", filters.kategoriId);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<PaginatedResponse<Cerita>>(`/cerita/admin/all?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Cerita> {
    const response = await api.get<ApiResponse<Cerita>>(`/cerita/admin/${id}`);
    return response.data.data;
  },

  async create(data: CeritaData): Promise<Cerita> {
    const response = await api.post<ApiResponse<Cerita>>("/cerita", data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CeritaData>): Promise<Cerita> {
    const response = await api.put<ApiResponse<Cerita>>(`/cerita/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cerita/${id}`);
  },

  async publish(id: string): Promise<Cerita> {
    const response = await api.put<ApiResponse<Cerita>>(`/cerita/${id}/publish`);
    return response.data.data;
  },

  async unpublish(id: string): Promise<Cerita> {
    const response = await api.put<ApiResponse<Cerita>>(`/cerita/${id}/unpublish`);
    return response.data.data;
  },

  // Scenes
  async getScenes(ceritaId: string): Promise<Scene[]> {
    const response = await api.get<ApiResponse<Scene[]>>(`/scenes/cerita/${ceritaId}`);
    return response.data.data;
  },

  async createScene(data: SceneData): Promise<Scene> {
    const response = await api.post<ApiResponse<Scene>>("/scenes", data);
    return response.data.data;
  },

  async createSceneAuto(ceritaId: string, data: Omit<SceneData, "ceritaId" | "urutan">): Promise<Scene> {
    const response = await api.post<ApiResponse<Scene>>(`/scenes/cerita/${ceritaId}`, data);
    return response.data.data;
  },

  async updateScene(id: string, data: Partial<Omit<SceneData, "ceritaId">>): Promise<Scene> {
    const response = await api.put<ApiResponse<Scene>>(`/scenes/${id}`, data);
    return response.data.data;
  },

  async deleteScene(id: string): Promise<void> {
    await api.delete(`/scenes/${id}`);
  },

  // Quizzes
  async getQuizzes(ceritaId: string): Promise<Quiz[]> {
    const response = await api.get<ApiResponse<Quiz[]>>(`/quiz/admin/cerita/${ceritaId}`);
    return response.data.data;
  },

  async createQuiz(data: QuizData): Promise<Quiz> {
    const response = await api.post<ApiResponse<Quiz>>("/quiz", data);
    return response.data.data;
  },

  async updateQuiz(id: string, data: Partial<QuizData>): Promise<Quiz> {
    const response = await api.put<ApiResponse<Quiz>>(`/quiz/${id}`, data);
    return response.data.data;
  },

  async deleteQuiz(id: string): Promise<void> {
    await api.delete(`/quiz/${id}`);
  },
};
