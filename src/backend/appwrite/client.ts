import { appwriteEnvironmentKeys } from "./schema";

export function getAppwriteConfig() {
  return {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",
    apiKey: process.env.APPWRITE_API_KEY ?? ""
  };
}

export function missingAppwriteEnvironmentKeys() {
  const config = getAppwriteConfig();
  return appwriteEnvironmentKeys.filter((key) => {
    if (key === "NEXT_PUBLIC_APPWRITE_ENDPOINT") return !config.endpoint;
    if (key === "NEXT_PUBLIC_APPWRITE_PROJECT_ID") return !config.projectId;
    if (key === "NEXT_PUBLIC_APPWRITE_DATABASE_ID") return !config.databaseId;
    return !config.apiKey;
  });
}

export function isAppwriteConfigured() {
  return missingAppwriteEnvironmentKeys().length === 0;
}

export function getAppwriteHeaders() {
  const config = getAppwriteConfig();
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Project": config.projectId,
    "X-Appwrite-Key": config.apiKey
  };
}
