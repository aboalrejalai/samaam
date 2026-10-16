import {
  Award,
  Cable,
  Database,
  Gauge,
  LayoutGrid,
  Library,
  Presentation,
  ScanLine,
  ScrollText,
  Shapes,
  type LucideIcon,
} from 'lucide-react'

/** The system lives under this prefix; `/` is the landing page. */
export const APP_BASE = '/app'

/**
 * Paths the system used before it moved under {@link APP_BASE}. Each redirects
 * to its new home, so old links, bookmarks and the README keep working.
 */
export const LEGACY_PATHS = [
  'data',
  'connectors',
  'kb',
  'gaps',
  'audit',
  'readiness',
  'slides',
  'dev/primitives',
] as const

/**
 * The page inventory from FRONTEND-PLAN Part 1-b, in the order the plan lists
 * it. `endpoint` is shown in the sidebar tooltip so the mapping from screen to
 * API surface stays visible while demoing.
 */
export interface RouteEntry {
  path: string
  /** Key under `nav.` in the locale files. */
  key:
    | 'console'
    | 'data'
    | 'connectors'
    | 'kb'
    | 'gaps'
    | 'audit'
    | 'readiness'
    | 'slides'
    | 'about'
    | 'primitives'
  icon: LucideIcon
  endpoint: string
}

export const NAV_ROUTES: readonly RouteEntry[] = [
  { path: APP_BASE, key: 'console', icon: ScanLine, endpoint: 'POST /device/execute' },
  { path: `${APP_BASE}/data`, key: 'data', icon: Database, endpoint: 'POST /data/request' },
  { path: `${APP_BASE}/connectors`, key: 'connectors', icon: Cable, endpoint: 'GET /connectors' },
  { path: `${APP_BASE}/kb`, key: 'kb', icon: Library, endpoint: 'GET /kb/search' },
  { path: `${APP_BASE}/gaps`, key: 'gaps', icon: LayoutGrid, endpoint: 'GET /kb/gaps' },
  { path: `${APP_BASE}/audit`, key: 'audit', icon: ScrollText, endpoint: 'GET /audit' },
  { path: `${APP_BASE}/readiness`, key: 'readiness', icon: Gauge, endpoint: 'GET /framework' },
  { path: `${APP_BASE}/slides`, key: 'slides', icon: Presentation, endpoint: '—' },
  // The team and the ITU award: who built the gateway, and what it won.
  { path: `${APP_BASE}/about`, key: 'about', icon: Award, endpoint: '—' },
]

/** Not part of the product. Phase 1's gate: every primitive in every state. */
export const DEV_ROUTE: RouteEntry = {
  path: `${APP_BASE}/dev/primitives`,
  key: 'primitives',
  icon: Shapes,
  endpoint: '—',
}
