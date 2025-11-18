import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
  
  const variants = {
    primary: "bg-accent text-white hover:bg-red-600 focus:ring-accent",
    secondary: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary",
    outline: "border border-gray-300 text-primary hover:bg-gray-50 focus:ring-primary",
    ghost: "text-primary hover:bg-gray-100 focus:ring-primary",
    link: "text-accent underline-offset-4 hover:underline focus:ring-accent"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button