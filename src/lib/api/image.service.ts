import { apiClient } from "./api";
import type { BackendEnvelope } from "./types/auth.types";
import { parseAuthResponse } from "./utils/auth-response";

export type ImageUploadData = {
  publicId: string;
  url: string;
};

class ImageService {
  async upload(file: File, folder: string): Promise<ImageUploadData> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await apiClient.post<BackendEnvelope<ImageUploadData>>(
      "/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new Error("Upload response did not include data.");
    }

    return data;
  }
}

export const imageService = new ImageService();
