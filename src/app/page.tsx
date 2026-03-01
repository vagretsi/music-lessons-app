import Link from "next/link";
import { Music, Video, Calendar, BarChart3, Sparkles, ArrowRight, Play } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden staff-lines">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-burgundy/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[100px]" />
        </div>

        {/* Decorative vertical lines */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold/80 text-sm tracking-[0.2em] uppercase mb-8 animate-fade-in">
            <Music size={14} />
            <span>Online Music Academy</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-6 animate-slide-up">
            Master Your{" "}
            <span className="text-gradient-gold italic">Music</span>
          </h1>

          {/* Subtitle */}
          <p className="text-cream/60 text-lg md:text-xl font-sans leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-100">
            Professional music lessons, online and on demand. From your first note to your finest performance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-200">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Start Learning <ArrowRight size={18} />
            </Link>
            <Link href="/lessons" className="btn-secondary text-lg px-8 py-4">
              <Play size={18} /> Browse Lessons
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-cream/40 text-sm tracking-widest uppercase animate-fade-in animate-delay-400">
            <div className="flex flex-col items-center gap-1">
              <span className="text-gold font-display text-3xl">500+</span>
              <span>Video Lessons</span>
            </div>
            <div className="w-px h-10 bg-gold/20 hidden sm:block self-center" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-gold font-display text-3xl">50+</span>
              <span>Expert Teachers</span>
            </div>
            <div className="w-px h-10 bg-gold/20 hidden sm:block self-center" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-gold font-display text-3xl">10k+</span>
              <span>Students</span>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold/60 tracking-[0.3em] uppercase text-xs mb-4">Why Choose Us</p>
            <h2 className="section-title">
              Everything you need to grow<br />
              <span className="text-gradient-gold italic">as a musician</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Video,
                title: "Video Lessons",
                desc: "Stream high-quality lessons on any device, at your own pace.",
              },
              {
                icon: Calendar,
                title: "Live 1-on-1 Sessions",
                desc: "Book personal sessions with expert teachers that fit your schedule.",
              },
              {
                icon: BarChart3,
                title: "Track Your Progress",
                desc: "Log your practice sessions and watch yourself improve over time.",
              },
              {
                icon: Sparkles,
                title: "AI Feedback",
                desc: "Upload recordings and receive instant, intelligent feedback on your playing.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card-dark group cursor-default"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors duration-300">
                  <feature.icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display text-xl text-cream mb-3">{feature.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Preview */}
      <section className="py-24 px-6 bg-ink-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gold/60 tracking-[0.3em] uppercase text-xs mb-4">Subscription Plans</p>
          <h2 className="section-title mb-4">
            Find Your Perfect Plan
          </h2>
          <p className="text-cream/50 text-lg mb-12 max-w-xl mx-auto">
            Start free with Prelude, grow into Sonata, and master your craft with Symphony.
          </p>

          <div className="flex justify-center gap-4 flex-wrap mb-8">
            {[
              { name: "Prelude", price: "Free", desc: "Begin your journey" },
              { name: "Sonata", price: "€14.99/mo", desc: "For the dedicated student", featured: true },
              { name: "Symphony", price: "€29.99/mo", desc: "For the serious musician" },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 border min-w-[200px] transition-all duration-300 ${
                  plan.featured
                    ? "border-gold bg-gold/5 gold-glow scale-105"
                    : "border-gold/20 hover:border-gold/40"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink text-xs px-3 py-1 font-semibold tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <p className="font-display text-2xl text-cream mb-1">{plan.name}</p>
                <p className="text-gold text-xl font-semibold mb-2">{plan.price}</p>
                <p className="text-cream/40 text-sm">{plan.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/pricing" className="btn-secondary mt-4 inline-flex">
            View Full Pricing <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-6">
            Ready to begin your<br />
            <span className="text-gradient-gold italic">musical journey?</span>
          </h2>
          <p className="text-cream/50 text-lg mb-10">
            Join thousands of students who are mastering their craft with expert guidance.
          </p>
          <Link href="/register" className="btn-primary text-lg px-10 py-5">
            Start Free Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
