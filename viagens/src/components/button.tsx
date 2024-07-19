import { ComponentProps, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: 'rounded-lg px-0 font-medium flex items-center justify-center gap-0 md:gap-2 md:px-5',
  
  variants: {
    variant: {
      primary: 'bg-lime-300 text-lime-950 hover:bg-lime-400',
      secondary: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
    },
    
    size: {
      default: 'py-1 w-20 text-xs md:w-36 md:text-base',
      full: 'w-full text-xs h-11  md:text-base' 
    }
  },

  defaultVariants: {
    variant: 'primary',
    size: 'default'
  }
})

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  children: ReactNode
}

export function Button({ children, variant, size, ...rest }: ButtonProps) {
  return (
    <button {...rest} className={buttonVariants({ variant,size })}>
      {children}
    </button>
  )
}