import api from "@/lib/api";
import { ApiResponse, PaginatedResponse, User } from "@/types";

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: "ADMIN" | "USER";
  isActive?: boolean;
  search?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  nama: string;
  role?: "ADMIN" | "USER";
}

export interface UpdateUserData {
  email?: string;
  nama?: string;
  avatar?: string | null;
  role?: "ADMIN" | "USER";
  isActive?: boolean;
}

export const userService = {
  async getAll(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.role) params.append("role", filters.role);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());
    if (filters.search) params.append("search", filters.search);

    const response = await api.get<PaginatedResponse<User>>(`/users?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async create(data: CreateUserData): Promise<User> {
    const response = await api.post<ApiResponse<User>>("/users", data);
    return response.data.data;
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async resetPassword(id: string, newPassword: string): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}/reset-password`, { newPassword });
    return response.data.data;
  },

  async toggleStatus(id: string): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return response.data.data;
  },
};
