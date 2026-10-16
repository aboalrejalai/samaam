import { useTranslation } from 'react-i18next'
import { ActionChip } from '@/components/primitives/ActionChip'
import { BasisBadge } from '@/components/primitives/BasisBadge'
import { StatusIcon } from '@/components/primitives/status-icon'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { PolicyCheck } from '@/types/api'

const STATUS_EDGE: Record<PolicyCheck['status'], string> = {
  PASS: 'border-s-success',
  FAIL: 'border-s-destructive',
  WARN: 'border-s-warning',
  NO_EVIDENCE: 'border-s-foreground/80',
  NOT_APPLICABLE: 'border-s-border',
}

export interface CheckRowProps extends React.ComponentProps<typeof Card> {
  check: PolicyCheck
}

/**
 * One rule the policy node ran, with the authority it ran under.
 *
 * Nothing here collapses. FRONTEND-PLAN Part 4 forbids hiding WARN behind a
 * disclosure — a warning is part of the decision, not an appendix to it — and
 * a row that folds for one status but not another teaches the reader that
 * folded rows are unimportant.
 */
export function CheckRow({ check, className, ...props }: CheckRowProps) {
  const { t } = useTranslation()

  return (
    <Card
      size="sm"
      data-slot="check-row"
      data-status={check.status}
      className={cn('gap-2 rounded-md border-s-2 ring-0 shadow-ring', STATUS_EDGE[check.status], className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3">
        <StatusIcon status={check.status} />

        {/* Rule identifiers come from the server and stay as issued. */}
        <code dir="ltr" className="font-mono text-sm font-medium text-foreground">
          {check.rule}
        </code>

        <span className="text-xs text-muted-foreground">
          {t(`check.status.${check.status}`)}
        </span>

        <span className="ms-auto flex items-center gap-2">
          {check.action !== 'PROCEED' && <ActionChip action={check.action} />}
          {check.basis !== null && (
            <BasisBadge basis={check.basis} breached={check.status === 'FAIL'} />
          )}
        </span>
      </div>

      <p className="px-3 text-sm text-foreground/80">{check.detail}</p>

      {check.cites.length > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-3 text-xs text-muted-foreground">
          <span>{t('check.cites')}</span>
          {check.cites.map((id) => (
            <code key={id} dir="ltr" className="font-mono">
              {id}
            </code>
          ))}
        </p>
      )}
    </Card>
  )
}
