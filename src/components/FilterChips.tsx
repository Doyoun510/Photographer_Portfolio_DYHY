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
  /** 사진이 존재하는 카테고리만 칩으로 노출한다. (All은 항상 표시) */
  available: Category[];
}

export default function FilterChips({ value, onChange, available }: FilterChipsProps) {
  const chips = CHIPS.filter(
    (chip) => chip.value === null || available.includes(chip.value)
  );

  // 카테고리가 하나뿐이면 필터 UI가 무의미하므로 숨긴다
  if (available.length < 2) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
      {chips.map((chip) => {
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
