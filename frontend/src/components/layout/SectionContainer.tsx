type Props = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
};

export function SectionContainer({
  id,
  children,
  className = "",
  innerClassName = "mx-auto max-w-7xl",
}: Props) {
  return (
    <section id={id} className={`px-6 py-24 ${className}`}>
      <div className={innerClassName}>{children}</div>
    </section>
  );
}