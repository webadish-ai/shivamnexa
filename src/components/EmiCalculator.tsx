"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/ui/link-button";
import { DEALER, estimateOnRoadPrice, formatPrice } from "@/lib/data";

type EmiCalculatorProps = {
  carSlug: string;
  carName: string;
  exShowroom: number;
};

function calculateEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}

export default function EmiCalculator({ carSlug, carName, exShowroom }: EmiCalculatorProps) {
  const onRoad = estimateOnRoadPrice(exShowroom);
  const defaultDown = Math.round(onRoad * 0.2);

  const [vehiclePrice, setVehiclePrice] = useState(onRoad);
  const [downPayment, setDownPayment] = useState(defaultDown);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [rate, setRate] = useState(8.99);

  const loanAmount = Math.max(vehiclePrice - downPayment, 0);
  const emi = useMemo(
    () => calculateEmi(loanAmount, rate, tenureMonths),
    [loanAmount, rate, tenureMonths]
  );
  const totalPayable = emi * tenureMonths;
  const totalInterest = Math.max(totalPayable - loanAmount, 0);

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="bg-muted/50 px-6 py-4 border-b">
        <h3 className="font-bold text-lg">EMI Calculator — {carName}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Estimate monthly EMI. Final rate &amp; tenure depend on finance partner approval.
        </p>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <Label htmlFor="vehiclePrice">Vehicle Price (On-Road)</Label>
              <span className="text-sm font-semibold">{formatPrice(vehiclePrice)}</span>
            </div>
            <Input
              id="vehiclePrice"
              type="number"
              value={vehiclePrice}
              min={300000}
              step={10000}
              onChange={(e) => setVehiclePrice(Math.max(Number(e.target.value) || 0, 0))}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <Label htmlFor="downPayment">
                Down Payment ({Math.round((downPayment / vehiclePrice) * 100) || 0}%)
              </Label>
              <span className="text-sm font-semibold">{formatPrice(downPayment)}</span>
            </div>
            <input
              id="downPayment"
              type="range"
              min={0}
              max={vehiclePrice}
              step={10000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₹0</span>
              <span>{formatPrice(vehiclePrice)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <Label htmlFor="tenure">Loan Tenure</Label>
              <span className="text-sm font-semibold">
                {tenureMonths} months ({(tenureMonths / 12).toFixed(0)} yr)
              </span>
            </div>
            <input
              id="tenure"
              type="range"
              min={12}
              max={84}
              step={6}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 yr</span>
              <span>7 yr</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <Label htmlFor="rate">Interest Rate (p.a.)</Label>
              <span className="text-sm font-semibold">{rate.toFixed(2)}%</span>
            </div>
            <input
              id="rate"
              type="range"
              min={7.5}
              max={14}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>7.5%</span>
              <span>14%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="rounded-xl bg-primary/5 border-2 border-primary/30 p-6 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Your Monthly EMI
            </p>
            <p className="text-4xl font-bold text-primary mt-2">
              {formatPrice(emi)}<span className="text-base font-medium text-muted-foreground">/mo</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs">
              <div className="rounded-lg bg-background border p-3">
                <p className="text-muted-foreground">Loan Amount</p>
                <p className="font-semibold mt-0.5">{formatPrice(loanAmount)}</p>
              </div>
              <div className="rounded-lg bg-background border p-3">
                <p className="text-muted-foreground">Total Interest</p>
                <p className="font-semibold mt-0.5">{formatPrice(totalInterest)}</p>
              </div>
              <div className="rounded-lg bg-background border p-3 col-span-2">
                <p className="text-muted-foreground">Total Payable</p>
                <p className="font-semibold mt-0.5">{formatPrice(totalPayable + downPayment)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <LinkButton
              href={`/contact?car=${carSlug}&type=quote&emi=${emi}&tenure=${tenureMonths}&rate=${rate}`}
              size="lg"
              className="w-full"
            >
              Apply for This EMI →
            </LinkButton>
            <a
              href={`https://wa.me/91${DEALER.phone}?text=Hi, I want finance for ${carName} — EMI approx ₹${emi.toLocaleString(
                "en-IN"
              )}/mo for ${tenureMonths} months`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full text-sm font-medium text-[#25D366] py-2 border border-[#25D366]/30 rounded-md hover:bg-[#25D366]/5 transition-colors"
            >
              💬 WhatsApp Finance Team
            </a>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            * Indicative only. Final EMI depends on lender, profile &amp; documentation.{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              Talk to a finance advisor
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
