"use client";

import { Account, Client, Databases, Storage } from "appwrite";
import { getAppwriteConfig } from "./client";

let browserClient: Client | null = null;

export function getAppwriteBrowserClient() {
  if (browserClient) return browserClient;
  const config = getAppwriteConfig();
  browserClient = new Client().setEndpoint(config.endpoint).setProject(config.projectId);
  return browserClient;
}

export function getAppwriteAccount() {
  return new Account(getAppwriteBrowserClient());
}

export function getAppwriteDatabases() {
  return new Databases(getAppwriteBrowserClient());
}

export function getAppwriteStorage() {
  return new Storage(getAppwriteBrowserClient());
}
