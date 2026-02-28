import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full border-t bg-muted/50 py-4 text-center text-sm text-muted-foreground">
      {t.footer}
    </footer>
  );
}
