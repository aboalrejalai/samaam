import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LANGUAGES, isLanguage, type Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const LABEL: Record<Language, string> = { en: 'EN', ar: 'عربي' }

/**
 * English is the default; Arabic flips the document to dir="rtl". Same pill
 * shape as the deck's Slides | Q&A switch. Labels: EN / عربي.
 */
export function LanguageToggle({ className, ...props }: React.ComponentProps<'div'>) {
  const { t, i18n } = useTranslation()
  const current: Language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'

  return (
    <div
      role="group"
      aria-label={t('shell.language')}
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-muted p-0.5',
        className,
      )}
      {...props}
    >
      {LANGUAGES.map((language) => {
        const active = language === current
        return (
          <Tooltip key={language}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                aria-pressed={active}
                onClick={() => void i18n.changeLanguage(language)}
                className={cn(
                  'rounded-full px-2.5 font-semibold tracking-wide shadow-none',
                  active && 'bg-background text-foreground shadow-sm',
                  !active && 'text-muted-foreground',
                )}
              >
                {LABEL[language]}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === 'ar' ? t('shell.switchToArabic') : t('shell.switchToEnglish')}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
