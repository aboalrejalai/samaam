import {
  CalendarDays,
  ExternalLink,
  Globe2,
  MapPin,
  Maximize2,
  PenLine,
  Quote,
  Sparkles,
  Stethoscope,
  Trophy,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AWARD, HACKATHON } from './home-data'
import { EASE, Reveal, Stagger, staggerChild } from './motion-kit'

/**
 * The prize, stated once and plainly: 3rd Prize, an international award from
 * ITU. Gold is reserved for the prize itself (medal, headline, frame); the rest
 * of the section stays on Soft tokens. Every string comes from `hackathon.*`;
 * the certificate is the evidence, so it opens full-size.
 */
export function AwardSection() {
  const { t } = useTranslation()

  const facts = [
    { icon: MapPin, label: t('home.award.hostLabel'), value: t('hackathon.host'), ltr: false },
    { icon: Sparkles, label: t('home.award.programmeLabel'), value: t('hackathon.programme'), ltr: true },
    { icon: Stethoscope, label: t('home.award.trackLabel'), value: t('hackathon.track'), ltr: false },
    { icon: CalendarDays, label: t('home.award.dateLabel'), value: t('hackathon.date'), ltr: false },
  ]

  return (
    <section id="award" className="relative isolate scroll-mt-20 overflow-hidden py-20 md:py-28">
      {/* Gold and brand glows behind the trophy. Decorative. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-muted/40" />
      <div
        aria-hidden
        className="absolute -top-24 start-[-10%] -z-10 size-[28rem] rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 end-[-10%] -z-10 size-[30rem] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 md:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-7">
          <Reveal className="flex flex-col gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Trophy aria-hidden className="size-3.5 shrink-0" />
              {t('home.award.eyebrow')}
            </p>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <Medal place={AWARD.place} label={t('home.award.medalLabel')} />
              <div className="flex min-w-0 flex-col gap-2">
                <h2 className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 bg-clip-text pb-1 text-5xl leading-[1.15] font-bold text-transparent md:text-7xl dark:from-amber-200 dark:via-amber-300 dark:to-amber-500">
                  {t('hackathon.prize')}
                </h2>
                <p className="text-xl leading-snug font-semibold text-balance md:text-2xl">
                  {t('hackathon.name')}
                </p>
              </div>
            </div>

            <p className="inline-flex w-fit items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-base leading-relaxed font-medium text-primary md:text-lg">
              <Globe2 aria-hidden className="mt-1 size-5 shrink-0" />
              {t('hackathon.international')}
            </p>
          </Reveal>

          <Stagger as="ul" className="grid gap-3 sm:grid-cols-2">
            {facts.map(({ icon: Icon, label, value, ltr }) => (
              <motion.li
                key={label}
                variants={staggerChild}
                className="flex items-start gap-3 rounded-xl border bg-card p-4"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden className="size-4" />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                  <span className="text-sm leading-snug font-semibold">
                    {ltr ? <span dir="ltr">{value}</span> : value}
                  </span>
                </div>
              </motion.li>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground">
              {t('home.award.partnersLabel')}
            </p>
            <ul className="flex flex-wrap gap-2">
              {HACKATHON.partners.map((p) => (
                <li
                  key={p}
                  dir="ltr"
                  className="rounded-md border bg-background px-3 py-1.5 text-sm font-bold tracking-wider shadow-xs"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <figure className="relative flex flex-col gap-3 rounded-xl border-s-4 border-amber-500 bg-card p-5 md:p-6">
              <Quote
                aria-hidden
                className="absolute end-4 top-4 size-8 text-amber-500/25 rtl:-scale-x-100"
              />
              <p className="text-xs font-medium text-muted-foreground">
                {t('home.award.citationLabel')}
              </p>
              <blockquote className="pe-8 text-base leading-relaxed font-medium text-pretty md:text-lg">
                {t('hackathon.citation')}
              </blockquote>
              <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Trophy aria-hidden className="size-3.5 text-amber-600 dark:text-amber-400" />
                  {t('home.award.awardedTo')}{' '}
                  <strong className="font-semibold text-foreground">{t('team.name')}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PenLine aria-hidden className="size-3.5" />
                  {t('hackathon.signedBy')}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Certificate />
        </motion.div>
      </div>
    </section>
  )
}

/** A gold medal on two ribbons, the place numeral at its centre. */
function Medal({ place, label }: { place: number; label: string }) {
  return (
    <motion.div
      role="img"
      aria-label={label}
      className="relative shrink-0"
      initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
    >
      <svg viewBox="0 0 120 150" className="h-36 w-auto drop-shadow-xl md:h-44" aria-hidden>
        <defs>
          <linearGradient id="award-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="0.45" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="award-gold-inner" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fcd34d" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* ribbons in the brand colour, so the medal belongs to Samaam */}
        <path d="M30 0h26l12 58H44z" className="fill-primary" />
        <path d="M90 0H64L52 58h24z" className="fill-primary/70" />
        <circle cx="60" cy="96" r="46" fill="url(#award-gold)" />
        <circle
          cx="60"
          cy="96"
          r="37"
          fill="url(#award-gold-inner)"
          stroke="#fef3c7"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeDasharray="3 4"
        />
        <text
          x="60"
          y="98"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="50"
          fontWeight="700"
          fill="#fffbeb"
          style={{ fontFamily: 'inherit' }}
        >
          {place}
        </text>
      </svg>
    </motion.div>
  )
}

/** The certificate in a tilted gold frame; click for the full-size image. */
function Certificate() {
  const { t } = useTranslation()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full cursor-zoom-in rounded-2xl text-start outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          <span
            aria-hidden
            className="absolute inset-4 -z-10 rounded-2xl bg-amber-400/30 blur-2xl transition-opacity group-hover:opacity-80 dark:bg-amber-500/20"
          />
          <span className="block -rotate-2 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-200 via-amber-50 to-amber-300 p-2.5 shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:rotate-0 rtl:rotate-2 rtl:group-hover:rotate-0 motion-reduce:transition-none dark:from-amber-700 dark:via-amber-900 dark:to-amber-600">
            <span className="block overflow-hidden rounded-xl bg-white">
              <img
                src={AWARD.certificate}
                alt={t('hackathon.certificateAlt')}
                width={1024}
                height={737}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </span>
          </span>
          <span className="absolute -top-3 end-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-amber-950 shadow-lg">
            <Trophy aria-hidden className="size-3.5" />
            {t('hackathon.prize')}
          </span>
          <span className="absolute bottom-4 start-4 inline-flex items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-medium shadow-md backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <Maximize2 aria-hidden className="size-3.5" />
            {t('home.award.viewFull')}
          </span>
        </button>
      </DialogTrigger>
      <p className="mt-5 text-center text-sm font-medium text-muted-foreground">
        {t('hackathon.certificate')}
      </p>

      <DialogContent className="max-h-[92dvh] gap-4 overflow-y-auto p-3 sm:max-w-5xl sm:p-5">
        <div className="flex flex-col gap-1 pe-10">
          <DialogTitle>{t('hackathon.certificate')}</DialogTitle>
          <DialogDescription>{t('hackathon.signedBy')}</DialogDescription>
        </div>
        <img
          src={AWARD.certificate}
          alt={t('hackathon.certificateAlt')}
          width={1024}
          height={737}
          className="h-auto w-full rounded-lg border"
        />
        <a
          href={AWARD.certificate}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t('home.award.openOriginal')}
          <ExternalLink aria-hidden className="size-3.5" />
        </a>
      </DialogContent>
    </Dialog>
  )
}
