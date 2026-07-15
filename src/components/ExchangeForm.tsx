"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEALER } from "@/lib/data";

type ExchangeFormProps = {
  newCarSlug?: string;
  newCarName?: string;
  className?: string;
};

const BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Honda",
  "Toyota",
  "Kia",
  "Renault",
  "Skoda",
  "Volkswagen",
  "Ford",
  "Nissan",
  "MG",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 21 }, (_, i) => CURRENT_YEAR - i);
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const KM_BUCKETS = [
  "Under 20,000",
  "20,000–40,000",
  "40,000–60,000",
  "60,000–80,000",
  "80,000–1,00,000",
  "Over 1,00,000",
];

export default function ExchangeForm({
  newCarSlug,
  newCarName,
  className,
}: ExchangeFormProps) {
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [km, setKm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const mobile = String(formData.get("mobile") || "").trim();
    const oldModel = String(formData.get("oldModel") || "").trim();

    const exchangeDetails = [
      `Exchange Old Car: ${brand} ${oldModel} (${year}, ${fuel}, ${km} km)`,
      newCarName ? `Interested in: ${newCarName}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      name,
      mobile,
      car: newCarSlug || "exchange",
      location: "",
      message: exchangeDetails,
      type: "exchange",
      city: "",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "We could not submit your request right now.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit. Please call or WhatsApp us."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={`rounded-2xl border bg-card p-6 text-center ${className ?? ""}`}>
        <div className="text-4xl mb-3">🚗💰</div>
        <h3 className="font-semibold text-lg mb-1">Exchange Quote on the Way!</h3>
        <p className="text-muted-foreground text-sm">
          Our exchange specialist will call you within 30 minutes with a fair valuation for your old car.
        </p>
        <p className="mt-4 text-sm font-medium">
          Or call:{" "}
          <a href={`tel:${DEALER.phone}`} className="text-primary underline">
            {DEALER.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden ${className ?? ""}`}>
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b">
        <h3 className="font-bold text-lg">Get Your Old Car&apos;s Exchange Value</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Free valuation in 2 minutes · Top exchange bonus on new NEXA purchase
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ex-brand">Old Car Brand *</Label>
            <Select value={brand} onValueChange={(v) => setBrand(v ?? "")} required>
              <SelectTrigger id="ex-brand">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="oldModel">Old Car Model *</Label>
            <Input
              id="oldModel"
              name="oldModel"
              placeholder="e.g. Swift, Creta, i20"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ex-year">Year *</Label>
            <Select value={year} onValueChange={(v) => setYear(v ?? "")} required>
              <SelectTrigger id="ex-year">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ex-fuel">Fuel *</Label>
            <Select value={fuel} onValueChange={(v) => setFuel(v ?? "")} required>
              <SelectTrigger id="ex-fuel">
                <SelectValue placeholder="Fuel" />
              </SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ex-km">KMs Driven *</Label>
            <Select value={km} onValueChange={(v) => setKm(v ?? "")} required>
              <SelectTrigger id="ex-km">
                <SelectValue placeholder="KMs" />
              </SelectTrigger>
              <SelectContent>
                {KM_BUCKETS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
          <div className="space-y-1.5">
            <Label htmlFor="ex-name">Your Name *</Label>
            <Input id="ex-name" name="name" placeholder="Your full name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ex-mobile">Mobile Number *</Label>
            <Input
              id="ex-mobile"
              name="mobile"
              type="tel"
              placeholder="10-digit mobile"
              pattern="[6-9][0-9]{9}"
              required
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Get Exchange Value →"}
        </Button>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <p className="text-[11px] text-muted-foreground text-center">
          Free, no obligation. Our team values 100+ exchanges every month.
        </p>
      </form>
    </div>
  );
}
