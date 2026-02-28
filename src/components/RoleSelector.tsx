import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, ShieldCheck } from "lucide-react";

export function RoleSelector() {
  const { t } = useLanguage();
  const { setUserRole } = useUserRole();
  const [loading, setLoading] = useState(false);

  const handleSelect = async (role: "doctor" | "admin") => {
    setLoading(true);
    await setUserRole(role);
    setLoading(false);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{t.selectRole}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            size="lg"
            className="h-16 text-lg gap-3"
            onClick={() => handleSelect("doctor")}
            disabled={loading}
          >
            <Stethoscope className="h-6 w-6" />
            {t.doctor}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="h-16 text-lg gap-3"
            onClick={() => handleSelect("admin")}
            disabled={loading}
          >
            <ShieldCheck className="h-6 w-6" />
            {t.admin}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
