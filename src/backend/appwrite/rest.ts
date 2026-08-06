import { getAppwriteConfig, getAppwriteHeaders, isAppwriteConfigured } from "./client";

interface AppwriteRestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

export class AppwriteConfigurationError extends Error {
  constructor(message = "Appwrite is not configured") {
    super(message);
    this.name = "AppwriteConfigurationError";
  }
}

export async function appwriteRest<T>(path: string, options: AppwriteRestOptions = {}) {
  if (!isAppwriteConfigured()) throw new AppwriteConfigurationError();
  const config = getAppwriteConfig();
  const response = await fetch(`${config.endpoint}${path}`, {
    method: options.method ?? "GET",
    headers: getAppwriteHeaders(),
    body: options.body == null ? undefined : JSON.stringify(options.body),
    cache: "no-store"
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T) : ({} as T);
  if (!response.ok) {
    const message = typeof payload === "object" && payload && "message" in payload ? String(payload.message) : `Appwrite request failed: ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

export async function checkAppwriteHealth() {
  const config = getAppwriteConfig();
  if (!isAppwriteConfigured()) {
    return { ok: false, endpoint: config.endpoint, projectId: config.projectId, databaseId: config.databaseId, message: "Appwrite configuration incomplete" };
  }

  const result = await appwriteRest<{ $id: string }>(`/databases/${config.databaseId}`).catch((error) => ({ error }));
  const ok = !("error" in result);
  return {
    ok,
    endpoint: config.endpoint,
    projectId: config.projectId,
    databaseId: config.databaseId,
    message: ok ? "Appwrite database reachable" : result.error instanceof Error ? result.error.message : "Appwrite database not reachable"
  };
}
