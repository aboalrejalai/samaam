import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { SearchComposer } from '@/components/kb/SearchComposer'
import { VerificationChip } from '@/components/primitives'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SamaamOfflineError } from '@/lib/api'
import { useKbSearchState } from '@/lib/kb-search'
import { useKbSearch } from '@/lib/queries'
import { scriptDirection } from '@/lib/text'

/**
 * Retrieval over the verified corpus.
 *
 * A search field, not a chat. Nothing is carried between queries and nothing is
 * generated: a question goes in, ranked records come back.
 *
 * Two things drive it. Typing debounces into live results, which is worth
 * keeping — watching records arrive as you type is the clearest demonstration
 * that retrieval is real. Submitting commits the question, and only a commit
 * writes history, so the trail holds questions rather than keystrokes.
 */
export default function KnowledgeBasePage() {
  const { t } = useTranslation()
  const kb = useKbSearchState()
  const [live, setLive] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setLive(kb.draft.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [kb.draft])

  // A committed question wins over the draft, so restoring a past search shows
  // its results before the debounce catches up.
  const term = kb.query || live

  const params = useMemo(
    () => ({
      q: term,
      collection: kb.collection,
      top_k: kb.topK,
      verified_only: kb.verifiedOnly,
    }),
    [term, kb.collection, kb.topK, kb.verifiedOnly],
  )
  const { data, isFetching, isError, error } = useKbSearch(params, term.length > 1)

  return (
    <>
      <PageHeader
        title={t('pages.kb.title')}
        lead={t('pages.kb.lead')}
        endpoint="GET /kb/search"
      />

      <SearchComposer
        draft={kb.draft}
        onDraftChange={kb.setDraft}
        onSubmit={kb.commit}
        collection={kb.collection}
        onCollectionChange={kb.setCollection}
        verifiedOnly={kb.verifiedOnly}
        onVerifiedOnlyChange={kb.setVerifiedOnly}
        topK={kb.topK}
        onTopKChange={kb.setTopK}
        busy={isFetching}
      />
      <p className="-mt-4 px-2 text-xs text-muted-foreground">{t('kb.hint')}</p>

      <div className="flex flex-col gap-3">
        {term.length <= 1 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {t('kb.prompt')}
            </CardContent>
          </Card>
        )}

        {/* A dead server and an empty corpus must never look the same. */}
        {isError && (
          <Card className="border-destructive-strong">
            <CardContent className="py-4 text-sm text-destructive-strong">
              {t(error instanceof SamaamOfflineError ? 'kb.errorOffline' : 'kb.errorService')}
            </CardContent>
          </Card>
        )}

        {isFetching && !data && !isError && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}

        {data && !isError && data.results.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {t('kb.empty')}
            </CardContent>
          </Card>
        )}

        {data && data.results.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {t('kb.results', { count: data.count })}
          </p>
        )}

        {data?.results.map((hit) => (
          <Card key={`${hit.record_id}-${hit.section}`}>
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span dir="ltr" className="font-mono text-xs font-semibold text-foreground">
                  {hit.record_id}
                </span>
                <div className="flex items-center gap-2">
                  <span dir="ltr" className="font-mono text-xs tabular-nums text-muted-foreground">
                    {hit.similarity.toFixed(3)} {t('kb.similarity')}
                  </span>
                  <VerificationChip verification={hit.verification} />
                </div>
              </div>
              {/* Quoted provisions read in the language they were issued in. */}
              <p dir={scriptDirection(hit.title)} className="text-sm font-medium text-foreground">
                {hit.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {hit.authority} · {hit.section}
              </p>
              <p dir={scriptDirection(hit.content)} className="text-sm text-foreground/80">
                {hit.content}
              </p>
              {hit.url && (
                <a
                  href={hit.url}
                  target="_blank"
                  rel="noreferrer"
                  dir="ltr"
                  className="inline-block break-all font-mono text-xs text-primary underline underline-offset-2"
                >
                  {hit.url}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
