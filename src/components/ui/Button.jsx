import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    primary: "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))/0.9]",
    secondary: "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))/0.8]",
    accent: "bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accent))/0.9]",
    outline: "border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] hover:text-white",
    ghost: "hover:bg-[hsl(var(--accent))] hover:text-white"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 py-2 px-4",
    lg: "h-11 px-8 text-lg"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};