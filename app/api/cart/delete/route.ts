import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Check current logged-in user
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

    // 2. Get cartid from the query parameter
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartid");

    if (!cartId) {
      return NextResponse.json(
        { error: "Missing cartid parameter." },
        { status: 400 }
      );
    }

    // 3. Delete specific row matching cartid AND current user
    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("cartid", cartId)
      .eq("userid", user.id);

    if (deleteError) {
      console.error("Single item delete error:", deleteError.message);
      return NextResponse.json(
        { error: "Failed to delete item from database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Item deleted successfully!" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Delete route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}