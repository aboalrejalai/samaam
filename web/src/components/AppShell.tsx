import { useTranslation } from 'react-i18next'
import { Trophy } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SyntheticNotice } from '@/components/SyntheticNotice'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { KbSearchProvider } from '@/lib/kb-search'
import { APP_BASE } from '@/lib/routes'
import { cn } from '@/lib/utils'

/**
 * The Soft app shell: a 280px sidebar (`--sidebar-width`) beside a 64px top bar
 * (`--topbar-height`). Top bar holds: sidebar trigger, SyntheticNotice, 3rd Prize
 * chip linking to `/app/about`, LanguageToggle.
 */
export function AppShell() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const onSlides = pathname.startsWith(`${APP_BASE}/slides`)

  return (
    <KbSearchProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-(--topbar-height) shrink-0 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
            <SidebarTrigger className="-ms-1" aria-label={t('shell.toggleSidebar')} />
            <SyntheticNotice className="min-w-0 flex-1" />
            <Link
              to={`${APP_BASE}/about`}
              aria-label={t('shell.awardLink')}
              title={t('shell.awardTitle')}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning-strong transition-colors hover:bg-warning/20 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Trophy aria-hidden className="size-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t('shell.awardChip')}</span>
            </Link>
            <LanguageToggle />
          </header>

          {/* SidebarInset is already the page's <main>; this is its padding box.
              Slides drop padding so the deck iframe fills the content pane. */}
          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col',
              onSlides ? 'p-0' : 'gap-5 p-4 md:p-6',
            )}
          >
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </KbSearchProvider>
  )
}
