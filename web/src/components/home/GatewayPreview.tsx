import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Lock, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BrandMark } from '@/components/BrandMark'
import { StatusIcon } from '@/components/primitives/status-icon'
import { useHealth } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { EASE } from './motion-kit'
import { PIPELINE, SC01, SC02, SCENARIOS, type Scenario } from './home-data'

const DEVICE_SCENARIOS = SCENARIOS.filter((s) => s.id !== 'SC-03')
const CYCLE_MS = 5200

/** The request lines each scenario shows. Values from home-data, never typed here. */
function requestLines(id: Scenario['id']) {
  const v = id === 'SC-01' ? SC01 : SC02
  return [
    { k: 'eGFR', v: v.egfr, u: 'mL/min/1.73m²' },
    { k: 'CTDIvol', v: v.ctdivol, u: 'mGy' },
    { k: 'DLP', v: v.dlp, u: 'mGy·cm' },
  ]
}

/**
 * A working miniature of the console, not a screenshot: SC-01 and SC-02 replay
 * through the seven nodes with the verdicts, checks and HTTP answers the
 * pipeline actually returns. The footer is live — it polls `/health` and shows
 * the knowledge-base counts the running service reports, or says plainly that
 * the service is offline.
 */
export function GatewayPreview({ className }: { className?: string }) {
  const { t } = useTranslation()
  const reduce = useReducedMotion()
  const health = useHealth()
  const [index, setIndex] = useState(1)
  const [pinned, setPinned] = useState(false)
  const scenario = DEVICE_SCENARIOS[index]!
  const blocked = scenario.http === 403

  useEffect(() => {
    if (reduce || pinned) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % DEVICE_SCENARIOS.length),
      CYCLE_MS,
    )
    return () => window.clearInterval(id)
  }, [reduce, pinned])

  const kb = health.data?.knowledge_base

  return (
    // Premium frame: a 1px gradient border (brand blue to award gold) around a
    // frosted inset, then the console itself. Content below is unchanged.
    <div
      className={cn(
        'rounded-[1.1rem] bg-linear-to-br from-primary/50 via-border to-amber-400/50 p-px shadow-e6',
        className,
      )}
    >
      <div className="rounded-2xl bg-background/80 p-1.5 backdrop-blur-sm">
        <div className="relative overflow-hidden rounded-xl border bg-card">
          {/* Top highlight line, tinted by the current answer. */}
          <div
            aria-hidden
            className={cn(
              'absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent to-transparent transition-colors duration-500',
              blocked ? 'via-destructive-strong' : 'via-success-strong',
            )}
          />
          {/* Title bar */}
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <BrandMark className="size-6 rounded-sm" />
            <code dir="ltr" className="truncate font-mono text-xs text-muted-foreground">
              {scenario.endpoint}
            </code>
            <div
              role="tablist"
              aria-label={t('home.preview.title')}
              className="ms-auto flex shrink-0 items-center gap-1 rounded-md bg-muted p-0.5"
            >
              {DEVICE_SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => {
                    setIndex(i)
                    setPinned(true)
                  }}
                  className={cn(
                    'relative rounded-sm px-2.5 py-1 font-mono text-xs transition-colors',
                    i === index ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {i === index && (
                    <motion.span
                      layoutId="preview-tab"
                      className="absolute inset-0 rounded-sm bg-background shadow-e1"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seven nodes */}
          <ol className="flex items-center gap-1 border-b px-4 py-3">
            {PIPELINE.map((node, i) => {
              const pIndex = PIPELINE.findIndex((n) => n.id === 'P')
              const reached = !blocked || i <= pIndex
              const gate = node.id === 'P'
              return (
                <li key={node.id} className="flex min-w-0 flex-1 items-center gap-1">
                  <motion.span
                    key={`${scenario.id}-${node.id}`}
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: reached ? 1 : 0.3 }}
                    transition={{ delay: reduce ? 0 : 0.15 + i * 0.09, duration: 0.3 }}
                    className={cn(
                      'flex h-7 min-w-0 flex-1 items-center justify-center rounded-sm border font-mono text-xs font-semibold',
                      gate && blocked && 'border-destructive-strong bg-destructive/10 text-destructive-strong',
                      gate && !blocked && 'border-success-strong bg-success/10 text-success-strong',
                      !gate && reached && 'border-primary/30 bg-primary/5 text-primary',
                      !reached && 'border-dashed text-muted-foreground',
                    )}
                  >
                    {node.id}
                  </motion.span>
                </li>
              )
            })}
          </ol>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid gap-4 p-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
              {/* Request */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground">{t('home.preview.request')}</p>
                <dl dir="ltr" className="flex flex-col gap-1.5 rounded-lg bg-muted/60 p-3">
                  {requestLines(scenario.id).map((line, i) => (
                    <motion.div
                      key={line.k}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduce ? 0 : 0.1 + i * 0.08, duration: 0.4, ease: EASE }}
                      className="flex items-baseline justify-between gap-2 font-mono text-xs"
                    >
                      <dt className="text-muted-foreground">{line.k}</dt>
                      <dd className="truncate">
                        <span className="text-sm font-semibold text-foreground">{line.v}</span>{' '}
                        <span className="text-muted-foreground">{line.u}</span>
                      </dd>
                    </motion.div>
                  ))}
                </dl>
                <p className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Send aria-hidden className="size-3.5" />
                  {t(`home.scenarios.items.${scenario.key}.name`)}
                </p>
              </div>

              {/* Checks + response */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground">{t('home.preview.checks')}</p>
                <ul className="flex flex-col gap-1">
                  {scenario.checks.map((check, i) => (
                    <motion.li
                      key={check.rule}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : 0.75 + i * 0.1, duration: 0.35, ease: EASE }}
                      className="flex items-center gap-2 rounded-sm px-1 py-0.5 text-xs"
                    >
                      <StatusIcon status={check.status} />
                      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-foreground">
                        {check.rule}
                      </code>
                      <span className="shrink-0 text-muted-foreground">
                        {t(`check.status.${check.status}`)}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduce ? 0 : 1.3, duration: 0.45, ease: EASE }}
                  className={cn(
                    'mt-1 flex items-center gap-3 rounded-lg border p-3',
                    blocked
                      ? 'border-destructive-strong/40 bg-destructive/10'
                      : 'border-success-strong/40 bg-success/10',
                  )}
                >
                  <span
                    dir="ltr"
                    className={cn(
                      'font-mono text-2xl font-bold',
                      blocked ? 'text-destructive-strong' : 'text-success-strong',
                    )}
                  >
                    {scenario.http}
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span dir="ltr" className="max-w-full self-start truncate font-mono text-xs font-semibold text-foreground">
                      {blocked ? t('home.preview.forbidden') : t('home.preview.ok')}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        {blocked && <Lock aria-hidden className="size-3" />}
                        {t(`home.outcome.${scenario.outcome}`)}
                      </span>
                      <code dir="ltr" className="font-mono">
                        {scenario.verdict}
                      </code>
                    </span>
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Live footer */}
          <div className="flex items-center gap-2 border-t bg-muted/40 px-4 py-2.5 text-xs" aria-live="polite">
            <span
              aria-hidden
              className={cn(
                'size-2 shrink-0 rounded-full',
                kb ? 'bg-success' : health.isPending ? 'bg-muted-foreground/40' : 'bg-warning',
              )}
            />
            {kb ? (
              <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                <span className="truncate">{t('home.preview.online')}</span>
                <span dir="ltr" className="font-mono font-semibold text-foreground">
                  {kb.policies} · {kb.gaps} · {kb.source_chunks.toLocaleString('en')}
                </span>
                <span className="hidden truncate sm:inline">{t('home.preview.counts')}</span>
              </span>
            ) : (
              <span className="truncate text-muted-foreground">
                {health.isPending ? '…' : t('home.preview.offline')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
