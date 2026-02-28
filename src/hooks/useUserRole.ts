import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<"doctor" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    setRole(data?.role ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchRole();
  }, [user]);

  const setUserRole = async (newRole: "doctor" | "admin") => {
    if (!user) return;
    await supabase.from("user_roles").insert({ user_id: user.id, role: newRole });
    setRole(newRole);
  };

  return { role, loading, setUserRole, refetch: fetchRole };
}
