import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, ShieldCheck } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
          <div>
            <h1 className="text-5xl font-bold text-primary mb-1">{t.appName}</h1>
            <p className="text-lg text-muted-foreground">{t.appNameEn}</p>
          </div>
          <p className="text-muted-foreground max-w-sm">{t.description}</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              size="lg"
              className="h-14 text-base gap-3"
              onClick={() => signInWithGoogle("doctor")}
            >
              <Stethoscope className="h-5 w-5" />
              {t.loginDoctor}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 text-base gap-3"
              onClick={() => signInWithGoogle("admin")}
            >
              <ShieldCheck className="h-5 w-5" />
              {t.loginAdmin}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t.noAccount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
