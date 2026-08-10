import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-[hsl(var(--primary))] text-white",
    accent: "bg-[hsl(var(--accent))] text-white",
    outline: "border border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};