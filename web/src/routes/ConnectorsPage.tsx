import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleDashed,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { APP_BASE } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useConnectorTest, useConnectors, useFhirPull } from '@/lib/queries'
import type { ConnectorCard, ConnectorTestResult } from '@/types/api'

/**
 * Connectors page (ported from boards/Connectors.dc.html).
 *
 * Premise card with the CT model, four device cards with model renders on pale blue tiles,
 * patient FHIR pull with before/after states, and dynamic deployment profiles.
 */

const CONNECTOR_IMAGES: Record<string, string> = {
  fhir: '/models/records.webp',
  mwl: '/models/valve.webp',
  modality: '/models/ct-scanner.webp',
  injector: '/models/injector.webp',
}

function getChipClass(state: ConnectorCard['state']) {
  switch (state) {
    case 'running':
    case 'configured':
    case 'discovered':
      return 'chip-ok'
    case 'stopped':
      return 'chip-warn'
    case 'error':
      return 'chip-err'
    default:
      return ''
  }
}

function TestOutcome({ result }: { result: ConnectorTestResult }) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'rounded-md border-s-2 px-3 py-2 text-xs mt-2',
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
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useConnectors()
  const test = useConnectorTest()
  const pull = useFhirPull()
  const [tested, setTested] = useState<Record<string, ConnectorTestResult>>({})
  const [patientId, setPatientId] = useState('137617795')

  const useArabic = i18n.resolvedLanguage === 'ar'

  function runTest(id: string) {
    test.mutate(id, { onSuccess: (result) => setTested((prev) => ({ ...prev, [id]: result })) })
  }

  return (
    <div className="flex flex-col gap-5" id="connectors">
      {/* Page head */}
      <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-6" data-id="head">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('pages.connectors.title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t('pages.connectors.lead')}
          </p>
        </div>
      </div>

      {/* Premise card with the CT model */}
      <Card
        className="p-5 sm:p-6 bg-gradient-to-r from-sa-50 to-card grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-6 items-center overflow-hidden border border-border"
        data-id="premise"
      >
        <p className="text-base leading-relaxed text-foreground">
          {t('connectors.premise')}
        </p>
        <img
          src="/models/ct-scanner.webp"
          alt="A CT scanner with an empty table."
          className="w-full max-h-[190px] object-contain mx-auto"
          data-id="premise.scanner"
        />
      </Card>

      {isLoading && <Skeleton className="h-64 w-full" />}
      {isError && (
        <Card className="border-destructive-strong">
          <CardContent className="py-4 text-sm text-destructive-strong">
            {t('connectors.offline')}
          </CardContent>
        </Card>
      )}

      {/* Four device cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-id="cards">
        {data?.connectors.map((connector) => {
          const chipClass = getChipClass(connector.state)
          const isOk = chipClass === 'chip-ok'
          return (
            <Card key={connector.id} className="p-4 border border-border" data-id={`card.${connector.id}`}>
              <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 items-start">
                <span className="w-24 h-24 flex items-center justify-center bg-primary-subtle rounded-xl overflow-hidden shrink-0">
                  <img
                    src={CONNECTOR_IMAGES[connector.id] ?? '/models/records.webp'}
                    alt=""
                    className="max-w-[84px] max-h-[84px] w-auto h-auto object-contain"
                  />
                </span>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold leading-tight text-foreground">
                      {t(`connectors.cards.${connector.id}`)}
                    </h2>
                    <span className={cn('chip ms-auto', chipClass)}>
                      {isOk && <Check className="size-3.5" aria-hidden />}
                      {connector.state === 'error' && <XCircle className="size-3.5" aria-hidden />}
                      {connector.state === 'stopped' && <AlertTriangle className="size-3.5" aria-hidden />}
                      {(connector.state === 'awaiting' || connector.state === 'local') && (
                        <CircleDashed className="size-3.5" aria-hidden />
                      )}
                      {t(`connectors.states.${connector.state}`)}
                    </span>
                  </div>
                  <p dir="ltr" className="font-mono text-xs text-muted-foreground">
                    {connector.standard}
                  </p>
                  <p dir="ltr" className="font-mono text-xs break-all text-foreground/80">
                    {connector.endpoint ?? t('connectors.noEndpoint')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(`connectors.notes.${connector.id}`)}
                  </p>
                  {connector.testable && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-fit mt-1 h-8 text-xs cursor-pointer"
                      disabled={test.isPending}
                      onClick={() => runTest(connector.id)}
                    >
                      {test.isPending && test.variables === connector.id
                        ? t('connectors.testing')
                        : t('connectors.test')}
                    </Button>
                  )}
                  {tested[connector.id] && <TestOutcome result={tested[connector.id]} />}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Pull a patient section */}
      <section className="card rounded-2xl border border-border p-5 sm:p-6" aria-label={t('connectors.pull.title')} data-id="pull">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-6 items-start">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-lg font-bold text-foreground">{t('connectors.pull.title')}</h2>
            <p className="text-xs text-muted-foreground">{t('connectors.pull.lead')}</p>
            <div className="flex flex-col gap-1.5 mt-1">
              <label htmlFor="fhir-id" className="text-xs font-medium text-muted-foreground">
                {t('connectors.pull.field')}
              </label>
              <Input
                id="fhir-id"
                dir="ltr"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                className="font-mono h-9"
              />
            </div>
            <Button
              size="sm"
              className="w-fit mt-1"
              disabled={pull.isPending || !patientId.trim()}
              onClick={() => pull.mutate(patientId.trim())}
            >
              {pull.isPending ? t('connectors.pull.pulling') : t('connectors.pull.submit')}
            </Button>
            {pull.isError && (
              <p className="text-xs text-destructive-strong mt-1">{t('connectors.pull.failed')}</p>
            )}
          </div>

          {/* Before pull: only muted prompt */}
          {!pull.data && !pull.isError && (
            <div className="flex items-center justify-center p-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl min-h-[140px]">
              {t('connectors.pull.prompt')}
            </div>
          )}

          {/* After pull: real readings */}
          {pull.data && (
            <div className="flex flex-col gap-3 min-w-0" data-id="pull.result">
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] gap-2.5 items-center">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">{t('connectors.pull.asSent')}</p>
                  <p dir="ltr" className="font-mono text-xl font-semibold text-foreground">
                    {pull.data.raw.creatinine?.value ?? '—'} {pull.data.raw.creatinine?.unit ?? ''}
                  </p>
                  <p dir="ltr" className="font-mono text-xs text-muted-foreground">
                    LOINC {pull.data.raw.creatinine?.loinc ?? '2160-0'}
                    {pull.data.raw.creatinine?.age_days != null && (
                      <span> · {t('connectors.pull.daysOld', { count: pull.data.raw.creatinine.age_days })}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-center text-muted-foreground">
                  <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
                </div>
                <div className="p-3 bg-primary-subtle rounded-lg">
                  <p className="text-xs text-muted-foreground">{t('connectors.pull.asComputed')}</p>
                  <p dir="ltr" className="font-mono text-xl font-semibold text-foreground">
                    {pull.data.patient.serum_creatinine_umol_l ?? '—'} µmol/L
                  </p>
                  <p dir="ltr" className="font-mono text-xs text-muted-foreground">
                    × {pull.data.raw.creatinine?.conversion_factor ?? '88.4'}
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
                <p className="text-xs text-muted-foreground">
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
                className="w-fit gap-1.5"
                onClick={() =>
                  navigate(APP_BASE, { state: { pulledPatient: pull.data.patient } })
                }
              >
                {t('connectors.pull.openInConsole')}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Deployment profiles */}
      {data && (
        <section className="card rounded-2xl border border-border p-5 sm:p-6" aria-label={t('connectors.sites.title')} data-id="sites">
          <h2 className="text-lg font-bold text-foreground">{t('connectors.sites.title')}</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t('connectors.sites.note')}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.site_profiles.map((site) => (
              <li key={site.id} className="p-3 border border-border rounded-lg bg-card">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  {useArabic ? site.name_ar : site.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {site.city} · {t('connectors.sites.pending')}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
