import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#6366f1]/20 text-[#a5b4fc]',
        trigger: 'border-transparent bg-[#6366f1]/20 text-[#a5b4fc]',
        decision: 'border-transparent bg-[#f59e0b]/20 text-[#fcd34d]',
        delay: 'border-transparent bg-[#06b6d4]/20 text-[#67e8f9]',
        action: 'border-transparent bg-[#10b981]/20 text-[#6ee7b7]',
        outline: 'border-[#2a2d3e] text-[#94a3b8]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
