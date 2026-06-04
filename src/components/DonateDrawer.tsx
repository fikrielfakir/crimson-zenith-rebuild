import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Heart, DollarSign, ArrowLeft, ArrowRight, Loader2, Phone, Mail, User, ShieldCheck } from "lucide-react";

interface DonateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DonateDrawer = ({ open, onOpenChange }: DonateDrawerProps) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRtl = i18n.language === "ar";

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("once");

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const predefinedAmounts = ["25", "50", "100", "250"];
  const displayAmount = customAmount || amount || "0";

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep(1);
      setSubmitting(false);
    }
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (!donorName.trim()) {
      toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    if (!donorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      toast({ title: "Valid email required", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/donations/cmi/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim() || undefined,
          amount: parseFloat(displayAmount),
          frequency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Payment Error",
          description: data.message || "Could not initiate CMI payment.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Demo mode — no gateway redirect
      if (data.demo_mode) {
        toast({ title: "Demo donation approved!", description: "Redirecting to confirmation…" });
        window.location.href = `/donate/success?ref=${data.booking_reference}`;
        return;
      }

      // Build a hidden form and auto-submit to CMI gateway
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.gateway_url;
      form.style.display = "none";

      Object.entries(data.fields as Record<string, string>).forEach(([key, val]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = val;
        form.appendChild(input);
      });

      toast({ title: "Redirecting to secure payment…", description: "You will be taken to the CMI payment page." });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Donation initiation error:", err);
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
        <SheetHeader className="space-y-4 pb-6 border-b">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <SheetTitle className="text-3xl font-bold text-center">
            {t("donation.title")}
          </SheetTitle>
          <SheetDescription className="text-center text-base">
            {t("donation.subtitle")}
          </SheetDescription>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step === 1 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${step === 1 ? "text-foreground" : "text-muted-foreground"}`}>
                {t("donation.selectAmount") || "Choose Amount"}
              </span>
            </div>
            <div className="h-px w-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${step === 2 ? "text-foreground" : "text-muted-foreground"}`}>
                {t("donation.paymentInfo") || "Your Details"}
              </span>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-8 py-8">

          {/* ── STEP 1: Amount ── */}
          {step === 1 && (
            <>
              {/* Frequency */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">{t("donation.frequency")}</Label>
                <RadioGroup value={frequency} onValueChange={setFrequency} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="once" id="once" className="peer sr-only" />
                    <Label
                      htmlFor="once"
                      className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      {t("donation.oneTime")}
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
                    <Label
                      htmlFor="monthly"
                      className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      {t("donation.monthly")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Amount */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">{t("donation.selectAmount")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {predefinedAmounts.map((amt) => (
                    <Button
                      key={amt}
                      variant={amount === amt && !customAmount ? "default" : "outline"}
                      onClick={() => { setAmount(amt); setCustomAmount(""); }}
                      className="h-14 text-lg font-semibold"
                    >
                      {amt} MAD
                    </Button>
                  ))}
                </div>

                <div className="relative">
                  <DollarSign className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                  <Input
                    type="number"
                    placeholder={t("donation.customAmount")}
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
                    className={`h-14 ${isRtl ? "pr-10" : "pl-10"} text-lg`}
                  />
                </div>
              </div>

              {/* Impact */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-6 space-y-3">
                <h3 className="font-semibold text-lg">{t("donation.yourImpact")}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ {t("donation.impact1")}</p>
                  <p>✓ {t("donation.impact2")}</p>
                  <p>✓ {t("donation.impact3")}</p>
                  <p>✓ {t("donation.impact4")}</p>
                </div>
              </div>

              <Button
                className="w-full h-14 text-lg font-semibold rounded-full"
                size="lg"
                onClick={() => setStep(2)}
                disabled={!displayAmount || displayAmount === "0"}
              >
                {t("donation.continue") || "Continue"}
                <ArrowRight className={`${isRtl ? "mr-2 rotate-180" : "ml-2"} w-5 h-5`} />
              </Button>
            </>
          )}

          {/* ── STEP 2: Donor details + CMI ── */}
          {step === 2 && (
            <>
              {/* Amount summary */}
              <div className="rounded-lg bg-muted/50 border p-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {frequency === "monthly" ? t("donation.monthly") : t("donation.oneTime")}{" "}
                  {t("donation.donation") || "donation"}
                </div>
                <div className="text-xl font-bold text-primary">
                  {displayAmount} MAD
                  {frequency === "monthly" && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /{t("donation.perMonth") || "mo"}
                    </span>
                  )}
                </div>
              </div>

              {/* Donor details */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  {t("donation.paymentInfo") || "Your Details"}
                </Label>

                <div className="space-y-2">
                  <Label htmlFor="donorName">{t("donation.fullName") || "Full Name"} *</Label>
                  <div className="relative">
                    <User className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="donorName"
                      placeholder={t("donation.fullNamePlaceholder") || "Your full name"}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className={`h-12 ${isRtl ? "pr-10" : "pl-10"}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorEmail">{t("donation.emailAddress") || "Email Address"} *</Label>
                  <div className="relative">
                    <Mail className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="donorEmail"
                      type="email"
                      placeholder={t("donation.emailPlaceholder") || "your@email.com"}
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className={`h-12 ${isRtl ? "pr-10" : "pl-10"}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorPhone">{t("donation.phone") || "Phone"} <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <div className="relative">
                    <Phone className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                    <Input
                      id="donorPhone"
                      type="tel"
                      placeholder="+212 6XX XXX XXX"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className={`h-12 ${isRtl ? "pr-10" : "pl-10"}`}
                    />
                  </div>
                </div>
              </div>

              {/* CMI secure payment notice */}
              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  You will be securely redirected to the <strong className="text-foreground">CMI payment gateway</strong> to complete your donation. Your card details are never shared with us.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-14 px-6 rounded-full"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                >
                  <ArrowLeft className={`${isRtl ? "ml-2 rotate-180" : "mr-2"} w-4 h-4`} />
                  {t("donation.back") || "Back"}
                </Button>

                <Button
                  className="flex-1 h-14 text-base font-semibold rounded-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 w-5 h-5" />
                      Donate {displayAmount} MAD
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                {t("donation.secureNote") || "Secured by CMI — 3D Secure payment"}
              </p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DonateDrawer;
