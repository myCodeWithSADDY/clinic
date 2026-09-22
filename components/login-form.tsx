import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = React.ComponentProps<"form"> & {
  error?: string;
  loading?: boolean;
};

export function LoginForm({
  className,
  action,
  error,
  loading = false,
  ...props
}: LoginFormProps) {
  return (
    <form
      action={action}
      className={cn(
        "flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-none",
        className,
      )}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>

          <p className="text-sm text-balance text-slate-500 dark:text-slate-400">
            Sign in to continue to your clinic workspace
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={loading}
            className="h-11 rounded-xl border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/70"
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <a
              href="#"
              className="ml-auto text-sm text-cyan-700 underline-offset-4 hover:underline dark:text-cyan-300"
            >
              Forgot your password?
            </a>
          </div>

          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={loading}
            className="h-11 rounded-xl border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/70"
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading} className="h-11 rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/15 hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
