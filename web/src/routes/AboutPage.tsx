import { Award, Crown, Expand, Globe2, Presentation, Quote, ScanLine, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { BrandMark } from '@/components/BrandMark'
import { AWARD, HACKATHON, TEAM_LEADER, TEAM_MEMBERS } from '@/components/home/home-data'
import { PageHeader } from '@/components/PageHeader'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { APP_BASE } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/text'

type MemberKey = (typeof TEAM_MEMBERS)[number]['key']

/** Two initials from the localised name: first word, last word. */
/**
 * The team and the award, inside the system. The landing page tells this
 * story to visitors; judges and reviewers who go straight to /app need it too.
 *
 * Every fact comes from home-data.ts (certificate, README, technical report)
 * or the existing `hackathon.*` / `team.*` strings. Wording stays at "3rd
 * Prize" and "international award from ITU" — the certificate says nothing
 * about a global ranking, so neither does this page.
 *
 * Gold is the `warning` token: the theme's only warm hue, already tuned for
 * contrast in light and dark (`warning-strong` for text).
 */
export default function AboutPage() {
  const { t } = useTranslation()

  const facts = [
    { label: t('about.facts.host'), value: t('hackathon.host') },
    { label: t('about.facts.programme'), value: t('hackathon.programme'), ltr: true },
    { label: t('about.facts.track'), value: t('hackathon.track') },
    { label: t('about.facts.date'), value: t('hackathon.date') },
  ]

  const others = TEAM_MEMBERS.filter((m) => !m.leader)

  return (
    <>
      <PageHeader title={t('pages.about.title')} lead={t('pages.about.lead')} />

      {/* Hero: the prize first, then the hackathon it came from. */}
      <section
        aria-labelledby="award-heading"
        className="relative overflow-hidden rounded-2xl border border-warning/30 bg-linear-to-br from-warning/15 via-card to-primary/5 p-5 md:p-8"
      >
        <Trophy
          aria-hidden
          className="pointer-events-none absolute -end-6 -top-6 size-40 text-warning/10 md:size-56"
        />
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1 border-warning/40 bg-warning/15 text-warning-strong">
              <Award aria-hidden />
              {t('about.eyebrow')}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Globe2 aria-hidden />
              {t('hackathon.international')}
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            <h2
              id="award-heading"
              className="text-4xl font-bold leading-tight text-warning-strong md:text-5xl"
            >
              {t('hackathon.prize')}
            </h2>
            <p className="text-lg font-semibold text-foreground">{t('hackathon.name')}</p>
            <p className="text-sm text-foreground/80">
              {t('about.awardedTo')} · {t('team.ledBy')}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-card/70 p-3"
              >
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium text-foreground">
                  {f.ltr ? <span dir="ltr">{f.value}</span> : f.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('about.facts.partners')}</span>
            {HACKATHON.partners.map((p) => (
              <Badge key={p} variant="outline" dir="ltr" className="bg-card font-mono">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate and citation side by side on wide screens. */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award aria-hidden className="size-4 text-warning-strong" />
              {t('hackathon.certificate')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group relative block overflow-hidden rounded-xl border-4 border-warning/30 bg-muted p-1 outline-none transition hover:border-warning/60 focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label={`${t('hackathon.certificate')} — ${t('about.viewCertificate')}`}
                >
                  <img
                    src={AWARD.certificate}
                    alt={t('hackathon.certificateAlt')}
                    loading="lazy"
                    className="w-full rounded-lg"
                  />
                  <span className="absolute bottom-3 end-3 flex items-center gap-1 rounded-lg bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm transition group-hover:bg-background">
                    <Expand aria-hidden className="size-3.5" />
                    {t('about.viewCertificate')}
                  </span>
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
            <p className="text-xs text-muted-foreground">{t('about.certificateHint')}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote aria-hidden className="size-4 text-warning-strong" />
              {t('about.citationLabel')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <blockquote className="border-s-4 border-warning/50 ps-4 text-base leading-relaxed text-foreground">
              {t('hackathon.citation')}
            </blockquote>
            <p className="text-xs text-muted-foreground">{t('hackathon.signedBy')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Team: the leader featured, then the members. */}
      <section aria-labelledby="team-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="team-heading" className="text-lg font-semibold text-foreground">
            {t('about.teamTitle')} · {t('team.name')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('about.teamLead')}</p>
        </div>

        <LeaderCard memberKey={TEAM_LEADER.key} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((m) => (
            <MemberCard key={m.key} memberKey={m.key} />
          ))}
        </div>
      </section>

      {/* What the award was for. */}
      <Card className="bg-primary/5">
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
          <BrandMark className="size-12 shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-base font-semibold text-foreground">
              {t('about.whatTitle')} —{' '}
              <span lang="ar">{t('brand.name')}</span>{' '}
              <span dir="ltr" className="font-mono text-xs tracking-[0.12em] text-muted-foreground">
                {t('brand.latin')}
              </span>
            </p>
            <p className="text-sm font-medium text-foreground/80">{t('brand.tagline')}</p>
            <p className="text-sm text-muted-foreground">{t('about.whatBody')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to={APP_BASE}>
                <ScanLine aria-hidden />
                {t('about.openConsole')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`${APP_BASE}/slides`}>
                <Presentation aria-hidden />
                {t('about.openSlides')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function LeaderCard({ memberKey }: { memberKey: MemberKey }) {
  const { t } = useTranslation()
  const name = t(`team.members.${memberKey}.name`)

  return (
    <Card className="border-warning/40 bg-warning/5">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-fit">
          <Avatar className="size-16 ring-2 ring-warning/60">
            <AvatarFallback className="bg-warning/15 text-lg font-semibold text-warning-strong">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -top-2 -end-2 flex size-7 items-center justify-center rounded-full bg-warning text-white dark:text-background shadow-sm">
            <Crown aria-hidden className="size-4" />
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-foreground">{name}</p>
            <Badge className="gap-1 border-warning/40 bg-warning/15 text-warning-strong">
              <Crown aria-hidden />
              {t('team.leader')}
            </Badge>
          </div>
          <MemberDetails memberKey={memberKey} />
        </div>
      </CardContent>
    </Card>
  )
}

function MemberCard({ memberKey }: { memberKey: MemberKey }) {
  const { t } = useTranslation()
  const name = t(`team.members.${memberKey}.name`)

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <p className="min-w-0 font-semibold text-foreground">{name}</p>
        </div>
        <MemberDetails memberKey={memberKey} />
      </CardContent>
    </Card>
  )
}

function MemberDetails({ memberKey, className }: { memberKey: MemberKey; className?: string }) {
  const { t } = useTranslation()
  return (
    <div className={cn('flex flex-col gap-1 text-sm', className)}>
      <p className="text-foreground/80">
        {t(`team.members.${memberKey}.role`)} · {t(`team.members.${memberKey}.study`)}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground/70">{t('about.focusLabel')}:</span>{' '}
        {t(`team.members.${memberKey}.focus`)}
      </p>
    </div>
  )
}
