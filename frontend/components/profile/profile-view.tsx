"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BriefcaseBusiness, History, PencilLine, Smartphone, Star, Wallet, Zap } from "lucide-react";
import { MOCK_ACTIVITY, MOCK_USER } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/common/section-header";
import { getInitialSavedPhoneIds, readSavedPhoneIds, subscribeSavedPhoneIds } from "@/lib/saved-phones";
import { formatINR } from "@/lib/utils";

export function ProfileView() {
  const savedPhoneIds = useSyncExternalStore(subscribeSavedPhoneIds, readSavedPhoneIds, getInitialSavedPhoneIds);
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [nameDraft, setNameDraft] = useState(MOCK_USER.name);
  const [emailDraft, setEmailDraft] = useState(MOCK_USER.email);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const initials = name.trim().split(/\s+/).map(part => part[0]).join("").toUpperCase();
  const resaleCount = MOCK_ACTIVITY.filter(item => item.type === "resale_prediction").length;
  const comparisonCount = MOCK_ACTIVITY.filter(item => item.type === "comparison").length;

  function beginEditing() {
    setNameDraft(name);
    setEmailDraft(email);
    setStatus("");
    setEditing(true);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setName(nameDraft.trim());
    setEmail(emailDraft.trim());
    setEditing(false);
    setStatus("Profile preview updated for this page only. Changes reset when you leave.");
  }

  function cancelEditing() {
    setEditing(false);
    setNameDraft(name);
    setEmailDraft(email);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader title="My Profile" description="Your account details and smartphone preferences available in this demo." />

      <Card>
        <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">
            {initials || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-950">{name}</h2>
              <Badge variant={MOCK_USER.plan === "premium" ? "success" : "secondary"} className="capitalize">{MOCK_USER.plan}</Badge>
            </div>
            <p className="mt-1 break-all text-sm text-slate-600">{email}</p>
            <p className="mt-2 text-xs text-slate-500">Member since {new Date(MOCK_USER.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          </div>
          {!editing && <Button type="button" variant="outline" onClick={beginEditing} className="min-h-11 w-full shrink-0 sm:w-auto"><PencilLine className="h-4 w-4" />Edit profile</Button>}
        </CardContent>
      </Card>

      {editing && <Card>
        <CardHeader><CardTitle className="text-base">Edit profile details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-slate-800">Full name</label>
              <input id="profile-name" name="name" autoComplete="name" required value={nameDraft} onChange={event => setNameDraft(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600" />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-slate-800">Email address</label>
              <input id="profile-email" name="email" type="email" autoComplete="email" required value={emailDraft} onChange={event => setEmailDraft(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600" />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" onClick={cancelEditing} className="min-h-11">Cancel</Button>
              <Button type="submit" className="min-h-11">Update preview</Button>
            </div>
          </form>
          <p className="mt-3 text-xs leading-5 text-slate-500">This demo does not save profile edits after you leave this page.</p>
        </CardContent>
      </Card>}
      {status && <p role="status" className="text-sm text-emerald-800">{status}</p>}

      <section aria-labelledby="activity-summary-heading" className="space-y-3">
        <div>
          <h2 id="activity-summary-heading" className="text-base font-bold text-slate-950">Account activity</h2>
          <p className="mt-1 text-sm text-slate-600">Counts reflect the saved list and available demo history.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ActivitySummary href="/app/saved" label="Saved phones" value={savedPhoneIds.length} icon={Bookmark} />
          <ActivitySummary href="/app/history" label="Recent history" value={MOCK_ACTIVITY.length} icon={History} />
          <ActivitySummary href="/app/history" label="Resale predictions" value={resaleCount} icon={Wallet} />
          <ActivitySummary href="/app/history" label="Comparisons" value={comparisonCount} icon={Smartphone} />
        </div>
      </section>

      <Card>
        <CardHeader><CardTitle className="text-base">Your preferences</CardTitle></CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <PreferenceRow icon={Wallet} label="Budget range" value={`${formatINR(MOCK_USER.budgetRange.min)} – ${formatINR(MOCK_USER.budgetRange.max)}`} />
          <PreferenceRow icon={BriefcaseBusiness} label="Primary usage" value={MOCK_USER.primaryUsage || "Not provided"} />
          <PreferenceRow icon={Star} label="Preferred brands" value={MOCK_USER.preferredBrands.length ? MOCK_USER.preferredBrands.join(", ") : "None saved"} />
          <PreferenceRow icon={Zap} label="Key features" value={MOCK_USER.keyFeatures.length ? MOCK_USER.keyFeatures.join(", ") : "None saved"} />
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className="min-h-11"><Link href="/app/buy">Update recommendation preferences<ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild variant="ghost" className="min-h-11"><Link href="/app/saved">Go to saved phones<Bookmark className="h-4 w-4" /></Link></Button>
            <Button asChild variant="ghost" className="min-h-11"><Link href="/app/history">View history<History className="h-4 w-4" /></Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivitySummary({ href, label, value, icon: Icon }: { href: string; label: string; value: number; icon: typeof Bookmark }) {
  return <Link href={href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
    <Card className="h-full transition-colors group-hover:border-emerald-200">
      <CardContent className="flex min-h-28 items-start gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><Icon className="h-4 w-4" /></span>
        <span className="min-w-0"><span className="block text-2xl font-bold tabular-nums text-slate-950">{value}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{label}</span></span>
      </CardContent>
    </Card>
  </Link>;
}

function PreferenceRow({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
    <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
    <div className="min-w-0"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div>
  </div>;
}