import { ArrowUpRight, Crown, ExternalLink, FolderGit2, Scale, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BrandMark } from '@/components/BrandMark'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SyntheticNotice } from '@/components/SyntheticNotice'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { AWARD, LINKS, TEAM_MEMBERS } from './home-data'

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</p>
}

export function HomeFooter() {
  const { t } = useTranslation()

  return (
    <footer className="relative isolate overflow-hidden border-t bg-card">
      {/* Brand hairline across the top edge. Decorative. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" />
      <div aria-hidden className="bg-mesh pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pt-16 pb-10 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="flex items-center gap-2.5">
              <BrandMark className="size-10 rounded-lg" />
              <span lang="ar" className="text-xl font-bold">
                {t('brand.name')}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t('brand.tagline')}</p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={LINKS.repo}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
              >
                <FolderGit2 aria-hidden className="size-4" />
                <span dir="ltr" className="font-mono text-xs">
                  github.com/aboalrejal-ai/samaam
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100"
                />
              </a>
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Scale aria-hidden className="size-4" />
                {t('home.footer.license')}
              </p>
            </div>
          </div>

          {/* Award */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <ColumnTitle>{t('home.footer.awardHeading')}</ColumnTitle>
            <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-50 to-background p-5 shadow-e2 dark:from-amber-500/10 dark:to-card">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-300 to-amber-600 text-white shadow-e2">
                  <Trophy aria-hidden className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm leading-snug font-bold">{t('hackathon.prizeLong')}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{t('hackathon.international')}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-500/20 pt-3">
                <time dateTime={AWARD.date} className="text-xs font-medium text-muted-foreground">
                  {t('hackathon.date')}
                </time>
                <a
                  href={AWARD.certificate}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 underline-offset-4 hover:underline dark:text-amber-300"
                >
                  {t('home.footer.viewCertificate')}
                  <ExternalLink aria-hidden className="size-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <ColumnTitle>{t('team.name')}</ColumnTitle>
            <ul className="flex flex-col gap-2">
              {TEAM_MEMBERS.map((member) => (
                <li
                  key={member.key}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg text-sm',
                    member.leader
                      ? 'border border-primary/25 bg-primary/5 px-3 py-2 font-semibold'
                      : 'px-3 py-1 text-muted-foreground',
                  )}
                >
                  {member.leader ? (
                    <Crown aria-hidden className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <span aria-hidden className="mx-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                  )}
                  <span className="flex min-w-0 flex-col">
                    <span>{t(`team.members.${member.key}.name`)}</span>
                    {member.leader && (
                      <span className="text-xs font-medium text-primary">{t('team.leader')}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preferences */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <ColumnTitle>{t('home.footer.preferences')}</ColumnTitle>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SyntheticNotice />
          <p className="text-xs text-muted-foreground">{t('home.footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
