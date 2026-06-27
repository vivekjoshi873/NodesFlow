import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--color-trigger-bg)] text-[var(--color-trigger)]',
        trigger: 'border-transparent bg-[var(--color-trigger-bg)] text-[var(--color-trigger)]',
        decision: 'border-transparent bg-[var(--color-decision-bg)] text-[var(--color-decision)]',
        delay: 'border-transparent bg-[var(--color-delay-bg)] text-[var(--color-delay)]',
        action: 'border-transparent bg-[var(--color-action-bg)] text-[var(--color-action)]',
        outline: 'border-[var(--border-primary)] text-[var(--text-secondary)]',
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
