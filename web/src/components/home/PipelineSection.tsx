import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Cpu, Database, ShieldAlert, ShieldOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PIPELINE } from './home-data'
import { EASE, Reveal, Stagger, staggerChild, useDirSign } from './motion-kit'

/**
 * Section scaffold for the mid-page sections (story, pipeline, bento, stats):
 * eyebrow chip, large heading with a brand accent bar, and a background tone
 * passed in by the caller so neighbouring sections alternate.
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  decor,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  children: React.ReactNode
  className?: string
  /** Optional background layer, rendered behind the content. */
  decor?: React.ReactNode
}) {
  const titleId = useId()
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn('relative isolate scroll-mt-20 overflow-x-clip py-20 md:py-28', className)}
    >
      {decor}
      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal className="flex max-w-3xl flex-col items-start gap-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-e1 md:text-sm">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-primary/50 motion-safe:animate-ping" />
              <span className="relative size-2 rounded-full bg-primary" />
            </span>
            {eyebrow}
          </p>
          <h2
            id={titleId}
            className="text-3xl leading-[1.2] font-bold text-balance md:text-5xl md:leading-[1.15]"
          >
            {title}
          </h2>
          <span aria-hidden className="h-1 w-16 rounded-full bg-gradient-1" />
          {lead !== undefined && (
            <p className="max-w-[65ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
              {lead}
            </p>
          )}
        </Reveal>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  )
}

/** A dashed wire whose dashes stream toward the end of the reading direction. */
function FlowWire({ vertical, className }: { vertical?: boolean; className?: string }) {
  const reduce = useReducedMotion()
  const sign = useDirSign()
  const dash = 'color-mix(in srgb, var(--primary) 70%, transparent)'
  const backgroundImage = vertical
    ? `repeating-linear-gradient(180deg, ${dash} 0 6px, transparent 6px 14px)`
    : `repeating-linear-gradient(90deg, ${dash} 0 6px, transparent 6px 14px)`
  const travel = vertical
    ? { backgroundPositionY: ['0px', '14px'] }
    : { backgroundPositionX: ['0px', `${14 * sign}px`] }

  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none absolute', className)}
      style={{ backgroundImage }}
      animate={reduce ? undefined : travel}
      transition={{ duration: 0.6, ease: 'linear', repeat: Infinity }}
    />
  )
}

/**
 * The seven Y.3172 nodes in reading order — right to left in Arabic, left to
 * right in English. M is marked as unable to block and P as the only node that
 * can; the knowledge base hangs off M, which is where retrieval happens.
 */
export function PipelineSection() {
  const { t } = useTranslation()
  const reduce = useReducedMotion()

  return (
    <SectionShell
      id="pipeline"
      eyebrow={t('home.pipeline.eyebrow')}
      title={t('home.pipeline.title')}
      lead={t('home.pipeline.lead')}
      className="border-y bg-muted/40"
      decor={
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(color-mix(in srgb, var(--foreground) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 5%, transparent) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      }
    >
      <div className="relative">
        {/* The wire the request travels: horizontal on wide screens, vertical below. */}
        <motion.div
          aria-hidden
          className="absolute inset-x-[7%] top-8 hidden h-0.5 lg:block ltr:origin-left rtl:origin-right"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '0px 0px -20% 0px' }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <span className="absolute inset-0 rounded-full bg-primary/15" />
          <FlowWire className="inset-0" />
        </motion.div>
        <div aria-hidden className="absolute inset-y-8 start-8 w-0.5 lg:hidden">
          <span className="absolute inset-0 rounded-full bg-primary/15" />
          <FlowWire vertical className="inset-0" />
        </div>

        <Stagger as="ol" className="relative grid gap-4 lg:grid-cols-7 lg:gap-3">
          {PIPELINE.map((node) => {
            const Icon = node.icon
            const gate = node.id === 'P'
            const model = node.id === 'M'
            return (
              <motion.li
                key={node.id}
                variants={staggerChild}
                className="group flex items-start gap-4 lg:flex-col lg:items-stretch lg:gap-3"
              >
                <span className="relative flex size-16 shrink-0 items-center justify-center lg:self-center">
                  {gate && !reduce && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl border-2 border-primary"
                      animate={{ opacity: [0.6, 0], scale: [1, 1.35] }}
                      transition={{ duration: 2, ease: 'easeOut', repeat: Infinity }}
                    />
                  )}
                  <span
                    className={cn(
                      'relative flex size-16 items-center justify-center rounded-2xl border bg-card shadow-e2 transition-transform duration-300 group-hover:-translate-y-0.5',
                      gate &&
                        'border-primary bg-gradient-2 text-primary-foreground shadow-e5 ring-4 ring-primary/20',
                      model && 'border-dashed',
                    )}
                  >
                    <Icon aria-hidden className={cn('size-7', !gate && 'text-primary')} />
                  </span>
                </span>

                <div
                  className={cn(
                    'relative flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border bg-card p-4 shadow-e1 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-e3 lg:h-full lg:text-center',
                    gate &&
                      'border-primary/50 bg-primary/5 shadow-e4 ring-1 ring-primary/20 group-hover:border-primary/60',
                  )}
                >
                  {gate && (
                    <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground lg:self-center">
                      <Cpu aria-hidden className="size-3" />
                      {t('home.pipeline.core')}
                    </span>
                  )}
                  <p
                    dir="ltr"
                    className={cn(
                      'self-start font-mono text-xl font-bold lg:self-center',
                      gate && 'text-primary',
                    )}
                  >
                    {node.id}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`home.pipeline.nodes.${node.id}`)}
                  </p>
                  {(gate || model) && (
                    <p
                      className={cn(
                        'mt-auto inline-flex items-center gap-1.5 text-xs font-semibold lg:justify-center',
                        gate ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {gate ? (
                        <ShieldAlert aria-hidden className="size-3.5 shrink-0" />
                      ) : (
                        <ShieldOff aria-hidden className="size-3.5 shrink-0" />
                      )}
                      {gate ? t('home.pipeline.onlyBlocker') : t('home.pipeline.cannotBlock')}
                    </p>
                  )}
                  <code
                    dir="ltr"
                    className="max-w-full self-start truncate rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground lg:self-center"
                  >
                    {node.file}
                  </code>
                </div>
              </motion.li>
            )
          })}
        </Stagger>

        <Reveal delay={0.2} className="mt-8">
          <p className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-card/80 px-4 py-3.5 text-sm text-muted-foreground shadow-e1 backdrop-blur">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database aria-hidden className="size-4" />
            </span>
            {t('home.pipeline.kb')}
          </p>
        </Reveal>
      </div>
    </SectionShell>
  )
}
