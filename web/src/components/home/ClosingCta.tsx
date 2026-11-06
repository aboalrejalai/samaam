import { ArrowRight, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { APP_BASE } from '@/lib/routes'
import { LINKS } from './home-data'

export function ClosingCta() {
  const { t } = useTranslation()

  return (
    <section
      id="open"
      style={{ background: 'var(--sa-900)', color: '#ffffff' }}
      data-id="cta"
    >
      <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-18 items-center py-16">
        <div className="flex flex-col gap-3">
          <h2 className="h-sec text-white">{t('home.cta.title')}</h2>
          <p className="text-lg leading-7" style={{ color: 'var(--sa-200)' }}>
            {t('home.cta.body')}
          </p>
        </div>
        <div className="flex flex-nowrap items-center gap-3 justify-start md:justify-end shrink-0">
          <Button
            asChild
            size="lg"
            className="btn font-semibold whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 border-0"
            style={{ background: '#ffffff', color: 'var(--sa-900)' }}
          >
            <Link to={APP_BASE}>
              {t('home.cta.dashboard')}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="btn font-semibold whitespace-nowrap shrink-0 transition-colors hover:bg-white/10"
            style={{ borderColor: 'var(--sa-300)', color: '#ffffff', background: 'transparent' }}
          >
            <a href={LINKS.repo} target="_blank" rel="noreferrer">
              {t('home.cta.repo')}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
