import { cn } from '@/lib/utils'

/**
 * Samaam mark: a contrast drop held at a closed gate, before it reaches the kidney.
 * Three shapes, viewBox 0 0 64 64, blue #1D4ED8, amber #C8962E, no tile behind it,
 * default size 36px (size-9).
 */
export function BrandMark({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Samaam"
      className={cn('size-9 shrink-0', className)}
      {...props}
    >
      <path
        fill="#1D4ED8"
        d="M42 4C54 4 62 17 62 32C62 47 54 60 42 60C33 60 27 54 27 47C27 41 36 39 36 32C36 25 27 23 27 17C27 10 33 4 42 4Z"
      />
      <rect x="22" y="21" width="6.5" height="22" rx="3.25" fill="#1D4ED8" />
      <path
        fill="#C8962E"
        d="M9 19C9 19 17 29 17 35A8 8 0 0 1 1 35C1 29 9 19 9 19Z"
      />
    </svg>
  )
}
