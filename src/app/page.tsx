import { supabase } from "@/lib/supabase";
import { Rock } from "@/types/rock";
import HomeClient from "@/components/HomeClient";

async function getRocks(): Promise<Rock[]> {
  const { data, error } = await supabase
    .from("rocks")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching rocks:", error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const rocks = await getRocks();

  return <HomeClient rocks={rocks} />;
}
