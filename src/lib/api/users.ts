import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/client";
import type {
  ChangePasswordPayloadDTO,
  UpdateProfilePayloadDTO,
  UserDTO,
} from "@/lib/contracts/user";
import { mapUser } from "@/lib/mappers/user.mapper";

export async function getCurrentUser(): Promise<UserDTO | null> {
  const response = await requestJson<any>(API_ENDPOINTS.users.me, {
    method: "GET",
  });
  return mapUser(response?.data ?? response);
}

export async function updateProfile(payload: UpdateProfilePayloadDTO): Promise<UserDTO | null> {
  const response = await requestJson<any>(API_ENDPOINTS.users.me, {
    method: "PATCH",
    body: payload,
  });
  return mapUser(response?.data ?? response);
}

export async function changePassword(payload: ChangePasswordPayloadDTO): Promise<void> {
  await requestJson<unknown>(API_ENDPOINTS.users.password, {
    method: "PATCH",
    body: payload,
  });
}
