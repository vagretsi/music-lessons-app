import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Headphones,
  Play,
  Sparkles,
  Video,
  Waves,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video lessons that stay clear and focused",
    desc: "Short, structured sessions you can revisit on any device without losing momentum.",
  },
  {
    icon: Calendar,
    title: "Live coaching when you need feedback",
    desc: "Book 1-on-1 sessions around your week and keep lessons connected to your actual goals.",
  },
  {
    icon: BarChart3,
    title: "Progress that feels measurable",
    desc: "Track practice, milestones, and streaks in one place instead of scattered notes.",
  },
  {
    icon: Sparkles,
    title: "Smart AI feedback between lessons",
    desc: "Get fast notes on timing, clarity, and consistency before the next live session.",
  },
];

const plans = [
  { name: "Prelude", price: "Free", desc: "A light start for new students." },
  { name: "Sonata", price: "€39.99/mo", desc: "The balanced plan for steady growth.", featured: true },
  { name: "Symphony", price: "€79.99/mo", desc: "Full access for serious practice." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-6 pb-20 pt-32 staff-lines">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute right-[12%] top-32 h-64 w-64 rounded-full bg-burgundy/20 blur-3xl" />
          <div className="absolute bottom-12 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cream/75 backdrop-blur-sm animate-fade-in">
              <Waves size={14} className="text-gold" />
              <span>Modern online music learning, designed for consistency</span>
            </div>

            <h1 className="font-display text-5xl leading-[1.02] text-cream md:text-7xl lg:text-[5.5rem] animate-slide-up">
              Learn music in a space that feels
              {" "}
              <span className="text-gradient-gold">clear, calm, and current.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70 md:text-xl animate-slide-up animate-delay-100">
              Structured lessons, live coaching, and thoughtful progress tracking in one softer, more focused experience.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-slide-up animate-delay-200">
              <Link href="/register" className="btn-primary px-8 py-4 text-base">
                Start Learning
                <ArrowRight size={18} />
              </Link>
              <Link href="/lessons" className="btn-secondary px-8 py-4 text-base">
                <Play size={18} />
                Browse Lessons
              </Link>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3 animate-fade-in animate-delay-300">
              {[
                { value: "500+", label: "Video lessons" },
                { value: "50+", label: "Expert teachers" },
                { value: "10k+", label: "Sessions completed" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm">
                  <p className="font-display text-3xl text-cream">{stat.value}</p>
                  <p className="mt-1 text-sm text-cream/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[32px] p-6 md:p-8 animate-fade-in animate-delay-200">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-gold/75">This week&apos;s studio</p>
                <h2 className="mt-2 font-display text-2xl text-cream">A smoother rhythm for practice</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gold">
                <Headphones size={20} />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between text-sm text-cream/60">
                <span>Practice flow</span>
                <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs text-gold">
                  +18% this month
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  { label: "Watch a lesson", width: "w-[88%]" },
                  { label: "Log your session", width: "w-[72%]" },
                  { label: "Get AI notes", width: "w-[58%]" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm text-cream/70">
                      <span>{item.label}</span>
                      <span>ready</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className={`h-full rounded-full bg-gradient-to-r from-gold to-gold-dark ${item.width}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-cream/60">Focus</p>
                <p className="mt-2 font-display text-3xl text-cream">92%</p>
                <p className="mt-2 text-sm text-cream/40">Shorter sessions, less friction, better follow-through.</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-cream/60">Weekly tempo</p>
                <p className="mt-2 font-display text-3xl text-cream">4.8h</p>
                <p className="mt-2 text-sm text-cream/40">A calm structure that still keeps momentum visible.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold/75">Why students stay</p>
            <h2 className="section-title">
              The essentials, without the visual noise
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/60">
              Every part of the experience is designed to feel lighter, faster, and easier to return to every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card-dark group cursor-default"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors duration-300 group-hover:border-gold/25 group-hover:bg-gold/10">
                  <feature.icon size={20} className="text-gold" />
                </div>
                <h3 className="mb-3 font-display text-xl text-cream">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-cream/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold/75">Subscription plans</p>
              <h2 className="section-title">A simple ladder from free to full access</h2>
            </div>
            <p className="max-w-xl text-cream/60">
              Start with a free entry point, then move into deeper practice support only when you need it.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[30px] p-8 border transition-all duration-300 ${
                  plan.featured
                    ? "border-gold/30 bg-gold/10 gold-glow md:-translate-y-2"
                    : "border-white/10 bg-ink-50/40 hover:border-gold/25"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
                    Most Popular
                  </div>
                )}

                <p className="mb-2 font-display text-2xl text-cream">{plan.name}</p>
                <p className="mb-3 text-3xl font-semibold text-cream">{plan.price}</p>
                <p className="text-sm text-cream/50">{plan.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/pricing" className="btn-secondary mt-8 inline-flex">
            View Full Pricing <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-[24rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5 px-8 py-14 text-center backdrop-blur-sm md:px-14 md:py-16">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold/75">Ready to begin</p>
          <h2 className="section-title mb-6">
            Build a music routine that feels motivating,
            {" "}
            <span className="text-gradient-gold">not heavy.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-cream/60">
            Join a calmer learning flow with clear lessons, flexible live sessions, and progress that stays visible.
          </p>
          <Link href="/register" className="btn-primary px-10 py-5 text-base">
            Start Free Today
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
