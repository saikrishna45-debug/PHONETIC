"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { requestPasswordResetMock } from "@/lib/auth/mock-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await requestPasswordResetMock(email.trim());
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase text-emerald-700">Account access</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">{sent ? "Reset link sent" : "Forgot your password?"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{sent ? "If an account exists with this email, you will receive instructions to reset your password." : "Enter your email and we’ll send instructions to help you reset your password."}</p>
      </div>
      <Card className="border-white/90 shadow-md shadow-slate-900/5">
        <CardContent className="p-5 sm:p-7">
          {sent ? (
            <div role="status" className="flex flex-col items-center py-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-7 w-7" /></span>
              <p className="mt-4 text-sm font-semibold text-slate-900">Check your inbox</p>
              <p className="mt-1 max-w-sm break-all text-sm text-slate-500">{email.trim()}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-slate-800">Email</label>
                <Input id="reset-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" startIcon={<Mail className="h-4 w-4" />} error={Boolean(error)} aria-invalid={Boolean(error)} aria-describedby={error ? "reset-email-error" : undefined} />
                {error && <p id="reset-email-error" className="mt-1.5 text-xs font-medium text-red-700">{error}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>{submitting ? <Send className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}Send Reset Link</Button>
              <p className="text-center text-xs text-slate-500">This demo does not send email.</p>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 px-5 py-4 sm:px-7">
          <Link href="/login" className="text-sm font-semibold text-emerald-800 hover:underline">Back to Login</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
