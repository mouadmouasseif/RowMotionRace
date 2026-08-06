import { NextResponse } from "next/server";
import { checkAppwriteHealth } from "@/backend/appwrite/rest";

export async function GET() {
  const health = await checkAppwriteHealth().catch((error) => ({
    ok: false,
    message: error instanceof Error ? error.message : "Appwrite health check failed"
  }));
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
