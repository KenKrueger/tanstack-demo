interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`$flex border border-gray-300 rounded p-4 card-shadow bg-white ${className}`}
    >
      {children}
    </div>
  );
}
