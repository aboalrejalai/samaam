import { Direction } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { BrandMark } from '@/components/BrandMark'
import { ConnectionIndicator } from '@/components/ConnectionIndicator'
import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NAV_ROUTES } from '@/lib/routes'

/**
 * Adapted from the `sidebar-07` block: collapse-to-icon behaviour and the rail
 * are the block's, unmodified.
 *
 * Replaced, because the app has no such concepts: the team switcher became the
 * project mark, the user menu became the connection indicator, and the projects
 * group is gone.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain label={t('nav.group')} items={NAV_ROUTES} />
      </SidebarContent>

      <SidebarFooter>
        <ConnectionIndicator />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
