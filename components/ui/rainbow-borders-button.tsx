import React from 'react';
import { cn } from "@/lib/utils";

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className, ...props }: RainbowButtonProps) => {
  return (
    <>
      <button 
        className={cn(
          "rainbow-border relative flex items-center justify-center gap-2.5 px-6 py-2.5 bg-black rounded-xl border-none text-white cursor-pointer font-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
      
      <style>{`
        .rainbow-border {
          position: relative;
        }
        .rainbow-border::before,
        .rainbow-border::after {
          content: '';
          position: absolute;
          left: -1.5px;
          top: -1.5px;
          border-radius: 12px;
          background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
          background-size: 400%;
          width: calc(100% + 3px);
          height: calc(100% + 3px);
          z-index: 1;
          animation: rainbow 12s linear infinite;
          pointer-events: none;
        }
        .rainbow-border::after {
          z-index: 0;
          filter: blur(12px);
          opacity: 0.6;
        }
        .rainbow-border > span {
          position: relative;
          z-index: 2;
        }
        @keyframes rainbow {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </>
  );
};

export default Button;
