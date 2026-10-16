import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Reading } from '@/types/api'

/**
 * The requested dose against the national level, and against the lower-dose
 * alternative when the case carries one.
 *
 * Emphasis, not category: the requested value is the point, the national level
 * is a reference tick, and the alternative is quiet. Each measure gets its own
 * track — CTDIvol and DLP are different scales and sharing an axis would be a
 * lie about their relationship.
 *
 * Every bar is labelled with its own number, so the chart is readable with the
 * colour removed.
 */
export interface DoseComparisonProps extends React.ComponentProps<'div'> {
  readings: Reading[]
  /** Drives the tone of the requested bar. From the check, not derived here. */
  breached: boolean
}

/** Scale so the longest bar leaves room for its label. */
function scale(r: Reading) {
  const top = Math.max(r.measured, r.limit ?? 0, r.alternative ?? 0) * 1.15
  return (v: number) => `${Math.min(100, (v / top) * 100)}%`
}

export function DoseComparison({
  readings, breached, className, ...props
}: DoseComparisonProps) {
  const { t } = useTranslation()
  const plottable = readings.filter((r) => r.limit !== null)
  if (plottable.length === 0) return null

  return (
    <div data-slot="dose-comparison" className={cn('flex flex-col gap-5', className)} {...props}>
      {plottable.map((r) => {
        const at = scale(r)
        const over = r.limit !== null && r.measured > r.limit
        const excess = r.limit ? Math.round(((r.measured - r.limit) / r.limit) * 100) : 0
        return (
          <div key={r.name} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span dir="ltr" className="font-mono text-xs font-semibold uppercase">
                {r.name}
              </span>
              <span className="text-[10px] text-muted-foreground">{r.unit}</span>
            </div>

            <Bar
              label={t('viz.dose.requested')}
              value={r.measured}
              width={at(r.measured)}
              tone={over && breached ? 'over' : 'ok'}
              suffix={over ? t('viz.dose.excess', { pct: excess }) : undefined}
            />

            {/* The limit is a reference edge, not a bar — it is not a quantity
                anyone chose, it is the line the others are judged against. */}
            <div className="relative h-4">
              <span
                style={{ insetInlineStart: at(r.limit as number) }}
                className="absolute top-0 h-4 w-px bg-foreground"
              />
              <span
                style={{ insetInlineStart: at(r.limit as number) }}
                className="absolute top-0 ms-1.5 text-[10px] whitespace-nowrap text-muted-foreground"
              >
                {t('viz.dose.limit')}{' '}
                <span dir="ltr" className="font-mono tabular-nums">{r.limit}</span>
              </span>
            </div>

            {r.alternative !== null && (
              <Bar
                label={t('viz.dose.alternative')}
                value={r.alternative}
                width={at(r.alternative)}
                tone="alt"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const TONE = {
  over: 'bg-destructive-strong',
  ok: 'bg-success-strong',
  alt: 'bg-muted-foreground/45',
} as const

function Bar({
  label, value, width, tone, suffix,
}: {
  label: string
  value: number
  width: string
  tone: keyof typeof TONE
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <div className="relative h-2.5 flex-1 rounded-full bg-muted">
        <div
          style={{ width }}
          className={cn('h-full rounded-full transition-[width] duration-300', TONE[tone])}
        />
      </div>
      <span dir="ltr" className="w-24 shrink-0 text-end font-mono text-xs tabular-nums">
        {value}
        {suffix && <span className="ms-1 font-semibold text-destructive-strong">{suffix}</span>}
      </span>
    </div>
  )
}
