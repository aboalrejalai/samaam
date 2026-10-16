import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { APP_BASE, type RouteEntry } from '@/lib/routes'

function isCurrent(pathname: string, path: string) {
  return path === APP_BASE ? pathname === APP_BASE || pathname === `${APP_BASE}/` : pathname.startsWith(path)
}

/**
 * Adapted from the `sidebar-07` block. The block ships collapsible sub-menus;
 * the Samaam inventory is six flat screens, so the Collapsible layer is gone.
 *
 * The tooltip carries the endpoint each screen drives, which is what shows when
 * the rail is collapsed to icons for filming.
 */
export function NavMain({ label, items }: { label?: string; items: readonly RouteEntry[] }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      {label !== undefined && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={isCurrent(pathname, item.path)}
              tooltip={`${t(`nav.${item.key}`)} — ${item.endpoint}`}
            >
              <Link to={item.path}>
                <item.icon aria-hidden />
                <span>{t(`nav.${item.key}`)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
