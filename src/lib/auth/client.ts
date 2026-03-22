import { fetchAuthSession, loginRequest, logoutRequest, registerRequest } from '@/lib/api/auth';
import type { LoginPayloadDTO, RegisterPayloadDTO, UserDTO } from '@/lib/contracts/user';
import {
  clearFrontendSession,
  getSessionUser as getStoredSessionUser,
  hasFrontendSession,
  setSessionToken,
  setSessionUser,
} from '@/lib/auth/session';

export async function login(payload: LoginPayloadDTO): Promise<UserDTO | null> {
  const session = await loginRequest(payload);
  if (session.token) setSessionToken(session.token);
  if (session.user) setSessionUser(session.user);
  return session.user || null;
}

export async function logout(): Promise<void> {
  clearFrontendSession();
  await logoutRequest();
}

export async function register(payload: RegisterPayloadDTO): Promise<UserDTO | null> {
  const session = await registerRequest(payload);
  if (session.token) setSessionToken(session.token);
  if (session.user) setSessionUser(session.user);
  return session.user || null;
}

export function getSessionUser(): UserDTO | null {
  return getStoredSessionUser();
}

export function requireFrontendAuth(): boolean {
  return hasFrontendSession();
}

export async function refreshSessionUser(): Promise<UserDTO | null> {
  const session = await fetchAuthSession();
  if (session.token) setSessionToken(session.token);
  if (session.user) setSessionUser(session.user);
  return session.user || null;
}
