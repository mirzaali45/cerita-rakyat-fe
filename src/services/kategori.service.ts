import api from "@/lib/api";
import { ApiResponse, Kategori } from "@/types";

export interface KategoriData {
  nama: string;
  icon?: string | null;
}

export const kategoriService = {
  async getAll(withCount: boolean = false): Promise<Kategori[]> {
    const response = await api.get<ApiResponse<Kategori[]>>(`/kategori?withCount=${withCount}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Kategori> {
    const response = await api.get<ApiResponse<Kategori>>(`/kategori/${id}`);
    return response.data.data;
  },

  async create(data: KategoriData): Promise<Kategori> {
    const response = await api.post<ApiResponse<Kategori>>("/kategori", data);
    return response.data.data;
  },

  async update(id: string, data: KategoriData): Promise<Kategori> {
    const response = await api.put<ApiResponse<Kategori>>(`/kategori/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/kategori/${id}`);
  },
};
