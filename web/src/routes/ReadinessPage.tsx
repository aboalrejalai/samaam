import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useFramework } from '@/lib/queries'
import { cn } from '@/lib/utils'

/**
 * The ITU AI Readiness framework (ported from boards/Readiness.dc.html).
 *
 * Dimensions list in one card with rows, the marked ones tinted,
 * collapsible metrics, with Factors in a right-hand column.
 * Counts and version line from the data.
 */

const OURS = new Set([10, 11, 13])

export default function ReadinessPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useFramework()
  const [openDims, setOpenDims] = useState<Set<number>>(new Set([10]))

  const totalMetrics = data?.dimensions.reduce((sum, d) => sum + d.metrics.length, 0) ?? 0

  function toggleDim(id: number) {
    setOpenDims((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5" id="readiness">
      {/* Page head */}
      <div
        className="flex flex-wrap items-end justify-between gap-3 sm:gap-6"
        data-id="head"
      >
        <div className="max-w-[760px]">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('pages.readiness.title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t('pages.readiness.lead')}
          </p>
        </div>

        {data && (
          <p dir="ltr" className="font-mono text-xs text-muted-foreground" data-id="head.counts">
            {t('readiness.summary', {
              v: data.framework_version,
              factors: data.factors.length,
              dimensions: data.dimensions.length,
              metrics: totalMetrics,
            })}
          </p>
        )}
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {data && (
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] gap-5 items-start"
          data-id="grid"
        >
          {/* Dimensions list in one card with rows */}
          <section
            className="card rounded-2xl border border-border overflow-hidden min-w-0"
            aria-label={t('pages.readiness.title')}
            data-id="dimensions"
          >
            <ul className="flex flex-col divide-y divide-border">
              {data.dimensions.map((dimension) => {
                const ours = OURS.has(dimension.id)
                const isOpen = openDims.has(dimension.id)

                return (
                  <li
                    key={dimension.id}
                    className={cn(
                      'dim transition-colors',
                      ours && 'dim ours bg-primary-subtle/70',
                    )}
                    data-id={`dimension.${dimension.id}`}
                  >
                    <span
                      dir="ltr"
                      className={cn(
                        'd font-mono text-xs sm:text-sm',
                        ours ? 'text-primary font-bold' : 'text-muted-foreground',
                      )}
                    >
                      D{String(dimension.id).padStart(2, '0')}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleDim(dimension.id)}
                      className="flex flex-wrap items-center gap-2 text-start cursor-pointer w-full"
                    >
                      <span className="font-semibold text-sm sm:text-base text-foreground">
                        {dimension.name}
                      </span>
                      {ours && (
                        <span className="chip border-primary text-primary bg-card text-xs">
                          {t('readiness.ours')}
                        </span>
                      )}
                      <span className="ms-auto text-muted-foreground sm:hidden">
                        {isOpen ? (
                          <ChevronUp className="size-4" aria-hidden />
                        ) : (
                          <ChevronDown className="size-4" aria-hidden />
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleDim(dimension.id)}
                      className="ct font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5"
                    >
                      <span dir="ltr">
                        {dimension.metrics.length} {t('readiness.metrics')}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="size-3.5 hidden sm:inline-block" aria-hidden />
                      ) : (
                        <ChevronDown className="size-3.5 hidden sm:inline-block" aria-hidden />
                      )}
                    </button>

                    {/* Collapsible details and metrics */}
                    {isOpen && (
                      <div className="col-start-2 col-end-4 pt-2 pb-1">
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {dimension.description}
                        </p>
                        <div className="flex flex-col gap-1 border-t border-border/70 pt-2">
                          {dimension.metrics.map((metric) => (
                            <div key={metric.id} className="metric">
                              <span dir="ltr" className="mono micro muted">
                                {metric.id}
                              </span>
                              <span className="text-xs sm:text-sm">
                                <span className="font-semibold text-foreground">
                                  {metric.name}
                                </span>{' '}
                                <span className="text-muted-foreground">
                                  {metric.description}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Factors in a right-hand column */}
          <aside
            className="card rounded-2xl border border-border p-4 sm:p-5"
            aria-label={t('readiness.factors')}
            data-id="factors"
          >
            <h2 className="text-base font-semibold mb-2 text-foreground">
              {t('readiness.factors')}
            </h2>
            <dl className="flex flex-col">
              {data.factors.map((factor) => (
                <div key={factor.id} className="py-2.5 border-t border-border">
                  <dt className="text-xs sm:text-sm font-semibold text-foreground">
                    {factor.name}
                  </dt>
                  <dd className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {factor.description}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      )}
    </div>
  )
}
