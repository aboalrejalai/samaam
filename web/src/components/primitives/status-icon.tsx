import {
  CircleCheck,
  CircleHelp,
  Minus,
  OctagonX,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CheckStatus } from '@/types/api'

/**
 * Per FRONTEND-PLAN §1 the outline distinguishes the status before the colour
 * does: a circled tick, an octagon, a triangle, a queried circle, a dash.
 */
const STATUS_ICON: Record<CheckStatus, LucideIcon> = {
  PASS: CircleCheck,
  FAIL: OctagonX,
  WARN: TriangleAlert,
  NO_EVIDENCE: CircleHelp,
  NOT_APPLICABLE: Minus,
}

const STATUS_COLOUR: Record<CheckStatus, string> = {
  PASS: 'text-success-strong',
  FAIL: 'text-destructive-strong',
  WARN: 'text-warning-strong',
  NO_EVIDENCE: 'text-foreground/80',
  NOT_APPLICABLE: 'text-muted-foreground',
}

export interface StatusIconProps extends React.ComponentProps<'svg'> {
  status: CheckStatus
}

export function StatusIcon({ status, className, ...props }: StatusIconProps) {
  const Icon = STATUS_ICON[status]
  return (
    <Icon
      aria-hidden
      data-status={status}
      className={cn('size-4 shrink-0', STATUS_COLOUR[status], className)}
      {...props}
    />
  )
}

export { STATUS_COLOUR }
