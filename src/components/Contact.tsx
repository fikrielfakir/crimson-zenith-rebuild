import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, MapPin, MessageCircle, Headset, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

const Contact = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: contactSettings } = useQuery<any>({
    queryKey: ["cms-contact"],
    queryFn: async () => {
      const res = await fetch("/api/cms/contact", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch contact settings");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const contactEmail = contactSettings?.email ?? "info@thejourney-ma.com";
  const contactPhone = contactSettings?.phone ?? "+212 686 777 888";
  const contactAddress = contactSettings?.officeAddress ?? "Rabat Bouregreg, Morocco";

  const contactOptions = [
    {
      icon: MessageCircle,
      title: t("contact.chatSupport"),
      subtitle: t("contact.chatSupportSub"),
      contact: contactEmail,
    },
    {
      icon: Headset,
      title: t("contact.chatToSelect"),
      subtitle: t("contact.chatToSelectSub"),
      contact: "Contact with chatbot",
    },
    {
      icon: MapPin,
      title: t("contact.visitUs"),
      subtitle: t("contact.visitUsSub"),
      contact: contactAddress,
    },
    {
      icon: Phone,
      title: t("contact.callUs"),
      subtitle: t("contact.callUsSub"),
      contact: contactPhone,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError(t("contact.errorPolicy"));
      return;
    }
    if (!firstName || !email || !message) {
      setError(t("contact.errorRequired"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone: phone || undefined,
          subject: 'Contact Form Submission',
          message,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `Server error: ${res.status}`);
      }

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setAgreed(false);
    } catch (err: any) {
      setError(err?.message ?? t("contact.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-background scroll-mt-32">
      <div className="container mx-auto px-4" style={{ maxWidth: '1100px' }}>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div
            className="bg-white dark:bg-card"
            style={{ border: '1px solid #E4E4E4', borderRadius: '12px', padding: '24px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}
          >
            <div className="space-y-5">
              {contactOptions.map((option, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-lg" style={{ backgroundColor: '#1B1B1B' }}>
                    <option.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" style={{ fontSize: '15px', color: '#222', letterSpacing: '0.5px' }}>
                      {option.title}
                    </h3>
                    <p className="mb-1" style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                      {option.subtitle}
                    </p>
                    <p style={{ fontSize: '13px', color: '#444', fontWeight: '500' }}>
                      {option.contact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-white dark:bg-card"
            style={{ border: '1px solid #E4E4E4', borderRadius: '12px', padding: '32px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}
          >
            <h2 className="font-semibold mb-2" style={{ fontSize: '24px', color: '#222', fontFamily: 'Georgia, serif', letterSpacing: '0.5px' }}>
              {t("contact.title")}
            </h2>
            <p className="mb-6" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              {t("contact.subtitle")}
            </p>

            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h3 className="text-lg font-semibold">{t("contact.success")}</h3>
                <Button variant="outline" size="sm" onClick={() => setSuccess(false)} className="mt-2">
                  {t("contact.send")}
                </Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                      {t("contact.firstName")}
                    </label>
                    <Input
                      placeholder={t("contact.firstName")}
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                      style={{ height: '48px', borderRadius: '8px', border: '1px solid #E4E4E4', padding: '12px', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                      {t("contact.lastName")}
                    </label>
                    <Input
                      placeholder={t("contact.lastName")}
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      style={{ height: '48px', borderRadius: '8px', border: '1px solid #E4E4E4', padding: '12px', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                    {t("contact.email")}
                  </label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ height: '48px', borderRadius: '8px', border: '1px solid #E4E4E4', padding: '12px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                    {t("contact.phone")}
                  </label>
                  <Input
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ height: '48px', borderRadius: '8px', border: '1px solid #E4E4E4', padding: '12px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                    {t("contact.message")}
                  </label>
                  <Textarea
                    placeholder={t("contact.messagePlaceholder")}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    style={{ height: '120px', borderRadius: '8px', border: '1px solid #E4E4E4', padding: '12px', fontSize: '14px', resize: 'none' }}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="privacy"
                    className="mt-1"
                    checked={agreed}
                    onCheckedChange={(v) => setAgreed(v as boolean)}
                  />
                  <label htmlFor="privacy" style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', cursor: 'pointer' }}>
                    {t("contact.agreePolicy")}
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full transition-all duration-300"
                  disabled={loading}
                  style={{ height: '50px', backgroundColor: '#1B1B1B', color: 'white', fontSize: '15px', fontWeight: '600', borderRadius: '8px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#333333'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1B1B1B'; }}
                >
                  {loading ? t("contact.sending") : t("contact.send")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
