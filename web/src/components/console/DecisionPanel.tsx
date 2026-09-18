import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckRow, CitationCard, VerdictBanner } from '@/components/primitives'
import { DoseComparison, HarmTimeline } from '@/components/viz'
import type { EvaluationResponse } from '@/types/api'

/**
 * What the policy node decided, and on whose authority.
 *
 * Checks render in the order the service returned them. WARN is never
 * collapsed: a warning is part of the decision, not a footnote to it.
 */
export interface DecisionPanelProps {
  result: EvaluationResponse
  /** Arrives after the decision. Null while pending or when the model is down. */
  explanation?: string | null
  explaining?: boolean
}

export function DecisionPanel({ result, explanation, explaining }: DecisionPanelProps) {
  const { t } = useTranslation()
  const { policy, device_response: device, privacy } = result

  // Both panels render only what a rule actually reported. No finding, no panel.
  const dose = policy.checks.find((c) => c.rule === 'national_drl')
  const renalFailed = policy.checks.some(
    (c) => c.rule === 'renal_prophylaxis' && c.status === 'FAIL',
  )
  const privacyFailed = policy.checks.some((c) =>
    ['health_data_minimisation', 'lawful_basis', 'cross_border'].includes(c.rule)
    && c.status === 'FAIL',
  )

  const doseReading = dose?.readings.find((r) => r.limit != null && r.measured > (r.limit ?? 0))
    ?? dose?.readings[0]

  let summary: string
  if (device.overridden_by) {
    summary = t('console.resultOverride')
  } else if (!policy.blocked && device.status === 200) {
    summary = t('console.resultSent')
  } else if (privacyFailed || device.session_terminated) {
    summary = t('console.resultBlockedPrivacy')
  } else if (dose?.status === 'FAIL' && doseReading?.limit != null) {
    summary = t('console.resultBlockedDose', {
      measured: doseReading.measured,
      unit: doseReading.unit,
      limit: doseReading.limit,
    })
  } else {
    summary = t('console.resultBlocked')
  }

  return (
    <div className="space-y-4">
      <p
        className={
          policy.blocked && !device.overridden_by
            ? 'rounded-md border border-danger-strong/40 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger-strong'
            : 'rounded-md border border-border bg-muted px-3 py-2 text-sm font-semibold text-foreground'
        }
      >
        {summary}
      </p>

      <VerdictBanner
        verdict={policy.verdict}
        action={policy.action}
        blocked={policy.blocked}
        httpStatus={device.status}
      >
        {(device.message ?? device.error) && (
          <p className="text-sm text-foreground/80">{device.message ?? device.error}</p>
        )}
      </VerdictBanner>

      {device.overridden_by && (
        <p className="rounded-md border border-warn-strong bg-warn/10 px-3 py-2 text-sm text-warn-strong">
          {t('console.overrideRecorded', { name: device.overridden_by })}
        </p>
      )}

      {dose && dose.readings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('viz.dose.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DoseComparison readings={dose.readings} breached={dose.status === 'FAIL'} />
          </CardContent>
        </Card>
      )}

      {renalFailed && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('viz.timeline.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <HarmTimeline />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('console.checks')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {policy.checks.map((check) => (
            <CheckRow key={check.rule} check={check} />
          ))}
        </CardContent>
      </Card>

      {(explaining || explanation || policy.explanation) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('console.explanation')}</CardTitle>
          </CardHeader>
          <CardContent>
            {explaining && !explanation ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <p className="text-sm text-foreground/80">
                {explanation ?? policy.explanation}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('console.citations')}{' '}
            <span className="font-mono text-sm text-muted-foreground">
              ({policy.citations.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {policy.citations.map((citation) => (
            <CitationCard key={citation.record_id} citation={citation} />
          ))}
        </CardContent>
      </Card>

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
