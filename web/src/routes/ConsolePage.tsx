import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { PageHeader } from '@/components/PageHeader'
import { PipelineRail, usePipelineTransit } from '@/components/pipeline'
import { DeviceSchematic } from '@/components/viz'
import { DecisionPanel } from '@/components/console/DecisionPanel'
import { OverrideDialog } from '@/components/console/OverrideDialog'
import { RequestForm } from '@/components/console/RequestForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExecuteOnDevice, useScenarios } from '@/lib/queries'
import { SamaamOfflineError, explainDecision } from '@/lib/api'
import type { ClinicalScenario, EvaluationResponse, Patient, Requested } from '@/types/api'

/**
 * The technologist console. The screen the whole product exists for.
 *
 * Its one job is to make a refusal legible in the seconds before someone
 * irradiates a patient, so the decision column and the rail are given the
 * space and the inputs are kept narrow.
 */

const EMPTY_PATIENT: Patient = {
  sex: 'female', age: 60, weight_kg: 70,
  serum_creatinine_umol_l: null, egfr: null,
  on_metformin: false, aki: false, medications: [],
}
const EMPTY_REQUEST: Requested = {
  body_region: 'abdomen_pelvis', kvp: 120, mas: 200,
  ctdivol_mgy: null, dlp_mgy_cm: null,
  contrast_agent: 'Iohexol', volume_ml: null,
  prophylaxis_ordered: false, metformin_held: false,
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

  const useEnglish = i18n.resolvedLanguage === 'en'

  const clinical = (scenarios ?? []).filter(
    (s): s is ClinicalScenario => 'patient' in s && s.patient !== undefined,
  )

  // A patient pulled over FHIR arrives in router state rather than storage:
  // it is one hand-off between two screens, not something to persist. The
  // request side is left untouched — the hospital sends who the patient is,
  // never what dose to give them.
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

  // The rail depicts what reached the device, so it follows the device's own
  // status — not policy.blocked, which stays true after an override and would
  // shut the valve on an acquisition that actually executed.
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
      // The decision only. Asking for the prose in the same call would put the
      // model's latency in front of the refusal, and the refusal is the point.
      const { result: response } = await execute.mutateAsync({
        worklist_id: loaded ? `MWL-${loaded}` : null,
        patient, requested,
        // Display context for the dose panel. No rule reads it.
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

      // The words follow. If they never arrive the decision still stands.
      setExplaining(true)
      explainDecision(response.policy)
        .then(setExplanation)
        .catch(() => setExplanation(null))
        .finally(() => setExplaining(false))
      // The server is the only source of eGFR, and it now reports it as a
      // number. This used to scrape it out of an English sentence with a
      // regex — one reworded detail string away from breaking silently.
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

  const pending = execute.isPending

  return (
    <>
      <PageHeader
        title={t('pages.console.title')}
        lead={t('pages.console.lead')}
        endpoint="POST /device/execute"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{t('console.scenarios')}:</span>
        {clinical.length === 0 && <Skeleton className="h-8 w-64" />}
        {clinical.map((scenario) => (
          <Button
            key={scenario.id}
            size="sm"
            variant={loaded === scenario.id ? 'default' : 'outline'}
            onClick={() => loadScenario(scenario)}
            disabled={pending}
          >
            <span className="font-mono text-xs">{scenario.id}</span>
            <span className="ms-2">{useEnglish ? scenario.name_en : scenario.name}</span>
          </Button>
        ))}
      </div>

      <DeviceSchematic
        state={result?.device_response.device_state ?? null}
        className="mb-6"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(340px,380px)_120px_minmax(0,1fr)]">
        <div className="space-y-4">
          <RequestForm
            patient={patient}
            requested={requested}
            riskBand={
              result?.policy.checks.find((c) => c.rule === 'renal_prophylaxis')?.band ?? null
            }
            disabled={pending}
            onPatientChange={(patch) => setPatient((prev) => ({ ...prev, ...patch }))}
            onRequestedChange={(patch) => setRequested((prev) => ({ ...prev, ...patch }))}
          />
          <Button className="w-full" size="lg" disabled={pending} onClick={() => send()}>
            {pending ? t('console.submitting') : t('console.submit')}
          </Button>
          {result?.policy.blocked && result.policy.overridable && (
            <OverrideDialog
              reason={result.policy.override_reason}
              pending={pending}
              onConfirm={(name) => send(name)}
            />
          )}
        </div>

        {/* Vertical beside the columns; horizontal above the decision when
            they stack, so the rail is never pushed below what it explains. */}
        <div className="hidden xl:block">
          <PipelineRail transit={transit} scarred={transit.scarred} className="sticky top-6" />
        </div>
        <div className="order-first xl:hidden">
          <PipelineRail transit={transit} scarred={transit.scarred} orientation="horizontal" />
        </div>

        <div className="min-w-0">
          {offline && (
            <Card className="border-danger-strong">
              <CardContent className="py-4 text-sm text-danger-strong">
                {t('console.deviceOffline')}
              </CardContent>
            </Card>
          )}
          {!offline && !result && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                {t('console.awaiting')}
              </CardContent>
            </Card>
          )}
          {result && (
            <DecisionPanel
              result={result}
              explanation={explanation}
              explaining={explaining}
            />
          )}
        </div>
      </div>
    </>
  )
}
