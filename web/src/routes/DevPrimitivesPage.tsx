import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import {
  DeviceSchematic, DoseComparison, HarmTimeline, RiskScale,
} from '@/components/viz'
import {
  BasisBadge,
  CheckRow,
  CitationCard,
  Measured,
  StatusIcon,
  VerdictBanner,
  VerificationChip,
} from '@/components/primitives'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  BASES,
  CHECK_STATUSES,
  VERDICTS,
  VERIFICATIONS,
  type Citation,
  type PolicyCheck,
} from '@/types/api'

/**
 * Phase 1's gate: every primitive in every state, on one page.
 *
 * The fixtures below are shaped like real responses but are written here, not
 * fetched, so the gallery renders with the service down. They are illustrative
 * strings only — the citation text is genuinely from the corpus, the check
 * details are abbreviated.
 */

const CHECK_FIXTURES: Record<PolicyCheck['status'], PolicyCheck> = {
  FAIL: {
    rule: 'national_drl',
    status: 'FAIL',
    action: 'AUTHORISE',
    detail:
      'CTDIvol 18.0 mGy exceeds the national level of 14.0 mGy; DLP 900 mGy-cm exceeds the national level of 706 mGy-cm. Compliance is binding on healthcare providers under Royal Decree 60057 approving Saudi Health Council Resolution 3/88.',
    basis: 'STATUTORY',
    cites: ['SFDA-MDS-G008-DRL', 'SFDA-DRL-BINDING'],
    readings: [],
    band: null,
  },
  WARN: {
    rule: 'nephrotoxic_meds',
    status: 'WARN',
    action: 'CONFIRM',
    detail:
      'Nephrotoxic agents present at eGFR < 30.0: oxaliplatin (active FOLFOX regimen), ibuprofen PRN. The protocol advises withholding non-essential agents 24-48 hours before and 48 hours after exposure where clinically feasible.',
    basis: 'NATIONAL_PROTOCOL',
    cites: ['MOH-CM-NEPHROTOXIC'],
    readings: [],
    band: null,
  },
  PASS: {
    rule: 'renal_prophylaxis',
    status: 'PASS',
    action: 'PROCEED',
    detail:
      'eGFR 81.4 >= 30.0. Prophylaxis is not indicated for stable renal function. CA-AKI risk in this band ≈5%.',
    basis: 'NATIONAL_PROTOCOL',
    cites: ['MOH-CM-PROPHYLAXIS', 'MOH-CM-RISK-BANDS'],
    readings: [],
    band: null,
  },
  NO_EVIDENCE: {
    rule: 'renal_prophylaxis',
    status: 'NO_EVIDENCE',
    action: 'AUTHORISE',
    detail:
      'No eGFR available. The MOH protocol requires eGFR-based screening before contrast administration; the decision cannot be made without it.',
    basis: null,
    cites: ['MOH-CM-PROPHYLAXIS', 'MOH-CM-SCREENING'],
    readings: [],
    band: null,
  },
  NOT_APPLICABLE: {
    rule: 'metformin',
    status: 'NOT_APPLICABLE',
    action: 'PROCEED',
    detail: 'Patient is not on metformin, or no contrast requested.',
    basis: null,
    cites: ['MOH-CM-METFORMIN'],
    readings: [],
    band: null,
  },
}

const CITATION_FIXTURES: Citation[] = [
  {
    record_id: 'SFDA-MDLAW-M54',
    title: 'Medical Devices Law, Royal Decree M/54',
    authority: 'SFDA / Council of Ministers',
    section: 'Legal basis of the MDMA framework',
    content:
      'MDS-REQ1 expressly bases the Medical Device Marketing Authorization framework on the Medical Devices Law issued by Royal Decree M/54 and its Implementing Regulation.',
    url: 'https://www.sfda.gov.sa/en/regulations/68759',
  },
  {
    record_id: 'PDPL-ART1-13-AR',
    title: 'نظام حماية البيانات الشخصية — المادة الأولى (13)',
    authority: 'هيئة الخبراء بمجلس الوزراء',
    section: 'تعريف البيانات الحساسة',
    content:
      'البيانات الحساسة: كل بيانات شخصية تتضمن إشارة إلى أصل الفرد العرقي أو القبلي، أو معتقده الديني أو الفكري أو السياسي، أو تدل على عضويته في جمعيات أو مؤسسات أهلية، وكذلك البيانات الجنائية والأمنية، أو بيانات السمات الحيوية، أو البيانات الوراثية، أو البيانات الصحية.',
    url: 'https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/b7cfae89-828e-4994-b167-adaa00e37188/1',
  },
  {
    record_id: 'MOH-CM-PROPHYLAXIS',
    title: 'MOH contrast media protocol — renal prophylaxis',
    authority: 'Ministry of Health',
    section: 'Section 5.2, pp. 22, 28',
    content:
      'Prophylaxis is indicated where eGFR is below 30 mL/min/1.73m² and the patient is not on maintenance dialysis.',
    url: '',
  },
  {
    record_id: 'MOH-CM-DRAFT-ONLY',
    title: '',
    authority: '',
    section: '',
    error: 'record is not VERIFIED; not citable',
  },
]

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className=" text-lg font-semibold text-foreground">{title}</h2>
        {note !== undefined && <p className="max-w-prose text-xs text-muted-foreground">{note}</p>}
      </div>
      <Separator />
      {children}
    </section>
  )
}

export default function DevPrimitivesPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('pages.primitives.title')} lead={t('pages.primitives.lead')} />

      <div className="flex flex-col gap-8">
        <Section
          title="Measured"
          note="Monospace with tabular figures. Passing a limit renders value / limit and colours the excess. No threshold is computed here."
        >
          <Card size="sm" className="rounded-md ring-0 shadow-ring">
            <CardContent className="flex flex-wrap items-end gap-x-8 gap-y-4 px-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">neutral, sm</span>
                <Measured value="120" unit="kVp" size="sm" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">neutral, md</span>
                <Measured value="260" unit="mAs" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">within limit</span>
                <Measured value="9.5" limit="12.0" unit="mGy" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">over limit</span>
                <Measured value="18.0" limit="14.0" unit="mGy" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">over limit</span>
                <Measured value="900" limit="706" unit="mGy-cm" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">lg — the eGFR slot</span>
                <Measured value="19.1" unit="mL/min/1.73m²" size="lg" state="over" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">alignment check</span>
                <span className="flex flex-col">
                  <Measured value="18.0" unit="mGy" />
                  <Measured value="14.0" unit="mGy" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="BasisBadge"
          note="Filled with 4px corners, outlined pill, bare text. Print this page in greyscale: the three must still read apart."
        >
          <Card size="sm" className="rounded-md ring-0 shadow-ring">
            <CardContent className="flex flex-wrap items-center gap-4 px-3">
              {BASES.map((basis) => (
                <div key={basis} className="flex flex-col items-start gap-1">
                  <code dir="ltr" className="font-mono text-xs text-muted-foreground">
                    {basis}
                  </code>
                  <BasisBadge basis={basis} />
                </div>
              ))}
            </CardContent>
            <CardContent className="px-3">
              <div className="grayscale">
                <p className="mb-2 text-xs text-muted-foreground">
                  The same three with colour removed:
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  {BASES.map((basis) => (
                    <BasisBadge key={basis} basis={basis} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="VerdictBanner"
          note="Six verdicts. VIOLATION carries HTTP 403 in monospace; POTENTIAL_GAP and INSUFFICIENT_EVIDENCE read as deliberate verdicts, not errors, and carry the referral line."
        >
          <div className="grid gap-3 lg:grid-cols-2">
            {VERDICTS.map((verdict) => (
              <VerdictBanner
                key={verdict}
                verdict={verdict}
                blocked={verdict !== 'COMPLIANT'}
              />
            ))}
          </div>
        </Section>

        <Section
          title="StatusIcon"
          note="The outline distinguishes before the colour does: circled tick, octagon, triangle, queried circle, dash."
        >
          <Card size="sm" className="rounded-md ring-0 shadow-ring">
            <CardContent className="flex flex-wrap items-center gap-6 px-3">
              {CHECK_STATUSES.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <StatusIcon status={status} />
                  <code dir="ltr" className="font-mono text-xs text-muted-foreground">
                    {status}
                  </code>
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>

        <Section
          title="CheckRow"
          note="Nothing collapses, WARN least of all. Every status in the order the policy node can produce them."
        >
          <div className="flex flex-col gap-3">
            {CHECK_STATUSES.map((status) => (
              <CheckRow key={status} check={CHECK_FIXTURES[status]} />
            ))}
          </div>
        </Section>

        <Section
          title="CitationCard"
          note="Authority, title, section, the passage as issued, and a link that opens the document. An English provision keeps dir=ltr inside the Arabic UI and an Arabic one keeps dir=rtl inside the English UI. The last card is a record the server declined to cite."
        >
          <div className="grid gap-3 lg:grid-cols-2">
            {CITATION_FIXTURES.map((citation) => (
              <CitationCard key={citation.record_id} citation={citation} />
            ))}
          </div>
        </Section>

        <Section title="VerificationChip" note="Verified, pending, unverified.">
          <Card size="sm" className="rounded-md ring-0 shadow-ring">
            <CardHeader className="px-3">
              <CardTitle className="text-sm">All three states</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4 px-3">
              {VERIFICATIONS.map((verification) => (
                <div key={verification} className="flex flex-col items-start gap-1">
                  <code dir="ltr" className="font-mono text-xs text-muted-foreground">
                    {verification}
                  </code>
                  <VerificationChip verification={verification} />
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Visualisations</h2>
        <p className="text-sm text-muted-foreground">
          Each renders a number the policy node cited. Print this in greyscale:
          every band, bar and stop carries its own label, so nothing depends on
          colour alone.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">RiskScale — high</CardTitle></CardHeader>
            <CardContent>
              <RiskScale value={19.1} band="≈30%" threshold={30}
                provenance="CKD-EPI, as the MOH protocol prescribes (p. 21)" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">RiskScale — low</CardTitle></CardHeader>
            <CardContent>
              <RiskScale value={81.4} band="≈5%" threshold={30} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">RiskScale — pending</CardTitle></CardHeader>
            <CardContent><RiskScale value={null} /></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">HarmTimeline</CardTitle></CardHeader>
            <CardContent><HarmTimeline /></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">DoseComparison — breached, with alternative</CardTitle></CardHeader>
          <CardContent>
            <DoseComparison breached readings={[
              { name: 'ctdivol', measured: 18, unit: 'mGy', limit: 14, alternative: 13 },
              { name: 'dlp', measured: 900, unit: 'mGy-cm', limit: 706, alternative: 660 },
            ]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">DoseComparison — within</CardTitle></CardHeader>
          <CardContent>
            <DoseComparison breached={false} readings={[
              { name: 'ctdivol', measured: 9.5, unit: 'mGy', limit: 12, alternative: null },
              { name: 'dlp', measured: 365, unit: 'mGy-cm', limit: 430, alternative: null },
            ]} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          {(['LOCKED', 'EXECUTED', 'ARMED', null] as const).map((s) => (
            <div key={String(s)} className="flex flex-col gap-1">
              <p className="font-mono text-xs text-muted-foreground">
                DeviceSchematic — {s ?? 'no request yet'}
              </p>
              <DeviceSchematic state={s} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
