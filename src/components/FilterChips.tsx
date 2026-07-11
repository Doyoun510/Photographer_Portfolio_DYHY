import type { Category } from "../types";

const CHIPS: { value: Category | null; label: string }[] = [
  { value: null, label: "All" },
  { value: "interior", label: "Interior" },
  { value: "cafe", label: "Cafe" },
  { value: "portrait", label: "Portrait" },
  { value: "street", label: "Street" },
];

interface FilterChipsProps {
  value: Category | null;
  onChange: (value: Category | null) => void;
}

export default function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
      {CHIPS.map((chip) => {
        const selected = chip.value === value;
        return (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChange(chip.value)}
            aria-pressed={selected}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              selected
                ? "border-neutral-800 bg-neutral-800 text-white"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
