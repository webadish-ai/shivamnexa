"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getStoredUtm } from "@/lib/utm";

type BrochureDownloadProps = {
  carSlug: string;
  carName: string;
  className?: string;
};

export default function BrochureDownload({ carSlug, carName, className }: BrochureDownloadProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const brochureHref = `/brochures/${carSlug}.pdf`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      mobile: String(formData.get("mobile") || "").trim(),
      car: carSlug,
      type: "brochure",
      pageUrl: window.location.href,
      utm: getStoredUtm(),
      website: String(formData.get("website") || ""),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "We could not process that right now.");
      }

      setSubmitted(true);
      window.open(brochureHref, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not process that right now. Please call or WhatsApp us."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSubmitted(false);
          setError("");
        }
      }}
    >
      <DialogTrigger
        className={
          className ??
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-md border text-sm font-medium hover:bg-accent transition-colors"
        }
      >
        📄 Download Brochure
      </DialogTrigger>
      <DialogContent>
        {submitted ? (
          <div className="text-center py-2">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold text-lg mb-1">Your brochure is ready</h3>
            <p className="text-muted-foreground text-sm mb-4">
              It should have opened in a new tab. If not, use the button below.
            </p>
            <a
              href={brochureHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Download {carName} Brochure (PDF)
            </a>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Download {carName} Brochure</DialogTitle>
              <DialogDescription>
                Enter your details and we&apos;ll unlock the full spec brochure (PDF).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <div className="space-y-1.5">
                <Label htmlFor="brochure-name">Full Name *</Label>
                <Input id="brochure-name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brochure-mobile">Mobile Number *</Label>
                <Input
                  id="brochure-mobile"
                  name="mobile"
                  type="tel"
                  placeholder="10-digit mobile"
                  pattern="[6-9][0-9]{9}"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Preparing..." : "Get Brochure →"}
              </Button>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
