type Props = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: Props) {
  return (
    <main className={`min-h-screen overflow-hidden bg-black text-white ${className}`}>
      {children}
    </main>
  );
}