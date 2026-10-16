import { cn } from '@/lib/utils'

export type MeasuredState = 'neutral' | 'within' | 'over'

export interface MeasuredProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  value: number | string
  unit?: string
  /** The cited limit. Renders as `value / limit` and colours the excess. */
  limit?: number | string
  /** Derived from `limit` when omitted; pass it when the server judged. */
  state?: MeasuredState
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASS: Record<NonNullable<MeasuredProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-3xl leading-tight',
}

function deriveState(
  value: MeasuredProps['value'],
  limit: MeasuredProps['limit'],
): MeasuredState {
  if (limit === undefined) return 'neutral'
  const measured = Number(value)
  const ceiling = Number(limit)
  if (Number.isNaN(measured) || Number.isNaN(ceiling)) return 'neutral'
  return measured > ceiling ? 'over' : 'within'
}

/**
 * A measured quantity, rendered the way a modality console or a lab report
 * renders it: monospaced and tabular, so `18.0` and `14.0` line up digit over
 * digit and the comparison is made by eye rather than by arithmetic.
 *
 * This component never computes a threshold. `limit` is a value the server
 * already cited; passing one only decides how it is drawn.
 */
export function Measured({
  value,
  unit,
  limit,
  state,
  size = 'md',
  className,
  ...props
}: MeasuredProps) {
  const resolved = state ?? deriveState(value, limit)

  return (
    <span
      data-slot="measured"
      data-state={resolved}
      className={cn(
        'inline-flex items-baseline gap-1 font-mono tabular-nums',
        SIZE_CLASS[size],
        resolved === 'over' ? 'text-destructive-strong' : 'text-foreground',
        className,
      )}
      {...props}
    >
      <span className={cn(resolved === 'over' && 'font-semibold')}>{value}</span>
      {limit !== undefined && (
        <>
          <span aria-hidden className="text-muted-foreground">
            /
          </span>
          <span className="text-muted-foreground">{limit}</span>
        </>
      )}
      {unit !== undefined && (
        <span className="text-xs font-normal text-muted-foreground">{unit}</span>
      )}
    </span>
  )
}
