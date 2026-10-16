import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'motion/react'
import { ArrowRightLeft, Lock, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StatusIcon } from '@/components/primitives/status-icon'
import { cn } from '@/lib/utils'
import {
  DEMO_TIMING,
  DIRECT_IDENTIFIERS,
  EGFR_THRESHOLD,
  SC02,
  SCENARIOS,
} from './home-data'
import { EASE, Reveal } from './motion-kit'
import { SectionShell } from './PipelineSection'

const STEPS = ['arrive', 'prepare', 'check', 'refuse'] as const
type Step = (typeof STEPS)[number]
const SC02_CHECKS = SCENARIOS.find((s) => s.id === 'SC-02')!.checks

/** A device-console card: gradient hairline border, a title bar, and a soft brand glow. */
function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative isolate', className)}>
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/15 opacity-70 blur-2xl"
      />
      <div className="rounded-2xl bg-gradient-to-br from-primary/60 via-border to-primary/25 p-px shadow-e5">
        <div className="overflow-hidden rounded-[15px] bg-card">
          <div dir="ltr" className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
            <span aria-hidden className="size-2.5 rounded-full bg-destructive/60" />
            <span aria-hidden className="size-2.5 rounded-full bg-warning/70" />
            <span aria-hidden className="size-2.5 rounded-full bg-success/70" />
            <span className="ms-2 font-mono text-[11px] text-muted-foreground">SC-02</span>
          </div>
          <div className="flex flex-col gap-4 p-5 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

function Field({ k, v, u }: { k: string; v: string; u: string }) {
  return (
    <div dir="ltr" className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="font-mono text-sm text-muted-foreground">{k}</span>
      <span className="font-mono">
        <span className="text-lg font-semibold">{v}</span>{' '}
        <span className="text-xs text-muted-foreground">{u}</span>
      </span>
    </div>
  )
}

/** What each stop of the story shows. Every value is SC-02's, from home-data. */
function StoryVisual({ step }: { step: Step }) {
  const { t } = useTranslation()

  if (step === 'arrive') {
    return (
      <Panel>
        <code dir="ltr" className="font-mono text-xs text-muted-foreground">
          POST /device/execute · SC-02
        </code>
        <div>
          <Field k="serum_creatinine" v={SC02.creatinine} u="µmol/L" />
          <Field k="ctdivol" v={SC02.ctdivol} u="mGy" />
          <Field k="dlp" v={SC02.dlp} u="mGy·cm" />
        </div>
      </Panel>
    )
  }

  if (step === 'prepare') {
    const pct = Math.min(100, (Number(SC02.egfr) / 60) * 100)
    const thresholdPct = (EGFR_THRESHOLD / 60) * 100
    return (
      <Panel>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted-foreground">{t('home.story.identifiers')}</p>
          <ul dir="ltr" className="flex flex-wrap gap-1.5">
            {DIRECT_IDENTIFIERS.map((id) => (
              <li
                key={id}
                className="rounded-sm border border-dashed px-2 py-0.5 font-mono text-xs text-muted-foreground line-through"
              >
                {id}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 rounded-lg bg-muted/60 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm text-muted-foreground">{t('home.story.egfr')}</p>
            <p dir="ltr" className="font-mono text-4xl font-bold text-destructive-strong">
              {SC02.egfr}
            </p>
          </div>
          {/* A 0–60 scale: the protocol threshold and where this patient sits. */}
          <div dir="ltr" className="relative h-2 rounded-full bg-border">
            <motion.div
              className="absolute inset-y-0 start-0 rounded-full bg-destructive"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: EASE }}
            />
            <span
              aria-hidden
              className="absolute -top-1 h-4 w-0.5 rounded-full bg-foreground"
              style={{ insetInlineStart: `${thresholdPct}%` }}
            />
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {t('home.story.threshold')}:{' '}
              <span dir="ltr" className="font-mono font-semibold text-foreground">
                &lt; {EGFR_THRESHOLD}
              </span>
            </span>
            <span>
              {t('home.story.band')}:{' '}
              <span dir="ltr" className="font-mono font-semibold text-foreground">
                {SC02.riskBand}
              </span>
            </span>
          </div>
        </div>
      </Panel>
    )
  }

  if (step === 'check') {
    return (
      <Panel>
        <ul className="flex flex-col gap-2">
          {SC02_CHECKS.map((check, i) => (
            <motion.li
              key={check.rule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
              className="flex flex-col gap-1.5 rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <StatusIcon status={check.status} />
                <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm font-semibold">
                  {check.rule}
                </code>
                {check.basis !== null && (
                  <span className="shrink-0 rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {t(`basis.satisfied.${check.basis}`)}
                  </span>
                )}
              </div>
              {check.reading !== undefined && (
                <p className="ps-6 text-xs text-muted-foreground">
                  <span dir="ltr" className="font-mono">
                    {check.reading.name} {check.reading.measured}{' '}
                  {check.status === 'FAIL' ? (check.reading.name === 'eGFR' ? '<' : '>') : '≤'}{' '}
                  {check.reading.limit} {check.reading.unit}
                  </span>
                </p>
              )}
              <p className="ps-6 text-xs text-primary">
                <span dir="ltr" className="font-mono">
                  {check.cites.join(' · ')}
                </span>
              </p>
            </motion.li>
          ))}
        </ul>
      </Panel>
    )
  }

  return (
    <Panel>
      <div className="flex items-center gap-4 rounded-lg border border-destructive-strong/40 bg-destructive/10 p-4">
        <span dir="ltr" className="font-mono text-5xl font-bold text-destructive-strong">
          403
        </span>
        <span className="flex flex-col gap-1">
          <span dir="ltr" className="max-w-full self-start font-mono text-sm font-semibold">
            {t('home.preview.forbidden')}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Lock aria-hidden className="size-3.5" />
            {t('home.outcome.LOCKED')} · <code className="font-mono">AUTHORISE</code>
          </span>
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 rounded-lg bg-muted/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <ArrowRightLeft aria-hidden className="size-3.5" />
            {t('home.story.alternative')}
          </p>
          <p dir="ltr" className="max-w-full self-start font-mono text-sm">
            CTDIvol {SC02.alternative.ctdivol} mGy · DLP {SC02.alternative.dlp} mGy·cm
          </p>
        </div>
        <div className="flex flex-col gap-1.5 rounded-lg bg-muted/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <UserCheck aria-hidden className="size-3.5" />
            {t('home.story.override')}
          </p>
          <p className="text-xs leading-relaxed text-foreground/80">{t('home.story.overrideBody')}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t('home.story.timing', { block: DEMO_TIMING.blockMs, explain: DEMO_TIMING.explainS })}
      </p>
    </Panel>
  )
}

function StepText({ step, index, active }: { step: Step; index: number; active: boolean }) {
  const { t } = useTranslation()
  return (
    <div className={cn('flex gap-4 transition-opacity duration-300', !active && 'opacity-45')}>
      <span
        dir="ltr"
        className={cn(
          'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-semibold transition-all duration-300',
          active
            ? 'border-primary bg-gradient-2 text-primary-foreground shadow-e3 ring-4 ring-primary/15'
            : 'bg-card text-muted-foreground',
        )}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex flex-col gap-1.5 pt-1">
        <h3 className={cn('text-lg font-semibold md:text-xl', active && 'text-foreground')}>{t(`home.story.steps.${step}.title`)}</h3>
        <p className="leading-relaxed text-muted-foreground">{t(`home.story.steps.${step}.body`)}</p>
      </div>
    </div>
  )
}

/**
 * The SC-02 story, pinned while the page scrolls past it. On phones and for
 * readers who prefer reduced motion it is a plain list — same content, no pin.
 */
export function StoryScroll() {
  const { t } = useTranslation()
  const track = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })
  useMotionValueEvent(scrollYProgress, 'change', (p) =>
    setStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length)))),
  )

  return (
    <SectionShell
      id="story"
      eyebrow={t('home.story.eyebrow')}
      title={t('home.story.title')}
      lead={t('home.story.lead')}
      className="bg-background pb-8 md:pb-12"
      decor={
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-primary/5 to-transparent"
        />
      }
    >
      {/* Pinned: md and up, motion allowed */}
      <div
        ref={track}
        className="relative hidden motion-safe:md:block"
        style={{ height: `${STEPS.length * 85}dvh` }}
      >
        <div className="sticky top-(--topbar-height) grid h-[calc(100dvh-var(--topbar-height))] grid-cols-12 items-center gap-10">
          <div className="relative col-span-5 flex flex-col gap-10">
            <div aria-hidden className="absolute inset-y-4 start-[1.0625rem] w-0.5 rounded-full bg-border" />
            <motion.div
              aria-hidden
              className="absolute inset-y-4 start-[1.0625rem] w-0.5 origin-top rounded-full bg-gradient-to-b from-primary to-primary/40 shadow-[0_0_12px_var(--primary)]"
              style={{ scaleY: rail }}
            />
            {STEPS.map((s, i) => (
              <StepText key={s} step={s} index={i} active={i === step} />
            ))}
          </div>
          <div className="col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[step]}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <StoryVisual step={STEPS[step]!} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stacked: phones, and reduced motion at any width */}
      <ol className="flex flex-col gap-12 motion-safe:md:hidden">
        {STEPS.map((s, i) => (
          <li key={s}>
            <Reveal className="flex flex-col gap-5">
              <StepText step={s} index={i} active />
              <StoryVisual step={s} />
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
