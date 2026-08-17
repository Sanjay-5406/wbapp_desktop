"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Zap,
  Globe,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {redirect} from 'next/navigation'
// Feature Cards Data for Horizontal Scroll
const showcaseCards = [
  {
    id: 1,
    title: "Quantum Processing Engine",
    subtitle: "Real-time AI Compute",
    description: "Sub-millisecond data pipelines processing over 10M operations per second seamlessly.",
    icon: Cpu,
    gradient: "from-blue-600/30 to-cyan-500/10",
    border: "border-cyan-500/30",
    badge: "v2.4 Active",
    stats: "0.4ms Latency",
  },
  {
    id: 2,
    title: "Hyper-Distributed Mesh",
    subtitle: "Global Edge Network",
    description: "Deploy serverless edge functions across 280+ nodes worldwide with zero cold starts.",
    icon: Globe,
    gradient: "from-purple-600/30 to-pink-500/10",
    border: "border-purple-500/30",
    badge: "99.99% Uptime",
    stats: "280+ POPs",
  },
  {
    id: 3,
    title: "Zero-Trust Security Core",
    subtitle: "Cryptographic Protection",
    description: "End-to-end encrypted protocol layers powered by post-quantum security standards.",
    icon: ShieldCheck,
    gradient: "from-emerald-600/30 to-teal-500/10",
    border: "border-emerald-500/30",
    badge: "Enterprise Grade",
    stats: "AES-256 GCM",
  },
  {
    id: 4,
    title: "Predictive Analytics Engine",
    subtitle: "Autonomous Insights",
    description: "Self-learning telemetry models that optimize system throughput automatically.",
    icon: TrendingUp,
    gradient: "from-amber-600/30 to-orange-500/10",
    border: "border-amber-500/30",
    badge: "AI Powered",
    stats: "10x Throughput",
  },
];

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  //mine

  function handleGetStarted(){
    console.log("getting started")
    redirect("/products")
  }

  function handleExploreDemo(){
    console.log("exploring demo")
    redirect("/about")
  }

  function handleFreeTrial(){
    console.log("getting started")
    redirect("/products")
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 to-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* HERO SECTION */}
        <section className="text-center space-y-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-cyan-400 font-medium tracking-wide shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen Platform Architecture</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Build at the Speed of{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              Thought
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg font-normal leading-relaxed"
          >
            Streamline your workflow with ultra-responsive modules, autonomous processing,
            and enterprise-grade security — all packaged inside a fluid, beautiful stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20" onClick={handleGetStarted}>
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-slate-200 active:scale-95 transition-all backdrop-blur-md"
            onClick={handleExploreDemo}>
              <span>Explore Live Demo</span>
            </button>
          </motion.div>
        </section>

        {/* HORIZONTAL SCROLL SHOWCASE (AMAZON-STYLE WINDOWS) */}
        <section className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-cyan-400" /> Key Innovation Windows
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Swipe or scroll horizontally to browse ecosystem capability modules.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 text-slate-300 transition-all backdrop-blur-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 text-slate-300 transition-all backdrop-blur-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Snap Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-2 -mx-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {showcaseCards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`snap-start shrink-0 w-[300px] sm:w-[350px] rounded-2xl p-6 bg-gradient-to-b ${card.gradient} border ${card.border} backdrop-blur-xl flex flex-col justify-between space-y-6 relative group hover:-translate-y-1.5 transition-all duration-300 shadow-2xl`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-cyan-400">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        {card.subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">Performance</span>
                    <span className="text-sm font-bold text-cyan-300">{card.stats}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* QUICK STATS STRIP */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-lg">
          {[
            { label: "Active Users", value: "100K+" },
            { label: "API Requests/sec", value: "4.2M" },
            { label: "Global Nodes", value: "280+" },
            { label: "Customer Rating", value: "4.9/5" },
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* CTA CARD */}
        <section className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-slate-900 border border-cyan-500/20 shadow-2xl">
          <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to modernize your digital platform?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of developers and teams delivering high-velocity software with our next-gen stack.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-md"
            onClick={handleFreeTrial}>
              <Layers className="w-4 h-4" />
              <span>Start Free Trial</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}