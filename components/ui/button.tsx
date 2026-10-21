import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent bg-clip-padding text-[0.8125rem] font-semibold tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-60 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-river-deep",
        river: "bg-river text-white hover:bg-river-deep",
        outline:
          "border-ink/35 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-paper-2",
        link: "h-auto rounded-none px-0 normal-case tracking-normal text-river-deep underline decoration-river/40 underline-offset-4 hover:decoration-river-deep",
        inverse: "bg-paper text-ink hover:bg-river-soft",
        "outline-inverse":
          "border-paper/55 bg-transparent text-paper hover:border-paper hover:bg-paper hover:text-ink",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-11 px-5",
        lg: "h-14 px-8 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
