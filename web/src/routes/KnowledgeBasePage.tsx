import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Search, Trash2 } from 'lucide-react'
import { VerificationChip } from '@/components/primitives'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { SamaamOfflineError } from '@/lib/api'
import { useKbSearchState } from '@/lib/kb-search'
import { useHealth, useKbSearch } from '@/lib/queries'
import { scriptDirection } from '@/lib/text'
import { cn } from '@/lib/utils'
import { KB_COLLECTIONS } from '@/types/api'

/**
 * Knowledge base retrieval (ported from boards/Knowledge-Base.dc.html).
 *
 * Search hero with the contrast vial image and filters.
 * Left: Results column with score similarity bars, conditional basis chips and citations.
 * Right: The corpus counts from /health, Suggested questions, and Search history.
 */

export default function KnowledgeBasePage() {
  const { t } = useTranslation()
  const kb = useKbSearchState()
  const { data: health } = useHealth()
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

  const rawExamples = t('kb.examples', { returnObjects: true })
  const suggestions = Array.isArray(rawExamples)
    ? rawExamples.filter((s): s is string => typeof s === 'string')
    : []

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    kb.commit()
  }

  function runSuggestion(q: string) {
    kb.apply({
      id: String(Date.now()),
      q,
      collection: 'policies',
      verifiedOnly: true,
      at: new Date().toISOString(),
    })
  }

  return (
    <div className="flex flex-col gap-5" id="kb">
      {/* Search hero with the vial image */}
      <section
        className="card rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-sa-50 to-card grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_150px] gap-6 items-center overflow-hidden border border-border"
        aria-label={t('pages.kb.title')}
        data-id="search"
      >
        <div className="flex flex-col gap-3.5 min-w-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('pages.kb.title')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {t('pages.kb.lead')}
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2" data-id="search.form">
            <div className="relative flex-1 min-w-0">
              <Search
                className="size-4 text-muted-foreground absolute top-3.5 inset-s-3 pointer-events-none"
                aria-hidden
              />
              <Input
                value={kb.draft}
                onChange={(e) => kb.setDraft(e.target.value)}
                placeholder={t('kb.placeholder')}
                aria-label={t('kb.ariaField')}
                className="h-11 ps-9 text-sm sm:text-base bg-card font-sans"
              />
            </div>
            <Button type="submit" className="h-11 px-5 cursor-pointer shrink-0">
              {t('kb.submit')}
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2" data-id="search.filters">
            <span className="text-xs text-muted-foreground">{t('kb.collection')}</span>
            {KB_COLLECTIONS.map((col) => {
              const active = kb.collection === col
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => kb.setCollection(col)}
                  className={cn('sug', active && 'on')}
                >
                  {t(`kb.collections.${col}`)}
                </button>
              )
            })}
            <div className="ms-auto flex items-center gap-2 text-xs sm:text-sm text-foreground">
              <Switch
                checked={kb.verifiedOnly}
                onCheckedChange={kb.setVerifiedOnly}
                id="kb-verified-toggle"
              />
              <label htmlFor="kb-verified-toggle" className="cursor-pointer">
                {t('kb.verifiedOnly')}
              </label>
            </div>
          </div>
        </div>

        <img
          src="/models/contrast-vial.webp"
          alt={t('models.contrastVialAlt')}
          className="h-[180px] sm:h-[220px] w-auto mx-auto object-contain hidden md:block"
          data-id="search.vial"
        />
      </section>

      {/* Main content grid: results and side panels */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] gap-5 items-start"
        data-id="grid"
      >
        {/* Left column: Results */}
        <div className="flex flex-col gap-3 min-w-0" data-id="results">
          {term.length > 1 && (
            <p className="text-xs text-muted-foreground">
              {t('kb.results', { count: data?.count ?? 0 })} · {t('kb.hint')}
            </p>
          )}

          {term.length <= 1 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                {t('kb.prompt')}
              </CardContent>
            </Card>
          )}

          {/* Error handling */}
          {isError && (
            <Card className="border-destructive-strong">
              <CardContent className="py-4 text-sm text-destructive-strong">
                {t(error instanceof SamaamOfflineError ? 'kb.errorOffline' : 'kb.errorService')}
              </CardContent>
            </Card>
          )}

          {/* Loading skeletons */}
          {isFetching && !data && !isError && (
            <>
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </>
          )}

          {/* Empty result */}
          {data && !isError && data.results.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                {t('kb.empty')}
              </CardContent>
            </Card>
          )}

          {/* Results list */}
          {data?.results.map((hit) => {
            const similarityPercent = Math.min(
              100,
              Math.max(0, Math.round(hit.similarity * 100)),
            )
            return (
              <Card key={`${hit.record_id}-${hit.section}`} className="p-4 sm:p-5 border border-border">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span dir="ltr" className="font-mono text-sm font-semibold text-foreground">
                      {hit.record_id}
                    </span>

                    {/* Basis chip only when provided by the API */}
                    {hit.basis && (
                      <span
                        className={cn(
                          'basis',
                          hit.basis === 'STATUTORY' ? 'basis-law' : 'basis-protocol',
                        )}
                      >
                        {hit.basis}
                      </span>
                    )}

                    <span className="ms-auto flex items-center gap-2">
                      <span className="bar">
                        <span style={{ width: `${similarityPercent}%` }} />
                      </span>
                      <span dir="ltr" className="font-mono text-xs text-muted-foreground">
                        {hit.similarity.toFixed(2)} {t('kb.similarity')}
                      </span>
                    </span>

                    <VerificationChip verification={hit.verification} />
                  </div>

                  <h2
                    dir={scriptDirection(hit.title)}
                    className="font-semibold text-base leading-snug text-foreground mt-1"
                  >
                    {hit.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {hit.authority} · {hit.section}
                  </p>
                  <p dir={scriptDirection(hit.content)} className="text-sm text-foreground/80 leading-relaxed">
                    {hit.content}
                  </p>
                  {hit.url && (
                    <a
                      href={hit.url}
                      target="_blank"
                      rel="noreferrer"
                      dir="ltr"
                      className="font-mono text-xs text-primary inline-flex items-center gap-1 hover:underline break-all mt-1"
                    >
                      {hit.url}
                      <ExternalLink className="size-3 shrink-0" aria-hidden />
                    </a>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Right column: Corpus, Suggested questions, History */}
        <aside className="flex flex-col gap-4 min-w-0" data-id="side">
          {/* The corpus card */}
          <Card className="p-4 sm:p-5 border border-border" data-id="side.corpus">
            <h2 className="text-base font-semibold mb-2 text-foreground">
              {t('kb.corpus.title')}
            </h2>
            <dl className="flex flex-col">
              <div className="flex justify-between items-center gap-3 py-2 border-t border-border">
                <dt className="text-xs text-muted-foreground">{t('kb.corpus.records')}</dt>
                <dd className="font-mono text-sm font-semibold text-foreground">
                  {health?.knowledge_base.policies ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between items-center gap-3 py-2 border-t border-border">
                <dt className="text-xs text-muted-foreground">{t('kb.corpus.sources')}</dt>
                <dd className="font-mono text-sm font-semibold text-foreground">
                  {health?.knowledge_base.source_chunks?.toLocaleString() ?? '—'}
                </dd>
              </div>
              <div className="flex justify-between items-center gap-3 py-2 border-t border-border">
                <dt className="text-xs text-muted-foreground">{t('kb.corpus.gaps')}</dt>
                <dd className="font-mono text-sm font-semibold text-foreground">
                  {health?.knowledge_base.gaps ?? '—'}
                </dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground mt-2">{t('kb.verifiedNote')}</p>
          </Card>

          {/* Suggested questions card */}
          <Card className="p-4 sm:p-5 border border-border" data-id="side.suggest">
            <h2 className="text-base font-semibold mb-2.5 text-foreground">
              {t('kb.suggestions')}
            </h2>
            <ul className="flex flex-col gap-2">
              {suggestions.map((example) => (
                <li key={example}>
                  <button
                    type="button"
                    onClick={() => runSuggestion(example)}
                    className="text-xs sm:text-sm text-primary hover:underline text-start cursor-pointer leading-snug"
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Search history card */}
          <Card className="p-4 sm:p-5 border border-border" data-id="side.history">
            <h2 className="text-base font-semibold mb-2 text-foreground">
              {t('kb.sidebar.history')}
            </h2>
            {kb.history.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t('kb.sidebar.empty')}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {kb.history.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted text-xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => kb.apply(item)}
                      className="flex-1 text-start font-medium text-foreground truncate cursor-pointer"
                      title={item.q}
                    >
                      {item.q}
                    </button>
                    <button
                      type="button"
                      onClick={() => kb.forget(item.id)}
                      aria-label={t('kb.sidebar.forget')}
                      className="text-muted-foreground hover:text-destructive cursor-pointer p-1"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </div>
  )
}
