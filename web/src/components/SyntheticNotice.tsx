import { FlaskConical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * A graded submission requirement: this notice appears on every screen, and its
 * Arabic wording is fixed by the hackathon guide. It is never translated and
 * never conditionally hidden.
 */
export const SYNTHETIC_NOTICE_AR = 'بيانات محاكاة لأغراض الهاكاثون فقط'

export function SyntheticNotice({ className, ...props }: React.ComponentProps<'div'>) {
  const { t } = useTranslation()

  return (
    <div
      data-slot="synthetic-notice"
      className={cn('flex min-w-0 items-center gap-2 text-xs text-foreground/80', className)}
      {...props}
    >
      <FlaskConical aria-hidden className="size-3.5 shrink-0 text-warning-strong" />
      <span dir="rtl" lang="ar" className="truncate font-medium">
        {SYNTHETIC_NOTICE_AR}
      </span>
      <span className="hidden truncate text-muted-foreground sm:inline">
        {t('notice.syntheticGloss')}
      </span>
    </div>
  )
}
