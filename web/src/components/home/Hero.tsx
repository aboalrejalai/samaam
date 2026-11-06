import { ArrowRight, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { DEMO_TIMING, SC02 } from '@/components/home/home-data'
import { Button } from '@/components/ui/button'
import { APP_BASE } from '@/lib/routes'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="wrap pt-10 md:pt-14" data-id="hero">
      {/* Heading and lead side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 items-end">
        <h1 className="h-hero" data-id="hero.title">
          {t('home.hero.title')}{' '}
          <span style={{ color: 'var(--primary)' }}>{t('home.hero.titleAccent')}</span>
        </h1>
        <div className="flex flex-col gap-5">
          <p className="lead" data-id="hero.lead">
            {t('home.hero.lead')}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild size="lg" className="btn btn-primary font-semibold">
              <Link to={APP_BASE}>
                {t('home.hero.openDashboard')}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn btn-outline font-semibold">
              <a href="#how">{t('home.hero.howItWorks')}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero stage: request + amber line, valve with 403 chip, dashed line + kidney */}
      <figure
        data-id="hero.stage"
        className="grid grid-cols-1 md:grid-cols-[minmax(150px,1fr)_minmax(0,720px)_minmax(200px,1fr)] items-center gap-6 md:gap-0 mt-10"
      >
        {/* Start side: Request */}
        <figcaption className="flex flex-col gap-2.5 min-w-0">
          <p className="micro strong" style={{ color: 'var(--warning-strong)' }}>
            {t('home.hero.stageRequest')}
          </p>
          <p className="mono small leading-relaxed">
            {SC02.agent} · {SC02.volume} mL<br />
            CTDIvol {SC02.ctdivol} mGy<br />
            DLP {SC02.dlp} mGy·cm
          </p>
          <div
            className="hidden md:block h-0.5 rounded-xs"
            style={{
              background: 'var(--contrast-liquid)',
              marginInlineEnd: '-24px',
            }}
          />
          <div
            className="md:hidden h-0.5 w-24 rounded-xs"
            style={{ background: 'var(--contrast-liquid)' }}
          />
          <p className="micro muted max-w-[190px]">
            {t('home.hero.stageProtocol')}
          </p>
        </figcaption>

        {/* Middle: Valve with 403 chip */}
        <div className="relative min-w-0 px-2 sm:px-6">
          <img
            src="/models/valve.webp"
            alt={t('models.valveAlt')}
            className="w-full object-contain mx-auto max-h-[360px]"
            data-id="hero.valve"
          />
          <p
            className="chip chip-err absolute start-1/2 -bottom-2 -translate-x-1/2 rtl:translate-x-1/2 h-8 text-sm font-semibold shadow-xs"
          >
            <Lock className="size-4" aria-hidden />
            <span className="mono">403</span> {t('home.hero.stageHeld')}
          </p>
        </div>

        {/* End side: Dashed line and injured kidney */}
        <div className="flex items-center min-w-0 justify-center md:justify-start">
          <div className="hidden md:block flex-1 border-t-2 border-dashed border-gray-300 min-w-6 -ms-6" />
          <div className="relative flex-none w-[180px] sm:w-[210px]">
            <img
              src="/models/kidney-injured.webp"
              alt={t('models.kidneyInjuredAlt')}
              className="w-full object-contain"
              data-id="hero.kidney"
            />
          </div>
        </div>
      </figure>

      {/* Readings row: eGFR, AKI risk, demo latency */}
      <dl
        data-id="hero.readings"
        className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-10 mt-10 border-t border-border"
      >
        <div className="py-4.5 border-b sm:border-b-0 border-border">
          <dt className="small muted">{t('home.hero.egfrLabel')}</dt>
          <dd className="mono text-2xl sm:text-3xl leading-9 font-semibold">
            {SC02.egfr} <span className="small muted font-normal">{t('home.hero.egfrThreshold')}</span>
          </dd>
        </div>
        <div className="py-4.5 border-b sm:border-b-0 border-border">
          <dt className="small muted">{t('home.hero.riskLabel')}</dt>
          <dd className="mono text-2xl sm:text-3xl leading-9 font-semibold">
            {SC02.riskBand}
          </dd>
        </div>
        <div className="py-4.5">
          <dt className="small muted">{t('home.hero.demoLabel')}</dt>
          <dd className="mono text-2xl sm:text-3xl leading-9 font-semibold">
            {DEMO_TIMING.blockMs} ms <span className="small muted font-normal">{t('home.hero.demoNote')}</span>
          </dd>
        </div>
      </dl>
    </section>
  )
}
