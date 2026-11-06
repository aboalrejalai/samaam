import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAudit } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { AUDIT_EVENTS, type AuditEvent } from '@/types/api'

/**
 * The audit trail (ported from boards/Audit.dc.html).
 *
 * Filter pills for event classification.
 * Left: Table of real events with attributed actors and emphasized overrides.
 * Right: Event details inspection panel with clinical risk cards and injured kidney image.
 */

const EMPHASISED = new Set<string>([
  'EXECUTED_UNDER_OVERRIDE',
  'OVERRIDE_REFUSED',
  'SECURITY_OVERRIDE',
])

type FilterType = 'all' | 'overrides' | 'security' | 'worklist'

function isKnown(event: string): event is AuditEvent {
  return (AUDIT_EVENTS as readonly string[]).includes(event)
}

export default function AuditPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useAudit()
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedAt, setSelectedAt] = useState<string | null>(null)

  const entries = data ?? []

  const filtered = entries.filter((entry) => {
    if (filter === 'all') return true
    const ev = entry.event.toUpperCase()
    if (filter === 'overrides') {
      return ev.includes('OVERRIDE')
    }
    if (filter === 'security') {
      return (
        ev.includes('SECURITY') ||
        ev.includes('DATA') ||
        entry.worklist_id?.includes('DATA')
      )
    }
    if (filter === 'worklist') {
      return ev.includes('MWL')
    }
    return true
  })

  // Selected entry (defaults to first matching entry if none or invalid)
  const selected =
    filtered.find((e) => e.at === selectedAt) ?? (filtered.length > 0 ? filtered[0] : null)

  const isClinical =
    selected &&
    !selected.worklist_id?.startsWith('DATA-') &&
    (selected.worklist_id?.startsWith('MWL-') ||
      selected.event.includes('EXECUTED') ||
      selected.event === 'BLOCKED' ||
      selected.detail?.accepted_risk != null)

  return (
    <div className="flex flex-col gap-5" id="audit">
      {/* Page head with filter pills */}
      <div
        className="flex flex-wrap items-end justify-between gap-3 sm:gap-6"
        data-id="head"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('pages.audit.title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t('pages.audit.lead')}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5" data-id="head.filters">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn('pill', filter === 'all' && 'on')}
          >
            {t('audit.filters.all')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('overrides')}
            className={cn('pill', filter === 'overrides' && 'on')}
          >
            {t('audit.filters.overrides')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('security')}
            className={cn('pill', filter === 'security' && 'on')}
          >
            {t('audit.filters.security')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('worklist')}
            className={cn('pill', filter === 'worklist' && 'on')}
          >
            {t('audit.filters.worklist')}
          </button>
        </div>
      </div>

      {isLoading && <Skeleton className="h-56 w-full" />}

      {/* Empty state */}
      {!isLoading && entries.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t('audit.empty')}
          </CardContent>
        </Card>
      )}

      {/* Main split: Table on the left, details on the right */}
      {!isLoading && entries.length > 0 && (
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(290px,320px)] gap-5 items-start"
          data-id="grid"
        >
          {/* Table */}
          <section
            className="card rounded-2xl border border-border overflow-hidden min-w-0"
            aria-label={t('pages.audit.title')}
            data-id="table"
          >
            <div className="overflow-x-auto">
              <Table className="tbl min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('audit.at')}</TableHead>
                    <TableHead>{t('audit.event')}</TableHead>
                    <TableHead>{t('audit.worklist')}</TableHead>
                    <TableHead>{t('audit.verdict')}</TableHead>
                    <TableHead>{t('audit.actor')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((entry, index) => {
                    const label = isKnown(entry.event)
                      ? t(`audit.events.${entry.event}`)
                      : entry.event
                    const isEmphasised = EMPHASISED.has(entry.event)
                    const isSelected = selected?.at === entry.at

                    return (
                      <TableRow
                        key={`${entry.at}-${index}`}
                        onClick={() => setSelectedAt(entry.at)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isEmphasised && 'flag bg-warning/5',
                          isSelected && 'bg-primary-subtle/50 font-medium',
                        )}
                      >
                        <TableCell dir="ltr" className="font-mono text-xs tabular-nums whitespace-nowrap">
                          {entry.at.slice(0, 19).replace('T', ' ')}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'text-sm leading-tight block',
                              isEmphasised && 'flagged font-semibold text-warning-strong',
                            )}
                          >
                            {label}
                          </span>
                          <span dir="ltr" className="code">
                            {entry.event}
                          </span>
                        </TableCell>
                        <TableCell dir="ltr" className="font-mono text-xs whitespace-nowrap">
                          {entry.worklist_id ?? '—'}
                        </TableCell>
                        <TableCell dir="ltr" className="font-mono text-xs whitespace-nowrap">
                          {entry.verdict}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={cn(isEmphasised && 'font-semibold text-foreground')}>
                            {entry.actor}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Detail panel */}
          {selected ? (
            <aside
              className="card rounded-2xl border border-border p-4 sm:p-5 flex flex-col gap-3 min-w-0"
              aria-label={t('audit.detail.title')}
              data-id="detail"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="card-title font-semibold text-base text-foreground leading-tight">
                  {isKnown(selected.event) ? t(`audit.events.${selected.event}`) : selected.event}
                </p>
                {selected.worklist_id && (
                  <span dir="ltr" className="chip chip-warn font-mono text-xs">
                    {selected.worklist_id}
                  </span>
                )}
              </div>

              {/* Injured kidney picture only for clinical events */}
              {isClinical && (
                <img
                  src="/models/kidney-injured.webp"
                  alt={t('models.kidneyInjuredAlt')}
                  className="w-32 mx-auto my-1 object-contain"
                  data-id="detail.kidney"
                />
              )}

              <div>
                <p className="text-xs text-muted-foreground">{t('audit.detail.namedBy')}</p>
                <p className="font-semibold text-sm text-foreground mt-0.5">{selected.actor}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">{t('audit.verdict')}</p>
                <p dir="ltr" className="font-mono text-xs font-semibold text-foreground mt-0.5">
                  {selected.verdict}
                </p>
              </div>

              {/* Accepted risks */}
              {selected.detail?.accepted_risk && selected.detail.accepted_risk.length > 0 && (
                <div className="pt-2.5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {t('audit.detail.riskAccepted')}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {selected.detail.accepted_risk.map((risk) => (
                      <li key={risk.rule} className="flex justify-between items-center gap-2">
                        <span dir="ltr" className="font-mono text-xs text-foreground font-medium">
                          {risk.rule}
                        </span>
                        {risk.basis && (
                          <span
                            className={cn(
                              'basis',
                              risk.basis === 'STATUTORY' ? 'basis-law' : 'basis-protocol',
                            )}
                          >
                            {risk.basis}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reason if recorded */}
              {selected.detail?.reason && (
                <div className="pt-2.5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-0.5">{t('audit.detail.reason')}</p>
                  <p className="text-xs text-foreground/90">{selected.detail.reason}</p>
                </div>
              )}

              {/* Failed checks if recorded */}
              {selected.detail?.failed && selected.detail.failed.length > 0 && (
                <div className="pt-2.5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t('audit.detail.failedChecks')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selected.detail.failed.map((rule) => (
                      <span
                        key={rule}
                        dir="ltr"
                        className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground"
                      >
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          ) : (
            <aside className="card rounded-2xl border border-border p-5 text-center text-xs text-muted-foreground">
              {t('audit.detail.selectPrompt')}
            </aside>
          )}
        </div>
      )}
    </div>
  )
}
