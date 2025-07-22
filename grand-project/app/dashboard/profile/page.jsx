import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: recipes } = await supabase
    .from("recipes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">👤 Profile</h1>

      <div className="bg-white p-4 rounded-md shadow">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {profile?.name || "Not set"}</p>
        <p><strong>Joined:</strong> {new Date(user.created_at).toDateString()}</p>
      </div>

      <div className="bg-white p-4 rounded-md shadow">
        <p><strong>📊 Recipes Generated:</strong> {recipes?.count ?? 0}</p>
      </div>

      {/* TODO: Add edit name + sign out buttons */}
    </div>
  );
}
