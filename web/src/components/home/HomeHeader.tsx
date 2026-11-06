import { FlaskConical, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { BrandMark } from '@/components/BrandMark'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Button } from '@/components/ui/button'
import { APP_BASE } from '@/lib/routes'

export function HomeHeader() {
  const { t } = useTranslation()

  return (
    <>
      {/* 1. Notice bar */}
      <div className="site-notice" data-id="notice">
        <FlaskConical className="size-3.5 text-muted-foreground" aria-hidden />
        <span lang="ar" dir="rtl" className="font-medium">
          {t('home.notice.ar')}
        </span>
        <span className="muted">{t('home.notice.en')}</span>
      </div>

      {/* 2. Header */}
      <header className="wrap site-head" data-id="header">
        <Link to="/" className="brand p-0 flex items-center gap-2.5" aria-label={t('home.nav.home')}>
          <BrandMark className="size-9 shrink-0" />
          <span className="flex flex-col justify-center leading-tight">
            <span className="brand-name block leading-tight" lang="ar">
              {t('brand.name')}
            </span>
            <span className="brand-latin block leading-tight">{t('brand.latin')}</span>
          </span>
        </Link>

        <nav className="site-nav hidden md:flex" aria-label={t('home.nav.menu')}>
          <a href="#how">{t('home.nav.how')}</a>
          <a href="#arch">{t('home.nav.arch')}</a>
          <a href="#paths">{t('home.nav.paths')}</a>
          <a href="#sources">{t('home.nav.sources')}</a>
          <a href="#award">{t('home.nav.award')}</a>
        </nav>

        <div className="ms-auto flex items-center gap-2.5">
          <LanguageToggle />
          <a href="#award" className="chip chip-gold hidden sm:inline-flex">
            <Trophy className="size-3.5 text-warning-strong" aria-hidden />
            {t('home.hero.awardChip')}
          </a>
          <Button asChild className="btn btn-primary text-sm whitespace-nowrap">
            <Link to={APP_BASE}>{t('home.nav.dashboard')}</Link>
          </Button>
        </div>
      </header>
    </>
  )
}
