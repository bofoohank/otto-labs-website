"use client";

type ActionItem<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  value: T;
  items: ActionItem<T>[];
  onChange: (value: T) => void;
};

export function AdminHeaderActions<T extends string>({
  value,
  items,
  onChange,
}: Props<T>) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black p-1">
      {items.map((item) => {
        const active = value === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`flex h-11 items-center justify-center whitespace-nowrap rounded-xl px-5 text-sm font-black transition ${
              active
                ? "bg-orange-500 text-white"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}