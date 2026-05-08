"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";

const options = [
  { value: "4.5", label: "4.5+" },
  { value: "4.0", label: "4.0+" },
  { value: "3.5", label: "3.5+" },
  { value: "any", label: "Any rating" },
] as const;

export type RatingValue = (typeof options)[number]["value"];

export function RatingRadio({
  value,
  onChange,
}: {
  value: RatingValue;
  onChange: (value: RatingValue) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as RatingValue)}
      className="space-y-2.5"
    >
      {options.map((option) => {
        const id = `rating-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-2.5 text-[14px] text-text-2 transition-colors duration-200 hover:text-text"
          >
            <RadioGroupItem
              value={option.value}
              id={id}
              className="border-border-soft text-blue"
            />
            <span className="flex items-center gap-1">
              {option.value !== "any" && (
                <Star
                  className="h-3.5 w-3.5 fill-amber text-amber"
                  strokeWidth={1.5}
                />
              )}
              {option.label}
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
