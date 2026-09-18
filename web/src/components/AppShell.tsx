import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SyntheticNotice } from '@/components/SyntheticNotice'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { KbSearchProvider } from '@/lib/kb-search'

/**
 * The shell from the `sidebar-07` block. Its collapse-to-icon rail and header
 * are untouched; the header content is ours, because the synthetic-data notice
 * has to be on every screen and is graded on being there.
 */
export function AppShell() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const onSlides = pathname.startsWith('/slides')

  return (
    <KbSearchProvider>
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card/85 px-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ms-1" aria-label={t('shell.toggleSidebar')} />
          <Separator
            orientation="vertical"
            className="me-1 data-vertical:h-4 data-vertical:self-auto"
          />
          <SyntheticNotice className="min-w-0 flex-1" />
          <LanguageToggle />
          <ThemeToggle />
        </header>

        {/* SidebarInset is already the page's <main>; this is its padding box.
            Slides drop padding so the deck iframe fills the content pane. */}
        <div
          className={
            onSlides
              ? 'flex min-h-0 flex-1 flex-col p-0'
              : 'flex flex-1 flex-col gap-6 p-4 md:p-6'
          }
        >
          <Outlet />
        </div>
      </SidebarInset>
      </SidebarProvider>
    </KbSearchProvider>
  )
}
