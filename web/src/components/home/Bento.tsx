import { motion } from 'motion/react'
import { Ban, Fingerprint, Gavel, Layers, Link2, ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ACTIONS, EMITTED_VERDICTS, SCENARIOS, VERDICTS } from './home-data'
import { Stagger, staggerChild } from './motion-kit'
import { SectionShell } from './PipelineSection'

/**
 * policy_node.py's import block, verbatim (app/policy_node.py:11-17). It is the
 * whole argument for "no model in the decision", so it is quoted, not paraphrased.
 */
const POLICY_IMPORTS = [
  'from __future__ import annotations',
  'from dataclasses import dataclass, field',
  'from enum import Enum',
  'from typing import Any',
  'from app.kb import KnowledgeBase',
]

const AUDIT_EVENTS = [
  'EXECUTED',
  'BLOCKED',
  'EXECUTED_UNDER_OVERRIDE',
  'OVERRIDE_REFUSED',
  'SECURITY_OVERRIDE',
] as const

const ACTION_TONE: Record<(typeof ACTIONS)[number], string> = {
  PROCEED: 'border-success-strong/40 bg-success/10 text-success-strong',
  CONFIRM: 'border-warning-strong/40 bg-warning/10 text-warning-strong',
  AUTHORISE: 'border-destructive-strong/40 bg-destructive/10 text-destructive-strong',
  PROHIBITED: 'border-destructive-strong bg-destructive-strong text-card',
}

const SC02_CITES = [
  ...new Set(SCENARIOS.find((s) => s.id === 'SC-02')!.checks.flatMap((c) => c.cites)),
]

const DOTS: React.CSSProperties = {
  backgroundImage:
    'radial-gradient(color-mix(in srgb, var(--foreground) 9%, transparent) 1px, transparent 1px)',
  backgroundSize: '18px 18px',
  maskImage: 'linear-gradient(to bottom, black, transparent 70%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 70%)',
}

/**
 * A bento cell: a one-pixel gradient border, a faded dot pattern, a glow that
 * appears on hover, and a pointer-following wash from the brand ladder.
 */
function Cell({
  icon: Icon,
  title,
  body,
  className,
  featured = false,
  children,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  title: string
  body: string
  className?: string
  /** Stronger border, tinted fill and a larger icon tile for the lead cells. */
  featured?: boolean
  children?: React.ReactNode
}) {
  return (
    <motion.li
      variants={staggerChild}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={cn(
        'group relative isolate flex rounded-2xl bg-gradient-to-br p-px shadow-e1 transition-shadow duration-300 hover:shadow-e4',
        featured ? 'from-primary/60 via-primary/15 to-primary/40' : 'from-border via-border to-primary/30',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute -inset-1 -z-10 rounded-3xl bg-primary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div
        className={cn(
          'relative flex w-full flex-col gap-5 overflow-hidden rounded-[15px] bg-card p-6 md:p-7',
          featured && 'bg-gradient-to-br from-primary/10 via-card to-card',
        )}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0" style={DOTS} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(320px circle at var(--mx) var(--my), color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)',
          }}
        />
        <div className="relative flex flex-col gap-3">
          <span
            className={cn(
              'flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
              featured
                ? 'size-12 bg-gradient-2 text-primary-foreground shadow-e3'
                : 'size-11 bg-primary/10 text-primary ring-1 ring-primary/20',
            )}
          >
            <Icon aria-hidden className={featured ? 'size-6' : 'size-5'} />
          </span>
          <h3 className={cn('font-semibold', featured ? 'text-xl md:text-2xl' : 'text-lg')}>{title}</h3>
          <p className="max-w-[56ch] text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
        {children !== undefined && <div className="relative mt-auto">{children}</div>}
      </div>
    </motion.li>
  )
}

export function Bento() {
  const { t } = useTranslation()

  return (
    <SectionShell
      eyebrow={t('home.bento.eyebrow')}
      title={t('home.bento.title')}
      lead={t('home.bento.lead')}
      className="bg-background"
    >
      <Stagger as="ul" className="grid grid-flow-dense gap-4 md:grid-cols-6 md:gap-5">
        <Cell
          icon={Layers}
          title={t('home.bento.verdicts.title')}
          body={t('home.bento.verdicts.body')}
          featured
          className="md:col-span-4"
        >
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {VERDICTS.map((v) => {
              const emitted = EMITTED_VERDICTS.has(v)
              return (
                <li
                  key={v}
                  className={cn(
                    'flex flex-col gap-1 rounded-lg border bg-background/80 p-3',
                    emitted && 'border-primary/40',
                  )}
                >
                  <code dir="ltr" className="max-w-full self-start truncate font-mono text-xs font-semibold">
                    {v}
                  </code>
                  <span className="text-xs text-muted-foreground">{t(`verdict.${v}`)}</span>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span aria-hidden className="size-2.5 rounded-sm border border-primary/40" />
            {t('home.bento.verdicts.emitted')}
          </p>
        </Cell>

        <Cell
          icon={Gavel}
          title={t('home.bento.deterministic.title')}
          body={t('home.bento.deterministic.body')}
          featured
          className="md:col-span-2 md:row-span-2"
        >
          <div dir="ltr" className="overflow-hidden rounded-xl border bg-background/90 shadow-e2">
            <div className="flex items-center gap-1.5 border-b bg-muted/60 px-3 py-2">
              <span aria-hidden className="size-2.5 rounded-full bg-destructive/60" />
              <span aria-hidden className="size-2.5 rounded-full bg-warning/70" />
              <span aria-hidden className="size-2.5 rounded-full bg-success/70" />
              <span className="ms-2 truncate font-mono text-[11px] text-muted-foreground">app/policy_node.py</span>
            </div>
            <pre className="overflow-x-auto p-3 text-start font-mono text-xs leading-relaxed text-muted-foreground">
              {POLICY_IMPORTS.map((line) => (
                <span key={line} className="block">
                  <span className="text-primary">{line.split(' ')[0]}</span>
                  {line.slice(line.indexOf(' '))}
                </span>
              ))}
            </pre>
          </div>
        </Cell>

        <Cell
          icon={Fingerprint}
          title={t('home.bento.actions.title')}
          body={t('home.bento.actions.body')}
          className="md:col-span-2"
        >
          <ol className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <li
                key={a}
                className={cn('rounded-sm border px-2.5 py-1 text-xs font-semibold', ACTION_TONE[a])}
              >
                {t(`action.${a}`)}
              </li>
            ))}
          </ol>
        </Cell>

        <Cell
          icon={Link2}
          title={t('home.bento.citations.title')}
          body={t('home.bento.citations.body')}
          className="md:col-span-2"
        >
          <ul dir="ltr" className="flex flex-wrap gap-1.5">
            {SC02_CITES.map((id) => (
              <li key={id} className="rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                {id}
              </li>
            ))}
          </ul>
        </Cell>

        <Cell
          icon={Ban}
          title={t('home.bento.privacy.title')}
          body={t('home.bento.privacy.body')}
          className="md:col-span-3"
        >
          <div dir="ltr" className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="rounded-sm border border-destructive-strong bg-destructive-strong px-2.5 py-1 font-semibold text-card">
              PROHIBITED
            </span>
            <span className="rounded-sm bg-muted px-2.5 py-1 text-muted-foreground">overridable: false</span>
            <span className="rounded-sm bg-muted px-2.5 py-1 text-muted-foreground">HTTP 403</span>
          </div>
        </Cell>

        <Cell
          icon={ScrollText}
          title={t('home.bento.audit.title')}
          body={t('home.bento.audit.body')}
          className="md:col-span-3"
        >
          <ul className="flex flex-col divide-y rounded-lg border bg-background/80">
            {AUDIT_EVENTS.map((e) => (
              <li key={e} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                <code dir="ltr" className="truncate font-mono font-semibold">
                  {e}
                </code>
                <span className="shrink-0 text-muted-foreground">{t(`audit.events.${e}`)}</span>
              </li>
            ))}
          </ul>
        </Cell>
      </Stagger>
    </SectionShell>
  )
}
