import { ArrowRight, Crown, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { AWARD, TEAM_MEMBERS } from '@/components/home/home-data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { APP_BASE } from '@/lib/routes'
import { initials } from '@/lib/text'
import { cn } from '@/lib/utils'

/**
 * Team and award page (ported from boards/About.dc.html).
 *
 * Full-size certificate dialog, prize citation and facts,
 * four member cards, and 'What Samaam is' band with the valve render.
 */

export default function AboutPage() {
  const { t } = useTranslation()

  const facts = [
    { label: t('about.facts.host'), value: t('hackathon.host'), ltr: false },
    { label: t('about.facts.programme'), value: t('hackathon.programme'), ltr: true },
    { label: t('about.facts.track'), value: t('hackathon.track'), ltr: false },
    { label: t('about.facts.date'), value: t('hackathon.date'), ltr: false },
  ]

  return (
    <div className="flex flex-col gap-5" id="about">
      {/* Page head */}
      <div data-id="head">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('pages.about.title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {t('pages.about.lead')}
        </p>
      </div>

      {/* The award card */}
      <section
        className="card rounded-2xl p-5 sm:p-6 bg-warning-bg border border-warning-line grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-6 sm:gap-8 items-center"
        aria-label={t('hackathon.prize')}
        data-id="award"
      >
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`${t('hackathon.certificate')} — ${t('about.viewCertificate')}`}
              className="block bg-card p-2 sm:p-2.5 border border-warning-line rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer text-start"
              data-id="award.certificate"
            >
              <img
                src={AWARD.certificate}
                alt={t('hackathon.certificateAlt')}
                className="w-full rounded-lg object-contain"
              />
            </button>
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] overflow-auto p-2 sm:max-w-5xl">
            <DialogTitle className="sr-only">{t('hackathon.certificate')}</DialogTitle>
            <DialogDescription className="sr-only">
              {t('hackathon.certificateAlt')}
            </DialogDescription>
            <img
              src={AWARD.certificate}
              alt={t('hackathon.certificateAlt')}
              className="w-full rounded-lg"
            />
          </DialogContent>
        </Dialog>

        <div className="flex flex-col gap-3 min-w-0" data-id="award.text">
          <span className="chip chip-gold w-fit bg-card">
            <Trophy className="size-3.5" aria-hidden />
            {t('hackathon.certificate')}
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-warning-strong leading-tight">
            {t('hackathon.prize')}
          </h2>

          <p className="text-base sm:text-lg font-semibold text-foreground">
            {t('hackathon.name')}, {t('hackathon.host')}
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('about.awardedTo')} · {t('team.ledBy')}
          </p>

          <blockquote className="text-sm sm:text-base leading-relaxed pt-2.5 border-t border-warning-line text-foreground/90 italic">
            “{t('hackathon.citation')}”
          </blockquote>

          <p className="text-xs text-muted-foreground">{t('hackathon.signedBy')}</p>
        </div>
      </section>

      {/* Facts row */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" data-id="facts">
        {facts.map((f) => (
          <Card key={f.label} className="p-3.5 sm:p-4 border border-border">
            <dt className="text-xs text-muted-foreground mb-0.5">{f.label}</dt>
            <dd className="text-xs sm:text-sm font-semibold text-foreground">
              {f.ltr ? <span dir="ltr">{f.value}</span> : f.value}
            </dd>
          </Card>
        ))}
      </dl>

      {/* The team */}
      <section aria-label={t('about.teamTitle')} data-id="team">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-foreground">
            {t('about.teamTitle')} · {t('team.name')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t('about.teamLead')}</p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM_MEMBERS.map((member) => {
            const memberName = t(`team.members.${member.key}.name`)
            const memberRole = t(`team.members.${member.key}.role`)
            const memberStudy = t(`team.members.${member.key}.study`)
            const memberFocus = t(`team.members.${member.key}.focus`)
            const initialsText = initials(memberName)

            return (
              <li
                key={member.key}
                className={cn(
                  'card rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 border',
                  member.leader
                    ? 'border-warning-line bg-warning-bg'
                    : 'border-border bg-card',
                )}
                data-id={`team.${member.key}`}
              >
                <div className="flex items-center gap-2.5 min-h-[44px]">
                  <span className={cn('avatar', member.leader && 'avatar-gold bg-card')}>
                    {initialsText}
                  </span>
                  {member.leader && (
                    <span className="chip chip-gold bg-card">
                      <Crown className="size-3.5" aria-hidden />
                      {t('team.leader')}
                    </span>
                  )}
                </div>

                <p className="font-semibold text-base text-foreground leading-snug">
                  {memberName}
                </p>

                <p className="text-xs text-muted-foreground">
                  {memberRole} · {memberStudy}
                </p>

                <p className="text-xs text-foreground/90 leading-relaxed mt-auto pt-2 border-t border-border/60">
                  <span className="font-semibold text-foreground">{t('about.focusLabel')}:</span>{' '}
                  {memberFocus}
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* What Samaam is band with the valve image */}
      <section
        className="card rounded-2xl p-5 sm:p-6 bg-primary-subtle border border-primary/20 grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)_auto] gap-6 items-center"
        aria-label={t('about.whatTitle')}
        data-id="what"
      >
        <img
          src="/models/valve.webp"
          alt="The Samaam valve."
          className="max-w-[120px] md:max-w-[140px] w-auto h-auto mx-auto object-contain"
          data-id="what.valve"
        />

        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            {t('about.whatTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t('about.whatBody')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-start md:justify-end shrink-0">
          <Button asChild size="sm" className="gap-1.5 cursor-pointer">
            <Link to={APP_BASE}>
              {t('about.openConsole')}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="cursor-pointer bg-card">
            <Link to={`${APP_BASE}/slides`}>
              {t('about.openSlides')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
