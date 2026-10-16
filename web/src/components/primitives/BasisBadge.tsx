import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Basis } from '@/types/api'

/**
 * How strong the authority behind a check is — the distinction the whole
 * project rests on. A protocol departure is not a statutory violation and must
 * never be dressed as one.
 *
 * The label depends on the outcome, not only the basis. A check that passed has
 * violated nothing, and a badge reading "Statutory violation" beside a green
 * tick is simply a false statement. Passing shows the authority; failing shows
 * the breach.
 *
 * Colour is not the only channel. Per FRONTEND-PLAN §1.4 the bases differ by
 * SHAPE: a square-cornered chip for statute, a pill for protocol, bare text for
 * guidance. That survives colour blindness — measured, our red and amber sit
 * ΔE 3.7 apart under deuteranopia — and it survives greyscale print. The shape
 * holds whether the check passed or failed; only the fill and the wording move.
 */
const SHAPE: Record<Basis, string> = {
  STATUTORY: 'rounded-sm',
  NATIONAL_PROTOCOL: 'rounded-full',
  CLINICAL_GUIDANCE: 'rounded-none px-0',
}

const BREACHED: Record<Basis, string> = {
  STATUTORY: 'border-transparent bg-destructive-strong text-card font-semibold',
  NATIONAL_PROTOCOL: 'border border-warning-strong bg-transparent text-warning-strong',
  CLINICAL_GUIDANCE: 'border-transparent bg-transparent text-muted-foreground',
}

/** Quiet when nothing was breached: the basis is context, not an alarm. */
const SATISFIED: Record<Basis, string> = {
  STATUTORY: 'border border-border bg-transparent text-muted-foreground',
  NATIONAL_PROTOCOL: 'border border-border bg-transparent text-muted-foreground',
  CLINICAL_GUIDANCE: 'border-transparent bg-transparent text-muted-foreground',
}

export interface BasisBadgeProps extends Omit<React.ComponentProps<typeof Badge>, 'variant'> {
  basis: Basis
  /** Whether this check actually failed. Drives the wording and the fill. */
  breached?: boolean
}

export function BasisBadge({ basis, breached = true, className, ...props }: BasisBadgeProps) {
  const { t } = useTranslation()

  return (
    <Badge
      data-basis={basis}
      data-breached={breached}
      className={cn(SHAPE[basis], breached ? BREACHED[basis] : SATISFIED[basis], className)}
      title={basis}
      {...props}
    >
      {t(breached ? `basis.${basis}` : `basis.satisfied.${basis}`)}
    </Badge>
  )
}
