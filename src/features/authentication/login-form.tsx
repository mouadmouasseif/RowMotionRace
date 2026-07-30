"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { sendRowMotionPasswordReset, signInToExistingRowMotionAccount } from "@/integrations/rowmotion-ai/rowmotion-auth.adapter";

const schema = z.object({ email: z.string().email("Adresse e-mail invalide."), password: z.string().min(6, "Minimum 6 caractères.") });
type Values = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  async function submit(values: Values) {
    setMessage(null);
    try {
      await signInToExistingRowMotionAccount(values.email, values.password);
      const destination = searchParams.get("retour");
      router.replace(destination?.startsWith("/") ? destination : "/tableau-de-bord");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Connexion impossible.");
    }
  }
  async function reset() {
    const email = getValues("email");
    if (!z.string().email().safeParse(email).success) return setMessage("Saisissez d’abord votre adresse e-mail.");
    try { await sendRowMotionPasswordReset(email); setMessage("E-mail de réinitialisation envoyé."); } catch { setMessage("Réinitialisation impossible."); }
  }
  return <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
    <label className="block"><span className="mb-2 block text-sm">Adresse e-mail</span><input {...register("email")} autoComplete="email" className="h-12 w-full rounded-xl border border-white/10 bg-race-background px-4 outline-none focus:border-race-primary" />{errors.email && <small className="mt-1 block text-race-danger">{errors.email.message}</small>}</label>
    <label className="block"><span className="mb-2 block text-sm">Mot de passe</span><input {...register("password")} type="password" autoComplete="current-password" className="h-12 w-full rounded-xl border border-white/10 bg-race-background px-4 outline-none focus:border-race-primary" />{errors.password && <small className="mt-1 block text-race-danger">{errors.password.message}</small>}</label>
    {message && <p className="rounded-xl bg-white/5 p-3 text-sm text-race-muted">{message}</p>}
    <button disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-race-primary font-semibold text-white disabled:opacity-50">{isSubmitting ? <LoaderCircle className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}Se connecter</button>
    <button type="button" onClick={reset} className="w-full text-sm text-race-muted hover:text-white">Mot de passe oublié ?</button>
  </form>;
}
