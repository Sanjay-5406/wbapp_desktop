"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Cpu,
  HardDrive,
  Zap,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  LucideIcon,
} from "lucide-react";

// ==========================================
// TYPESAFE INTERFACES
// ==========================================

export interface Product {
  name: string;
  price: string;
  availableqty: number;
  productid: number;
}

export interface ServiceItem {
  id: "compute" | "storage" | "gpu";
  pname: string;
  price: number;
  icon: LucideIcon;
  gradient: string;
  badge: string;
  description: string;
}

export interface ToastState {
  id: string;
  text: string;
  type: "success" | "error" | "auth_warning";
}

export interface ApiResponseData {
  error?: string;
  message?: string;
}

export interface GetProductsProps {
  products: Product[];
  isLoggedIn?: boolean;
}

// ==========================================
// CONSTANTS
// ==========================================

const SERVICES: ServiceItem[] = [
  {
    id: "compute",
    pname: "Rent Compute",
    price: 299,
    icon: Cpu,
    gradient: "from-blue-600/20 to-cyan-500/10",
    badge: "High Performance",
    description: "Dedicated vCPU instances scalable on demand.",
  },
  {
    id: "storage",
    pname: "Rent Storage",
    price: 399,
    icon: HardDrive,
    gradient: "from-purple-600/20 to-pink-500/10",
    badge: "NVMe Speed",
    description: "Ultra-low latency block storage with instant snapshots.",
  },
  {
    id: "gpu",
    pname: "Rent GPUs",
    price: 499,
    icon: Zap,
    gradient: "from-amber-600/20 to-orange-500/10",
    badge: "AI & ML Ready",
    description: "Enterprise H100 & A100 clusters for model training.",
  },
];

let toastCounter = 0;
const generateId = (): string => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  toastCounter += 1;
  return `toast-${toastCounter}`;
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function GetProducts({
  products,
  isLoggedIn = false,
}: GetProductsProps) {
  const [loadingId, setLoadingId] = useState<number | string | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);

  const servicesScrollRef = useRef<HTMLDivElement | null>(null);
  const productsScrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ): void => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showToast = (
    text: string,
    type: "success" | "error" | "auth_warning"
  ): void => {
    const newId = generateId();
    setToastMessage({ id: newId, text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  async function handleBuyServices(service: ServiceItem): Promise<void> {
    if (!isLoggedIn) {
      showToast(`Please log in first to rent ${service.pname}`, "auth_warning");
      return;
    }

    showToast(`Service reserved successfully for ${service.pname}!`, "success");
  }

  async function handleBuyProducts(product: Product): Promise<void> {
    if (!isLoggedIn) {
      showToast(`Please log in first to buy ${product.name}`, "auth_warning");
      return;
    }

    setLoadingId(product.productid);
    try {
      const res: Response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: product.name,
          price: product.price,
          productid: product.productid,
        }),
      });

      const data: ApiResponseData = await res.json();

      if (!res.ok) {
        showToast(data.error ?? "Failed to add product", "error");
        return;
      }

      showToast(`${product.name} added to cart!`, "success");
    } catch (err: unknown) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-16 selection:bg-cyan-500 selection:text-black">
      {/* AUTH & NOTIFICATION TOAST BAR */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl max-w-sm ${
              toastMessage.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
                : toastMessage.type === "auth_warning"
                ? "bg-amber-950/90 border-amber-500/50 text-amber-200"
                : "bg-rose-950/90 border-rose-500/50 text-rose-200"
            }`}
          >
            {toastMessage.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            {toastMessage.type === "auth_warning" && (
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            {toastMessage.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}

            <div className="flex-1">
              <span className="text-sm font-semibold block">
                {toastMessage.type === "auth_warning"
                  ? "Authentication Required"
                  : toastMessage.type === "success"
                  ? "Success"
                  : "Error"}
              </span>
              <span className="text-xs opacity-90 block mt-0.5">
                {toastMessage.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SERVICES SECTION */}
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between px-2">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Cloud Infrastructure
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
              Exciting Range of Services
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll(servicesScrollRef, "left")}
              aria-label="Scroll left services"
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 text-slate-300 transition-all backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(servicesScrollRef, "right")}
              aria-label="Scroll right services"
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 text-slate-300 transition-all backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={servicesScrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 -mx-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SERVICES.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`snap-start shrink-0 w-[290px] sm:w-[340px] rounded-2xl p-6 bg-gradient-to-b ${s.gradient} border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-cyan-500/40 transition-all duration-300 shadow-xl group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-white/10 text-cyan-400 border border-white/10">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      {s.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {s.pname}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Rent Rate</span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-white">
                        ${s.price}
                      </span>
                      <span className="text-xs text-slate-400 font-normal"> / sec</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyServices(s)}
                    className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    {!isLoggedIn ? (
                      <Lock className="w-4 h-4 text-slate-950" />
                    ) : (
                      <Zap className="w-4 h-4 fill-slate-950" />
                    )}
                    <span>{isLoggedIn ? "Reserve Service" : "Login to Rent"}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between px-2">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              Hardware & Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Other Products
            </h2>
          </div>

          {products.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => scroll(productsScrollRef, "left")}
                aria-label="Scroll left products"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 text-slate-300 transition-all backdrop-blur-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(productsScrollRef, "right")}
                aria-label="Scroll right products"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 text-slate-300 transition-all backdrop-blur-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-slate-400">
            No products available at the moment.
          </div>
        ) : (
          <div
            ref={productsScrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 -mx-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((p) => {
              const isLoading: boolean = loadingId === p.productid;
              const isOutOfStock: boolean = p.availableqty <= 0;

              return (
                <motion.div
                  key={p.productid}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-purple-500/40 transition-all duration-300 shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Package className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                          isOutOfStock
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : `${p.availableqty} available`}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Product ID: #{p.productid}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Price</span>
                      <span className="text-2xl font-extrabold text-white">
                        ${p.price}
                      </span>
                    </div>

                    <button
                      disabled={isLoading || isOutOfStock}
                      onClick={() => handleBuyProducts(p)}
                      className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-white/5 text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border border-purple-400/20"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                          <span>Adding...</span>
                        </>
                      ) : !isLoggedIn ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Login to Buy</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>
                            {isOutOfStock ? "Unavailable" : "Add to Cart"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-slate-500 font-medium tracking-wide">
          More products to be released soon...
        </p>
      </section>
    </div>
  );
}