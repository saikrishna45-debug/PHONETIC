import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell backHref="/login" backLabel="Back to Login">
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
