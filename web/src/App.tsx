import { QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { RouterProvider } from 'react-router'
import { Direction } from 'radix-ui'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { dirOf, isLanguage, type Language } from '@/lib/i18n'
import { queryClient } from '@/lib/query-client'
import { router } from '@/router'

export default function App() {
  const { i18n } = useTranslation()
  const language: Language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'
  const direction = dirOf(language)

  return (
    <QueryClientProvider client={queryClient}>
      {/* Radix positions popovers and tooltips from this, not from the DOM. */}
      <Direction.DirectionProvider dir={direction}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </Direction.DirectionProvider>
    </QueryClientProvider>
  )
}
