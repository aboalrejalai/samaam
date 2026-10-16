import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Action } from '@/types/api'

/**
 * What the console must do, shown apart from what the verdict says.
 *
 * A consultant radiologist reviewing this project put it plainly: the thing
 * clinicians reject is software that takes the medical decision for them. A
 * screen reading PROHIBITED at a lab value does exactly that. So the strongest
 * clinical outcome here is AUTHORISE — held until a named person reviews it —
 * and PROHIBITED is reserved for what no clinician may permit at all.
 */
const TONE: Record<Action, string> = {
  PROCEED: 'border-success-strong text-success-strong',
  CONFIRM: 'border-warning-strong text-warning-strong',
  AUTHORISE: 'border-destructive-strong bg-destructive-strong text-card',
  PROHIBITED: 'border-foreground bg-foreground text-card',
}
const DOT: Record<Action, string> = {
  PROCEED: '🟢', CONFIRM: '🟡', AUTHORISE: '🔴', PROHIBITED: '⛔',
}

export function ActionChip({ action, className }: { action: Action; className?: string }) {
  const { t } = useTranslation()
  return (
    <span
      data-action={action}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold',
        TONE[action],
        className,
      )}
    >
      <span aria-hidden>{DOT[action]}</span>
      {t(`action.${action}`)}
    </span>
  )
}
