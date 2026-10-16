import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useFramework } from '@/lib/queries'

/**
 * The ITU AI Readiness framework, served unmodified from the organisers' own
 * dimensions.json.
 *
 * Three dimensions are marked because Samaam carries actual evidence for them,
 * not because they sound relevant: the policy sandbox it is (10), the health
 * data it minimises (11), and the human oversight the override enforces (13).
 * Claiming the other ten would be the padding the guide warns against.
 */
const OURS = new Set([10, 11, 13])

export default function ReadinessPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useFramework()

  const totalMetrics = data?.dimensions.reduce((sum, d) => sum + d.metrics.length, 0) ?? 0

  return (
    <>
      <PageHeader
        title={t('pages.readiness.title')}
        lead={t('pages.readiness.lead')}
        endpoint="GET /framework"
      />
      <p className="mb-4 text-sm text-muted-foreground">{t('readiness.lead')}</p>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {data && (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span dir="ltr" className="font-mono">
              {t('readiness.version', { v: data.framework_version })}
            </span>
            <span dir="ltr" className="font-mono tabular-nums">
              {data.factors.length} {t('readiness.factors')} · {data.dimensions.length}{' '}
              {t('readiness.dimensions')} · {totalMetrics} {t('readiness.metrics')}
            </span>
          </div>

          <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.factors.map((factor) => (
              <Card key={factor.id}>
                <CardContent className="py-3">
                  <p className="text-sm font-medium text-foreground">{factor.name}</p>
                  <p className="pt-0.5 text-xs text-muted-foreground">
                    {factor.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {data.dimensions.map((dimension) => {
              const ours = OURS.has(dimension.id)
              return (
                <Collapsible key={dimension.id} asChild>
                  <Card className={cn('py-0', ours && 'border-primary')}>
                    <CollapsibleTrigger className="w-full text-start">
                      <CardHeader className="gap-1 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span dir="ltr" className="font-mono text-xs tabular-nums text-muted-foreground">
                            D{String(dimension.id).padStart(2, '0')}
                          </span>
                          <CardTitle className="text-base">{dimension.name}</CardTitle>
                          {ours && (
                            <Badge className="rounded-full border-primary bg-transparent text-primary">
                              {t('readiness.ours')}
                            </Badge>
                          )}
                          <span dir="ltr" className="ms-auto font-mono text-xs tabular-nums text-muted-foreground">
                            {dimension.metrics.length} {t('readiness.metrics')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {dimension.description}
                        </p>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="border-t border-border/60 py-3">
                        <ul className="flex flex-col gap-1.5">
                          {dimension.metrics.map((metric) => (
                            <li key={metric.id} className="text-sm">
                              <span dir="ltr" className="font-mono text-xs text-muted-foreground">
                                {metric.id}
                              </span>{' '}
                              <span className="font-medium text-foreground">{metric.name}</span>
                              <span className="text-muted-foreground"> — {metric.description}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
