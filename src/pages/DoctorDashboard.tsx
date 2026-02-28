import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function DoctorDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [duration, setDuration] = useState<string>("8");
  const [completedTasks, setCompletedTasks] = useState(0);
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, availRes, tasksRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("doctor_availability").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("tasks").select("id").eq("doctor_id", user.id).eq("status", "completed"),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (availRes.data) {
        setIsAvailable(availRes.data.is_available);
        setDuration(String(availRes.data.duration_hours ?? "8"));
      }
      setCompletedTasks(tasksRes.data?.length ?? 0);
      setLoading(false);
    };
    load();
  }, [user]);

  const updateAvailability = async (available: boolean, hours?: string) => {
    if (!user) return;
    const h = parseInt(hours ?? duration);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + h * 60 * 60 * 1000);

    const payload = {
      user_id: user.id,
      is_available: available,
      duration_hours: available ? h : null,
      available_since: available ? now.toISOString() : null,
      expires_at: available ? expiresAt.toISOString() : null,
    };

    const { data: existing } = await supabase
      .from("doctor_availability")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase.from("doctor_availability").update(payload).eq("user_id", user.id);
    } else {
      await supabase.from("doctor_availability").insert(payload);
    }

    setIsAvailable(available);
    toast({ title: t.availabilityUpdated });
  };

  if (loading) return <div className="flex justify-center p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="mx-auto max-w-lg p-4 space-y-6">
      <h2 className="text-2xl font-bold text-primary">{t.doctorDashboard}</h2>
      <p className="text-lg text-muted-foreground">
        {t.welcome}, <span className="font-semibold text-foreground">{profile.full_name || user?.email}</span>
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{isAvailable ? t.available : t.notAvailable}</span>
            <Switch
              checked={isAvailable}
              onCheckedChange={(checked) => updateAvailability(checked)}
            />
          </CardTitle>
        </CardHeader>
        {isAvailable && (
          <CardContent>
            <label className="text-sm text-muted-foreground mb-2 block">{t.selectDuration}</label>
            <Select
              value={duration}
              onValueChange={(val) => {
                setDuration(val);
                updateAvailability(true, val);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["6", "8", "12", "24"].map((h) => (
                  <SelectItem key={h} value={h}>
                    {h} {t.hours}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardContent className="pt-6 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-lg">{t.completedTasks}:</span>
          <Badge variant="secondary" className="text-lg px-3">
            {completedTasks}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
