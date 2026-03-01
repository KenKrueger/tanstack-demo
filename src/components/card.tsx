interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`border border-stone-200/60 rounded-2xl p-4 card-shadow bg-white ${className}`}
    >
      {children}
    </div>
  );
}
