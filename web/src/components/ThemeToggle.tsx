import { Moon, Sun, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { THEMES, useTheme, type Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const ICON: Record<Theme, LucideIcon> = { light: Sun, dark: Moon }

/**
 * The Soft theme capsule: one segment per theme, the active one lifted onto
 * the background with a primary ring. Light and dark only; light is default.
 */
export function ThemeToggle({ className, ...props }: React.ComponentProps<'div'>) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label={t('shell.theme')}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border/50 bg-muted/50 p-0.5',
        className,
      )}
      {...props}
    >
      {THEMES.map((option) => {
        const Icon = ICON[option]
        const active = option === theme
        const label = option === 'dark' ? t('shell.themeDark') : t('shell.themeLight')
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(option)}
            className={cn(
              'flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground',
              active && 'bg-background text-foreground ring-2 ring-primary',
            )}
          >
            <Icon aria-hidden className="size-3.5" />
          </button>
        )
      })}
    </div>
  )
}
