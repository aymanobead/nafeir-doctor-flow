import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { UserCheck } from "lucide-react";

type AvailableDoctor = {
  user_id: string;
  duration_hours: number | null;
  expires_at: string | null;
  full_name: string | null;
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<AvailableDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  const fetchDoctors = async () => {
    const { data: availability } = await supabase
      .from("doctor_availability")
      .select("user_id, duration_hours, expires_at")
      .eq("is_available", true);

    if (!availability?.length) {
      setDoctors([]);
      setLoading(false);
      return;
    }

    const userIds = availability.map((a) => a.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) ?? []);

    setDoctors(
      availability.map((a) => ({
        ...a,
        full_name: profileMap.get(a.user_id) ?? null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const assignTask = async (doctorId: string) => {
    if (!user) return;
    setAssigning(doctorId);
    await supabase.from("tasks").insert({
      doctor_id: doctorId,
      assigned_by: user.id,
      status: "assigned",
    });
    toast({ title: t.taskAssigned });
    setAssigning(null);
  };

  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return "—";
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  if (loading) return <div className="flex justify-center p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-6">
      <h2 className="text-2xl font-bold text-primary">{t.adminDashboard}</h2>

      {doctors.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>{t.noAvailableDoctors}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t.availableDoctors}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.doctor}</TableHead>
                  <TableHead>{t.duration}</TableHead>
                  <TableHead>{t.expiresIn}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doc) => (
                  <TableRow key={doc.user_id}>
                    <TableCell className="font-medium">{doc.full_name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {doc.duration_hours} {t.hours}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatExpiry(doc.expires_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => assignTask(doc.user_id)}
                        disabled={assigning === doc.user_id}
                      >
                        {t.assignTask}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
