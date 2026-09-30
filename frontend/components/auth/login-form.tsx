"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { signInMock, continueWithGoogleMock } from "@/lib/auth/mock-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    else if (!emailPattern.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await signInMock({ email: email.trim(), password });
      router.push("/onboarding");
    } finally {
      setSubmitting(false);
    }
  }

  async function continueWithGoogle() {
    setSubmitting(true);
    try {
      await continueWithGoogleMock();
      router.push("/onboarding");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase text-emerald-700">Welcome to Phonetic</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to continue to your Phonetic journey.</p>
      </div>
      <Card className="border-white/90 shadow-md shadow-slate-900/5">
        <CardContent className="p-5 sm:p-7">
          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-800">Email</label>
              <Input id="login-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" startIcon={<Mail className="h-4 w-4" />} error={Boolean(errors.email)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} />
              {errors.email && <p id="login-email-error" className="mt-1.5 text-xs font-medium text-red-700">{errors.email}</p>}
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-800">Password</label>
                <Link href="/forgot-password" className="rounded-sm text-xs font-semibold text-emerald-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" startIcon={<LockKeyhole className="h-4 w-4" />} error={Boolean(errors.password)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} className="pr-11" />
                <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p id="login-password-error" className="mt-1.5 text-xs font-medium text-red-700">{errors.password}</p>}
            </div>
            <Checkbox id="remember-me" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} label="Remember me" className="mt-1" />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or continue with<span className="h-px flex-1 bg-slate-200" /></div>
          <Button type="button" variant="outline" onClick={continueWithGoogle} disabled={submitting} className="w-full">
            <GoogleMark /> Continue with Google
          </Button>
          <p className="mt-4 text-center text-[11px] leading-5 text-slate-500">Demo flow only. Authentication is not connected.</p>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-sm text-slate-600">Don&apos;t have an account? <Link href="/signup" className="font-semibold text-emerald-800 hover:underline">Sign Up</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}

function GoogleMark() {
  return <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full text-sm font-bold text-blue-600">G</span>;
}
