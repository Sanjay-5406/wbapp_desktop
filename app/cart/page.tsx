// app/cart/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CartClient, { CartItem } from "@/app/cart/cartclient";

export default async function CartPage() {
  const supabase = await createClient();

  // 1. Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // 2. Redirect to login if not authenticated
  if (userError || !user) {
    redirect("/login");
  }

  // 3. Fetch cart items belonging to this user
// app/cart/page.tsx snippet

// Fetch cart items belonging to this user (include cartid)
const { data: rawCartItems, error: cartError } = await supabase
  .from("cart")
  .select("cartid, productid, product, price, userid")
  .eq("userid", user.id);

  if (cartError) {
    console.error("Supabase Error:", cartError.message);
    return (
      <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex items-center justify-center p-6">
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-center max-w-md">
          <p className="font-semibold text-lg">Error loading cart items</p>
          <p className="text-sm opacity-80 mt-1">{cartError.message}</p>
        </div>
      </div>
    );
  }

  // Format cart items safety check
  const cartItems: CartItem[] = (rawCartItems || []).map((item) => ({
    productid: Number(item.productid),
    product: String(item.product),
    price: Number(item.price) || 0,
    userid: String(item.userid),
    cartid: Number(item.cartid)
  }));

  return <CartClient initialItems={cartItems} />;
}