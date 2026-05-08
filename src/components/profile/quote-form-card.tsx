"use client";

import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const volumeOptions = [
  { value: "0-500", label: "0–500 orders/mo" },
  { value: "500-2000", label: "500–2,000 orders/mo" },
  { value: "2000-10000", label: "2,000–10,000 orders/mo" },
  { value: "10000+", label: "10,000+ orders/mo" },
];

export function QuoteFormCard({ partnerName }: { partnerName: string }) {
  return (
    <section className="rounded-2xl border border-blue/30 bg-blue/[0.04] p-6">
      <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-text">
        Get a quote from {partnerName}
      </h3>
      <p className="mt-2 text-[13px] leading-[1.6] text-text-2">
        Drop your details and the team will reach out within 24 hours. No spam,
        no pay-to-play matching.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-5 space-y-3"
      >
        <Input
          type="text"
          name="name"
          placeholder="Your name"
          className="h-11 border-border-soft bg-surface text-[14px]"
        />
        <Input
          type="email"
          name="email"
          placeholder="Work email"
          className="h-11 border-border-soft bg-surface text-[14px]"
        />
        <Select>
          <SelectTrigger className="h-11 border-border-soft bg-surface text-[14px] font-medium text-text">
            <SelectValue placeholder="Monthly order volume" />
          </SelectTrigger>
          <SelectContent>
            {volumeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <textarea
          name="message"
          placeholder="What are you looking for?"
          rows={3}
          className="w-full resize-none rounded-md border border-border-soft bg-surface px-3 py-2.5 text-[14px] text-text placeholder:text-text-3 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
        />
        <Button
          type="submit"
          className="h-11 w-full bg-blue text-[14px] font-medium text-white hover:bg-blue-hover"
        >
          Request quote
          <ArrowRight className="ml-1 h-4 w-4" strokeWidth={2} />
        </Button>
      </form>
    </section>
  );
}
