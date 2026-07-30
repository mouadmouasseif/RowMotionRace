import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseAdminAuth } from "@/lib/firebase/server";

const schema = z.object({ idToken: z.string().min(1) });
const expiresIn = 12 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const { idToken } = schema.parse(await request.json());
    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifyIdToken(idToken, true);
    if (Date.now() / 1000 - decoded.auth_time > 300) return NextResponse.json({ error: "Authentification trop ancienne." }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set("rowmotion_race_session", await auth.createSessionCookie(idToken, { expiresIn }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/"
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Firebase Admin n’est pas encore configuré." }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("rowmotion_race_session", "", { httpOnly: true, sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
