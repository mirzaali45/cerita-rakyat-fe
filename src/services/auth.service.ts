import api from "@/lib/api";
import { ApiResponse, LoginResponse, User } from "@/types";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/auth/profile");
    return response.data.data;
  },

  async updateProfile(data: { nama?: string; avatar?: string | null }): Promise<User> {
    const response = await api.put<ApiResponse<User>>("/auth/profile", data);
    return response.data.data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.put("/auth/change-password", { oldPassword, newPassword });
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  },

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
