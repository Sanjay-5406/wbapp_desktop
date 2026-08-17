"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Zap,
  ShieldCheck,
  Globe2,
  Server,
  Layers,
  ArrowRight,
  Sparkles,
  Terminal,
  Activity,
  CheckCircle2,
  Code2,
} from "lucide-react";

// ==========================================
// DATA SEGMENTS
// ==========================================

const STATS = [
  { label: "Uptime SLA", value: "99.99%", icon: Activity },
  { label: "Global Edge Nodes", value: "120+", icon: Globe2 },
  { label: "Active Workloads", value: "2.4M+", icon: Cpu },
  { label: "Avg Latency", value: "<12ms", icon: Zap },
];

const VALUES = [
  {
    icon: Cpu,
    title: "Bare-Metal Speed",
    description:
      "Direct hardware execution with zero virtualized overhead. Native performance tailored for intensive compute workloads.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Trust Architecture",
    description:
      "End-to-end memory encryption and strict identity access management safeguard every execution thread.",
  },
  {
    icon: Server,
    title: "Instant Provisioning",
    description:
      "Spool up dedicated vCPUs, NVMe pools, or GPU clusters within seconds via clean, developer-friendly APIs.",
  },
  {
    icon: Layers,
    title: "Transparent Scaling",
    description:
      "From single instance experiments to multi-region serverless clusters—scale seamlessly without lock-in.",
  },
];

const ARCHITECTURE_TABS = [
  {
    id: "compute",
    label: "Compute Fabric",
    title: "Dynamic Core Orchestration",
    code: `const cluster = await Core.deploy({
  vCPU: 64,
  ram: "128GB",
  region: "ap-south-1",
  isolated: true
});`,
    points: [
      "Sub-millisecond cold start allocation",
      "Per-second execution billing model",
      "Automatic failover & load balancing",
    ],
  },
  {
    id: "storage",
    label: "Storage Matrix",
    title: "Ultra-Low Latency NVMe Block",
    code: `const storage = await Storage.mount({
  volumeId: "vol_nvme_9021",
  type: "ultra-fast",
  snapshots: "realtime"
});`,
    points: [
      "Up to 100,000 IOPS per volume",
      "Real-time cluster snapshots",
      "Automated cross-region replication",
    ],
  },
  {
    id: "gpus",
    label: "AI Acceleration",
    title: "High-Density GPU Clusters",
    code: `const node = await GPU.provision({
  model: "NVIDIA-H100",
  clusterSize: 8,
  interconnect: "InfiniBand"
});`,
    points: [
      "Optimized for LLM training & inference",
      "80GB SXM5 memory configurations",
      "Pre-configured CUDA & PyTorch stacks",
    ],
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "The Genesis",
    description:
      "Founded with a vision to streamline bare-metal cloud infrastructure for high-throughput computing.",
  },
  {
    year: "2025",
    title: "Global Mesh Expansion",
    description:
      "Expanded edge footprint across 40 new regions with dedicated high-speed fiber backbones.",
  },
  {
    year: "2026",
    title: "Next-Gen Engine Launch",
    description:
      "Introduced real-time AI node provisioning and dynamic web interface integrations.",
  },
];

// ==========================================
// COMPONENT
// ==========================================

export default function AboutClient() {
  const [activeTab, setActiveTab] = useState("compute");
  const selectedTab =
    ARCHITECTURE_TABS.find((t) => t.id === activeTab) || ARCHITECTURE_TABS[0];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-24 selection:bg-cyan-500 selection:text-black">
      
      {/* ---------------------------------------------------- */}
      {/* SEGMENT 1: HERO SECTION                              */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto text-center space-y-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Building Next-Gen Infrastructure</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Engineered for <span className="text-cyan-400">Extreme Speed</span> & Uncompromised Control
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
        >
          We build high-performance computing, storage, and GPU infrastructure 
          designed to run intensive workloads without server latency or vendor lock-in.
        </motion.p>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SEGMENT 2: STATS DISPLAY                             */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-2 hover:border-cyan-500/40 transition-all"
              >
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
                  <IconComp className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono pt-2">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SEGMENT 3: MISSION & CORE VALUES                     */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Core Principles
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Designed from the Silicon Up
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl flex items-start gap-5 hover:border-white/20 transition-all group"
              >
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SEGMENT 4: INTERACTIVE ARCHITECTURE SHOWCASE         */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              Platform Deep-Dive
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Interactive System Architecture
            </h2>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-white/10 w-fit">
            {ARCHITECTURE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-8 backdrop-blur-xl items-center"
          >
            {/* Left Column - Details */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl font-bold text-white">
                {selectedTab.title}
              </h3>

              <ul className="space-y-3">
                {selectedTab.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-bold text-xs transition-all"
              >
                <span>Deploy Node</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Column - Terminal Preview */}
            <div className="lg:col-span-6 rounded-2xl bg-[#060709] border border-white/10 p-5 font-mono text-xs text-slate-300 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-slate-500">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>SDK Initialization</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>

              <pre className="text-cyan-300/90 overflow-x-auto leading-relaxed">
                <code>{selectedTab.code}</code>
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SEGMENT 5: MILESTONE TIMELINE                        */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            History & Growth
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Our Journey
          </h2>
        </div>

        <div className="relative border-l border-white/10 ml-4 sm:ml-32 space-y-8">
          {TIMELINE.map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-6 sm:pl-8"
            >
              <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-[#0a0c10]" />
              <span className="sm:absolute sm:-left-28 sm:top-0 text-cyan-400 font-mono font-bold text-sm block mb-1">
                {item.year}
              </span>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SEGMENT 6: BOTTOM CALL TO ACTION                     */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-slate-900 border border-white/10 backdrop-blur-xl text-center space-y-6 shadow-2xl">
        <Code2 className="w-10 h-10 text-cyan-400 mx-auto" />
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to supercharge your stack?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Explore our products or deploy a compute instance instantly right from your portal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            Explore Catalog
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-sm transition-all active:scale-95"
          >
            View Cart
          </Link>
        </div>
      </section>

    </div>
  );
}