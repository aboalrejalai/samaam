/**
 * Wire types for the Samaam FastAPI service on :8000.
 *
 * Mirrors app/main.py, app/policy_node.py and app/device_api.py. Every field
 * here exists on the wire; nothing is inferred or convenient. The frontend
 * never recomputes a threshold or a verdict — it renders what arrived.
 */

/* ── ITU-T Y.3172 nodes ──────────────────────────────────────────────── */

export const PIPELINE_NODES = ['SRC', 'C', 'PP', 'M', 'P', 'D', 'SINK'] as const
export type PipelineNode = (typeof PIPELINE_NODES)[number]

/* ── The six verdicts (app/policy_node.py :: Verdict) ────────────────── */

export const VERDICTS = [
  'COMPLIANT',
  'VIOLATION',
  'AMBIGUITY',
  'CONFLICT',
  'POTENTIAL_GAP',
  'INSUFFICIENT_EVIDENCE',
] as const
export type Verdict = (typeof VERDICTS)[number]

/** Verdicts the plan forbids auto-approving; they route to a human. */
export const HUMAN_IN_THE_LOOP_VERDICTS = [
  'POTENTIAL_GAP',
  'INSUFFICIENT_EVIDENCE',
] as const satisfies readonly Verdict[]

/* ── What the system does (app/policy_node.py :: Action) ─────────────── */

/**
 * Separate from the verdict on purpose. The verdict is a regulatory
 * classification; the action is what happens at the console.
 *
 * Added after review by a consultant radiologist: no eGFR value forbids
 * iodinated contrast outright, and a system that says PROHIBITED at a lab
 * number is substituting itself for the clinician. Samaam holds until an
 * authorised person reviews; it does not decide in their place.
 */
export const ACTIONS = ['PROCEED', 'CONFIRM', 'AUTHORISE', 'PROHIBITED'] as const
export type Action = (typeof ACTIONS)[number]

/* ── Strength of authority (app/policy_node.py :: Basis) ─────────────── */

export const BASES = ['STATUTORY', 'NATIONAL_PROTOCOL', 'CLINICAL_GUIDANCE'] as const
export type Basis = (typeof BASES)[number]

/* ── Per-rule outcome (app/policy_node.py :: Status) ─────────────────── */

export const CHECK_STATUSES = [
  'PASS',
  'FAIL',
  'WARN',
  'NOT_APPLICABLE',
  'NO_EVIDENCE',
] as const
export type CheckStatus = (typeof CHECK_STATUSES)[number]

/* ── Knowledge base ─────────────────────────────────────────────────── */

export const VERIFICATIONS = ['VERIFIED', 'UNVERIFIED', 'PENDING'] as const
export type Verification = (typeof VERIFICATIONS)[number]

/** A resolved citation as attached by node D. */
export interface Citation {
  record_id: string
  title?: string
  authority?: string
  section?: string
  url?: string
  content?: string
  /** Present instead of the text when the record is missing or not citable. */
  error?: string
}

/**
 * A record as the service returns it. The key is `record_id`, not `id` — that
 * is the stable citation handle the policy node blocks by, and it is what the
 * wire carries. Verified against GET /kb/search and GET /kb/record.
 */
export interface KbRecord {
  record_id: string
  title: string
  authority: string
  section: string
  content: string
  url: string
  year?: number
  /** Spelled `language` on the wire. */
  language?: string
  verification: Verification
  category?: string
  node?: PipelineNode
  note?: string
  /** How the chunk entered the corpus: a curated record, a gap, or PDF text. */
  kind?: 'record' | 'gap' | 'source_chunk'
  basis?: Basis | null
}

export interface KbSearchHit extends KbRecord {
  similarity: number
}

export const KB_COLLECTIONS = ['policies', 'sources', 'gaps'] as const
export type KbCollection = (typeof KB_COLLECTIONS)[number]

export interface KbSearchResponse {
  query: string
  collection: KbCollection
  count: number
  results: KbSearchHit[]
}

export interface KbGap {
  id: string
  title: string
  finding: string
  implication: string
  recommendation: string
}

/* ── Health ─────────────────────────────────────────────────────────── */

export interface HealthResponse {
  status: string
  notice: string
  knowledge_base: {
    policies: number
    gaps: number
    source_chunks: number
  }
  embedding: {
    model: string
    local: boolean
  }
  model: {
    reachable: boolean
    detail: string
    note: string
  }
}

/* ── Evaluation request (app/main.py :: EvaluationRequest) ───────────── */

export interface Patient {
  sex: string
  age: number
  weight_kg?: number | null
  serum_creatinine_umol_l?: number | null
  egfr?: number | null
  egfr_method?: string | null
  on_metformin?: boolean
  aki?: boolean
  maintenance_dialysis?: boolean
  medications?: string[]
  diagnosis?: string | null
}

export interface Requested {
  study?: string | null
  body_region: string
  kvp?: number | null
  mas?: number | null
  ctdivol_mgy?: number | null
  dlp_mgy_cm?: number | null
  contrast_agent?: string | null
  iodine_mg_per_ml?: number | null
  volume_ml?: number | null
  flow_rate_ml_s?: number | null
  prophylaxis_ordered?: boolean
  metformin_held?: boolean
}

/** Display context for the dose panel. No rule reads it. */
export interface SafeAlternativeInput {
  ctdivol_mgy?: number | null
  dlp_mgy_cm?: number | null
}

export interface EvaluationRequest {
  worklist_id?: string | null
  patient: Patient
  requested: Requested
  safe_alternative?: SafeAlternativeInput | null
  /** Name of the consultant accepting the risk. Refused when not overridable. */
  override_by?: string | null
  explain?: boolean
}

/* ── Policy decision (app/policy_node.py :: Decision.to_dict) ───────── */

/**
 * One measurement and the limit it was checked against. Both come from the
 * server — the browser never derives a threshold, and a chart drawn from these
 * shows what the policy node actually cited rather than re-deriving it.
 */
export interface Reading {
  name: string
  measured: number
  unit: string
  /** Null where no published text sets a limit for this case. */
  limit: number | null
  /** A lower-dose option the scenario proposes. Display only. */
  alternative: number | null
}

export interface PolicyCheck {
  rule: string
  status: CheckStatus
  detail: string
  basis: Basis | null
  /** What clearing this particular finding requires. */
  action: Action
  cites: string[]
  /** Descriptive only. Populated after the rule has already decided. */
  readings: Reading[]
  /** The risk band as the source document names it, e.g. "≈30%". */
  band: string | null
}

export interface PolicyPayload {
  verdict: Verdict
  /** The severest action across all checks. */
  action: Action
  blocked: boolean
  overridable: boolean
  override_reason: string
  checks: PolicyCheck[]
  citations: Citation[]
  /** Drafted by node M. Absent when `explain: false` was requested. */
  explanation?: string
}

export const DEVICE_STATES = ['IDLE', 'ARMED', 'EXECUTED', 'LOCKED'] as const
export type DeviceState = (typeof DEVICE_STATES)[number]

export interface DeviceResponse {
  status: number
  worklist_id?: string
  device_state?: DeviceState
  message?: string
  error?: string
  overridden_by?: string
  session_terminated?: boolean
  decision?: PolicyPayload & {
    override_refused?: boolean
    override_refused_reason?: string
    worklist_id?: string
  }
}

export interface EvaluationResponse {
  verdict: Verdict
  blocked: boolean
  device_response: DeviceResponse
  policy: PolicyPayload
  privacy?: {
    identifiers_removed: string[]
    note: string
  }
}

/* ── Data request path (app/main.py :: DataRequest) ──────────────────── */

export interface DataRequestBody {
  request_id?: string | null
  actor: string
  action: string
  stated_purpose: string
  record_count?: number
  destination_outside_kingdom?: boolean
  care_purpose?: boolean
  /** False returns the decision alone; the prose is fetched from /explain. */
  explain?: boolean
  /** Passed deliberately in scenario 3 to demonstrate that it is refused. */
  override_by?: string | null
}

export interface DataRequestResponse {
  verdict: Verdict
  blocked: boolean
  device_response: DeviceResponse
  policy: PolicyPayload
}

/* ── Audit trail (app/device_api.py :: AuditEntry) ───────────────────── */

export const AUDIT_EVENTS = [
  'EXECUTED',
  'EXECUTED_UNDER_OVERRIDE',
  'BLOCKED',
  'OVERRIDE_REFUSED',
  'SECURITY_OVERRIDE',
  'DATA_ACCESS_GRANTED',
] as const
export type AuditEvent = (typeof AUDIT_EVENTS)[number]

export interface AuditDetailRisk {
  rule: string
  status?: CheckStatus
  detail?: string
  basis?: Basis | null
  action?: Action
  cites?: string[]
}

export interface AuditDetail {
  accepted_risk?: AuditDetailRisk[]
  failed?: string[]
  reason?: string
  action?: string
  via?: string
  [key: string]: unknown
}

export interface AuditEntry {
  at: string
  /** Widened past AuditEvent: the server may log events this build predates. */
  event: AuditEvent | string
  worklist_id: string | null
  verdict: Verdict | string
  actor: string
  detail: AuditDetail
}

/* ── Scenarios ──────────────────────────────────────────────────────── */

export interface ScenarioExpectedCheck {
  rule: string
  status: CheckStatus
  severity?: Basis
  detail: string
  cites: string[]
}

interface ScenarioBase {
  id: string
  name: string
  name_en: string
  expected_verdict: Verdict
  expected_checks: ScenarioExpectedCheck[]
  expected_action: string
}

/** SC-01 and SC-02 drive the device path. */
export interface ClinicalScenario extends ScenarioBase {
  patient: Patient & { synthetic?: boolean; note?: string }
  requested: Requested & { saline_flush_ml?: number }
  safe_alternative?: Record<string, string | number>
  request?: never
}

/** SC-03 drives the privacy path. */
export interface DataScenario extends ScenarioBase {
  request: Pick<DataRequestBody, 'actor' | 'action' | 'stated_purpose'>
  patient?: never
  requested?: never
}

export type Scenario = ClinicalScenario | DataScenario

export function isClinicalScenario(s: Scenario): s is ClinicalScenario {
  return 'requested' in s && s.requested !== undefined
}

/* ── ITU AI Readiness framework (kb/framework/dimensions.json) ───────── */

export interface FrameworkFactor {
  id: string
  name: string
  description: string
}

export interface FrameworkMetric {
  id: string
  name: string
  description: string
}

export interface FrameworkDimension {
  id: number
  name: string
  short_name: string
  description: string
  mapped_factors: string[]
  metrics: FrameworkMetric[]
}

export interface FrameworkResponse {
  framework_version: string
  framework_source: string
  factors: FrameworkFactor[]
  dimensions: FrameworkDimension[]
}

/* ── Connectors (app/main.py :: /connectors) ─────────────────────────── */

/**
 * The C node, made visible. A scanner is not driven through an API — it
 * asks, over DICOM, and whoever answers controls what the technologist
 * sees. These cards report live sockets, not saved settings.
 */
export interface ConnectorCard {
  id: 'fhir' | 'mwl' | 'modality' | 'injector'
  standard: string
  direction: 'inbound' | 'outbound'
  endpoint: string | null
  /** Reaches a real network peer, so the test button means something. */
  live: boolean
  testable: boolean
  state: 'configured' | 'running' | 'stopped' | 'error' | 'discovered' | 'awaiting' | 'local'
  detail: Record<string, unknown>
}

/** Real institutions, named as deployment targets. No affiliation claimed. */
export interface SiteProfile {
  id: string
  name: string
  name_ar: string
  city: string
}

export interface ConnectorsResponse {
  notice: string
  connectors: ConnectorCard[]
  site_profiles: SiteProfile[]
  site_profiles_note: string
}

export interface ConnectorTestResult {
  ok: boolean
  detail: string
  latency_ms?: number | null
  fhir_version?: string | null
  software?: string | null
  endpoint?: string
  checked_at?: string
  sop_classes?: { name: string; uid: string }[]
}

/** What the hospital sent, kept beside what Samaam derived from it. */
export interface PulledCreatinine {
  observation_id: string
  loinc: string
  display: string | null
  value: number | null
  unit: string | null
  status: string | null
  effective: string | null
  age_days: number | null
  converted_umol_l?: number
  conversion_factor?: number
}

export interface FhirPullResponse {
  patient: Patient
  raw: {
    source: string
    patient_id: string
    gender: string | null
    birth_date: string | null
    creatinine: PulledCreatinine | null
    weight: { value?: number; unit?: string } | null
  }
  /** Fields present on the FHIR resource that the connector refused to read. */
  identifiers_withheld: string[]
  warnings: string[]
  notice: string
}
