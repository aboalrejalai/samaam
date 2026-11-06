import { useTranslation } from 'react-i18next'

export function CaseSection() {
  const { t } = useTranslation()

  return (
    <section id="how" className="wrap sec" data-id="case">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18 items-center">
        {/* Figure with model and annotations */}
        <figure
          className="relative w-full max-w-[470px] mx-auto select-none"
          data-id="case.model"
        >
          <img
            src="/models/abdomen.webp"
            alt={t('models.abdomenAlt')}
            className="w-full object-contain"
          />

          {/* Hotspot 1: eGFR 19.1 pointing to kidneys */}
          <div
            className="hot flex-row-reverse"
            style={{
              top: '47%',
              insetInlineEnd: '66%',
            }}
          >
            <span className="hot-dot" />
            <span className="hot-line w-8 sm:w-16" />
            <span className="hot-label">
              <b>{t('home.case.hotspots.egfr.value')}</b>
              <span>{t('home.case.hotspots.egfr.label')}</span>
            </span>
          </div>

          {/* Hotspot 2: Scan region */}
          <div
            className="hot"
            style={{
              top: '35%',
              insetInlineStart: '62%',
            }}
          >
            <span className="hot-dot" style={{ borderColor: 'var(--primary)' }} />
            <span className="hot-line w-8 sm:w-16" />
            <span className="hot-label">
              <b style={{ fontFamily: 'var(--font-sans)', fontSize: '14px' }}>
                {t('home.case.hotspots.region.value')}
              </b>
              <span>{t('home.case.hotspots.region.label')}</span>
            </span>
          </div>
        </figure>

        {/* Steps */}
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <p className="chip w-fit">
              <span className="mono font-semibold">SC-02</span> {t('home.case.chip')}
            </p>
            <h2 className="h-sec">{t('home.case.title')}</h2>
            <p className="lead">{t('home.case.lead')}</p>
          </div>

          <ol className="flex flex-col">
            <li className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 py-3.5 border-t border-border">
              <span className="mono muted font-semibold">{t('home.case.steps.arrive.code')}</span>
              <div>
                <p className="strong">{t('home.case.steps.arrive.title')}</p>
                <p className="small muted mt-0.5">{t('home.case.steps.arrive.body')}</p>
              </div>
            </li>
            <li className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 py-3.5 border-t border-border">
              <span className="mono muted font-semibold">{t('home.case.steps.prepare.code')}</span>
              <div>
                <p className="strong">{t('home.case.steps.prepare.title')}</p>
                <p className="small muted mt-0.5">{t('home.case.steps.prepare.body')}</p>
              </div>
            </li>
            <li className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 py-3.5 border-t border-border">
              <span className="mono muted font-semibold">{t('home.case.steps.check.code')}</span>
              <div>
                <p className="strong">{t('home.case.steps.check.title')}</p>
                <p className="small muted mt-0.5">{t('home.case.steps.check.body')}</p>
              </div>
            </li>
            <li className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 py-3.5 border-t border-border">
              <span
                className="mono font-semibold"
                style={{ color: 'var(--destructive-strong)' }}
              >
                {t('home.case.steps.refuse.code')}
              </span>
              <div>
                <p className="strong">{t('home.case.steps.refuse.title')}</p>
                <p className="small muted mt-0.5">{t('home.case.steps.refuse.body')}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
