import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSidebar } from '@/components/ui/sidebar'
import { useHealth } from '@/lib/queries'
import { cn } from '@/lib/utils'

/**
 * Live proof that the gateway is up and that the knowledge base has content in
 * it. Not decoration: if the service dies mid-demo, this says so at a glance
 * instead of letting a click fail in front of the panel.
 *
 * The three counts are policies · gaps · source chunks, straight from /health.
 */
export function ConnectionIndicator() {
  const { t } = useTranslation()
  const { state } = useSidebar()
  const { data, isPending, isError } = useHealth()
  const collapsed = state === 'collapsed'

  const status = isPending ? 'checking' : isError ? 'offline' : 'connected'
  const counts = data?.knowledge_base

  const label =
    status === 'connected'
      ? t('connection.connected')
      : status === 'offline'
        ? t('connection.offline')
        : t('connection.checking')

  const detail =
    status === 'offline'
      ? t('connection.offlineDetail')
      : counts !== undefined
        ? t('connection.counts', {
            policies: counts.policies,
            gaps: counts.gaps,
            chunks: counts.source_chunks,
          })
        : label

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={detail}
        className="flex w-full flex-col items-start gap-1.5 rounded-md px-2 py-1.5 text-start hover:bg-sidebar-accent"
      >
        <span className="flex w-full items-center gap-2">
          <span
            aria-hidden
            data-status={status}
            className={cn(
              'size-2 shrink-0 rounded-full',
              status === 'connected' && 'animate-pulse bg-success',
              status === 'offline' && 'bg-destructive',
              status === 'checking' && 'bg-muted-foreground',
            )}
          />
          {!collapsed && (
            <span
              className={cn(
                'truncate text-xs font-medium',
                status === 'offline' ? 'text-destructive-strong' : 'text-foreground/80',
              )}
            >
              {label}
            </span>
          )}
        </span>

        {!collapsed && (
          <>
            {isPending && <Skeleton className="h-3 w-24" />}
            {counts !== undefined && (
              /* Counts are data, not labels: mono and tabular so they stay put
                 across refetches instead of jittering the sidebar width. */
              <span
                dir="ltr"
                className="ps-4 font-mono text-xs tabular-nums text-muted-foreground"
              >
                {counts.policies} · {counts.gaps} · {counts.source_chunks}
              </span>
            )}
          </>
        )}
      </TooltipTrigger>

      <TooltipContent side="top" className="max-w-64">
        <span className="flex flex-col gap-1">
          <span>{detail}</span>
          {data !== undefined && (
            <span className="text-background/70">
              {data.model.reachable
                ? t('connection.modelReachable')
                : t('connection.modelUnreachable')}
            </span>
          )}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
