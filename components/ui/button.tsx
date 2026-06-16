import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95 shadow-md",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/35",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-900/35",
        outline:
          "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20",
        secondary:
          "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-white/5",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white shadow-none",
        link: "text-blue-400 underline-offset-4 hover:underline shadow-none",
        rainbow: "rainbow-border bg-black text-white hover:scale-[1.02] active:scale-[0.98] border-none font-black relative flex items-center justify-center gap-2.5 rounded-xl shadow-none",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
        {variant === "rainbow" && (
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
              animation: button-rainbow 12s linear infinite;
              pointer-events: none;
            }
            .rainbow-border::after {
              z-index: 0;
              filter: blur(12px);
              opacity: 0.65;
            }
            .rainbow-border > * {
              position: relative;
              z-index: 2;
            }
            @keyframes button-rainbow {
              0% { background-position: 0 0; }
              50% { background-position: 400% 0; }
              100% { background-position: 0 0; }
            }
          `}</style>
        )}
      </>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
