import { motion } from 'motion/react'
import { ArrowUpRight, LayoutDashboard, Trophy, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { APP_BASE } from '@/lib/routes'
import { LINKS } from './home-data'
import { EASE } from './motion-kit'

/** Full-bleed brand band: celebrates the award, then hands off to the dashboard. */
export function ClosingCta() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden bg-gradient-brand text-primary-foreground">
      {/* Light grid and glows over the gradient. Decorative. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div aria-hidden className="absolute -start-32 -top-32 -z-10 size-96 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="absolute -end-24 -bottom-40 -z-10 size-[28rem] rounded-full bg-black/15 blur-3xl" />

      {/* The valve mark, enlarged as a watermark. Decorative. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        className="absolute -end-20 -bottom-20 -z-10 size-96 opacity-10 md:size-[32rem]"
      >
        <path d="M12 3v6m0 6v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 12h3.6m6.8 0H19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center md:px-8 md:py-32"
      >
        <a
          href="#award"
          className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-white/10 py-1.5 ps-1.5 pe-4 text-sm font-semibold shadow-e3 backdrop-blur transition-colors hover:bg-white/20"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-amber-600 text-white shadow-e2">
            <Trophy aria-hidden className="size-4" />
          </span>
          <span className="min-w-0 text-start">{t('home.cta.award')}</span>
        </a>

        <h2 className="text-3xl leading-[1.2] font-bold text-balance sm:text-4xl md:text-6xl">
          {t('home.cta.title')}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty opacity-90 md:text-xl">
          {t('home.cta.body')}
        </p>

        <div className="mt-2 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            asChild
            size="lg"
            className="bg-background text-foreground shadow-e5 hover:bg-background/90"
          >
            <Link to={APP_BASE}>
              <LayoutDashboard data-icon="inline-start" aria-hidden />
              {t('home.nav.dashboard')}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="border border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
          >
            <a href={LINKS.repo} target="_blank" rel="noreferrer">
              {t('home.cta.repo')}
              <ArrowUpRight data-icon="inline-end" aria-hidden className="rtl:-scale-x-100" />
            </a>
          </Button>
        </div>

        <nav
          aria-label={t('home.cta.award')}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium opacity-90"
        >
          <a href="#award" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
            <Trophy aria-hidden className="size-4" />
            {t('home.cta.seeAward')}
          </a>
          <span aria-hidden className="hidden size-1 rounded-full bg-current opacity-60 sm:block" />
          <a href="#team" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
            <Users aria-hidden className="size-4" />
            {t('home.cta.meetTeam')}
          </a>
        </nav>
      </motion.div>
    </section>
  )
}
