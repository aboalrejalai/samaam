import { cn } from '@/lib/utils'

export interface PageHeaderProps extends React.ComponentProps<'header'> {
  title: string
  lead?: string
  /** The endpoint the screen drives, shown as issued. */
  endpoint?: string
}

export function PageHeader({ title, lead, endpoint, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-1', className)} {...props}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className=" text-xl font-semibold text-foreground">{title}</h1>
        {endpoint !== undefined && endpoint !== '—' && (
          <code dir="ltr" className="font-mono text-xs text-muted-foreground">
            {endpoint}
          </code>
        )}
      </div>
      {lead !== undefined && <p className="max-w-prose text-sm text-foreground/80">{lead}</p>}
    </header>
  )
}
