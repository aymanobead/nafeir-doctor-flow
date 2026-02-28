import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Globe, LogOut } from "lucide-react";

export function Header() {
  const { t, toggleLanguage } = useLanguage();
  const { user, signOut } = useAuth();

  return (
    <header className="w-full border-b bg-card px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <h1 className="text-xl font-bold text-primary">
          {t.appName} <span className="text-muted-foreground font-normal text-base">/ {t.appNameEn}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            <Globe className="h-4 w-4" />
            <span className="ms-1">{t.language}</span>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span className="ms-1">{t.logout}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
