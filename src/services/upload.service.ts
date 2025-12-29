import api from "@/lib/api";
import { ApiResponse } from "@/types";

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ApiResponse<{ url: string }>>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.url;
  },

  async uploadAudio(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ApiResponse<{ url: string }>>("/upload/audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.url;
  },

  async uploadMultipleImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post<ApiResponse<{ urls: string[] }>>("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.urls;
  },

  async deleteFile(url: string): Promise<void> {
    await api.delete("/upload", { data: { url } });
  },
};
