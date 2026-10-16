import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { DeviceState } from '@/types/api'

/**
 * The equipment, drawn as a schematic rather than an anatomy plate.
 *
 * Four units in the order the contrast actually travels — injector, patient,
 * kidney — with the scanner alongside. Line weights match the icon set, so it
 * reads as equipment documentation and not as clip art.
 *
 * It shows one thing a verdict cannot: when the gateway withholds, the path
 * visibly breaks at the injector and the contrast never reaches the patient.
 * The state comes from the device's own `device_state`; nothing here is
 * decorative and nothing is inferred.
 */
const UNITS = ['injector', 'patient', 'kidney', 'scanner'] as const
type Unit = (typeof UNITS)[number]

export interface DeviceSchematicProps extends React.ComponentProps<'div'> {
  state: DeviceState | null
}

/** Where the flow stops. Only a withheld acquisition breaks the path. */
function severed(state: DeviceState | null) {
  return state === 'LOCKED'
}

function unitTone(unit: Unit, state: DeviceState | null) {
  if (state === null) return 'idle'
  if (severed(state)) return unit === 'injector' ? 'held' : 'unreached'
  if (state === 'EXECUTED') return 'live'
  return 'armed'
}

const TONE: Record<string, string> = {
  idle: 'border-border text-muted-foreground',
  armed: 'border-primary text-primary',
  live: 'border-success-strong text-success-strong',
  held: 'border-destructive-strong text-destructive-strong ring-4 ring-destructive/20',
  unreached: 'border-dashed border-border text-muted-foreground/50',
}

export function DeviceSchematic({ state, className, ...props }: DeviceSchematicProps) {
  const { t } = useTranslation()
  const broken = severed(state)

  return (
    <div
      data-slot="device-schematic"
      data-device-state={state ?? 'NONE'}
      role="img"
      aria-label={t(broken ? 'viz.device.ariaHeld' : 'viz.device.aria')}
      className={cn(
        'flex flex-wrap items-stretch gap-2 rounded-lg border border-border bg-card p-3',
        className,
      )}
      {...props}
    >
      {UNITS.map((unit, i) => {
        const tone = unitTone(unit, state)
        // The break sits between the injector and the patient — the first link
        // in the contrast path, which is exactly what a 403 prevents.
        const linkBroken = broken && i === 0
        return (
          <div key={unit} className="flex min-w-0 flex-1 items-center gap-2">
            <div
              data-unit={unit}
              data-tone={tone}
              className={cn(
                'flex min-w-0 flex-1 flex-col gap-0.5 rounded-md border-2 px-2.5 py-2 transition-colors',
                TONE[tone],
              )}
            >
              <span className="truncate text-xs font-medium">{t(`viz.device.${unit}`)}</span>
              <span dir="ltr" className="font-mono text-[10px] opacity-70">
                {t(`viz.device.tone.${tone}`)}
              </span>
            </div>

            {i < UNITS.length - 1 && (
              <span className="relative flex w-6 shrink-0 items-center justify-center" aria-hidden>
                <span
                  className={cn(
                    'h-px w-full',
                    linkBroken ? 'bg-destructive-strong' : 'bg-border',
                    tone === 'unreached' && 'bg-border/40',
                  )}
                />
                {linkBroken && (
                  <span className="absolute text-xs font-bold text-destructive-strong">✕</span>
                )}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
