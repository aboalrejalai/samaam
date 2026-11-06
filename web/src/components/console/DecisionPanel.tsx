import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  MinusCircle,
  XCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Citation, EvaluationResponse, PolicyCheck, Reading } from '@/types/api'

export interface DecisionPanelProps {
  result: EvaluationResponse
  explanation?: string | null
  explaining?: boolean
  highlightedRule?: string | null
}

function CheckStatusIcon({ status }: { status: PolicyCheck['status'] }) {
  switch (status) {
    case 'FAIL':
      return <XCircle className="size-5 text-destructive-strong shrink-0 mt-0.5" aria-hidden />
    case 'WARN':
      return <AlertTriangle className="size-5 text-warning-strong shrink-0 mt-0.5" aria-hidden />
    case 'PASS':
      return <CheckCircle2 className="size-5 text-success-strong shrink-0 mt-0.5" aria-hidden />
    case 'NO_EVIDENCE':
      return <HelpCircle className="size-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
    default:
      return <MinusCircle className="size-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
  }
}

export function DecisionPanel({
  result,
  explanation,
  explaining,
  highlightedRule,
}: DecisionPanelProps) {
  const { t } = useTranslation()
  const { policy, privacy } = result

  const dose = policy.checks.find((c) => c.rule === 'national_drl')

  return (
    <div className="flex flex-col gap-5 min-w-0" data-id="decision">
      {/* Checks Card */}
      <Card className="p-5" aria-label={t('console.checks')} data-id="decision.checks">
        <p className="font-semibold text-base mb-3">{t('console.checks')}</p>
        <ul className="flex flex-col">
          {policy.checks.map((check) => {
            const ruleTitle = t(`rules.${check.rule}`, check.rule)
            const isHighlighted = highlightedRule === check.rule
            return (
              <li
                key={check.rule}
                id={`check-${check.rule}`}
                className={cn(
                  'check',
                  isHighlighted && 'bg-primary/10 rounded-md px-2 -mx-2 transition-colors duration-300',
                )}
              >
                <CheckStatusIcon status={check.status} />
                <div className="min-w-0">
                  <div className="check-top">
                    <span className="check-name">{ruleTitle}</span>
                    {check.basis && (
                      <span
                        dir="ltr"
                        className={
                          check.basis === 'STATUTORY'
                            ? 'basis basis-law'
                            : 'basis basis-protocol'
                        }
                      >
                        {check.basis}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">
                    {check.detail}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Dose against the national level */}
      {dose && dose.readings.length > 0 && (
        <Card className="p-5" aria-label={t('viz.dose.title')} data-id="decision.dose">
          <p className="font-semibold text-base mb-3">{t('viz.dose.title')}</p>
          <div className="flex flex-col gap-4">
            {dose.readings.map((r: Reading) => {
              const top = Math.max(r.measured, r.limit ?? 0, r.alternative ?? 0)
              const over = r.limit !== null && r.measured > r.limit
              const reqPct = top > 0 ? (r.measured / top) * 100 : 0
              const limPct = top > 0 && r.limit ? (r.limit / top) * 100 : 0
              const altPct = top > 0 && r.alternative ? (r.alternative / top) * 100 : 0

              return (
                <div key={r.name} className="flex flex-col">
                  <p className="text-xs font-semibold mb-1.5" dir="ltr">
                    {r.name}, {r.unit}
                  </p>

                  {/* Requested */}
                  <div className="meter">
                    <span className="text-muted-foreground">{t('viz.dose.requested')}</span>
                    <span className="meter-track">
                      <span
                        className={cn('meter-fill', over ? 'fill-breach' : 'bg-success')}
                        style={{ display: 'block', width: `${reqPct}%` }}
                      />
                    </span>
                    <span
                      dir="ltr"
                      className={cn(
                        'font-mono font-semibold text-end',
                        over ? 'text-destructive-strong' : 'text-foreground',
                      )}
                    >
                      {r.measured}
                    </span>
                  </div>

                  {/* National */}
                  {r.limit !== null && (
                    <div className="meter mt-1.5">
                      <span className="text-muted-foreground">{t('viz.dose.limit')}</span>
                      <span className="meter-track">
                        <span
                          className="meter-fill fill-limit"
                          style={{ display: 'block', width: `${limPct}%` }}
                        />
                      </span>
                      <span dir="ltr" className="font-mono text-end text-muted-foreground">
                        {r.limit}
                      </span>
                    </div>
                  )}

                  {/* Alternative */}
                  {r.alternative !== null && (
                    <div className="meter mt-1.5">
                      <span className="text-muted-foreground">{t('viz.dose.alternative')}</span>
                      <span className="meter-track">
                        <span
                          className="meter-fill fill-alt"
                          style={{ display: 'block', width: `${altPct}%` }}
                        />
                      </span>
                      <span dir="ltr" className="font-mono text-end text-foreground">
                        {r.alternative}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Explanation */}
      {(explaining || explanation || policy.explanation) && (
        <Card className="p-5" aria-label={t('console.explanation')} data-id="decision.explanation">
          <p className="font-semibold text-base mb-3">{t('console.explanation')}</p>
          {explaining && !explanation ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <p className="text-sm text-foreground/80 leading-relaxed">
              {explanation ?? policy.explanation}
            </p>
          )}
        </Card>
      )}

      {/* References */}
      {policy.citations.length > 0 && (
        <Card className="p-5" aria-label={t('console.citations')} data-id="decision.refs">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="font-semibold text-base">{t('console.citations')}</p>
            <span className="chip chip-ok">
              <Check className="size-3" aria-hidden />
              <span>VERIFIED</span>
            </span>
          </div>
          <ul className="flex flex-col">
            {policy.citations.map((c: Citation) => (
              <li key={c.record_id} className="ref">
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                    dir="ltr"
                  >
                    <span>{c.record_id}</span>
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : (
                  <span className="font-mono text-sm font-semibold" dir="ltr">
                    {c.record_id}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {c.authority}
                  {c.section ? ` · ${c.section}` : c.title ? ` · ${c.title}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Privacy line */}
      {privacy && (
        <p className="text-xs text-muted-foreground">
          {privacy.identifiers_removed.length
            ? t('console.privacy', { fields: privacy.identifiers_removed.join('، ') })
            : t('console.privacyNone')}
        </p>
      )}
    </div>
  )
}
