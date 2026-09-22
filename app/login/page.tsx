"use client";

import { useActionState } from "react";

import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, ShieldCheck, Sparkles } from "lucide-react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-950/30" />
      <div className="pointer-events-none absolute -bottom-32 right-1/3 size-96 rounded-full bg-teal-200/20 blur-3xl dark:bg-teal-950/20" />

      <div className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="relative grid min-h-svh lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col p-6 sm:p-10 lg:p-14">
          <a href="#" className="flex items-center gap-3 font-medium">
            <Logo className="shrink-0" style={{ width: 42, height: 42 }} />
            <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
              Fahad Clinic
            </span>
          </a>

          <div className="flex flex-1 items-center justify-center py-12 lg:py-16">
            <div className="w-full max-w-md">
              <LoginForm
                action={formAction}
                loading={isPending}
                error={state?.error}
              />
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden border-l border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-teal-50 lg:flex lg:items-center lg:justify-center dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="absolute right-10 top-16 size-40 rounded-full border border-cyan-200/70 dark:border-cyan-800/60" />
          <div className="absolute -bottom-20 -left-12 size-64 rounded-full border border-teal-200/60 dark:border-teal-900/60" />

          <div className="relative max-w-lg px-12">
            <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/20">
              <Activity className="size-8" />
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
              Care, organized
            </p>
            <h1 className="max-w-md text-4xl font-semibold tracking-tight text-slate-900 dark:text-white xl:text-5xl">
              A calmer way to run your clinic.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600 dark:text-slate-300">
              Keep patient records, appointments, prescriptions, and daily work
              flowing from one focused workspace.
            </p>

            <div className="mt-10 grid gap-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-teal-600 dark:text-teal-300" />
                Secure patient workflows
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-cyan-600 dark:text-cyan-300" />
                Clear, connected clinic operations
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
