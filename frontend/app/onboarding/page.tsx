import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { OnboardingFlow } from "@/components/auth/onboarding-flow";

export default function OnboardingPage() {
  return (
    <AuthPageShell width="xl" backHref="/" backLabel="Back to Home">
      <OnboardingFlow />
    </AuthPageShell>
  );
}
