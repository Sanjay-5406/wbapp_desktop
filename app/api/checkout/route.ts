import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Get current logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Delete all items from `cart` table where `userid` matches current user
    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("userid", user.id);

    if (deleteError) {
      console.error("Cart clear error:", deleteError.message);
      return NextResponse.json(
        { error: "Failed to clear cart in database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Checkout successful, cart cleared!" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Checkout route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}