"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  Tag,
} from "lucide-react";

export interface CartItem {
  cartid: number;
  productid: number;
  product: string;
  price: number;
  userid: string;
}

export interface CartClientProps {
  initialItems: CartItem[];
}

export default function CartClient({ initialItems }: CartClientProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  // Price Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const estimatedTax = subtotal * 0.08; // 8% estimated tax
  const shipping = subtotal > 0 ? 15 : 0; // Flat $15 shipping fee
  const total = subtotal + estimatedTax + shipping;

  const handleRemoveItem = async (cartidToRemove: number) => {
    try {
      // 1. Call API endpoint to remove from Supabase DB
      console.log("trying to remove itemid: "+cartidToRemove)
      const res = await fetch(`/api/cart/delete?cartid=${cartidToRemove}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to remove item.");
        return;
      }

      // 2. Remove item from local state UI using cartid
      setItems((prev) => prev.filter((item) => item.cartid !== cartidToRemove));
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Network error removing item.");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Call the API route to delete items from database
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to complete checkout.");
        return;
      }

      // Success: Clear local state and notify user
      setOrderComplete(true);
      setItems([]);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("A network error occurred during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* TOP NAVIGATION / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Review & Checkout
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                Your Shopping Cart
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/10 w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted 256-bit Checkout</span>
          </div>
        </div>

        {/* ORDER SUCCESS NOTIFICATION */}
        <AnimatePresence>
          {orderComplete && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <PackageCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-200">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    Thank you for your purchase. A confirmation receipt has been generated.
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all whitespace-nowrap"
              >
                Continue Shopping
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT GRID */}
        {items.length === 0 && !orderComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl space-y-5 max-w-md mx-auto my-12"
          >
            <div className="p-4 rounded-full bg-white/5 border border-white/10 w-fit mx-auto text-slate-400">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
              <p className="text-xs text-slate-400">
                Looks like you haven`&apos;`t added any products or services yet.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Browse Catalog
            </Link>
          </motion.div>
        ) : (
          items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* CART ITEMS LIST (Left Column - 7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                  <span>Items ({items.length})</span>
                  <span>Unit Price</span>
                </div>

                <AnimatePresence>
                  {/* {console.log(items)} */}
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productid}-${item.cartid}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">
                            {item.product}
                          </h3>
                          <p className="text-xs font-mono text-slate-400 mt-0.5">
                            ID: #{item.productid} • Qty: 1
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="font-extrabold text-white text-lg font-mono">
                          ${item.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.cartid)}
                          title="Remove item"
                          className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* ORDER SUMMARY CARD (Right Column - 5 Cols) */}
              <div className="lg:col-span-5 rounded-2xl p-6 bg-gradient-to-b from-slate-900/80 to-slate-950 border border-white/10 backdrop-blur-xl space-y-6 shadow-2xl sticky top-6">
                <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-mono font-medium">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-white font-mono font-medium">
                      ${estimatedTax.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Standard Shipping</span>
                    <span className="text-white font-mono font-medium">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-bold text-white block">
                        Total Amount
                      </span>
                      <span className="text-xs text-slate-400">
                        Includes taxes and fees
                      </span>
                    </div>
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  disabled={isCheckingOut || items.length === 0}
                  onClick={handleCheckout}
                  className="w-full py-4 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 fill-slate-950" />
                      <span>Checkout (${total.toFixed(2)})</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Instant digital dispatch on completed order</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}