import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAudit } from '@/lib/queries'
import { AUDIT_EVENTS } from '@/types/api'
import type { AuditEvent } from '@/types/api'

/**
 * The trail. What makes an override a decision someone owns rather than a
 * click nobody remembers — which is precisely the gap GAP-02 records.
 *
 * The two attributed events are given weight: a release under override and a
 * refused override are the entries a reviewer is looking for.
 */
const EMPHASISED = new Set<string>([
  'EXECUTED_UNDER_OVERRIDE',
  'OVERRIDE_REFUSED',
  'SECURITY_OVERRIDE',
])

/** The wire may carry an event this build predates; show it raw rather than
 *  a missing-translation key. */
function isKnown(event: string): event is AuditEvent {
  return (AUDIT_EVENTS as readonly string[]).includes(event)
}

export default function AuditPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useAudit()

  return (
    <>
      <PageHeader
        title={t('pages.audit.title')}
        lead={t('pages.audit.lead')}
        endpoint="GET /audit"
      />
      <p className="mb-4 text-sm text-muted-foreground">{t('audit.lead')}</p>

      {isLoading && <Skeleton className="h-48 w-full" />}

      {data && data.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {t('audit.empty')}
          </CardContent>
        </Card>
      )}

      {data && data.length > 0 && (
        <Card className="overflow-hidden py-0">
          <div className="overflow-x-auto">
            <Table>
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
                {data.map((entry, index) => {
                  const label = isKnown(entry.event)
                    ? t(`audit.events.${entry.event}`)
                    : entry.event
                  return (
                    <TableRow
                      key={`${entry.at}-${index}`}
                      className={cn(EMPHASISED.has(entry.event) && 'bg-warning/5')}
                    >
                      <TableCell dir="ltr" className="font-mono text-xs tabular-nums whitespace-nowrap">
                        {entry.at.slice(0, 19).replace('T', ' ')}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'text-sm',
                            EMPHASISED.has(entry.event) && 'font-semibold text-warning-strong',
                          )}
                        >
                          {label}
                        </span>
                        <span dir="ltr" className="block font-mono text-xs text-muted-foreground">
                          {entry.event}
                        </span>
                      </TableCell>
                      <TableCell dir="ltr" className="font-mono text-xs">{entry.worklist_id}</TableCell>
                      <TableCell dir="ltr" className="font-mono text-xs">{entry.verdict}</TableCell>
                      <TableCell className="text-sm">{entry.actor}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </>
  )
}
