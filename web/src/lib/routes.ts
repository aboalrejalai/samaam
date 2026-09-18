import {
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
    | 'primitives'
  icon: LucideIcon
  endpoint: string
}

export const NAV_ROUTES: readonly RouteEntry[] = [
  { path: '/', key: 'console', icon: ScanLine, endpoint: 'POST /device/execute' },
  { path: '/data', key: 'data', icon: Database, endpoint: 'POST /data/request' },
  { path: '/connectors', key: 'connectors', icon: Cable, endpoint: 'GET /connectors' },
  { path: '/kb', key: 'kb', icon: Library, endpoint: 'GET /kb/search' },
  { path: '/gaps', key: 'gaps', icon: LayoutGrid, endpoint: 'GET /kb/gaps' },
  { path: '/audit', key: 'audit', icon: ScrollText, endpoint: 'GET /audit' },
  { path: '/readiness', key: 'readiness', icon: Gauge, endpoint: 'GET /framework' },
  { path: '/slides', key: 'slides', icon: Presentation, endpoint: '—' },
]

/** Not part of the product. Phase 1's gate: every primitive in every state. */
export const DEV_ROUTE: RouteEntry = {
  path: '/dev/primitives',
  key: 'primitives',
  icon: Shapes,
  endpoint: '—',
}
