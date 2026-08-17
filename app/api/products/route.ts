import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    console.log("========== API HIT ==========");

    const body = await req.json();
    console.log("Request Body:", body);

    const supabase = await createClient();

    // Get logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Logged in user:", user.id);

    // Insert into cart
    const { data, error } = await supabase
      .from("cart")
      .insert({
        userid: user.id,
        product: body.product,
        productid: body.productid,
        price: body.price,
      })
      .select();

    if (error) {
      console.error("Insert Error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log("Insert Success:", data);

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("Server Crash:", err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}