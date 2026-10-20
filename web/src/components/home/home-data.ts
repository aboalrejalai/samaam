/**
 * Every fact the landing page states, in one place.
 *
 * Nothing here is written for effect. Each value was read from the code, the
 * knowledge base or the submission documents, or produced by running the
 * pipeline, and carries a `source:` comment saying where. Copy lives in the
 * locale files under `home.*`; this file holds the numbers, identifiers and
 * links that copy refers to. If a value here stops matching its source, the
 * source wins and this file is wrong.
 *
 * Deliberately absent, because the repository does not support them: a claim
 * that all six verdicts are produced (the code emits three), any enforcement of
 * contrast volume or flow rate (no rule reads them), any real scanner or
 * hospital integration, and any latency presented as a guarantee.
 */

import {
  Brain,
  Cable,
  FileCheck2,
  FileText,
  Monitor,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

/* ── Pipeline ─────────────────────────────────────────────────────────── */

export type NodeId = 'SRC' | 'C' | 'PP' | 'M' | 'P' | 'D' | 'SINK'

export interface PipelineNode {
  id: NodeId
  icon: LucideIcon
  /** Repo file that implements the node, shown as evidence. */
  file: string
}

// source: app/pipeline.py:1-13 (node map), README.md:104-114
export const PIPELINE: readonly PipelineNode[] = [
  { id: 'SRC', icon: FileText, file: 'kb/ · scenarios/' },
  { id: 'C', icon: Cable, file: 'app/connectors/' },
  { id: 'PP', icon: ShieldCheck, file: 'app/pipeline.py' },
  { id: 'M', icon: Brain, file: 'app/llm.py' },
  { id: 'P', icon: FileCheck2, file: 'app/policy_node.py' },
  { id: 'D', icon: ScrollText, file: 'app/device_api.py' },
  { id: 'SINK', icon: Monitor, file: 'web/ · MockCTScanner' },
]

/* ── Verdicts and actions ─────────────────────────────────────────────── */

// source: app/policy_node.py:20-27
export const VERDICTS = [
  'COMPLIANT',
  'VIOLATION',
  'AMBIGUITY',
  'CONFLICT',
  'POTENTIAL_GAP',
  'INSUFFICIENT_EVIDENCE',
] as const

/**
 * The three the policy node actually returns today.
 * source: app/policy_node.py:408-414 (evaluate), :492-495 (data path)
 */
export const EMITTED_VERDICTS: ReadonlySet<string> = new Set([
  'COMPLIANT',
  'VIOLATION',
  'INSUFFICIENT_EVIDENCE',
])

// source: app/policy_node.py:42-64 — ranked, the decision takes the most severe
export const ACTIONS = ['PROCEED', 'CONFIRM', 'AUTHORISE', 'PROHIBITED'] as const

/* ── Scenarios (values from a live run of the pipeline) ───────────────── */

export type CheckStatus = 'PASS' | 'FAIL' | 'WARN' | 'NOT_APPLICABLE'
export type Basis = 'STATUTORY' | 'NATIONAL_PROTOCOL' | null

export interface ScenarioCheck {
  rule: string
  status: CheckStatus
  basis: Basis
  action: (typeof ACTIONS)[number]
  /** Measured value and cited limit, when the rule reads a number. */
  reading?: { name: string; measured: string; limit: string; unit: string }
  cites: readonly string[]
}

export interface Scenario {
  id: 'SC-01' | 'SC-02' | 'SC-03'
  /** Key under `home.scenarios.items` for the name and summary. */
  key: 'sc01' | 'sc02' | 'sc03'
  endpoint: string
  verdict: 'COMPLIANT' | 'VIOLATION'
  action: (typeof ACTIONS)[number]
  http: 200 | 403
  /** Device state, or the data path's session outcome. */
  outcome: 'EXECUTED' | 'LOCKED' | 'SESSION_TERMINATED'
  overridable: boolean
  checks: readonly ScenarioCheck[]
}

// source: `.venv/bin/python` run of Samaam().run() on scenarios/sc-01.json and
// sc-02.json (2026-10-12); SC-03 from run_data_request with run_demo.py:38-44
export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'SC-01',
    key: 'sc01',
    endpoint: 'POST /device/execute',
    verdict: 'COMPLIANT',
    action: 'PROCEED',
    http: 200,
    outcome: 'EXECUTED',
    overridable: true,
    checks: [
      {
        rule: 'national_drl',
        status: 'PASS',
        basis: 'STATUTORY',
        action: 'PROCEED',
        reading: { name: 'CTDIvol', measured: '9.5', limit: '12', unit: 'mGy' },
        cites: ['SFDA-MDS-G008-DRL', 'SFDA-DRL-BINDING'],
      },
      {
        rule: 'renal_prophylaxis',
        status: 'PASS',
        basis: 'NATIONAL_PROTOCOL',
        action: 'PROCEED',
        reading: { name: 'eGFR', measured: '81.4', limit: '30', unit: 'mL/min/1.73m²' },
        cites: ['MOH-CM-PROPHYLAXIS', 'MOH-CM-RISK-BANDS'],
      },
      { rule: 'metformin', status: 'NOT_APPLICABLE', basis: null, action: 'PROCEED', cites: ['MOH-CM-METFORMIN'] },
      { rule: 'nephrotoxic_meds', status: 'NOT_APPLICABLE', basis: null, action: 'PROCEED', cites: ['MOH-CM-NEPHROTOXIC'] },
    ],
  },
  {
    id: 'SC-02',
    key: 'sc02',
    endpoint: 'POST /device/execute',
    verdict: 'VIOLATION',
    action: 'AUTHORISE',
    http: 403,
    outcome: 'LOCKED',
    overridable: true,
    checks: [
      {
        rule: 'national_drl',
        status: 'FAIL',
        basis: 'STATUTORY',
        action: 'AUTHORISE',
        reading: { name: 'CTDIvol', measured: '18.0', limit: '14', unit: 'mGy' },
        cites: ['SFDA-MDS-G008-DRL', 'SFDA-DRL-BINDING'],
      },
      {
        rule: 'renal_prophylaxis',
        status: 'FAIL',
        basis: 'NATIONAL_PROTOCOL',
        action: 'AUTHORISE',
        reading: { name: 'eGFR', measured: '19.1', limit: '30', unit: 'mL/min/1.73m²' },
        cites: ['MOH-CM-PROPHYLAXIS', 'MOH-CM-RISK-BANDS', 'CAR-2022-INDIVIDUAL'],
      },
      { rule: 'metformin', status: 'FAIL', basis: 'NATIONAL_PROTOCOL', action: 'CONFIRM', cites: ['MOH-CM-METFORMIN'] },
      { rule: 'nephrotoxic_meds', status: 'WARN', basis: 'NATIONAL_PROTOCOL', action: 'CONFIRM', cites: ['MOH-CM-NEPHROTOXIC'] },
    ],
  },
  {
    id: 'SC-03',
    key: 'sc03',
    endpoint: 'POST /data/request',
    verdict: 'VIOLATION',
    action: 'PROHIBITED',
    http: 403,
    outcome: 'SESSION_TERMINATED',
    // source: app/policy_node.py:497-503 — no clinical override for the PDPL
    overridable: false,
    checks: [
      { rule: 'health_data_minimisation', status: 'FAIL', basis: 'STATUTORY', action: 'PROHIBITED', cites: ['PDPL-ART23'] },
      { rule: 'lawful_basis', status: 'FAIL', basis: 'STATUTORY', action: 'PROHIBITED', cites: ['PDPL-ART1-11', 'PDPL-ART1-13', 'PDPL-ART1-13-AR'] },
      { rule: 'cross_border', status: 'FAIL', basis: 'STATUTORY', action: 'PROHIBITED', cites: ['PDPL-ART29'] },
    ],
  },
]

/**
 * SC-02's request as the technologist enters it, and the lower-dose
 * alternative the scenario proposes.
 * source: scenarios/sc-02.json (requested, safe_alternative); eGFR computed by
 * app/policy_node.py:193 (CKD-EPI, MoH protocol p.21) from creatinine 229.8
 */
export const SC02 = {
  creatinine: '229.8',
  egfr: '19.1',
  ctdivol: '18.0',
  ctdivolLimit: '14',
  dlp: '900',
  dlpLimit: '706',
  riskBand: '≈30%',
  alternative: { ctdivol: '13.0', dlp: '660' },
} as const

/** source: scenarios/sc-01.json */
export const SC01 = { egfr: '81.4', ctdivol: '9.5', dlp: '365' } as const

/** source: run_demo.py:42, web/src/routes/DataRequestPage.tsx:28 */
export const SC03_RECORDS = 4200

/* ── Rules ────────────────────────────────────────────────────────────── */

export interface Rule {
  rule: string
  basis: NonNullable<Basis>
  /** Most severe action this rule can raise. */
  action: (typeof ACTIONS)[number]
  path: 'device' | 'data'
}

// source: app/policy_node.py:214-388 (device path), :438-505 (data path)
export const RULES: readonly Rule[] = [
  { rule: 'national_drl', basis: 'STATUTORY', action: 'AUTHORISE', path: 'device' },
  { rule: 'renal_prophylaxis', basis: 'NATIONAL_PROTOCOL', action: 'AUTHORISE', path: 'device' },
  { rule: 'metformin', basis: 'NATIONAL_PROTOCOL', action: 'CONFIRM', path: 'device' },
  { rule: 'nephrotoxic_meds', basis: 'NATIONAL_PROTOCOL', action: 'CONFIRM', path: 'device' },
  { rule: 'health_data_minimisation', basis: 'STATUTORY', action: 'PROHIBITED', path: 'data' },
  { rule: 'lawful_basis', basis: 'STATUTORY', action: 'PROHIBITED', path: 'data' },
  { rule: 'cross_border', basis: 'STATUTORY', action: 'PROHIBITED', path: 'data' },
]

/** source: app/policy_node.py:88 (EGFR_PROPHYLAXIS_THRESHOLD), MoH protocol §5.2 */
export const EGFR_THRESHOLD = 30

/* ── Counts ───────────────────────────────────────────────────────────── */

/**
 * source: kb/records/health-regulatory.json (45 records: 43 VERIFIED, 1
 * UNVERIFIED, 1 HISTORICAL; 6 gaps); ChromaDB counts `45 6 1338` from
 * KnowledgeBase().count(); kb/sources/ (6 PDFs + 1 text summary);
 * kb/framework/dimensions.json (13 dimensions, 6 factors, 111 metrics)
 */
export const COUNTS = {
  nodes: 7,
  records: 45,
  verified: 43,
  gaps: 6,
  chunks: 1338,
  sourceFiles: 7,
  rules: 7,
  verdicts: 6,
  dimensions: 13,
  metrics: 111,
} as const

/**
 * Observations from the recorded demo, not benchmarks.
 * source: README.md:62,90-91 ("29 ms", "~40 s"); docs/VIDEO-SCRIPT.md:31
 */
export const DEMO_TIMING = { blockMs: 29, explainS: 40 } as const

/* ── Primary sources (the horizontal rail) ────────────────────────────── */

export interface Source {
  id: string
  authority: string
  title: string
  year: number
  url: string
  /** Title language, so Arabic titles render right-to-left. */
  lang: 'en' | 'ar'
}

// source: kb/records/health-regulatory.json — VERIFIED records whose url points
// at the document itself (PDF or official law page), not a listing page.
export const SOURCES: readonly Source[] = [
  {
    id: 'MOH-CM-PROPHYLAXIS',
    authority: 'Saudi Ministry of Health',
    title: 'Protocols on the Safe Use of Contrast Media in Radiology Departments',
    year: 2021,
    url: 'https://www.moh.gov.sa/en/Ministry/MediaCenter/Publications/Documents/Protocols-of-CM.pdf',
    lang: 'en',
  },
  {
    id: 'SFDA-DRL-BINDING',
    authority: 'SFDA',
    title: 'National Diagnostic Reference Levels (MDS-G008), version 2.0',
    year: 2022,
    url: 'https://www.sfda.gov.sa/sites/default/files/2023-02/NDRL-En.pdf',
    lang: 'en',
  },
  {
    id: 'PDPL-ART1-13-AR',
    authority: 'SDAIA / هيئة الخبراء بمجلس الوزراء',
    title: 'نظام حماية البيانات الشخصية',
    year: 2023,
    url: 'https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/b7cfae89-828e-4994-b167-adaa00e37188/1',
    lang: 'ar',
  },
  {
    id: 'PDPL-ART1-11',
    authority: 'SDAIA',
    title: 'Personal Data Protection Law (PDPL)',
    year: 2023,
    url: 'https://sdaia.gov.sa/en/SDAIA/about/Documents/Personal%20Data%20English%20V2-23April2023-%20Reviewed-.pdf',
    lang: 'en',
  },
  {
    id: 'PDPL-IR-AUTO',
    authority: 'SDAIA',
    title: 'Implementing Regulation of the Personal Data Protection Law',
    year: 2023,
    url: 'https://sdaia.gov.sa/en/SDAIA/about/Documents/ImplementingRegulationPersonalDataProtectionLaw.pdf',
    lang: 'en',
  },
  {
    id: 'SFDA-MDS-G010-CLINEVAL',
    authority: 'SFDA',
    title: 'Guidance on AI and ML Technologies Based Medical Devices (MDS-G010)',
    year: 2022,
    url: 'https://www.sfda.gov.sa/sites/default/files/2023-01/MDS-G010ML.pdf',
    lang: 'en',
  },
  {
    id: 'SFDA-MDS-G23-SAMD',
    authority: 'SFDA',
    title: 'Guidance on Software as a Medical Device (MDS-G23)',
    year: 2018,
    url: 'https://www.sfda.gov.sa/sites/default/files/2020-03/MDS_G23.pdf',
    lang: 'en',
  },
  {
    id: 'WHO-2021-PRINCIPLES',
    authority: 'World Health Organization',
    title: 'Ethics and governance of artificial intelligence for health',
    year: 2021,
    url: 'https://www.who.int/publications/i/item/9789240029200',
    lang: 'en',
  },
  {
    id: 'ITU-Y3172',
    authority: 'ITU-T',
    title: 'ITU-T Y.3172 — Architectural framework for machine learning in future networks',
    year: 2019,
    url: 'https://www.itu.int/rec/T-REC-Y.3172/en',
    lang: 'en',
  },
]

/* ── Award, team, links ───────────────────────────────────────────────── */

// source: README.md:26-37; docs/awards/itu-ai-readiness-hackathon-3rd-prize-2026.jpg
export const AWARD = {
  place: 3,
  date: '2026-09-15',
  // copy of docs/awards/… served from web/public so the SPA can show it.
  // `?v=` busts a Cloudflare edge entry cached before the file was deployed.
  certificate: '/awards/itu-ai-readiness-hackathon-3rd-prize-2026.jpg?v=1',
  // source: certificate — signatory line
  signatory: 'Seizo Onoe',
} as const

// source: certificate header and footer logos; README.md:37
export const HACKATHON = {
  name: 'ITU AI Readiness Hackathon',
  programme: 'AI for Good · ITU AI/ML in 5G Challenge',
  host: 'Kingdom of Saudi Arabia',
  // source: docs/Hackathon-Guide.md:165 (Health & Radiology track)
  track: 'Health & Radiology',
  partners: ['ITU', 'SDAIA', 'UNESCO', 'ICAIRE'],
  url: 'https://aiforgood.itu.int/',
} as const

/**
 * Names as spelled on the certificate; `key` indexes `home.team.members.*`
 * in the locales (Arabic name, role, study). Leader first, as on the certificate.
 * source: certificate; submission/TECHNICAL-REPORT.md:35-40 (roles, universities)
 */
export const TEAM_MEMBERS = [
  { key: 'mohammed', name: 'Mohammed Nadher Abo Alrejal', leader: true },
  { key: 'badour', name: 'Badour Alsehli', leader: false },
  { key: 'haneen', name: 'Haneen Saleh Alharbi', leader: false },
  { key: 'norah', name: 'Norah Abdullah Alsahli', leader: false },
] as const

export const TEAM = TEAM_MEMBERS.map((m) => m.name)
export const TEAM_LEADER = TEAM_MEMBERS[0]

// source: submission/TECHNICAL-REPORT.md:48-50; LICENSE
export const LINKS = {
  repo: 'https://github.com/aboalrejal-ai/samaam',
  license: 'MIT',
} as const

/**
 * Direct identifiers PP drops before anything else sees the record.
 * source: app/pipeline.py:23-25 (DIRECT_IDENTIFIERS, PDPL Article 23)
 */
export const DIRECT_IDENTIFIERS = [
  'name',
  'national_id',
  'iqama',
  'mrn',
  'phone',
  'email',
  'address',
] as const
