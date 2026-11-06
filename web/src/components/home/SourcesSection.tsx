import { useTranslation } from 'react-i18next'
import { COUNTS } from './home-data'

export function SourcesSection() {
  const { t } = useTranslation()

  return (
    <section id="sources" className="wrap sec" data-id="sources">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-18 items-center">
        <div className="flex flex-col gap-3">
          <h2 className="h-sec">{t('home.sources.title')}</h2>
          <p className="lead">{t('home.sources.lead')}</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-0" data-id="sources.counts">
          <div className="py-3.5 border-t border-border">
            <dd className="mono text-2xl sm:text-3xl leading-9 font-semibold">
              {COUNTS.records}
            </dd>
            <dt className="small muted mt-0.5">{t('home.sources.counts.records')}</dt>
          </div>
          <div className="py-3.5 border-t border-border">
            <dd className="mono text-2xl sm:text-3xl leading-9 font-semibold">
              {COUNTS.chunks.toLocaleString('en')}
            </dd>
            <dt className="small muted mt-0.5">{t('home.sources.counts.passages')}</dt>
          </div>
          <div className="py-3.5 border-t border-border">
            <dd className="mono text-2xl sm:text-3xl leading-9 font-semibold">
              {COUNTS.rules}
            </dd>
            <dt className="small muted mt-0.5">{t('home.sources.counts.rules')}</dt>
          </div>
          <div className="py-3.5 border-t border-border">
            <dd className="mono text-2xl sm:text-3xl leading-9 font-semibold">
              {COUNTS.gaps}
            </dd>
            <dt className="small muted mt-0.5">{t('home.sources.counts.gaps')}</dt>
          </div>
        </dl>
      </div>
    </section>
  )
}
