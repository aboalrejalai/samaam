import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useKbGaps } from '@/lib/queries'

/**
 * Where the regulation is silent.
 *
 * Each gap is an absence that was searched for and not found, which is why
 * every card states the finding before its consequence. Claiming a gap
 * without having looked is the failure mode the hackathon guide names.
 */
export default function GapsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useKbGaps()

  return (
    <>
      <PageHeader
        title={t('pages.gaps.title')}
        lead={t('pages.gaps.lead')}
        endpoint="GET /kb/gaps"
      />
      <p className="mb-4 text-sm text-muted-foreground">{t('gaps.lead')}</p>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {data?.map((gap) => (
          <Card key={gap.id}>
            <CardHeader className="pb-3">
              <span dir="ltr" className="font-mono text-xs text-muted-foreground">{gap.id}</span>
              <CardTitle className="text-base leading-tight">{gap.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('gaps.finding')}</p>
                <p className="pt-0.5 text-foreground/80">{gap.finding}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t('gaps.implication')}</p>
                <p className="pt-0.5 text-foreground/80">{gap.implication}</p>
              </div>
              <div className="rounded-md border-s-2 border-primary bg-primary/5 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {t('gaps.recommendation')}
                </p>
                <p className="pt-0.5 text-foreground">{gap.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
