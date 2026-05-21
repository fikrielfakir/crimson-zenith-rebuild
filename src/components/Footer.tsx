import logo from "@/assets/logo.png";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="The Journey Association" className="h-10 w-auto brightness-0 invert" />
              <span className="text-2xl font-bold font-heading">The Journey</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6 max-w-md font-body">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/moroccoactivities"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/moroccoactivities"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/moroccoactivities"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@moroccoactivities.com"
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
                <a href="#about" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.aboutUs")}
                </a>
              </li>
              <li>
                <a href="#events" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.events")}
                </a>
              </li>
              <li>
                <a href="#clubs" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.ourClubs")}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-white transition-colors">
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.contact")}</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <p>+212 686 777 888</p>
              <p>info@thejourney-ma.com</p>
              <p>Rabat Bouregreg, Morocco</p>
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
