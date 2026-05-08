"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const options = [
  { value: "any", label: "No minimum" },
  { value: "100", label: "100+ orders/mo" },
  { value: "500", label: "500+ orders/mo" },
  { value: "1000", label: "1,000+ orders/mo" },
] as const;

export type VolumeValue = (typeof options)[number]["value"];

export function VolumeRadio({
  value,
  onChange,
}: {
  value: VolumeValue;
  onChange: (value: VolumeValue) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as VolumeValue)}
      className="space-y-2.5"
    >
      {options.map((option) => {
        const id = `vol-${option.value}`;
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
            <span>{option.label}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
