import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight, FileText, Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SOURCES, type Source } from './home-data'
import { Reveal, useDirSign } from './motion-kit'

function SourceCard({ source, index }: { source: Source; index: number }) {
  const { t } = useTranslation()
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="group relative isolate flex h-full w-[min(20rem,80vw)] shrink-0 snap-start flex-col gap-4 overflow-hidden rounded-2xl border bg-background p-6 shadow-e2 transition-[border-color,box-shadow,transform] hover:-translate-y-1 hover:border-primary/50 hover:shadow-e5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:w-[22rem]"
    >
      {/* Brand strip that grows on hover, and a faint ordinal watermark. Decorative. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-[50%_0] scale-y-50 bg-gradient-brand opacity-60 transition-[transform,opacity] group-hover:scale-y-100 group-hover:opacity-100"
      />
      <span
        aria-hidden
        dir="ltr"
        className="pointer-events-none absolute -end-2 -bottom-6 -z-10 font-mono text-8xl font-bold text-primary/5 transition-colors group-hover:text-primary/10"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-e2 transition-transform group-hover:scale-105">
          <FileText aria-hidden className="size-5" />
        </span>
        <span dir="ltr" className="rounded-full border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
          {source.year}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">{source.authority}</p>
        {/* The title lays out in its own direction (plaintext bidi), but lines
            align to the page's start edge. `text-start` cannot express that —
            under plaintext it follows each paragraph's own direction — so the
            page direction picks the edge explicitly. */}
        <p
          lang={source.lang}
          className="text-base leading-snug font-semibold [unicode-bidi:plaintext] ltr:text-left rtl:text-right"
        >
          {source.title}
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-3 border-t pt-4">
        <code dir="ltr" className="max-w-full self-start truncate rounded-md bg-primary/5 px-1.5 py-0.5 font-mono text-xs text-primary">
          {source.id}
        </code>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {t('home.sources.open')}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          />
        </span>
      </div>
    </a>
  )
}

function Heading() {
  const { t } = useTranslation()
  return (
    <Reveal className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 md:px-8">
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
        <Library aria-hidden className="size-3.5" />
        {t('home.sources.eyebrow')}
      </span>
      <h2 className="text-3xl leading-[1.25] font-bold text-balance md:text-5xl">{t('home.sources.title')}</h2>
      <p className="max-w-[65ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
        {t('home.sources.lead')}
      </p>
      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
        <span dir="ltr" className="font-mono text-lg font-bold text-primary">
          {SOURCES.length}
        </span>
        {t('home.sources.count')}
      </p>
    </Reveal>
  )
}

/**
 * Vertical scroll drives the track sideways while the stage is pinned. In RTL
 * the row starts at the right edge and overflows to the left, so revealing it
 * means moving by +x — `useDirSign()` supplies that flip. Phones and reduced
 * motion get a native snap-scrolling row, which handles RTL by itself.
 */
export function SourcesRail() {
  const { t } = useTranslation()
  const sign = useDirSign()
  const section = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current && viewport.current) {
        const style = getComputedStyle(viewport.current)
        const inner =
          viewport.current.clientWidth -
          parseFloat(style.paddingInlineStart) -
          parseFloat(style.paddingInlineEnd)
        setDistance(Math.max(0, track.current.scrollWidth - inner))
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (track.current) observer.observe(track.current)
    if (viewport.current) observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  const x = useTransform(smooth, [0, 1], [0, -distance * sign])

  return (
    <section id="sources" aria-label={t('home.sources.title')} className="relative scroll-mt-20 border-y bg-card">
      {/* Pinned: md and up, motion allowed */}
      <div ref={section} className="relative hidden h-[260dvh] motion-safe:md:block">
        <div className="sticky top-(--topbar-height) flex h-[calc(100dvh-var(--topbar-height))] flex-col justify-center gap-10 overflow-hidden py-10">
          <Heading />
          <div ref={viewport} className="mx-auto w-full max-w-7xl px-8">
            <motion.ul ref={track} style={{ x }} className="flex w-max gap-6 py-2">
              {SOURCES.map((source, index) => (
                <li key={source.id} className="flex">
                  <SourceCard source={source} index={index} />
                </li>
              ))}
            </motion.ul>
          </div>
          <div className="mx-auto w-full max-w-7xl px-8">
            <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full w-full rounded-full bg-gradient-brand ltr:origin-left rtl:origin-right"
                style={{ scaleX: smooth }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Native row: phones, and reduced motion at any width */}
      <div className="flex flex-col gap-10 py-20 motion-safe:md:hidden">
        <Heading />
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-2 pb-4 md:px-8">
          {SOURCES.map((source, index) => (
            <li key={source.id} className="flex">
              <SourceCard source={source} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
