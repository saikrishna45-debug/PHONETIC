import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookmarkCheck,
  BrainCircuit,
  Check,
  CircleHelp,
  GitCompareArrows,
  HeartHandshake,
  Lightbulb,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Wallet,
} from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    number: "01",
    eyebrow: "SELL SMART",
    title: "Know what your phone is worth.",
    description: "Get a considered resale estimate based on your device and its condition.",
    action: "Estimate Value",
    href: "/signup",
    icon: Tag,
    tone: "mint",
  },
  {
    number: "02",
    eyebrow: "BUY SMART",
    title: "Find the phone that fits you.",
    description: "Discover options shaped around your budget, priorities and everyday life.",
    action: "Find My Phone",
    href: "/signup",
    icon: SearchCheck,
    tone: "blue",
  },
  {
    number: "03",
    eyebrow: "COMPARE",
    title: "Choose with the full picture.",
    description: "Put the details side by side and feel good about your next move.",
    action: "Compare Phones",
    href: "/signup",
    icon: GitCompareArrows,
    tone: "mint",
  },
] as const;

const steps = [
  { number: "01", title: "Tell us what you need", description: "Start with your phone, budget or priorities.", icon: Smartphone },
  { number: "02", title: "Phonetic analyzes the data", description: "We bring device details and market context together.", icon: BarChart3 },
  { number: "03", title: "AI/ML generates insights", description: "Useful estimates and recommendations, made for you.", icon: BrainCircuit },
  { number: "04", title: "Get your result", description: "See your options clearly, then decide with confidence.", icon: Check },
] as const;

const features = [
  { title: "AI-powered resale estimation", description: "Understand a phone's estimated resale value before you sell.", icon: Tag, color: "text-emerald-700", bg: "bg-emerald-50" },
  { title: "Personalized recommendations", description: "Shortlist phones that align with your needs and budget.", icon: HeartHandshake, color: "text-blue-700", bg: "bg-blue-50" },
  { title: "Smartphone comparison", description: "Compare the details that matter in one clear view.", icon: GitCompareArrows, color: "text-emerald-700", bg: "bg-emerald-50" },
  { title: "Price insights", description: "Explore pricing context to make a more informed choice.", icon: BarChart3, color: "text-blue-700", bg: "bg-blue-50" },
  { title: "Explainable predictions", description: "See the factors behind an estimate or recommendation.", icon: Lightbulb, color: "text-emerald-700", bg: "bg-emerald-50" },
  { title: "Personalized dashboard", description: "Keep your activity, saved phones and insights together.", icon: BookmarkCheck, color: "text-blue-700", bg: "bg-blue-50" },
] as const;

const journey = [
  { label: "Your Current Phone", icon: Smartphone },
  { label: "Resale Value", icon: Tag },
  { label: "Your Budget", icon: Wallet },
  { label: "Recommended Phones", icon: Sparkles },
  { label: "Compare", icon: GitCompareArrows },
  { label: "Smart Decision", icon: ShieldCheck },
] as const;

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-emerald-50/35 to-sky-50/45">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:min-h-[650px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-10 lg:py-16">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/85 px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                A clearer way to choose your next phone
              </p>
              <h1 className="max-w-[620px] text-4xl font-extrabold leading-[1.08] text-slate-950 sm:text-5xl lg:text-[3.65rem]">
                Your Smartphone.
                <br />
                Your <span className="text-emerald-700">Smart</span> Decision.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                Predict your phone&apos;s resale value and discover smartphones that fit your needs and budget.
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Buy smarter. Sell smarter. Know your phone&apos;s value.
              </p>
              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
                <Button asChild size="lg" className="w-full gap-2 sm:w-auto"><Link href="/signup">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="w-full gap-2 sm:w-auto"><Link href="#what-we-do">Explore Phonetic <ArrowDown className="h-4 w-4" /></Link></Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-700" /> Thoughtful, data-informed guidance</span>
                <span className="inline-flex items-center gap-2"><CircleHelp className="h-4 w-4 text-blue-700" /> Estimates are not guarantees</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
              <div className="relative mx-auto aspect-[1.08/1] w-full max-w-[540px] overflow-hidden rounded-[2rem] border border-white/80 bg-slate-100 shadow-[0_28px_70px_-35px_rgba(15,23,42,0.35)] sm:rounded-[2.5rem]">
                <Image
                  src="/images/phones/phonetic-hero-phone.jpg"
                  alt="Smartphone showing a colorful home screen"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/20 via-transparent to-emerald-900/10" />
                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm sm:bottom-7 sm:left-7">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  A smarter view of your next move
                </div>
              </div>

              <Card className="absolute -left-1 top-[12%] w-[min(64%,250px)] border-white/90 shadow-lg sm:-left-8 sm:top-[14%]">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Tag className="h-3.5 w-3.5" /></span>
                    Estimated Resale Value
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <span className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">₹32,500</span>
                    <span className="mb-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">Demo estimate</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="absolute -bottom-3 right-0 w-[min(76%,310px)] border-white/90 shadow-lg sm:-bottom-5 sm:right-[-1rem]">
                <CardContent className="flex items-center gap-3 p-4 sm:p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700"><Smartphone className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-slate-500">Recommended for You · Demo</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-slate-900">iPhone 15</p>
                    <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">92% Match</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-72 w-72 rounded-full bg-emerald-100/45 blur-3xl" />
        </section>

        <section id="what-we-do" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-700">Three ways to get clarity</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Make your next move a smart one.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-600">From your current phone to your next one, Phonetic helps make the details easier to understand.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {actions.map(({ number, eyebrow, title, description, action, href, icon: Icon, tone }) => (
                <Card key={number} className="group overflow-hidden border-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone === "mint" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}><Icon className="h-5 w-5" /></span>
                      <span className="text-xs font-bold text-slate-400">{number}</span>
                    </div>
                    <p className="mt-7 text-[11px] font-bold uppercase text-emerald-700">{eyebrow}</p>
                    <h3 className="mt-2 max-w-xs text-xl font-bold leading-snug text-slate-950">{title}</h3>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{description}</p>
                    <Link href={href} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-950">
                      {action} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-y border-slate-100 bg-slate-50/80 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <p className="text-xs font-bold uppercase text-emerald-700">A little clarity goes a long way</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">How It Works</h2>
            </div>
            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-emerald-200 lg:block" />
              {steps.map(({ number, title, description, icon: Icon }) => (
                <div key={number} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white">{number.slice(1)}</span>
                  </div>
                  <div className="lg:mt-4">
                    <p className="text-xs font-bold tracking-normal text-emerald-700">{number}</p>
                    <h3 className="mt-1 text-base font-bold text-slate-950">{title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600 lg:mx-auto">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase text-emerald-700">Made for better phone decisions</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Everything you need to make a smarter smartphone decision.</h2>
            </div>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, description, icon: Icon, color, bg }) => (
                <div key={title} className="flex gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}><Icon className="h-5 w-5" /></div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-20 bg-gradient-to-r from-emerald-50/80 via-white to-sky-50/80 px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-bold uppercase text-emerald-700">From what you have to what comes next</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Your smartphone decision journey.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">One connected path to make your next choice with more context and confidence.</p>
            </div>
            <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:gap-2">
              {journey.map(({ label, icon: Icon }, index) => (
                <div key={label} className="flex items-center gap-3 lg:contents">
                  <div className="flex min-h-[112px] flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-white bg-white/90 px-3 py-5 text-center shadow-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span>
                    <span className="text-sm font-semibold text-slate-800">{label}</span>
                  </div>
                  {index < journey.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-emerald-500 lg:mx-auto lg:rotate-0" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-[1.75rem] bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase text-emerald-300">Your next choice, made clearer</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Ready to make a smarter smartphone decision?</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">Know your phone&apos;s value. Find what fits you. Choose with confidence.</p>
            </div>
            <Button asChild size="lg" className="shrink-0 gap-2 bg-emerald-600 text-white hover:bg-emerald-500"><Link href="/signup">Get Started <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Phonetic home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white">P</span>
              <span className="font-bold tracking-normal text-slate-950">PHONETIC</span>
            </Link>
            <p className="mt-2 text-sm text-slate-500">Your Smartphone. Your Smart Decision.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            {footerLinks.map(({ label, href }) => <Link key={label} href={href} className="transition-colors hover:text-emerald-800">{label}</Link>)}
          </nav>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} PHONETIC</p>
        </div>
      </footer>
    </div>
  );
}
