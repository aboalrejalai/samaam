import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * Where the patient's kidney function sits, and what that costs.
 *
 * The four bands and their percentages are the MOH protocol's own (p. 22), not
 * a scale invented here. A reader with no clinical background gets the answer
 * from the position of the marker: far left is the worst band, and the band
 * says how much worse.
 *
 * Every band is labelled with its own percentage. That is deliberate — our red
 * and amber measure ΔE 3.7 apart under deuteranopia, so colour alone would
 * carry nothing for a red-green colourblind reader.
 */

/** MOH protocol p. 22 — CA-AKI risk by eGFR. Mirrors CA_AKI_RISK_BANDS. */
const BANDS = [
  { from: 0, to: 30, risk: '≈30%', tone: 'danger' },
  { from: 30, to: 45, risk: '≈15%', tone: 'warn' },
  { from: 45, to: 60, risk: '≈10%', tone: 'warn' },
  { from: 60, to: 120, risk: '≈5%', tone: 'success' },
] as const

const FILL: Record<(typeof BANDS)[number]['tone'], string> = {
  danger: 'bg-destructive/25',
  warn: 'bg-warning/20',
  success: 'bg-success/20',
}
const INK: Record<(typeof BANDS)[number]['tone'], string> = {
  danger: 'text-destructive-strong',
  warn: 'text-warning-strong',
  success: 'text-success-strong',
}

const MAX = 120

export interface RiskScaleProps extends React.ComponentProps<'div'> {
  /** eGFR as the server computed it. Null before anything has been sent. */
  value: number | null
  /** The band label the server returned, e.g. "≈30%". */
  band?: string | null
  /** The cited threshold, for the tick. */
  threshold?: number | null
  provenance?: string
}

function bandFor(value: number) {
  return BANDS.find((b) => value >= b.from && value < b.to) ?? BANDS[BANDS.length - 1]
}

export function RiskScale({
  value, band, threshold, provenance, className, ...props
}: RiskScaleProps) {
  const { t } = useTranslation()
  const active = value === null ? null : bandFor(value)
  const pct = value === null ? 0 : Math.min(Math.max(value, 0), MAX) / MAX

  return (
    <div data-slot="risk-scale" className={cn('flex flex-col gap-2', className)} {...props}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{t('viz.risk.label')}</span>
        {active && (
          <span className={cn('text-xs font-semibold', INK[active.tone])}>
            {t('viz.risk.chance', { pct: band ?? active.risk })}
          </span>
        )}
      </div>

      {/* Proportional figures, not tabular: a hero number set in tabular gives
          every digit the width of a zero and reads loose at this size. */}
      {value === null ? (
        <p className="text-sm text-muted-foreground">{t('viz.risk.pending')}</p>
      ) : (
        <p className={cn('text-4xl leading-none font-semibold', active && INK[active.tone])}>
          {value}
          <span className="ms-1.5 align-baseline text-xs font-normal text-muted-foreground">
            mL/min/1.73m²
          </span>
        </p>
      )}

      {/* The track. Bands are drawn to scale, each labelled with its own risk. */}
      <div className="pt-1">
        <div className="relative flex h-7 w-full overflow-hidden rounded-md border border-border">
          {BANDS.map((b) => (
            <div
              key={b.from}
              style={{ width: `${((b.to - b.from) / MAX) * 100}%` }}
              className={cn(
                'flex items-center justify-center border-e border-border/60 last:border-e-0',
                FILL[b.tone],
              )}
            >
              <span className={cn('text-[10px] font-semibold', INK[b.tone])}>{b.risk}</span>
            </div>
          ))}

          {value !== null && (
            <span
              aria-hidden
              style={{ insetInlineStart: `${pct * 100}%` }}
              className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-foreground rtl:translate-x-1/2"
            />
          )}
        </div>

        <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
          {[0, 30, 45, 60, MAX].map((tick) => (
            <span
              key={tick}
              dir="ltr"
              style={{ insetInlineStart: `${(tick / MAX) * 100}%` }}
              className={cn(
                'absolute -translate-x-1/2 tabular-nums rtl:translate-x-1/2',
                tick === threshold && 'font-semibold text-foreground',
              )}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>

      {provenance && <p className="text-xs text-muted-foreground">{provenance}</p>}
    </div>
  )
}
