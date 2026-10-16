import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { StatusIcon } from '@/components/primitives/status-icon'
import { Button } from '@/components/ui/button'
import { APP_BASE } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { SC03_RECORDS, SCENARIOS, type CheckStatus, type Scenario } from './home-data'
import { EASE, Reveal, useDirSign } from './motion-kit'

// Accent per check status — the colour carries the same meaning as StatusIcon.
const CHECK_ACCENT: Record<CheckStatus, string> = {
  PASS: 'border-s-success-strong',
  FAIL: 'border-s-destructive-strong',
  WARN: 'border-s-warning-strong',
  NOT_APPLICABLE: 'border-s-border',
}

// A 200 proceeds; a PROHIBITED 403 cannot be released; other 403s wait for an authoriser.
function tone(s: Scenario) {
  if (s.http === 200) {
    return {
      icon: ShieldCheck,
      text: 'text-success-strong',
      dot: 'bg-success-strong',
      bar: 'bg-success-strong',
      panel: 'border-success-strong/40 bg-success/10',
    }
  }
  return {
    icon: s.overridable ? ShieldAlert : ShieldX,
    text: 'text-destructive-strong',
    dot: 'bg-destructive-strong',
    bar: 'bg-destructive-strong',
    panel: 'border-destructive-strong/40 bg-destructive/10',
  }
}

/** The three mandatory scenarios, in the order the guide fixes. */
export function ScenarioTabs() {
  const { t } = useTranslation()
  const sign = useDirSign()
  const [active, setActive] = useState(1)
  const [travel, setTravel] = useState(1)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const scenario = SCENARIOS[active]!
  const look = tone(scenario)
  const ToneIcon = look.icon

  function select(next: number) {
    const wrapped = (next + SCENARIOS.length) % SCENARIOS.length
    setTravel(wrapped > active ? 1 : -1)
    setActive(wrapped)
    tabs.current[wrapped]?.focus()
  }

  return (
    <section id="scenarios" className="relative scroll-mt-20 overflow-hidden py-20 md:py-28">
      {/* Soft brand wash behind the section. Decorative. */}
      <div aria-hidden className="bg-mesh pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal className="flex max-w-3xl flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {t('home.scenarios.eyebrow')}
          </span>
          <h2 className="text-3xl leading-[1.25] font-bold text-balance md:text-5xl">
            {t('home.scenarios.title')}
          </h2>
          <p className="max-w-[65ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {t('home.scenarios.lead')}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-6">
          <div
            role="tablist"
            aria-label={t('home.scenarios.title')}
            className="grid gap-2 rounded-2xl border bg-card/80 p-2 shadow-e1 backdrop-blur sm:grid-cols-3"
            onKeyDown={(e) => {
              // Arrow keys follow reading direction.
              const forward = sign === 1 ? 'ArrowRight' : 'ArrowLeft'
              const back = sign === 1 ? 'ArrowLeft' : 'ArrowRight'
              if (e.key === forward) select(active + 1)
              else if (e.key === back) select(active - 1)
              else return
              e.preventDefault()
            }}
          >
            {SCENARIOS.map((s, i) => {
              const selected = i === active
              const st = tone(s)
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`scenario-tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls="scenario-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    'group relative flex min-w-0 items-center gap-3 rounded-xl px-4 py-3 text-start transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    selected ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="scenario-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-brand shadow-e3"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    dir="ltr"
                    className={cn(
                      'relative flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs font-semibold',
                      selected ? 'bg-primary-foreground/15' : 'bg-muted group-hover:bg-background',
                    )}
                  >
                    <span aria-hidden className={cn('size-1.5 rounded-full', st.dot)} />
                    {s.id}
                  </span>
                  <span className="relative min-w-0 flex-1 truncate text-sm font-semibold">
                    {t(`home.scenarios.items.${s.key}.name`)}
                  </span>
                  <span
                    dir="ltr"
                    className={cn(
                      'relative shrink-0 font-mono text-xs font-bold',
                      selected ? 'text-primary-foreground/90' : st.text,
                    )}
                  >
                    {s.http}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            id="scenario-panel"
            role="tabpanel"
            aria-labelledby={`scenario-tab-${scenario.id}`}
            className="relative overflow-hidden rounded-2xl border bg-card shadow-e4"
          >
            {/* Verdict-coloured accent along the top edge. */}
            <motion.div
              key={`bar-${scenario.id}`}
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className={cn('h-1 w-full ltr:origin-left rtl:origin-right', look.bar)}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, x: 24 * travel * sign }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 * travel * sign }}
                transition={{ duration: 0.35, ease: EASE }}
                className="grid lg:grid-cols-12"
              >
                {/* Summary and outcome */}
                <div className="flex min-w-0 flex-col gap-6 border-b p-5 sm:p-6 md:p-8 lg:col-span-5 lg:border-e lg:border-b-0">
                  <div className="flex flex-col gap-3">
                    <span
                      dir="ltr"
                      className="self-start rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-muted-foreground"
                    >
                      {scenario.id}
                    </span>
                    <h3 className="text-xl font-bold md:text-2xl">
                      {t(`home.scenarios.items.${scenario.key}.name`)}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {t(`home.scenarios.items.${scenario.key}.summary`, {
                        records: SC03_RECORDS.toLocaleString('en'),
                      })}
                    </p>
                  </div>

                  <div className={cn('flex items-center gap-4 rounded-xl border p-4', look.panel)}>
                    <span
                      className={cn(
                        'flex size-12 shrink-0 items-center justify-center rounded-xl bg-background shadow-e1',
                        look.text,
                      )}
                    >
                      <ToneIcon aria-hidden className="size-6" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5 text-sm">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span dir="ltr" className={cn('font-mono text-3xl leading-none font-bold', look.text)}>
                          {scenario.http}
                        </span>
                        <span className="text-xs text-muted-foreground">{t('home.scenarios.http')}</span>
                      </span>
                      <code dir="ltr" className="max-w-full self-start truncate font-mono text-xs font-semibold">
                        {scenario.endpoint}
                      </code>
                      <span className="text-muted-foreground">{t(`home.outcome.${scenario.outcome}`)}</span>
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex min-w-0 flex-col gap-1 rounded-lg bg-muted/60 p-3">
                      <dt className="text-xs text-muted-foreground">{t('home.scenarios.verdict')}</dt>
                      <dd>
                        <code dir="ltr" className={cn('font-mono text-xs font-bold break-all', look.text)}>
                          {scenario.verdict}
                        </code>
                      </dd>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1 rounded-lg bg-muted/60 p-3">
                      <dt className="text-xs text-muted-foreground">{t('home.scenarios.action')}</dt>
                      <dd className="font-semibold">{t(`action.${scenario.action}`)}</dd>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1 rounded-lg bg-muted/60 p-3">
                      <dt className="text-xs text-muted-foreground">{t('home.scenarios.overridable')}</dt>
                      <dd className="font-semibold">
                        {scenario.action === 'PROCEED'
                          ? '—'
                          : scenario.overridable
                            ? t('home.scenarios.overrideYes')
                            : t('home.scenarios.overrideNo')}
                      </dd>
                    </div>
                  </dl>

                  <Button asChild className="group/btn mt-auto self-start shadow-e2">
                    <Link to={scenario.id === 'SC-03' ? `${APP_BASE}/data` : APP_BASE}>
                      {t('home.scenarios.open')}
                      <ArrowRight
                        data-icon="inline-end"
                        aria-hidden
                        className="transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5"
                      />
                    </Link>
                  </Button>
                </div>

                {/* Checks */}
                <div className="flex min-w-0 flex-col gap-3 bg-muted/30 p-5 sm:p-6 md:p-8 lg:col-span-7">
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
                    {t('home.scenarios.checks')}
                    <span dir="ltr" className="rounded-full bg-background px-2 py-0.5 font-mono shadow-e1">
                      {scenario.checks.length}
                    </span>
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {scenario.checks.map((check, i) => (
                      <motion.li
                        key={check.rule}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: EASE }}
                        className={cn(
                          'flex min-w-0 flex-col gap-2 rounded-xl border border-s-4 bg-card p-4 shadow-e1 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-e3',
                          CHECK_ACCENT[check.status],
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusIcon status={check.status} />
                          <code dir="ltr" className="min-w-0 font-mono text-sm font-semibold break-all">
                            {check.rule}
                          </code>
                          <span className="text-xs text-muted-foreground">{t(`check.status.${check.status}`)}</span>
                          {check.basis !== null && (
                            <span className="ms-auto rounded-full border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                              {t(`basis.satisfied.${check.basis}`)}
                            </span>
                          )}
                        </div>
                        {check.reading !== undefined && (
                          <p className="flex flex-wrap gap-x-4 gap-y-1 ps-6 text-xs text-muted-foreground">
                            <span>
                              {check.reading.name} · {t('home.scenarios.measured')}{' '}
                              <span dir="ltr" className="font-mono font-semibold text-foreground">
                                {check.reading.measured}
                              </span>
                            </span>
                            <span>
                              {t('home.scenarios.limit')}{' '}
                              <span dir="ltr" className="font-mono font-semibold text-foreground">
                                {check.reading.limit} {check.reading.unit}
                              </span>
                            </span>
                          </p>
                        )}
                        <p className="flex flex-wrap gap-1.5 ps-6">
                          {check.cites.map((cite) => (
                            <span
                              key={cite}
                              dir="ltr"
                              className="rounded-md bg-primary/5 px-1.5 py-0.5 font-mono text-[11px] text-primary"
                            >
                              {cite}
                            </span>
                          ))}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
