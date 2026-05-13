"use client";

import { useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminTagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function AdminTagInput({
  value,
  onChange,
  placeholder = "Add tag and press Enter",
  className,
}: AdminTagInputProps) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
  }

  function commitDraft() {
    if (!draft.trim()) return;
    addTag(draft);
    setDraft("");
  }

  function removeAt(index: number) {
    const next = value.slice();
    next.splice(index, 1);
    onChange(next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      removeAt(value.length - 1);
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (!text.includes(",")) return;
    e.preventDefault();
    const parts = text.split(",").map((s) => s.trim()).filter(Boolean);
    const additions = parts.filter((p) => !value.includes(p));
    if (additions.length > 0) {
      onChange([...value, ...additions]);
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1.5 transition-colors focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/15",
        className
      )}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-1 text-[12px] font-medium text-text"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label={`Remove ${tag}`}
            className="text-text-3 transition-colors hover:text-text"
          >
            <X className="h-3 w-3" strokeWidth={2.4} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onBlur={commitDraft}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[120px] flex-1 bg-transparent px-1 text-[14px] text-text outline-none placeholder:text-text-3"
      />
    </div>
  );
}
