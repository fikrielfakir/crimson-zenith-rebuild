import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "ar", flag: "🇲🇦", label: "العربية" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

interface LanguageSwitcherProps {
  textColor?: string;
  className?: string;
}

const LanguageSwitcher = ({ textColor = "#ffffff", className = "" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split("-")[0] || "en";
  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  const changeLanguage = (code: string) => {
    localStorage.setItem("tja_language", code);
    i18n.changeLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-button hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 ${className}`}
          style={{ color: textColor }}
        >
          <Globe className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">{current.flag}</span>
          <span className="hidden sm:inline uppercase">{current.code}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[140px] z-[200] shadow-lg border border-border bg-background"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between gap-2 cursor-pointer px-3 py-2 text-sm"
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
            {currentLang === lang.code && (
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
