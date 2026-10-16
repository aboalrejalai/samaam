import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ActionChip } from './ActionChip'
import { HUMAN_IN_THE_LOOP_VERDICTS, type Verdict } from '@/types/api'
import type { Action as ActionValue } from '@/types/api'

type Tone = 'released' | 'withheld' | 'unsettled' | 'abstained'

/**
 * INSUFFICIENT_EVIDENCE and POTENTIAL_GAP are deliberate verdicts, not
 * failures, and FRONTEND-PLAN Part 4 forbids drawing them as errors. They read
 * neutral and carry the referral line instead.
 */
const VERDICT_TONE: Record<Verdict, Tone> = {
  COMPLIANT: 'released',
  VIOLATION: 'withheld',
  AMBIGUITY: 'unsettled',
  CONFLICT: 'unsettled',
  POTENTIAL_GAP: 'abstained',
  INSUFFICIENT_EVIDENCE: 'abstained',
}

const TONE_CLASS: Record<Tone, string> = {
  released: 'border-s-success bg-success/8 text-success-strong',
  withheld: 'border-s-destructive bg-destructive/8 text-destructive-strong',
  unsettled: 'border-s-warning bg-warning/8 text-warning-strong',
  abstained: 'border-s-muted-foreground bg-muted text-foreground',
}

export interface VerdictBannerProps extends React.ComponentProps<typeof Card> {
  verdict: Verdict
  /** What the console must do. Shown beside the verdict, never merged with it. */
  action?: ActionValue
  /** Whether the policy node withheld execution. */
  blocked: boolean
  /** The status the device actually returned. Derived from `blocked` if absent. */
  httpStatus?: number
}

export function VerdictBanner({
  verdict,
  action,
  blocked,
  httpStatus,
  className,
  // Explicit, because spreading it onto Card is silently dropped: JSX children
  // win over a children prop, so the caller's message would vanish.
  children,
  ...props
}: VerdictBannerProps) {
  const { t } = useTranslation()
  const tone = VERDICT_TONE[verdict]
  const status = httpStatus ?? (blocked ? 403 : 200)
  const referred = (HUMAN_IN_THE_LOOP_VERDICTS as readonly Verdict[]).includes(verdict)

  return (
    <Card
      data-slot="verdict-banner"
      data-verdict={verdict}
      data-blocked={blocked}
      role="status"
      className={cn(
        'gap-2 rounded-md border-s-4 px-4 ring-0 shadow-ring',
        TONE_CLASS[tone],
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* The verdict name is a contract value and is never translated. */}
        <span
          dir="ltr"
          className=" text-xl font-bold tracking-[0.04em] uppercase"
        >
          {verdict}
        </span>
        <div className="flex items-center gap-3">
          {action && <ActionChip action={action} />}
          <span
            dir="ltr"
            className={cn(
              'font-mono text-sm tabular-nums',
              blocked ? 'font-semibold' : 'text-muted-foreground',
            )}
          >
            HTTP {status}
          </span>
        </div>
      </div>

      {/* The verdict stands even when a consultant released the acquisition,
          so the headline keeps saying VIOLATION — but the subtitle must not
          claim the execution was withheld when the device returned 200. */}
      <p className="text-sm text-foreground/80">
        {blocked && status === 200
          ? t('verdict.releasedUnderOverride')
          : t(`verdict.${verdict}`)}
      </p>
      {action && action !== 'PROCEED' && (
        <p className="text-sm font-medium text-foreground">{t(`action.${action}_lead`)}</p>
      )}

      {referred && (
        <p className="text-xs text-muted-foreground">{t('verdict.humanInTheLoop')}</p>
      )}

      {children}
    </Card>
  )
}
