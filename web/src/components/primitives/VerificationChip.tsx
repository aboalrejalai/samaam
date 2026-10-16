import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Verification } from '@/types/api'

/**
 * Whether a knowledge-base record has been checked against the document it
 * claims to quote. Only VERIFIED records are citable in a block, so this is
 * the reader's cue for how much weight a retrieval result carries.
 */
const VERIFICATION_CLASS: Record<Verification, string> = {
  VERIFIED: 'border-success-strong text-success-strong',
  PENDING: 'border-warning-strong text-warning-strong',
  UNVERIFIED: 'border-border text-muted-foreground',
}

export interface VerificationChipProps
  extends Omit<React.ComponentProps<typeof Badge>, 'variant'> {
  verification: Verification
}

export function VerificationChip({
  verification,
  className,
  ...props
}: VerificationChipProps) {
  const { t } = useTranslation()

  return (
    <Badge
      variant="outline"
      data-verification={verification}
      title={verification}
      className={cn('bg-transparent', VERIFICATION_CLASS[verification], className)}
      {...props}
    >
      {t(`verification.${verification}`)}
    </Badge>
  )
}
