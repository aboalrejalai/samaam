import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { useKbGaps } from '@/lib/queries'

/**
 * The regulatory gap matrix (ported from boards/Gaps.dc.html).
 *
 * Four-column matrix on desktop, stacked cards on mobile.
 * Localised text comes from t() keyed by gap.id with graceful fallback
 * to the API's wire value for unknown IDs.
 */

export default function GapsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useKbGaps()

  return (
    <div className="flex flex-col gap-5" id="gaps">
      {/* Page head card with healthy kidney render */}
      <section
        className="card rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-sa-50 to-card grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_120px] gap-6 items-center overflow-hidden border border-border"
        aria-label={t('pages.gaps.title')}
        data-id="head"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('pages.gaps.title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t('pages.gaps.lead')}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">{t('gaps.note')}</p>
        </div>
        <img
          src="/models/kidney.webp"
          alt="A healthy human kidney."
          className="h-[120px] sm:h-[132px] w-auto mx-auto object-contain hidden md:block"
          data-id="head.kidney"
        />
      </section>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      )}

      {data && (
        <section
          className="card rounded-2xl border border-border overflow-hidden"
          aria-label={t('pages.gaps.title')}
          data-id="matrix"
        >
          {/* Desktop four-column matrix */}
          <div className="hidden md:grid gaps" role="table">
            <div className="hd">{t('gaps.columns.gap')}</div>
            <div className="hd">{t('gaps.columns.finding')}</div>
            <div className="hd">{t('gaps.columns.implication')}</div>
            <div className="hd rec">{t('gaps.columns.recommendation')}</div>

            {data.map((gap) => {
              const title = t(`gaps.items.${gap.id}.title`, { defaultValue: gap.title })
              const finding = t(`gaps.items.${gap.id}.finding`, { defaultValue: gap.finding })
              const implication = t(`gaps.items.${gap.id}.implication`, { defaultValue: gap.implication })
              const recommendation = t(`gaps.items.${gap.id}.recommendation`, { defaultValue: gap.recommendation })

              return (
                <div key={gap.id} className="contents" data-id={`gap.${gap.id.toLowerCase().replace('-', '.')}`}>
                  <div>
                    <span dir="ltr" className="gap-id">
                      {gap.id}
                    </span>
                    <span className="gap-title text-foreground">{title}</span>
                  </div>
                  <div className="text-foreground/90">{finding}</div>
                  <div className="text-foreground/90">{implication}</div>
                  <div className="rec text-foreground">{recommendation}</div>
                </div>
              )
            })}
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden flex flex-col divide-y divide-border">
            {data.map((gap) => {
              const title = t(`gaps.items.${gap.id}.title`, { defaultValue: gap.title })
              const finding = t(`gaps.items.${gap.id}.finding`, { defaultValue: gap.finding })
              const implication = t(`gaps.items.${gap.id}.implication`, { defaultValue: gap.implication })
              const recommendation = t(`gaps.items.${gap.id}.recommendation`, { defaultValue: gap.recommendation })

              return (
                <div key={gap.id} className="p-4 flex flex-col gap-3 text-sm">
                  <div>
                    <span dir="ltr" className="gap-id">
                      {gap.id}
                    </span>
                    <h3 className="font-semibold text-base text-foreground">{title}</h3>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">
                      {t('gaps.columns.finding')}
                    </p>
                    <p className="text-foreground/90">{finding}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">
                      {t('gaps.columns.implication')}
                    </p>
                    <p className="text-foreground/90">{implication}</p>
                  </div>

                  <div className="p-3 bg-primary-subtle rounded-lg border border-primary/20">
                    <p className="text-xs font-medium text-primary mb-0.5">
                      {t('gaps.columns.recommendation')}
                    </p>
                    <p className="text-foreground font-medium">{recommendation}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
