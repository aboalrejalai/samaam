import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * When the harm would appear.
 *
 * This is the piece that answers the obvious objection — "the scan finished and
 * the patient walked out, so what was the problem?" Nothing presents during the
 * acquisition. Creatinine begins rising a day later and is clearest at two to
 * three days.
 *
 * The wording stays at elevated risk, never certainty. The reviewing
 * radiologist was explicit that contrast is not stated to cause renal failure;
 * the accurate claim is that this patient is at elevated risk of it. Source
 * record CLINICAL-AKI-ONSET, and it is labelled as clinical review rather than
 * published text.
 */
const STOPS = ['scan', 'rise', 'peak'] as const

export interface HarmTimelineProps extends React.ComponentProps<'div'> {
  citeId?: string
}

export function HarmTimeline({ citeId = 'CLINICAL-AKI-ONSET', className, ...props }: HarmTimelineProps) {
  const { t } = useTranslation()

  return (
    <div data-slot="harm-timeline" className={cn('flex flex-col gap-3', className)} {...props}>
      <p className="text-xs text-muted-foreground">{t('viz.timeline.lead')}</p>

      <ol className="relative flex justify-between">
        <span aria-hidden className="absolute inset-x-2 top-1.5 h-px bg-border" />
        <span
          aria-hidden
          className="absolute start-2 top-1.5 h-px w-[calc(100%-1rem)] bg-gradient-to-r from-transparent via-warning to-destructive-strong rtl:bg-gradient-to-l"
        />
        {STOPS.map((stop, i) => (
          <li key={stop} className="relative z-10 flex w-1/3 flex-col items-center gap-1.5 text-center">
            <span
              className={cn(
                'size-3 rounded-full border-2 bg-card',
                i === 0 && 'border-muted-foreground',
                i === 1 && 'border-warning-strong',
                i === 2 && 'border-destructive-strong',
              )}
            />
            <span dir="ltr" className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {t(`viz.timeline.${stop}.when`)}
            </span>
            <span
              className={cn(
                'text-[11px] leading-tight',
                i === 2 ? 'font-semibold text-destructive-strong' : 'text-foreground/80',
              )}
            >
              {t(`viz.timeline.${stop}.what`)}
            </span>
          </li>
        ))}
      </ol>

      <p dir="ltr" className="font-mono text-[10px] text-muted-foreground">
        {t('check.cites')}: {citeId}
      </p>
    </div>
  )
}
