import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { SamaamOfflineError, explainDecision } from '@/lib/api'
import { useRequestData, useScenarios } from '@/lib/queries'
import { cn } from '@/lib/utils'
import type {
  Citation,
  DataRequestBody,
  DataRequestResponse,
  DataScenario,
  PolicyCheck,
} from '@/types/api'

/**
 * The privacy path (ported from boards/Data-A.dc.html).
 *
 * Verdict band across the full width, and three columns:
 * 1. Form with textareas for Action and Stated purpose so text does not clip.
 * 2. Center stage with /models/records.webp, record count and No clinical override path card.
 * 3. Checks and References.
 */

const BREACH: DataRequestBody = {
  actor: 'integration service account',
  action: 'Bulk export of oncology patient records to an external endpoint',
  stated_purpose: 'Targeted outreach for a private imaging centre campaign',
  record_count: 4200,
  destination_outside_kingdom: true,
  care_purpose: false,
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

export default function DataRequestPage() {
  const { t } = useTranslation()
  const { data: scenarios } = useScenarios()
  const submit = useRequestData()

  const [body, setBody] = useState<DataRequestBody>(BREACH)
  const [attemptOverride, setAttemptOverride] = useState(true)
  const [result, setResult] = useState<DataRequestResponse | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [offline, setOffline] = useState(false)

  const scenario = (scenarios ?? []).find(
    (s): s is DataScenario => 'request' in s && s.request !== undefined,
  )
  const locked = result?.blocked ?? false
  const patch = (next: Partial<DataRequestBody>) => setBody((prev) => ({ ...prev, ...next }))

  async function send() {
    setOffline(false)
    try {
      const { result: response } = await submit.mutateAsync({
        ...body,
        request_id: 'DATA-REQ-UI',
        override_by: attemptOverride ? 'Dr. A. Alharbi, Consultant Radiologist' : null,
        explain: false,
      })
      setResult(response)
      setExplanation(null)
      explainDecision(response.policy)
        .then(setExplanation)
        .catch(() => setExplanation(null))
    } catch (error) {
      if (error instanceof SamaamOfflineError) setOffline(true)
      else throw error
    }
  }

  return (
    <div className="flex flex-col gap-5" id="data">
      {/* Page head */}
      <div
        className="flex flex-wrap items-end justify-between gap-3 sm:gap-6"
        data-id="head"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('pages.data.title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t('pages.data.lead')}
          </p>
        </div>

        {scenario && (
          <Button
            size="sm"
            variant="outline"
            disabled={locked}
            onClick={() => {
              setBody(BREACH)
              setResult(null)
              setOffline(false)
            }}
          >
            <span className="font-mono text-xs" dir="ltr">
              {scenario.id}
            </span>
            <span className="ms-1.5">{t('data.loadBreach')}</span>
          </Button>
        )}
      </div>

      {/* Full-width verdict band: shown only once a result exists */}
      {result && (
        <section
          className={cn(
            'verdict',
            result.device_response.status === 200 && 'verdict-ok',
          )}
          aria-label={t('console.decision')}
          data-id="verdict"
        >
          <span className="verdict-code" dir="ltr">
            {result.device_response.status}
          </span>
          <div className="verdict-body">
            <p className="verdict-title">
              {result.device_response.status === 403
                ? t('data.refusedTitle')
                : t('console.resultSent')}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{t('data.locked')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5" data-id="verdict.tags">
            <span
              className={
                result.policy.verdict === 'VIOLATION' ? 'basis basis-law' : 'basis basis-protocol'
              }
              dir="ltr"
            >
              {result.policy.verdict}
            </span>
            <span
              className={
                result.policy.action === 'PROHIBITED' ? 'basis basis-law' : 'basis basis-protocol'
              }
              dir="ltr"
            >
              {result.policy.action}
            </span>
          </div>
        </section>
      )}

      {/* Three columns grid: Form, Center stage (Records + No override), Decision (Checks + Refs) */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)_minmax(320px,370px)] gap-5 items-start"
        data-id="grid"
      >
        {/* Column 1: Access request form */}
        <Card className="p-5" aria-label={t('data.request')} data-id="request">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="font-semibold text-base">{t('data.request')}</p>
            {locked && <span className="chip chip-err">{t('data.lockedStatus')}</span>}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">{t('data.actor')}</Label>
              <Input
                className="h-[38px] text-sm"
                value={body.actor}
                disabled={locked}
                onChange={(e) => patch({ actor: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">{t('data.action')}</Label>
              <textarea
                value={body.action}
                disabled={locked}
                rows={2}
                className="w-full rounded-md border border-border bg-card px-2.5 py-2 text-sm leading-snug resize-none disabled:bg-muted disabled:text-foreground"
                onChange={(e) => patch({ action: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">{t('data.purpose')}</Label>
              <textarea
                value={body.stated_purpose}
                disabled={locked}
                rows={2}
                className="w-full rounded-md border border-border bg-card px-2.5 py-2 text-sm leading-snug resize-none disabled:bg-muted disabled:text-foreground"
                onChange={(e) => patch({ stated_purpose: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">{t('data.recordCount')}</Label>
              <Input
                type="number"
                className="h-[38px] font-mono text-sm"
                value={body.record_count ?? 0}
                disabled={locked}
                onChange={(e) => patch({ record_count: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-3.5 mt-3.5 border-t border-border">
            <div className="flex items-center justify-between gap-3 min-h-8 text-sm">
              <span>{t('data.outsideKingdom')}</span>
              <Switch
                checked={body.destination_outside_kingdom ?? false}
                disabled={locked}
                onCheckedChange={(v) => patch({ destination_outside_kingdom: v })}
              />
            </div>
            <div className="flex items-center justify-between gap-3 min-h-8 text-sm">
              <span>{t('data.carePurpose')}</span>
              <Switch
                checked={body.care_purpose ?? false}
                disabled={locked}
                onCheckedChange={(v) => patch({ care_purpose: v })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-3.5 mt-3.5 border-t border-border">
            <div className="flex items-center justify-between gap-3 min-h-8 text-sm">
              <span>{t('data.attemptOverride')}</span>
              <Switch
                checked={attemptOverride}
                disabled={locked}
                onCheckedChange={setAttemptOverride}
              />
            </div>
            <p className="text-xs text-muted-foreground">{t('data.attemptOverrideHint')}</p>
          </div>

          <Button
            type="button"
            className="w-full mt-4"
            size="lg"
            disabled={locked || submit.isPending}
            onClick={send}
          >
            {submit.isPending ? t('data.submitting') : t('data.submit')}
          </Button>
        </Card>

        {/* Column 2: Center stage (Records + No override) */}
        <div className="flex flex-col gap-5 min-w-0" data-id="stage">
          <section
            className="card p-6 flex flex-col items-center gap-4 text-center"
            style={{
              background: 'linear-gradient(180deg, var(--sa-50), var(--card) 70%)',
            }}
            aria-label={t('data.request')}
            data-id="stage.records"
          >
            <img
              src="/models/records.webp"
              alt={t('models.recordsAlt')}
              className="w-full max-w-[330px] h-auto block"
              data-id="stage.model"
            />
            {result ? (
              <div>
                <p className="font-mono text-[44px] leading-[48px] font-semibold" dir="ltr">
                  {Number(body.record_count || 0).toLocaleString()}
                </p>
                <p className="font-semibold text-base mt-1">{t('data.recordsStayed')}</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  {t('data.recordsStayedDetail')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">{t('data.awaiting')}</p>
            )}
          </section>

          {result?.policy.blocked && !result.policy.overridable && (
            <section
              className="card p-5 flex flex-col gap-2"
              style={{
                background: 'var(--error-bg)',
                borderColor: 'var(--error-line)',
              }}
              aria-label={t('data.noOverride')}
              data-id="stage.override"
            >
              <p className="font-semibold text-base text-destructive-strong">
                {t('data.noOverride')}
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">
                {result.policy.override_reason || t('data.noOverrideDetail')}
              </p>
              {attemptOverride && (
                <div
                  className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-1 border-t"
                  style={{ borderColor: 'var(--error-line)' }}
                >
                  <span className="font-semibold text-sm">{t('data.consultantName')}</span>
                  <span
                    className="font-mono text-xs font-semibold text-destructive-strong"
                    dir="ltr"
                  >
                    OVERRIDE_REFUSED
                  </span>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Column 3: Checks and References */}
        <div className="flex flex-col gap-5 min-w-0 md:col-span-2 xl:col-span-1" data-id="decision">
          {offline && (
            <Card className="border-destructive-strong">
              <CardContent className="py-4 text-sm text-destructive-strong">
                {t('console.deviceOffline')}
              </CardContent>
            </Card>
          )}
          {!offline && !result && (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                {t('data.awaiting')}
              </CardContent>
            </Card>
          )}
          {result && (
            <>
              {/* Checks */}
              <Card className="p-5" aria-label={t('console.checks')} data-id="decision.checks">
                <p className="font-semibold text-base mb-3">{t('console.checks')}</p>
                <ul className="flex flex-col">
                  {result.policy.checks.map((check) => {
                    const ruleTitle = t(`rules.${check.rule}`, check.rule)
                    return (
                      <li key={check.rule} className="check">
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

              {/* Explanation (if provided) */}
              {explanation && (
                <Card className="p-5" aria-label={t('console.explanation')}>
                  <p className="font-semibold text-base mb-3">{t('console.explanation')}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{explanation}</p>
                </Card>
              )}

              {/* References */}
              {result.policy.citations.length > 0 && (
                <Card className="p-5" aria-label={t('console.citations')} data-id="decision.refs">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="font-semibold text-base">{t('console.citations')}</p>
                    <span className="chip chip-ok">
                      <Check className="size-3" aria-hidden />
                      <span>VERIFIED</span>
                    </span>
                  </div>
                  <ul className="flex flex-col">
                    {result.policy.citations.map((c: Citation) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
