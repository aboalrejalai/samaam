import { useEffect, useState } from 'react'
import { Direction } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { Trophy } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { ConnectionIndicator } from '@/components/ConnectionIndicator'
import { NavMain } from '@/components/nav-main'
import { KbSidebar } from '@/components/kb/KbSidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { APP_BASE, DEV_ROUTE, NAV_ROUTES } from '@/lib/routes'

/**
 * Adapted from the `sidebar-07` block: collapse-to-icon behaviour and the rail
 * are the block's, unmodified.
 *
 * Replaced, because the app has no such concepts: the team switcher became the
 * project mark, the user menu became the connection indicator, and the projects
 * group is gone.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const onKb = pathname.startsWith(`${APP_BASE}/kb`)
  // Back swaps the panel for the nav without navigating, so the rest of the
  // system stays reachable without losing the search. Leaving /kb resets it.
  const [navShown, setNavShown] = useState(false)
  useEffect(() => { if (!onKb) setNavShown(false) }, [onKb])
  const { t } = useTranslation()
  const direction = Direction.useDirection()

  return (
    // The sidebar's fixed container pins itself with physical left-0 / right-0
    // off `side`, while the gap that reserves its space sits in the flex flow
    // and does follow `dir`. Left unset, the Arabic layout draws the rail on
    // the left and reserves its width on the right. `side` is the inline-start
    // edge for the current direction.
    <Sidebar collapsible="icon" side={direction === 'rtl' ? 'right' : 'left'} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip={t('brand.tagline')}>
              <Link to="/">
                <BrandMark />
                <span className="grid flex-1 text-start leading-tight">
                  {/* One Arabic word needs no dir override; forcing rtl here
                      would align it against the block's start edge. */}
                  <span lang="ar" className="truncate text-base font-semibold">
                    {t('brand.name')}
                  </span>
                  <span className="truncate font-mono text-xs tracking-[0.12em] text-muted-foreground">
                    {t('brand.latin')}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {onKb && !navShown ? (
          <KbSidebar onBack={() => setNavShown(true)} />
        ) : (
          <NavMain label={t('nav.group')} items={NAV_ROUTES} />
        )}
      </SidebarContent>

      <SidebarFooter>
        {/* The award, on every screen of the system. Collapsed to icons, the
            button shrinks to its gold tile and the tooltip carries the title. */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              isActive={pathname.startsWith(`${APP_BASE}/about`)}
              tooltip={t('shell.awardTitle')}
              className="h-auto border border-warning/30 bg-warning/10 py-2 hover:bg-warning/15 data-active:bg-warning/15 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent"
            >
              <Link to={`${APP_BASE}/about`} aria-label={t('shell.awardLink')}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-warning text-white dark:text-background">
                  <Trophy aria-hidden />
                </span>
                <span className="grid min-w-0 flex-1 gap-0.5 text-start leading-tight">
                  <span className="truncate text-sm font-semibold text-warning-strong">
                    {t('hackathon.prize')}
                  </span>
                  <span className="text-xs leading-snug whitespace-normal text-foreground/80">
                    {t('hackathon.name')}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {t('team.ledBy')}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={[DEV_ROUTE]} />
        <SidebarSeparator />
        <ConnectionIndicator />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
