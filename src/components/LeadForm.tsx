"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CARS, DEALER } from "@/lib/data";
import { getStoredUtm } from "@/lib/utm";

type FormType = "test-drive" | "quote" | "contact";

type LeadFormProps = {
  formType?: FormType;
  preselectedCar?: string;
  city?: string;
  className?: string;
};

export default function LeadForm({
  formType = "test-drive",
  preselectedCar,
  city,
  className,
}: LeadFormProps) {
  const [selectedCar, setSelectedCar] = useState(preselectedCar ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titles: Record<FormType, string> = {
    "test-drive": "Book a Free Test Drive",
    quote: "Get Best Price Quote",
    contact: "Talk to Our Experts",
  };

  const ctaLabels: Record<FormType, string> = {
    "test-drive": "Book Test Drive →",
    quote: "Get Quote →",
    contact: "Send Enquiry →",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      mobile: String(formData.get("mobile") || "").trim(),
      car: String(formData.get("car") || selectedCar || "").trim(),
      location: String(formData.get("location") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      type: formType,
      city: city || "",
      pageUrl: window.location.href,
      utm: getStoredUtm(),
      // Honeypot — must stay empty; bots that fill it are silently dropped.
      website: String(formData.get("website") || ""),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "We could not submit your enquiry right now.");
      }

      setSubmitted(true);
      form.reset();
      setSelectedCar(preselectedCar ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not submit your enquiry right now. Please call or WhatsApp us."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={`rounded-xl border bg-card p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-semibold text-lg mb-1">We&apos;ll Call You Shortly!</h3>
        <p className="text-muted-foreground text-sm">
          Our team will reach out within 30 minutes during business hours.
        </p>
        <p className="mt-4 text-sm font-medium">
          Or call us directly:{" "}
          <a href={`tel:${DEALER.phone}`} className="text-primary underline">
            {DEALER.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border bg-card p-6 ${className}`}>
      <h2 className="font-bold text-xl mb-1">{titles[formType]}</h2>
      {city && (
        <p className="text-muted-foreground text-sm mb-4">
          Shivam NEXA · Mumbai, Thane &amp; Palghar
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="10-digit mobile"
              pattern="[6-9][0-9]{9}"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="car">Car Model *</Label>
          <input type="hidden" name="car" value={selectedCar} />
          <Select value={selectedCar} onValueChange={(value) => setSelectedCar(value ?? "")} required>
            <SelectTrigger id="car">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {CARS.map((car) => (
                <SelectItem key={car.slug} value={car.slug}>
                  {car.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Your Location</Label>
          <Input
            id="location"
            name="location"
            placeholder={city || "Mumbai / Thane / Navi Mumbai / Palghar"}
          />
        </div>

        {formType === "contact" && (
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Any specific questions or requirements..."
              rows={3}
            />
          </div>
        )}

        <Button type="submit" className="w-full text-base" size="lg" disabled={loading}>
          {loading ? "Sending..." : ctaLabels[formType]}
        </Button>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>

      <div className="mt-4 pt-4 border-t flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <a href={`tel:${DEALER.phone}`} className="hover:text-foreground transition-colors">
          📞 {DEALER.phone}
        </a>
        <span>|</span>
        <a
          href={`https://wa.me/91${DEALER.phone}?text=Hi, I'm interested in a NEXA car`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
}
