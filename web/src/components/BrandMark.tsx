import { cn } from '@/lib/utils'

/** The mark is the valve: a seat with a stem through it. */
export function BrandMark({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground',
        className,
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="size-1/2" fill="none" aria-hidden>
        <path d="M12 3v6m0 6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
        <path d="M5 12h3.6m6.8 0H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
