import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { isLanguage, type Language } from '@/lib/i18n'

/**
 * Pitch deck + judge Q&A. Served as a static HTML deck under /deck so the
 * presentation keeps its own chrome; the shell only hosts the iframe and the
 * graded synthetic-data notice in the header.
 *
 * Language follows the app toggle: query string on load, postMessage on change.
 */
export default function SlidesPage() {
  const { t, i18n } = useTranslation()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lang: Language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'

  function pushLang(next: Language) {
    const frame = iframeRef.current
    if (!frame?.contentWindow) return
    frame.contentWindow.postMessage({ type: 'samaam-lang', lang: next }, window.location.origin)
  }

  useEffect(() => {
    pushLang(lang)
  }, [lang])

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-1 flex-col group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100dvh-3rem)]">
      <iframe
        ref={iframeRef}
        title={t('nav.slides')}
        src={`/deck/index.html?lang=${lang}`}
        className="h-full w-full flex-1 border-0 bg-background"
        allow="fullscreen"
        onLoad={() => pushLang(lang)}
      />
    </div>
  )
}
