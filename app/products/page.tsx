import { createClient } from "@/utils/supabase/server";
import ProductsClient from "@/app/products/getproducts";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("product")
    .select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ProductsClient
      products={products ?? []}
      isLoggedIn={!!user}
    />
  );
}