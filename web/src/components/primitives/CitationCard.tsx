import { ExternalLink, FileWarning } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { scriptDirection } from '@/lib/text'
import { cn } from '@/lib/utils'
import type { Citation } from '@/types/api'

export interface CitationCardProps extends React.ComponentProps<typeof Card> {
  citation: Citation
}

/**
 * A citation exactly as node D attached it: issuing authority, document title,
 * section, the quoted passage, and a link that opens the actual document.
 *
 * Nothing here is composed or paraphrased. When the record could not be
 * resolved or is not VERIFIED the server says so in `error`, and that is
 * displayed rather than swallowed — a citation the reader cannot check is worse
 * than an admitted gap.
 */
export function CitationCard({ citation, className, ...props }: CitationCardProps) {
  const { t } = useTranslation()
  const quoteDir = scriptDirection(citation.content)

  if (citation.error !== undefined) {
    return (
      <Card
        size="sm"
        data-slot="citation-card"
        data-error
        className={cn('gap-2 rounded-md border-s-2 border-s-warning ring-0 shadow-ring', className)}
        {...props}
      >
        <CardHeader className="px-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileWarning aria-hidden className="size-4 shrink-0 text-warning-strong" />
            <code dir="ltr" className="font-mono">
              {citation.record_id}
            </code>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3">
          <p className="text-xs text-warning-strong">{citation.error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      size="sm"
      data-slot="citation-card"
      className={cn('gap-3 rounded-md ring-0 shadow-ring', className)}
      {...props}
    >
      <CardHeader className="gap-1 px-3">
        <p className="text-xs font-medium text-primary">{citation.authority}</p>
        <CardTitle className="text-sm">{citation.title}</CardTitle>
        <p className="text-xs text-muted-foreground">{citation.section}</p>
      </CardHeader>

      <CardContent className="px-3">
        {citation.content !== undefined && (
          /* Quoted as issued: source language, source direction, own edge rule. */
          <blockquote
            dir={quoteDir}
            className="border-s-2 border-s-border ps-3 text-start text-sm text-foreground/80"
          >
            {citation.content}
          </blockquote>
        )}
      </CardContent>

      <CardContent className="flex items-center gap-2 px-3">
        {citation.url !== undefined && citation.url.length > 0 ? (
          <a
            href={citation.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-primary underline underline-offset-4 hover:text-primary"
          >
            <ExternalLink aria-hidden className="size-3.5" />
            {t('citation.open')}
          </a>
        ) : (
          <p className="text-xs text-muted-foreground">{t('citation.noUrl')}</p>
        )}
        <code dir="ltr" className="ms-auto font-mono text-xs text-muted-foreground">
          {citation.record_id}
        </code>
      </CardContent>
    </Card>
  )
}
