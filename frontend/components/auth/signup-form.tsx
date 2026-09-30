"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { signUpMock, continueWithGoogleMock } from "@/lib/auth/mock-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    else if (!emailPattern.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Create a password.";
    else if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    else if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    return nextErrors;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await signUpMock({ fullName: fullName.trim(), email: email.trim(), password });
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
        <p className="text-xs font-bold uppercase text-emerald-700">A smarter choice starts here</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">Create your Phonetic account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Start making smarter smartphone decisions.</p>
      </div>
      <Card className="border-white/90 shadow-md shadow-slate-900/5">
        <CardContent className="p-5 sm:p-7">
          <form onSubmit={submit} noValidate className="space-y-4">
            <FormField id="signup-name" label="Full Name" error={errors.fullName}>
              <Input id="signup-name" autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} placeholder="Your name" startIcon={<UserRound className="h-4 w-4" />} error={Boolean(errors.fullName)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "signup-name-error" : undefined} />
            </FormField>
            <FormField id="signup-email" label="Email" error={errors.email}>
              <Input id="signup-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" startIcon={<Mail className="h-4 w-4" />} error={Boolean(errors.email)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "signup-email-error" : undefined} />
            </FormField>
            <FormField id="signup-password" label="Password" error={errors.password}>
              <PasswordInput id="signup-password" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(value => !value)} autoComplete="new-password" placeholder="At least 8 characters" error={Boolean(errors.password)} describedBy={errors.password ? "signup-password-error" : undefined} />
            </FormField>
            <FormField id="signup-confirm" label="Confirm Password" error={errors.confirmPassword}>
              <PasswordInput id="signup-confirm" value={confirmPassword} onChange={setConfirmPassword} show={showConfirmPassword} toggle={() => setShowConfirmPassword(value => !value)} autoComplete="new-password" placeholder="Re-enter your password" error={Boolean(errors.confirmPassword)} describedBy={errors.confirmPassword ? "signup-confirm-error" : undefined} />
            </FormField>
            <p className="-mt-1 text-xs text-slate-500">Use at least 8 characters for your password.</p>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or continue with<span className="h-px flex-1 bg-slate-200" /></div>
          <Button type="button" variant="outline" onClick={continueWithGoogle} disabled={submitting} className="w-full"><GoogleMark /> Continue with Google</Button>
          <p className="mt-4 text-center text-[11px] leading-5 text-slate-500">Demo flow only. Authentication is not connected.</p>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-emerald-800 hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}

function FormField({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800">{label}</label>{children}{error && <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">{error}</p>}</div>;
}

function PasswordInput({ id, value, onChange, show, toggle, autoComplete, placeholder, error, describedBy }: { id: string; value: string; onChange: (value: string) => void; show: boolean; toggle: () => void; autoComplete: string; placeholder: string; error: boolean; describedBy?: string }) {
  return <div className="relative"><Input id={id} type={show ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} startIcon={<LockKeyhole className="h-4 w-4" />} error={error} aria-invalid={error} aria-describedby={describedBy} className="pr-11" /><button type="button" onClick={toggle} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>;
}

function GoogleMark() {
  return <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full text-sm font-bold text-blue-600">G</span>;
}
