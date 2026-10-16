import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'motion/react'
import { Direction } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * The landing page's motion vocabulary. One easing curve, one reveal distance,
 * one stagger — so every section moves as part of the same page.
 *
 * Reduced motion is handled at the root (`<MotionConfig reducedMotion="user">`
 * in HomePage), which strips transforms and keeps opacity. Anything driven by
 * time rather than by a transition — counters, loops — checks
 * `useReducedMotion()` itself.
 */

export const EASE = [0.16, 1, 0.3, 1] as const

/** +1 in LTR, -1 in RTL: multiply any x offset that means "toward the end". */
export function useDirSign(): 1 | -1 {
  return Direction.useDirection() === 'rtl' ? -1 : 1
}

type From = 'up' | 'start' | 'end'

export function Reveal({
  children,
  from = 'up',
  delay = 0,
  className,
}: {
  children: React.ReactNode
  from?: From
  delay?: number
  className?: string
}) {
  const sign = useDirSign()
  const offset =
    from === 'start' ? { x: -28 * sign } : from === 'end' ? { x: 28 * sign } : { y: 28 }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/** A container whose `staggerChild` children rise in sequence on first view. */
export function Stagger({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'ul' | 'ol'
}) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </Tag>
  )
}

/**
 * Counts up to `to` the first time it scrolls into view. It starts *at* `to`,
 * so a reader without motion — or before hydration — never sees a zero.
 * Digits are Latin and tabular in both languages, matching the console.
 */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const { i18n } = useTranslation()
  const value = useMotionValue(to)
  const text = useTransform(value, (n) => Math.round(n).toLocaleString('en'))

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(value, [0, to], { duration: 1.6, ease: EASE })
    return () => controls.stop()
  }, [inView, reduce, to, value])

  return (
    <motion.span
      ref={ref}
      dir="ltr"
      lang={i18n.resolvedLanguage === 'ar' ? 'en' : undefined}
      className={cn('inline-block tabular-nums', className)}
    >
      {text}
    </motion.span>
  )
}

/** Section scaffold: one container width, one vertical rhythm, one heading. */
export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  id?: string
  eyebrow?: string
  title: string
  lead?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-20 py-20 md:py-28', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal className="flex max-w-3xl flex-col gap-3">
          {eyebrow !== undefined && (
            <p className="text-sm font-semibold text-primary">{eyebrow}</p>
          )}
          <h2 className="text-3xl leading-[1.25] font-bold text-balance md:text-4xl">{title}</h2>
          {lead !== undefined && (
            <p className="max-w-[65ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
              {lead}
            </p>
          )}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
