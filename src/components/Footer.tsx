import logo from "@/assets/logo.png";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const { data: contactData } = useQuery<any>({
    queryKey: ["cms-contact"],
    queryFn: async () => {
      const res = await fetch("/api/cms/contact", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contact settings");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: footerData } = useQuery<any>({
    queryKey: ["cms-footer"],
    queryFn: async () => {
      const res = await fetch("/api/cms/footer", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch footer settings");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const contactPhone = contactData?.phone ?? "+212 686 777 888";
  const contactEmail = contactData?.email ?? "info@thejourney-ma.com";
  const contactAddress =
    contactData?.officeAddress ?? contactData?.office_address ?? "Rabat Bouregreg, Morocco";

  const socialLinks = footerData?.socialLinks ?? footerData?.social_links ?? {};
  const facebookUrl = socialLinks?.facebook ?? "https://www.facebook.com/moroccoactivities";
  const instagramUrl = socialLinks?.instagram ?? "https://www.instagram.com/moroccoactivities";
  const twitterUrl = socialLinks?.twitter ?? "https://twitter.com/moroccoactivities";
  const mailLink = socialLinks?.email
    ? `mailto:${socialLinks.email}`
    : `mailto:${contactEmail}`;

  const socialItems = [
    { href: mailLink, icon: Mail, label: "Email" },
    { href: twitterUrl, icon: Twitter, label: "Twitter" },
    { href: instagramUrl, icon: Instagram, label: "Instagram" },
    { href: facebookUrl, icon: Facebook, label: "Facebook" },
  ];

  const quickLinks = [
    { to: "/about", label: t("footer.aboutUs") },
    { to: "/events", label: t("footer.events") },
    { to: "/clubs", label: t("footer.ourClubs") },
    { to: "/contact", label: t("footer.contact") },
  ];

  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-6">
      <div className="container mx-auto px-5 sm:px-6">

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">

          {/* Brand — centred on mobile, left-aligned on md+ */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start text-center md:text-start">
            <img
              src={logo}
              alt="The Journey Association"
              className="h-20 w-auto brightness-0 invert mb-5"
            />
            <p className="text-primary-foreground/75 leading-relaxed mb-6 max-w-sm font-body text-sm">
              {t("footer.tagline")}
            </p>

            {/* Social icons — larger tap targets */}
            <div className="flex gap-3">
              {socialItems.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — 2-col grid on mobile */}
          <div className="sm:col-span-1">
            <h3 className="text-base font-semibold mb-4 font-heading tracking-wide">
              {t("footer.quickLinks")}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-primary-foreground/75 hover:text-white active:opacity-70 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info — icons added */}
          <div className="sm:col-span-1">
            <h3 className="text-base font-semibold mb-4 font-heading tracking-wide">
              {t("footer.contact")}
            </h3>
            <div className="space-y-3 text-primary-foreground/75 text-sm">
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 hover:text-white active:opacity-70 transition-colors group"
              >
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span className="break-all">{contactPhone}</span>
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2.5 hover:text-white active:opacity-70 transition-colors group"
              >
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <span className="break-all">{contactEmail}</span>
              </a>
              <div className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <span>{contactAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="border-t border-white/15" />

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="pt-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-primary-foreground/60 text-xs text-center md:text-start">
            © {currentYear} The Journey Association.{" "}
            <span className="whitespace-nowrap">{t("footer.allRightsReserved")}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-primary-foreground/60">
            <Link to="/privacy-policy" className="hover:text-white active:opacity-70 transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
            <Link to="/terms-of-service" className="hover:text-white active:opacity-70 transition-colors">
              {t("footer.termsOfService")}
            </Link>
            <Link to="/cookie-policy" className="hover:text-white active:opacity-70 transition-colors">
              {t("footer.cookiePolicy")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
