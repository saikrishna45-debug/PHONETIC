"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { MOCK_PHONES } from "@/data/phones";
import { getInitialSavedPhoneIds, readSavedPhoneIds, removeSavedPhoneId, subscribeSavedPhoneIds } from "@/lib/saved-phones";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PhoneCard } from "@/components/phones/phone-card";

export function SavedPhonesView() {
  const router = useRouter();
  const savedIds = useSyncExternalStore(subscribeSavedPhoneIds, readSavedPhoneIds, getInitialSavedPhoneIds);
  const savedPhones = MOCK_PHONES.filter(phone => savedIds.includes(phone.id));
  function remove(id: string) { removeSavedPhoneId(id); }

  return <div className="space-y-6 sm:space-y-8">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Saved Phones</h1><p className="mt-1 text-sm leading-6 text-slate-600">Keep phones you are considering close at hand.</p></div><Button asChild size="sm" className="w-fit gap-1.5"><Link href="/app/buy"><Search className="h-4 w-4" />Find a Phone</Link></Button></div>
    {savedPhones.length ? <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{savedPhones.map((phone, index) => <PhoneCard key={phone.id} phone={phone} isSaved onSave={remove} showImage showCompare priority={index === 0} />)}</div> : <EmptyState icon={Bookmark} title="No saved phones yet" description="Save phones from recommendation results or their detail pages to find them here." action={{ label: "Find a Phone", onClick: () => router.push("/app/buy") }} />}
    {savedIds.length > 0 && <p className="text-xs text-slate-500">Saved phones are stored locally in this browser for now.</p>}
  </div>;
}
