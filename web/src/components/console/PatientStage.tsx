import { useTranslation } from 'react-i18next'
import { Check, Lock } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { EvaluationResponse, Patient, Requested } from '@/types/api'
import type { PipelineTransit } from '@/components/pipeline/pipeline-transit'

export interface PatientStageProps {
  worklistId?: string | null
  patient: Patient
  requested: Requested
  result: EvaluationResponse | null
  transit: PipelineTransit
  offline?: boolean
  onPinClick?: (rule: string) => void
}

export function PatientStage({
  worklistId,
  patient,
  requested,
  result,
  transit,
  offline,
  onPinClick,
}: PatientStageProps) {
  const { t } = useTranslation()

  const renalCheck = result?.policy.checks.find((c) => c.rule === 'renal_prophylaxis')
  const egfrReading = renalCheck?.readings.find((r) => r.name === 'egfr')
  const egfrVal = egfrReading?.measured ?? patient.egfr ?? null
  const egfrLimit = egfrReading?.limit != null ? String(egfrReading.limit) : '—'

  const hasResult = result !== null
  const pin1Color = renalCheck?.status === 'FAIL'
    ? 'var(--destructive-strong)'
    : renalCheck?.status === 'WARN'
      ? 'var(--warning-strong)'
      : 'var(--success-strong)'
  const pin2Color = 'var(--warning-strong)'

  const regionDisplay = requested.body_region
    ? t(`regions.${requested.body_region}`, { defaultValue: requested.body_region })
    : '—'

  // Six pipeline nodes: C, PP, M, P, D, SINK
  const isSealed = transit.sealed || (hasResult && result.device_response.status !== 200)
  const isExecuted = hasResult && result.device_response.status === 200

  function getNodeClass(index: number) {
    if (isSealed) {
      if (index === 3) return 'node sealed'
      if (index > 3) return 'node dim'
      return 'node'
    }
    if (transit.position !== null) {
      if (transit.position === index) return 'node active'
      if (index > transit.position) return 'node dim'
      return 'node'
    }
    if (isExecuted) {
      return 'node'
    }
    return 'node'
  }

  return (
    <div className="flex flex-col gap-5 min-w-0" data-id="stage">
      {/* Patient Torso Card */}
      <section
        className="card relative overflow-hidden p-5"
        style={{
          background: 'linear-gradient(180deg, var(--sa-50), var(--card) 62%)',
        }}
        aria-label={t('console.patient')}
        data-id="stage.model"
      >
        <div className="flex items-center justify-between gap-3 mb-0">
          <p className="font-semibold text-base">{t('console.patient')}</p>
          {worklistId && (
            <span className="chip bg-card">
              <span dir="ltr" className="font-mono">
                {worklistId}
              </span>
            </span>
          )}
        </div>

        <figure className="relative mx-auto mt-1.5 w-full max-w-[330px]">
          <img
            src="/models/abdomen.webp"
            alt={t('models.torsoAlt')}
            className="block w-full h-auto"
            data-id="stage.torso"
          />

          {/* Pin 1: Kidney eGFR - visible on kidneys once result exists */}
          {hasResult && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  style={{
                    top: '45%',
                    left: '33%',
                    borderColor: pin1Color,
                    color: pin1Color,
                  }}
                  className="pin"
                  aria-label={t('console.pinTooltipEgfr', {
                    val: egfrVal ?? '—',
                    threshold: egfrLimit,
                  })}
                  onClick={() => onPinClick?.('renal_prophylaxis')}
                >
                  1
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>
                  {t('console.pinTooltipEgfr', {
                    val: egfrVal ?? '—',
                    threshold: egfrLimit,
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Pin 2: AKI Risk - visible on kidneys once result exists */}
          {hasResult && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  style={{
                    top: '45%',
                    left: '62%',
                    borderColor: pin2Color,
                    color: pin2Color,
                  }}
                  className="pin"
                  aria-label={t('console.pinTooltipAki', {
                    val: renalCheck?.band ?? '—',
                  })}
                  onClick={() => onPinClick?.('renal_prophylaxis')}
                >
                  2
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>
                  {t('console.pinTooltipAki', {
                    val: renalCheck?.band ?? '—',
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Pin 3: Region */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                style={{
                  top: '31%',
                  left: '41%',
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                }}
                className="pin"
                aria-label={t('console.pinTooltipRegion', {
                  val: regionDisplay,
                })}
                onClick={() => onPinClick?.('national_drl')}
              >
                3
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>
                {t('console.pinTooltipRegion', {
                  val: regionDisplay,
                })}
              </span>
            </TooltipContent>
          </Tooltip>
        </figure>

        {/* Legend */}
        <dl
          className="grid grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-border/40"
          data-id="stage.legend"
        >
          <div>
            <dt className="text-xs text-muted-foreground leading-snug">
              <span
                className="font-mono font-semibold me-1"
                style={{
                  color: hasResult ? pin1Color : 'var(--muted-foreground)',
                }}
              >
                1
              </span>
              {t('console.legendEgfr', { threshold: egfrLimit })}
            </dt>
            <dd
              className="font-mono text-[22px] leading-7 font-semibold mt-0.5"
              style={{
                color: hasResult && egfrVal !== null ? pin1Color : 'var(--muted-foreground)',
              }}
              dir="ltr"
            >
              {hasResult && egfrVal !== null ? egfrVal : '—'}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-muted-foreground leading-snug">
              <span className="font-mono font-semibold text-warning-strong me-1">2</span>
              {t('console.legendAkiRisk')}
            </dt>
            <dd
              className={cn(
                'font-mono text-[22px] leading-7 font-semibold mt-0.5 text-warning-strong',
                !hasResult && 'text-muted-foreground',
              )}
              dir="ltr"
            >
              {hasResult && renalCheck?.band ? renalCheck.band : '—'}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-muted-foreground leading-snug">
              <span className="font-mono font-semibold text-primary me-1">3</span>
              {t('console.legendRegion')}
            </dt>
            <dd className="text-sm font-semibold leading-snug mt-0.5" title={regionDisplay}>
              {regionDisplay}
            </dd>
          </div>
        </dl>
      </section>

      {/* Path to the device */}
      <section className="card p-5" aria-label={t('console.pathTitle')} data-id="stage.rail">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="font-semibold text-base">{t('console.pathTitle')}</p>
          {offline ? (
            <span className="chip chip-err">{t('connection.offline')}</span>
          ) : isSealed ? (
            <span className="chip chip-err">
              <Lock className="size-3" aria-hidden />
              {t('console.pathLocked')}
            </span>
          ) : isExecuted ? (
            <span className="chip chip-ok">
              <Check className="size-3" aria-hidden />
              {t('console.pathExecuted')}
            </span>
          ) : (
            <span className="chip text-muted-foreground">
              {t('connection.connected')}
            </span>
          )}
        </div>

        <ol className="rail-flow">
          <li className={getNodeClass(0)}>
            <span className="sym">C</span>
            <span className="what">MWL</span>
          </li>
          <li className={getNodeClass(1)}>
            <span className="sym">PP</span>
            <span className="what">eGFR</span>
          </li>
          <li className={getNodeClass(2)}>
            <span className="sym">M</span>
            <span className="what">Prose</span>
          </li>
          <li className={getNodeClass(3)}>
            <span className="sym">P</span>
            <span className="what">{isSealed ? 'Held' : 'Policy'}</span>
          </li>
          <li className={getNodeClass(4)}>
            <span className="sym">D</span>
            <span className="what">Device</span>
          </li>
          <li className={getNodeClass(5)}>
            <span className="sym">SINK</span>
            <span className="what">CT</span>
          </li>
        </ol>
      </section>
    </div>
  )
}
