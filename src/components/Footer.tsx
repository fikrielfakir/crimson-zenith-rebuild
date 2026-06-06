import logo from "@/assets/logo.png";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
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

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img src={logo} alt="The Journey Association" className="h-24 w-auto brightness-0 invert" />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6 max-w-md font-body">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={mailLink}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.events")}
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.ourClubs")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.contact")}</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <p>{contactPhone}</p>
              <p>{contactEmail}</p>
              <p>{contactAddress}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/70 text-sm">
            © {currentYear} The Journey Association. {t("footer.allRightsReserved")}
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/70">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              {t("footer.termsOfService")}
            </Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">
              {t("footer.cookiePolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
