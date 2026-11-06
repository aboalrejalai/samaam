import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { usePipelineTransit } from '@/components/pipeline'
import { DecisionPanel } from '@/components/console/DecisionPanel'
import { OverrideDialog } from '@/components/console/OverrideDialog'
import { PatientStage } from '@/components/console/PatientStage'
import { RequestForm } from '@/components/console/RequestForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExecuteOnDevice, useScenarios } from '@/lib/queries'
import { SamaamOfflineError, explainDecision } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { ClinicalScenario, EvaluationResponse, Patient, Requested } from '@/types/api'

/**
 * The technologist console (ported from boards/Console-A.dc.html).
 *
 * Page head with title and prepared cases, full-width verdict band,
 * and three columns: Request form, Patient stage with anatomical torso
 * and pipeline transit, and the Decision column with checks, dose meter,
 * explanation and references.
 */

const EMPTY_PATIENT: Patient = {
  sex: 'female',
  age: 60,
  weight_kg: 70,
  serum_creatinine_umol_l: null,
  egfr: null,
  on_metformin: false,
  aki: false,
  medications: [],
}

const EMPTY_REQUEST: Requested = {
  body_region: 'Abdomen and pelvis',
  kvp: 120,
  mas: 200,
  ctdivol_mgy: null,
  dlp_mgy_cm: null,
  contrast_agent: 'Iohexol',
  volume_ml: null,
  prophylaxis_ordered: false,
  metformin_held: false,
}

export default function ConsolePage() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const transit = usePipelineTransit()
  const { data: scenarios } = useScenarios()
  const execute = useExecuteOnDevice()

  const [patient, setPatient] = useState<Patient>(EMPTY_PATIENT)
  const [requested, setRequested] = useState<Requested>(EMPTY_REQUEST)
  const [loaded, setLoaded] = useState<string | null>(null)
  const [alternative, setAlternative] = useState<ClinicalScenario['safe_alternative']>(undefined)
  const [result, setResult] = useState<EvaluationResponse | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [explaining, setExplaining] = useState(false)
  const [offline, setOffline] = useState(false)
  const [highlightedRule, setHighlightedRule] = useState<string | null>(null)

  const useEnglish = i18n.resolvedLanguage === 'en'

  const clinical = (scenarios ?? []).filter(
    (s): s is ClinicalScenario => 'patient' in s && s.patient !== undefined,
  )

  useEffect(() => {
    const pulled = (location.state as { pulledPatient?: Patient } | null)?.pulledPatient
    if (!pulled) return
    setPatient((prev) => ({ ...prev, ...pulled }))
    setLoaded(null)
    setResult(null)
    setExplanation(null)
    transit.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  useEffect(() => {
    if (!result) return
    if (result.device_response.status === 200) transit.release()
    else transit.seal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  function loadScenario(scenario: ClinicalScenario) {
    setPatient({ ...scenario.patient })
    setRequested({ ...scenario.requested })
    setAlternative(scenario.safe_alternative)
    setLoaded(scenario.id)
    setResult(null)
    setExplanation(null)
    setOffline(false)
    transit.reset()
  }

  async function send(overrideBy?: string) {
    setOffline(false)
    setExplanation(null)
    transit.begin()
    try {
      const { result: response } = await execute.mutateAsync({
        worklist_id: loaded ? `MWL-${loaded}` : null,
        patient,
        requested,
        safe_alternative: alternative
          ? {
              ctdivol_mgy: Number(alternative.ctdivol_mgy) || null,
              dlp_mgy_cm: Number(alternative.dlp_mgy_cm) || null,
            }
          : null,
        override_by: overrideBy ?? null,
        explain: false,
      })
      setResult(response)

      setExplaining(true)
      explainDecision(response.policy)
        .then(setExplanation)
        .catch(() => setExplanation(null))
        .finally(() => setExplaining(false))

      const renal = response.policy.checks.find((c) => c.rule === 'renal_prophylaxis')
      const egfr = renal?.readings.find((r) => r.name === 'egfr')
      if (egfr) setPatient((prev) => ({ ...prev, egfr: egfr.measured }))
    } catch (error) {
      if (error instanceof SamaamOfflineError) {
        setOffline(true)
        transit.reset()
      } else throw error
    }
  }

  function handlePinClick(rule: string) {
    setHighlightedRule(rule)
    const el = document.getElementById(`check-${rule}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    setTimeout(() => setHighlightedRule(null), 2500)
  }

  const pending = execute.isPending

  // Breach checks for input styling
  const doseCheck = result?.policy.checks.find((c) => c.rule === 'national_drl')
  const ctdiBreached = doseCheck?.readings.some(
    (r) => r.name.toLowerCase().includes('ctdi') && r.limit !== null && r.measured > r.limit,
  )
  const dlpBreached = doseCheck?.readings.some(
    (r) => r.name.toLowerCase().includes('dlp') && r.limit !== null && r.measured > r.limit,
  )
  const renalCheck = result?.policy.checks.find((c) => c.rule === 'renal_prophylaxis')
  const egfrBreached = renalCheck?.status === 'FAIL'

  // Summary and detail for verdict band
  let verdictTitle = ''
  let verdictDetail = ''
  if (result) {
    const { policy, device_response: device } = result
    if (device.overridden_by) {
      verdictTitle = t('console.resultOverride')
      verdictDetail = t('console.overrideRecorded', { name: device.overridden_by })
    } else if (!policy.blocked && device.status === 200) {
      verdictTitle = t('console.resultSent')
      verdictDetail = t('verdict.COMPLIANT')
    } else if (policy.action === 'AUTHORISE') {
      verdictTitle = t('console.heldForRadiologist')
      const egfrVal = renalCheck?.readings.find((r) => r.name === 'egfr')?.measured ?? patient.egfr
      verdictDetail = egfrVal != null
        ? t('console.heldForRadiologistDetail', { egfr: egfrVal })
        : t('verdict.VIOLATION')
    } else {
      verdictTitle = t('console.resultBlocked')
      verdictDetail = t('verdict.VIOLATION')
    }
  }

  return (
    <div className="flex flex-col gap-5" id="console">
      {/* Page head: title and prepared-case buttons on the same row */}
      <div
        className="flex flex-wrap items-end justify-between gap-3 sm:gap-6"
        data-id="head"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('pages.console.title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t('pages.console.lead')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2" data-id="head.cases">
          <span className="text-xs text-muted-foreground">{t('console.scenarios')}:</span>
          {clinical.length === 0 && <Skeleton className="h-8 w-48" />}
          {clinical.map((scenario) => (
            <Button
              key={scenario.id}
              size="sm"
              variant={loaded === scenario.id ? 'default' : 'outline'}
              onClick={() => loadScenario(scenario)}
              disabled={pending}
            >
              <span className="font-mono text-xs" dir="ltr">
                {scenario.id}
              </span>
              <span className="ms-1.5">{useEnglish ? scenario.name_en : scenario.name}</span>
            </Button>
          ))}
        </div>
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
            <p className="verdict-title">{verdictTitle}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{verdictDetail}</p>
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
          {result.policy.blocked && result.policy.overridable && (
            <OverrideDialog
              reason={result.policy.override_reason}
              pending={pending}
              onConfirm={(name) => send(name)}
            >
              <button
                type="button"
                className="btn-warn ms-auto"
                data-id="verdict.override"
              >
                {t('console.overrideOpen')}
              </button>
            </OverrideDialog>
          )}
        </section>
      )}

      {/* Three columns grid: Form, Patient Stage, Decision */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(280px,300px)_minmax(0,1fr)_minmax(320px,370px)] gap-5 items-start"
        data-id="grid"
      >
        {/* Column 1: Request form */}
        <div className="min-w-0">
          <RequestForm
            patient={patient}
            requested={requested}
            disabled={pending}
            breaches={{
              ctdi: ctdiBreached,
              dlp: dlpBreached,
              egfr: egfrBreached,
            }}
            onSubmit={() => send()}
            onPatientChange={(patch) => setPatient((prev) => ({ ...prev, ...patch }))}
            onRequestedChange={(patch) => setRequested((prev) => ({ ...prev, ...patch }))}
          />
        </div>

        {/* Column 2: Patient stage (Torso model + Pipeline rail) */}
        <div className="min-w-0">
          <PatientStage
            worklistId={loaded ? `MWL-${loaded}` : null}
            patient={patient}
            requested={requested}
            result={result}
            transit={transit}
            offline={offline}
            onPinClick={handlePinClick}
          />
        </div>

        {/* Column 3: Decision column */}
        <div className="min-w-0">
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
                {t('console.awaiting')}
              </CardContent>
            </Card>
          )}
          {result && (
            <DecisionPanel
              result={result}
              explanation={explanation}
              explaining={explaining}
              highlightedRule={highlightedRule}
            />
          )}
        </div>
      </div>
    </div>
  )
}
