import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/client";
import type { UploadedAssetDTO } from "@/lib/contracts/common";

function normalizeUploadedAsset(input: any): UploadedAssetDTO {
  return {
    id: String(input?.id ?? ""),
    filename: typeof input?.filename === "string" ? input.filename : undefined,
    url: String(input?.url ?? ""),
    thumbnailUrl: typeof input?.thumbnailUrl === "string" ? input.thumbnailUrl : null,
    mimeType: typeof input?.mimeType === "string" ? input.mimeType : undefined,
    size: typeof input?.size === "number" ? input.size : undefined,
  };
}

export async function uploadFiles(payload: FormData): Promise<UploadedAssetDTO[]> {
  const response = await requestJson<any>(API_ENDPOINTS.upload.list, {
    method: "POST",
    body: payload,
  });

  const data = response?.data ?? response;
  if (Array.isArray(data)) return data.map(normalizeUploadedAsset);
  if (data && typeof data === "object") return [normalizeUploadedAsset(data)];
  return [];
}

export async function uploadSingleFile(file: File): Promise<UploadedAssetDTO | null> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadFiles(formData);
  return result[0] ?? null;
}

export async function deleteUpload(id: string): Promise<void> {
  await requestJson<unknown>(API_ENDPOINTS.upload.byId(id), {
    method: "DELETE",
  });
}
