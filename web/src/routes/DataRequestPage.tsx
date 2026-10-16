import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { CheckRow, CitationCard, VerdictBanner } from '@/components/primitives'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { SamaamOfflineError, explainDecision } from '@/lib/api'
import { useRequestData, useScenarios } from '@/lib/queries'
import type { DataRequestBody, DataScenario, DataRequestResponse } from '@/types/api'

/**
 * The privacy path, kept deliberately apart from the console.
 *
 * The separation is the argument. A consultant may accept clinical risk for a
 * patient in their care, so a contrast block can be overridden. No clinician
 * holds authority to permit processing the PDPL forbids, so this one cannot.
 * Passing a consultant name here and watching it be refused is the point of
 * the screen.
 */

const BREACH: DataRequestBody = {
  actor: 'integration service account',
  action: 'Bulk export of oncology patient records to an external endpoint',
  stated_purpose: 'Targeted outreach for a private imaging centre campaign',
  record_count: 4200,
  destination_outside_kingdom: true,
  care_purpose: false,
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
      // The refusal first, the prose after. A hard security block must not
      // wait on a language model.
      const { result: response } = await submit.mutateAsync({
        ...body,
        request_id: 'DATA-REQ-UI',
        override_by: attemptOverride ? 'Dr. A. Alharbi, Consultant Radiologist' : null,
        explain: false,
      })
      setResult(response)
      setExplanation(null)
      explainDecision(response.policy).then(setExplanation).catch(() => setExplanation(null))
    } catch (error) {
      if (error instanceof SamaamOfflineError) setOffline(true)
      else throw error
    }
  }

  return (
    <>
      <PageHeader
        title={t('pages.data.title')}
        lead={t('pages.data.lead')}
        endpoint="POST /data/request"
      />

      {scenario && (
        <div className="mb-4">
          <Button size="sm" variant="outline" disabled={locked}
            onClick={() => { setBody(BREACH); setResult(null) }}>
            <span className="font-mono text-xs">{scenario.id}</span>
            <span className="ms-2">{t('data.loadBreach')}</span>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('data.request')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">{t('data.actor')}</Label>
              <Input value={body.actor} disabled={locked}
                onChange={(e) => patch({ actor: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">{t('data.action')}</Label>
              <Input value={body.action} disabled={locked}
                onChange={(e) => patch({ action: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">{t('data.purpose')}</Label>
              <Input value={body.stated_purpose} disabled={locked}
                onChange={(e) => patch({ stated_purpose: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">{t('data.recordCount')}</Label>
              <Input type="number" value={body.record_count ?? 0} disabled={locked}
                onChange={(e) => patch({ record_count: Number(e.target.value) })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">{t('data.outsideKingdom')}</Label>
              <Switch checked={body.destination_outside_kingdom ?? false} disabled={locked}
                onCheckedChange={(v) => patch({ destination_outside_kingdom: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">{t('data.carePurpose')}</Label>
              <Switch checked={body.care_purpose ?? false} disabled={locked}
                onCheckedChange={(v) => patch({ care_purpose: v })} />
            </div>
            <div className="rounded-md border border-warning-strong/40 bg-warning/5 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{t('data.attemptOverride')}</Label>
                <Switch checked={attemptOverride} disabled={locked}
                  onCheckedChange={setAttemptOverride} />
              </div>
              <p className="pt-1 text-xs text-muted-foreground">
                {t('data.attemptOverrideHint')}
              </p>
            </div>
            <Button className="w-full" size="lg" disabled={locked || submit.isPending}
              onClick={send}>
              {submit.isPending ? t('data.submitting') : t('data.submit')}
            </Button>
          </CardContent>
        </Card>

        <div className="min-w-0 flex flex-col gap-4">
          {offline && (
            <Card className="border-destructive-strong">
              <CardContent className="py-4 text-sm text-destructive-strong">
                {t('console.deviceOffline')}
              </CardContent>
            </Card>
          )}
          {!offline && !result && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                {t('data.awaiting')}
              </CardContent>
            </Card>
          )}
          {result && (
            <>
              <VerdictBanner
                verdict={result.policy.verdict}
                action={result.policy.action}
                blocked={result.policy.blocked}
                httpStatus={result.device_response.status}
              >
                {(result.device_response.message ?? result.device_response.error) && (
                  <p className="text-sm text-foreground/80">
                    {result.device_response.message ?? result.device_response.error}
                  </p>
                )}
              </VerdictBanner>
              {result.policy.blocked && !result.policy.overridable && (
                <div className="rounded-md border-2 border-destructive-strong bg-destructive/5 p-4">
                  <p className="font-semibold text-destructive-strong">{t('data.noOverride')}</p>
                  <p className="pt-1 text-sm text-foreground/80">{result.policy.override_reason}</p>
                </div>
              )}
              {result.device_response.session_terminated && (
                <p className="text-sm text-muted-foreground">{t('data.locked')}</p>
              )}
              {explanation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('console.explanation')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80">{explanation}</p>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader><CardTitle className="text-base">{t('console.checks')}</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {result.policy.checks.map((check) => (
                    <CheckRow key={check.rule} check={check} />
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('console.citations')}{' '}
                    <span className="font-mono text-sm text-muted-foreground">
                      ({result.policy.citations.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {result.policy.citations.map((citation) => (
                    <CitationCard key={citation.record_id} citation={citation} />
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  )
}
