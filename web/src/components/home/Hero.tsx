import { ArrowDown, CalendarDays, ChevronRight, Cpu, LayoutDashboard, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { SyntheticNotice } from '@/components/SyntheticNotice'
import { Button } from '@/components/ui/button'
import { APP_BASE } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { GatewayPreview } from './GatewayPreview'
import { AWARD, TEAM_MEMBERS } from './home-data'
import { EASE } from './motion-kit'
import { initials } from '@/lib/text'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
})

/** Arabic names read better as one letter; Latin names as first + last. */
/** Medal-style award card. Copy from `hackathon.*`; the place from AWARD. */
function AwardBadge() {
  const { t } = useTranslation()

  return (
    <a
      href="#award"
      className="group relative isolate flex w-full max-w-xl items-center gap-4 overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-50 via-background to-amber-100/60 p-3 pe-4 shadow-e2 transition-shadow hover:shadow-e4 sm:w-fit dark:from-amber-500/15 dark:via-background dark:to-amber-500/5"
    >
      {/* Medal: gold disc, inner ring, the place in large numerals. */}
      <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-200 via-amber-400 to-amber-700 shadow-md ring-4 ring-amber-300/40 dark:ring-amber-400/20">
        <span className="absolute inset-1 rounded-full border border-white/50" aria-hidden />
        <span dir="ltr" className="font-mono text-2xl leading-none font-bold text-white drop-shadow-sm">
          {AWARD.place}
        </span>
        <Trophy
          aria-hidden
          className="absolute -bottom-1 -end-1 size-5 rounded-full bg-background p-0.5 text-amber-600 shadow-sm dark:text-amber-300"
        />
      </span>

      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg leading-tight font-bold text-amber-900 dark:text-amber-200">
            {t('hackathon.prize')}
          </span>
          <span className="text-sm font-semibold text-foreground">{t('hackathon.name')}</span>
        </span>
        <span className="text-xs text-pretty text-muted-foreground">{t('hackathon.international')}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden className="size-3.5 shrink-0" />
            {t('hackathon.date')}
          </span>
          <span>{t('hackathon.track')}</span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-amber-800 group-hover:underline dark:text-amber-300">
            {t('home.hero.awardCta')}
            <ChevronRight aria-hidden className="size-3.5 rtl:rotate-180" />
          </span>
        </span>
      </span>

      {/* Sheen across the card; transforms are stripped for reduced motion. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-0 -z-10 w-1/2 bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-amber-200/10"
        initial={{ x: '-150%', skewX: -20 }}
        animate={{ x: '300%', skewX: -20 }}
        transition={{ duration: 2.4, delay: 1, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
      />
    </a>
  )
}

/** "Led by … · Team Samaam" with the four members as an initials stack. */
function TeamCredit() {
  const { t } = useTranslation()

  return (
    <a
      href="#team"
      aria-label={`${t('team.ledBy')} · ${t('team.name')} — ${t('home.hero.teamCta')}`}
      className="group flex w-fit items-center gap-3 rounded-full py-1 pe-3 transition-colors hover:bg-muted/60"
    >
      <span className="flex items-center">
        {TEAM_MEMBERS.map((m, i) => {
          const name = t(`team.members.${m.key}.name`)
          return (
            <span
              key={m.key}
              title={name}
              className={cn(
                'flex size-9 items-center justify-center rounded-full text-xs font-bold ring-2 ring-background',
                i > 0 && '-ms-2.5',
                m.leader
                  ? 'z-10 bg-linear-to-br from-amber-300 to-amber-600 text-white'
                  : 'bg-primary/10 text-primary dark:bg-primary/20',
              )}
            >
              {initials(name)}
            </span>
          )
        })}
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground">{t('team.ledBy')}</span>
        <span className="text-xs text-muted-foreground group-hover:text-foreground">
          {t('team.name')} · {t('home.hero.teamCta')}
        </span>
      </span>
    </a>
  )
}

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden">
      {/* Layered background: Soft's brand wash, a faded grid, two glows. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-mesh absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[44px_44px] opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute -top-40 -end-40 size-[36rem] rounded-full bg-primary/20 blur-3xl dark:bg-primary/25" />
        <div className="absolute top-1/3 -start-48 size-[28rem] rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-background" />
      </div>

      {/* First screen = viewport minus the top bar and HomeHeader's 2.25rem (h-9) award bar. */}
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-10 pb-20 md:px-8 md:pt-14 lg:min-h-[calc(100dvh-var(--topbar-height)-2.25rem)] lg:grid-cols-12 lg:gap-10 lg:py-14">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-6 xl:col-span-6">
          <motion.div {...rise(0)}>
            <AwardBadge />
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="text-4xl leading-[1.2] font-bold tracking-tight text-balance md:text-6xl md:leading-[1.15] lg:text-5xl xl:text-[3.5rem]"
          >
            {t('home.hero.title')}{' '}
            <span className="bg-linear-to-r from-primary via-accent to-sky-500 bg-clip-text text-transparent rtl:bg-linear-to-l dark:from-sky-300 dark:via-primary dark:to-sky-400">
              {t('home.hero.titleAccent')}
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="max-w-[60ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg"
          >
            {t('home.hero.lead')}
          </motion.p>

          <motion.div {...rise(0.22)}>
            <TeamCredit />
          </motion.div>

          <motion.div {...rise(0.28)} className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="shadow-lg shadow-primary/25">
              <Link to={APP_BASE}>
                <LayoutDashboard data-icon="inline-start" aria-hidden />
                {t('home.nav.dashboard')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-background/70 backdrop-blur">
              <a href="#story">
                {t('home.hero.secondary')}
                <ArrowDown data-icon="inline-end" aria-hidden />
              </a>
            </Button>
          </motion.div>

          <motion.div {...rise(0.34)}>
            <SyntheticNotice className="rounded-md border border-warning-strong/30 bg-warning/5 px-3 py-2" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="relative flex min-w-0 flex-col gap-3 lg:col-span-6 xl:col-span-6"
        >
          {/* Glow behind the preview. */}
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-linear-to-br from-primary/25 via-transparent to-amber-400/20 blur-2xl"
          />
          <div className="relative">
            <GatewayPreview />

            {/* Floating chips; hidden on phones so nothing crowds the gutter. */}
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-4 start-6 hidden items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-e4 backdrop-blur sm:inline-flex"
            >
              <Cpu aria-hidden className="size-3.5 text-primary" />
              {t('home.hero.chipDeterministic')}
            </motion.span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 end-6 hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-background/90 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-e4 backdrop-blur sm:inline-flex dark:text-amber-200"
            >
              <Trophy aria-hidden className="size-3.5" />
              {t('hackathon.prize')} · <span dir="ltr">ITU</span>
            </motion.span>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">{t('home.preview.caption')}</p>
        </motion.div>
      </div>
    </section>
  )
}
