import type { ApiErrorBody } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

/** Backend рүү generic хүсэлт илгээнэ. Жишээ: await api<User>("/users/me") */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
