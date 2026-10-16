import { ChevronRight, LayoutDashboard, Trophy } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { BrandMark } from '@/components/BrandMark'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { APP_BASE } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useDirSign } from './motion-kit'

// `wide` anchors only fit beside the award/team links from xl up.
const ANCHORS = [
  { id: 'story', wide: false },
  { id: 'pipeline', wide: true },
  { id: 'scenarios', wide: false },
  { id: 'sources', wide: true },
  { id: 'award', wide: false },
  { id: 'team', wide: false },
] as const

/**
 * The award is the first thing a visitor reads: a slim gold bar that scrolls
 * away, then the sticky 64px Soft top bar. Every word comes from `hackathon.*`
 * and `team.*`, so the bar never states more than the certificate does.
 */
function AnnouncementBar() {
  const { t } = useTranslation()
  const sign = useDirSign()

  return (
    <a
      href="#award"
      aria-label={`${t('home.announce.label')}: ${t('hackathon.prizeLong')}. ${t('team.ledBy')}`}
      className="group relative isolate block h-9 overflow-hidden border-b border-amber-500/30 bg-linear-to-r from-amber-100 via-amber-50 to-amber-100 text-amber-950 dark:from-amber-500/15 dark:via-amber-400/10 dark:to-amber-500/15 dark:text-amber-100"
    >
      {/* A slow sheen; MotionConfig strips the transform for reduced motion. */}
      <motion.span
        aria-hidden
        className="absolute inset-y-0 start-0 -z-10 w-1/3 bg-linear-to-r from-transparent via-white/60 to-transparent dark:via-amber-200/10"
        initial={{ x: `${-120 * sign}%` }}
        animate={{ x: `${320 * sign}%` }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
      />
      <span className="mx-auto flex h-full w-full max-w-7xl items-center justify-center gap-2 px-4 text-xs md:px-8">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-amber-600 text-white shadow-sm">
          <Trophy aria-hidden className="size-3" />
        </span>
        <span className="shrink-0 font-bold">{t('hackathon.prize')}</span>
        <span aria-hidden className="hidden opacity-50 sm:inline">·</span>
        <span className="hidden min-w-0 truncate font-medium sm:inline">{t('hackathon.name')}</span>
        <span aria-hidden className="opacity-50">·</span>
        <span className="min-w-0 truncate">{t('team.ledBy')}</span>
        <span className="ms-2 hidden shrink-0 items-center gap-0.5 font-semibold underline-offset-4 group-hover:underline lg:inline-flex">
          {t('home.announce.cta')}
          <ChevronRight aria-hidden className="size-3.5 rtl:rotate-180" />
        </span>
      </span>
    </a>
  )
}

/** Sticky, 64px — the Soft top-bar height — and quiet until the page scrolls. */
export function HomeHeader() {
  const { t } = useTranslation()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  return (
    <>
      <AnnouncementBar />
      <motion.header
        className={cn(
          'sticky top-0 z-40 h-(--topbar-height) border-b transition-colors duration-300',
          scrolled ? 'border-border/60 bg-background/85 backdrop-blur-md' : 'border-transparent bg-background',
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-3 px-4 md:px-8">
          <Link
            to="/"
            aria-label={t('home.nav.home')}
            className="flex shrink-0 items-center gap-2.5 rounded-md"
          >
            <BrandMark />
            <span className="flex flex-col leading-tight">
              <span lang="ar" className="text-base font-bold">
                {t('brand.name')}
              </span>
              <span className="hidden font-mono text-xs tracking-[0.12em] text-muted-foreground sm:block">
                {t('brand.latin')}
              </span>
            </span>
          </Link>

          <nav aria-label={t('home.nav.menu')} className="ms-4 hidden lg:block xl:ms-6">
            <ul className="flex items-center gap-0.5">
              {ANCHORS.map(({ id, wide }) => (
                <li key={id} className={cn(wide && 'hidden xl:block')}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                      id === 'award'
                        ? 'text-amber-700 hover:bg-amber-500/10 dark:text-amber-300'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {id === 'award' && <Trophy aria-hidden className="size-3.5" />}
                    {t(`home.nav.${id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
            <LanguageToggle />
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button asChild size="sm" className="ms-1">
              <Link to={APP_BASE}>
                <LayoutDashboard data-icon="inline-start" aria-hidden />
                {t('home.nav.dashboard')}
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>
    </>
  )
}
