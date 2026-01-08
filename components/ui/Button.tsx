import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium font-display transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "text-black bg-white hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] border-beam-container z-10",
    secondary: "text-white bg-surface border border-white/10 hover:bg-slate-800 hover:border-white/20 hover:scale-105",
    outline: "text-white border border-white/10 hover:bg-white/5 hover:border-primary/50",
    text: "text-slate-400 hover:text-white hover:underline decoration-primary/50 underline-offset-4 p-0 bg-transparent"
  };

  // Primary variant specific wrapper structure needed for the beam effect
  if (variant === 'primary') {
    return (
      <button 
        className={`${baseStyles} ${variants[variant]} ${className}`} 
        {...props}
      >
        {/* Inner background to mask the conic gradient center */}
        <span className="absolute inset-[1px] bg-white rounded-[7px] z-0"></span>
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
        </span>
      </button>
    );
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
      {icon && <span className="ml-2 transition-transform group-hover:translate-x-1">{icon}</span>}
    </button>
  );
};

export default Button;