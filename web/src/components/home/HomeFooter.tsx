import { ArrowUpRight, FolderGit2, Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { BrandMark } from '@/components/BrandMark'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SyntheticNotice } from '@/components/SyntheticNotice'
import { Separator } from '@/components/ui/separator'
import { APP_BASE } from '@/lib/routes'
import { LINKS } from './home-data'

export function HomeFooter() {
  const { t } = useTranslation()

  return (
    <footer className="rule-top bg-card" data-id="footer">
      <div className="wrap py-12 flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <BrandMark className="size-8" />
              <span lang="ar" className="text-lg font-bold">
                {t('brand.name')}
              </span>
              <span className="font-mono text-xs tracking-wider text-muted-foreground">
                {t('brand.latin')}
              </span>
            </div>
            <p className="small muted max-w-sm leading-relaxed">
              {t('brand.tagline')}
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <a
                href={LINKS.repo}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <FolderGit2 className="size-3.5" aria-hidden />
                <span dir="ltr" className="font-mono">
                  github.com/aboalrejalai/samaam
                </span>
                <ArrowUpRight
                  className="size-3 transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100"
                  aria-hidden
                />
              </a>
              <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Scale className="size-3.5" aria-hidden />
                {t('home.footer.license')}
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col gap-2.5 lg:col-span-4">
            <p className="micro strong text-muted-foreground uppercase tracking-wider">
              {t('home.footer.links')}
            </p>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>
                <Link to={APP_BASE} className="muted hover:text-foreground transition-colors">
                  {t('home.footer.console')}
                </Link>
              </li>
              <li>
                <Link
                  to={`${APP_BASE}/data`}
                  className="muted hover:text-foreground transition-colors"
                >
                  {t('home.footer.data')}
                </Link>
              </li>
              <li>
                <Link
                  to={`${APP_BASE}/about`}
                  className="muted hover:text-foreground transition-colors"
                >
                  {t('home.footer.about')}
                </Link>
              </li>
              <li>
                <Link
                  to={`${APP_BASE}/slides`}
                  className="muted hover:text-foreground transition-colors"
                >
                  {t('home.footer.slides')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Preferences */}
          <div className="flex flex-col gap-2.5 lg:col-span-3">
            <p className="micro strong text-muted-foreground uppercase tracking-wider">
              {t('home.footer.preferences')}
            </p>
            <LanguageToggle />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SyntheticNotice />
          <p className="micro muted">{t('home.footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
