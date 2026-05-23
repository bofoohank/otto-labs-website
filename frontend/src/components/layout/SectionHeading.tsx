type Props = {
  eyebrow: string;
  title: string;
  centered?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  centered = false,
  className = "",
}: Props) {
  return (
    <div
      className={`mb-12 max-w-3xl ${
        centered ? "mx-auto text-center" : ""
      } ${className}`}
    >
      <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-orange-500">
        {eyebrow}
      </p>

      <h2 className="text-4xl font-black md:text-5xl">{title}</h2>
    </div>
  );
}