import { supabase } from "@/lib/supabase";
import { Rock } from "@/types/rock";
import RockDetailClient from "@/components/RockDetailClient";
import { notFound } from "next/navigation";

async function getRock(id: string): Promise<Rock | null> {
  const { data, error } = await supabase
    .from("rocks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching rock:", error);
    return null;
  }

  return data;
}

async function getAllRocks(): Promise<Rock[]> {
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

export default async function RockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [rock, allRocks] = await Promise.all([getRock(id), getAllRocks()]);

  if (!rock) {
    notFound();
  }

  return <RockDetailClient rock={rock} allRocks={allRocks} />;
}
