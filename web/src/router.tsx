import { createBrowserRouter, Navigate } from 'react-router'
import { AppShell } from '@/components/AppShell'
import { APP_BASE, LEGACY_PATHS } from '@/lib/routes'
import AuditPage from '@/routes/AuditPage'
import ConnectorsPage from '@/routes/ConnectorsPage'
import ConsolePage from '@/routes/ConsolePage'
import DataRequestPage from '@/routes/DataRequestPage'
import DevPrimitivesPage from '@/routes/DevPrimitivesPage'
import GapsPage from '@/routes/GapsPage'
import KnowledgeBasePage from '@/routes/KnowledgeBasePage'
import NotFoundPage from '@/routes/NotFoundPage'
import ReadinessPage from '@/routes/ReadinessPage'
import SlidesPage from '@/routes/SlidesPage'

/**
 * `/` is the landing page, outside the shell. The system — the six screens of
 * FRONTEND-PLAN Part 1-b plus the slides and Phase 1's gate page — lives under
 * `/app`. Its former top-level paths redirect, so nothing that linked to them
 * breaks. Under `/app` the SPA paths no longer coincide with the API's `/audit`
 * and `/connectors`, which is the collision the service's Accept-header
 * middleware was written to paper over.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    // Split out: the landing page carries the motion library, which the
    // system's screens do not need.
    lazy: () => import('@/routes/HomePage').then((m) => ({ Component: m.default })),
  },
  {
    path: APP_BASE,
    Component: AppShell,
    children: [
      { index: true, Component: ConsolePage },
      { path: 'data', Component: DataRequestPage },
      { path: 'connectors', Component: ConnectorsPage },
      { path: 'kb', Component: KnowledgeBasePage },
      { path: 'gaps', Component: GapsPage },
      { path: 'audit', Component: AuditPage },
      { path: 'readiness', Component: ReadinessPage },
      { path: 'slides', Component: SlidesPage },
      {
        path: 'about',
        // Split out: an image-led page nobody needs before the console renders.
        lazy: () => import('@/routes/AboutPage').then((m) => ({ Component: m.default })),
      },
      { path: 'dev/primitives', Component: DevPrimitivesPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
  ...LEGACY_PATHS.map((path) => ({
    path: `/${path}`,
    element: <Navigate to={`${APP_BASE}/${path}`} replace />,
  })),
  { path: '*', element: <Navigate to={APP_BASE} replace /> },
])
