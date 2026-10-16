import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { isLanguage, type Language } from '@/lib/i18n'

/**
 * The Soft language toggle: a ghost icon button. Arabic flips the document to
 * dir="rtl"; the tooltip and accessible name say which language comes next.
 */
export function LanguageToggle(props: React.ComponentProps<typeof Button>) {
  const { t, i18n } = useTranslation()
  const current: Language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'
  const next: Language = current === 'ar' ? 'en' : 'ar'
  const label = next === 'ar' ? t('shell.switchToArabic') : t('shell.switchToEnglish')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          onClick={() => void i18n.changeLanguage(next)}
          {...props}
        >
          <Languages aria-hidden />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
