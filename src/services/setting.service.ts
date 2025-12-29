import api from "@/lib/api";
import { ApiResponse, AppSetting } from "@/types";

export const settingService = {
  async getAll(): Promise<AppSetting[]> {
    const response = await api.get<ApiResponse<AppSetting[]>>("/settings");
    return response.data.data;
  },

  async getAsObject(): Promise<Record<string, string>> {
    const response = await api.get<ApiResponse<Record<string, string>>>("/settings?format=object");
    return response.data.data;
  },

  async getByKey(key: string): Promise<AppSetting> {
    const response = await api.get<ApiResponse<AppSetting>>(`/settings/${key}`);
    return response.data.data;
  },

  async upsert(key: string, value: string): Promise<AppSetting> {
    const response = await api.post<ApiResponse<AppSetting>>("/settings", { key, value });
    return response.data.data;
  },

  async update(key: string, value: string): Promise<AppSetting> {
    const response = await api.put<ApiResponse<AppSetting>>(`/settings/${key}`, { value });
    return response.data.data;
  },

  async delete(key: string): Promise<void> {
    await api.delete(`/settings/${key}`);
  },

  async bulkUpdate(settings: { key: string; value: string }[]): Promise<AppSetting[]> {
    const response = await api.put<ApiResponse<AppSetting[]>>("/settings/bulk", { settings });
    return response.data.data;
  },
};
