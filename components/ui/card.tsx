import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-[24px] bg-[#c8d1d9] p-8 shadow-sm overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}