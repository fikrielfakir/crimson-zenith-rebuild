import { useState } from "react";
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
import { Heart, CreditCard, DollarSign } from "lucide-react";

interface DonateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DonateDrawer = ({ open, onOpenChange }: DonateDrawerProps) => {
  const [amount, setAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("once");

  const predefinedAmounts = ["25", "50", "100", "250"];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4 pb-6 border-b">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <SheetTitle className="text-3xl font-bold text-center">
            Make a Donation
          </SheetTitle>
          <SheetDescription className="text-center text-base">
            Your contribution helps us empower communities and preserve Morocco's heritage
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 py-8">
          {/* Frequency Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Donation Frequency</Label>
            <RadioGroup value={frequency} onValueChange={setFrequency} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="once" id="once" className="peer sr-only" />
                <Label
                  htmlFor="once"
                  className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                >
                  One-time
                </Label>
              </div>
              <div>
                <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
                <Label
                  htmlFor="monthly"
                  className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                >
                  Monthly
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Amount (USD)</Label>
            <div className="grid grid-cols-2 gap-3">
              {predefinedAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant={amount === amt && !customAmount ? "default" : "outline"}
                  onClick={() => {
                    setAmount(amt);
                    setCustomAmount("");
                  }}
                  className="h-14 text-lg font-semibold"
                >
                  ${amt}
                </Button>
              ))}
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount("");
                }}
                className="h-14 pl-10 text-lg"
              />
            </div>
          </div>

          {/* Donation Impact */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-6 space-y-3">
            <h3 className="font-semibold text-lg">Your Impact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Support sustainable tourism initiatives</p>
              <p>✓ Empower local communities</p>
              <p>✓ Preserve cultural heritage</p>
              <p>✓ Fund educational programs</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Payment Information</Label>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="card" placeholder="1234 5678 9012 3456" className="h-12 pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" className="h-12" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full h-14 text-lg font-semibold rounded-full"
            size="lg"
          >
            <Heart className="mr-2 w-5 h-5" />
            Donate ${customAmount || amount || "0"} {frequency === "monthly" ? "/month" : ""}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your donation is secure and tax-deductible. You will receive a receipt via email.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DonateDrawer;
