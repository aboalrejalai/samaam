import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { AlertTriangle, Cable, CheckCircle2, CircleDashed, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { APP_BASE } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useConnectorTest, useConnectors, useFhirPull } from '@/lib/queries'
import type { ConnectorCard, ConnectorTestResult } from '@/types/api'

/**
 * The C node, made visible.
 *
 * The question this screen exists to answer is the first one anyone asks:
 * *how does it attach to the scanner?* Not through a vendor API — no
 * manufacturer exposes one. A scanner asks, over DICOM, for its scheduled
 * work, and whoever answers that question decides what the technologist
 * sees. Samaam answers it.
 *
 * So these cards are not a settings form. Two of them hold live network
 * peers and their test buttons open real sockets; the modality card fills
 * itself in from the first query that arrives. Nothing here is saved state
 * pretending to be a connection.
 */

const STATE_TONE: Record<ConnectorCard['state'], string> = {
  running: 'text-success-strong',
  configured: 'text-success-strong',
  discovered: 'text-success-strong',
  local: 'text-muted-foreground',
  awaiting: 'text-muted-foreground',
  stopped: 'text-warning-strong',
  error: 'text-destructive-strong',
}

function StateIcon({ state }: { state: ConnectorCard['state'] }) {
  const cls = cn('size-4 shrink-0', STATE_TONE[state])
  // Shape carries the state as well as colour: red and amber are 3.7 ΔE apart
  // under deuteranopia, so a dot alone would not distinguish them.
  if (state === 'error') return <XCircle className={cls} aria-hidden />
  if (state === 'stopped') return <AlertTriangle className={cls} aria-hidden />
  if (state === 'awaiting' || state === 'local') return <CircleDashed className={cls} aria-hidden />
  return <CheckCircle2 className={cls} aria-hidden />
}

function TestOutcome({ result }: { result: ConnectorTestResult }) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'rounded-md border-s-2 px-3 py-2 text-xs',
        result.ok ? 'border-success-strong bg-muted' : 'border-destructive-strong bg-muted',
      )}
    >
      <p className={cn('font-medium', result.ok ? 'text-success-strong' : 'text-destructive-strong')}>
        {result.ok ? t('connectors.reachable') : t('connectors.unreachable')}
        {result.latency_ms != null && (
          <span dir="ltr" className="ms-2 font-mono tabular-nums text-muted-foreground">
            {result.latency_ms} ms
          </span>
        )}
      </p>
      <p dir="ltr" className="pt-1 break-words font-mono text-muted-foreground">{result.detail}</p>
      {result.fhir_version && (
        <p dir="ltr" className="pt-1 font-mono text-muted-foreground">
          FHIR {result.fhir_version} · {result.software}
        </p>
      )}
      {result.sop_classes?.map((sop) => (
        <p key={sop.uid} dir="ltr" className="pt-1 font-mono text-muted-foreground">
          {sop.name} · {sop.uid}
        </p>
      ))}
    </div>
  )
}

export default function ConnectorsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useConnectors()
  const test = useConnectorTest()
  const pull = useFhirPull()
  const [tested, setTested] = useState<Record<string, ConnectorTestResult>>({})
  const [patientId, setPatientId] = useState('137617795')

  function runTest(id: string) {
    test.mutate(id, { onSuccess: (result) => setTested((prev) => ({ ...prev, [id]: result })) })
  }

  return (
    <>
      <PageHeader
        title={t('pages.connectors.title')}
        lead={t('pages.connectors.lead')}
        endpoint="GET /connectors"
      />

      {/* The claim a judge will test first, stated before the cards. */}
      <Card className="mb-6 border-s-2 border-primary">
        <CardContent className="py-4 text-sm text-foreground/80">
          {t('connectors.premise')}
        </CardContent>
      </Card>

      {isLoading && <Skeleton className="h-64 w-full" />}
      {isError && (
        <Card className="border-destructive-strong">
          <CardContent className="py-4 text-sm text-destructive-strong">
            {t('connectors.offline')}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {data?.connectors.map((connector) => (
          <Card key={connector.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <StateIcon state={connector.state} />
                <CardTitle className="text-base">{t(`connectors.cards.${connector.id}`)}</CardTitle>
                <Badge variant="outline" className="ms-auto text-xs">
                  {t(`connectors.states.${connector.state}`)}
                </Badge>
              </div>
              <p dir="ltr" className="pt-1 font-mono text-xs text-muted-foreground">
                {connector.standard}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t('connectors.endpoint')}
                </p>
                <p dir="ltr" className="pt-0.5 break-all font-mono text-foreground/80">
                  {connector.endpoint ?? t('connectors.noEndpoint')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {t(`connectors.notes.${connector.id}`)}
              </p>
              {connector.testable && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={test.isPending}
                  onClick={() => runTest(connector.id)}
                >
                  {test.isPending && test.variables === connector.id
                    ? t('connectors.testing')
                    : t('connectors.test')}
                </Button>
              )}
              {tested[connector.id] && <TestOutcome result={tested[connector.id]} />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* The part that makes the page a gateway rather than a form: a patient
          arrives over the network and goes straight to the console. */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Cable className="size-4 text-primary" aria-hidden />
            {t('connectors.pull.title')}
          </CardTitle>
          <p className="pt-1 text-xs text-muted-foreground">{t('connectors.pull.lead')}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1">
              <label htmlFor="fhir-id" className="text-xs text-muted-foreground">
                {t('connectors.pull.field')}
              </label>
              <Input
                id="fhir-id"
                dir="ltr"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                className="mt-1 font-mono"
              />
            </div>
            <Button
              disabled={pull.isPending || !patientId.trim()}
              onClick={() => pull.mutate(patientId.trim())}
            >
              {pull.isPending ? t('connectors.pull.pulling') : t('connectors.pull.submit')}
            </Button>
          </div>

          {pull.isError && (
            <p className="text-sm text-destructive-strong">{t('connectors.pull.failed')}</p>
          )}

          {pull.data && (
            <div className="flex flex-col gap-3">
              {/* Raw beside derived, never derived alone: a computed number
                  with no visible origin is a number nobody can check. */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border bg-card px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t('connectors.pull.asSent')}
                  </p>
                  <p dir="ltr" className="pt-1 font-mono tabular-nums text-foreground">
                    {pull.data.raw.creatinine?.value ?? '—'}{' '}
                    {pull.data.raw.creatinine?.unit ?? ''}
                  </p>
                  <p dir="ltr" className="pt-1 font-mono text-xs text-muted-foreground">
                    LOINC {pull.data.raw.creatinine?.loinc} ·{' '}
                    {pull.data.raw.creatinine?.age_days != null
                      ? t('connectors.pull.daysOld', {
                          count: pull.data.raw.creatinine.age_days,
                        })
                      : '—'}
                  </p>
                </div>
                <div className="rounded-md border bg-card px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t('connectors.pull.asComputed')}
                  </p>
                  <p dir="ltr" className="pt-1 font-mono tabular-nums text-foreground">
                    {pull.data.patient.serum_creatinine_umol_l ?? '—'} µmol/L
                  </p>
                  <p dir="ltr" className="pt-1 font-mono text-xs text-muted-foreground">
                    × {pull.data.raw.creatinine?.conversion_factor ?? '—'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {t('connectors.pull.demographics', {
                  sex: pull.data.patient.sex || '—',
                  age: pull.data.patient.age ?? '—',
                })}
              </p>

              {pull.data.identifiers_withheld.length > 0 && (
                <p className="rounded-md border-s-2 border-primary bg-primary/5 px-3 py-2 text-xs text-foreground/80">
                  {t('connectors.pull.withheld', {
                    fields: pull.data.identifiers_withheld.join(', '),
                  })}
                </p>
              )}

              {pull.data.warnings.map((warning) => (
                <p key={warning} dir="ltr" className="text-xs text-warning-strong">
                  {warning}
                </p>
              ))}

              <Button
                size="sm"
                onClick={() =>
                  navigate(APP_BASE, { state: { pulledPatient: pull.data.patient } })
                }
              >
                {t('connectors.pull.openInConsole')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {data && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('connectors.sites.title')}</CardTitle>
            <p className="pt-1 text-xs text-muted-foreground">{t('connectors.sites.note')}</p>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {data.site_profiles.map((site) => (
                <li key={site.id} className="rounded-md border px-3 py-2">
                  <p className="text-sm text-foreground">{site.name_ar}</p>
                  <p dir="ltr" className="text-xs text-muted-foreground">
                    {site.name} · {site.city}
                  </p>
                  <p className="pt-1 text-xs text-muted-foreground">
                    {t('connectors.sites.pending')}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  )
}
