import { motion } from 'motion/react'
import { Database, FileStack, ListChecks, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { COUNTS } from './home-data'
import { CountUp, Stagger, staggerChild } from './motion-kit'
import { SectionShell } from './PipelineSection'

const ITEMS = [
  { key: 'records', value: COUNTS.records, icon: Database },
  { key: 'chunks', value: COUNTS.chunks, icon: FileStack },
  { key: 'rules', value: COUNTS.rules, icon: ListChecks },
  { key: 'gaps', value: COUNTS.gaps, icon: SearchX },
] as const

/**
 * Knowledge-base counts. CountUp starts at the final value and only animates
 * when motion is allowed, so reduced-motion readers see the real number at once.
 */
export function Stats() {
  const { t } = useTranslation()
  const vars = { verified: COUNTS.verified, files: COUNTS.sourceFiles }

  return (
    <SectionShell
      eyebrow={t('home.stats.eyebrow')}
      title={t('home.stats.title')}
      className="border-y bg-primary/5"
      decor={
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                'radial-gradient(color-mix(in srgb, var(--primary) 22%, transparent) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 start-1/2 -z-10 size-[28rem] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-3xl rtl:translate-x-1/2"
          />
        </>
      }
    >
      <Stagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <motion.li
              key={item.key}
              variants={staggerChild}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="group relative isolate rounded-2xl bg-gradient-to-br from-primary/50 via-border to-primary/20 p-px shadow-e2 transition-shadow duration-300 hover:shadow-e5"
            >
              <div
                aria-hidden
                className="absolute -inset-1 -z-10 rounded-3xl bg-primary/25 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-[15px] bg-card p-6">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-10 -top-10 size-32 rounded-full bg-primary/10 blur-2xl"
                />
                <span className="relative flex size-11 items-center justify-center rounded-xl bg-gradient-2 text-primary-foreground shadow-e3">
                  <Icon aria-hidden className="size-5" />
                </span>
                {/* Gradient text on a wrapper: the counter's own colour must stay transparent. */}
                <span
                  className="relative self-start bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, var(--foreground)))',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  <CountUp to={item.value} />
                </span>
                <p className="relative text-base font-semibold">
                  {t(`home.stats.items.${item.key}.label`, vars)}
                </p>
                <p className="relative text-sm leading-relaxed text-muted-foreground">
                  {t(`home.stats.items.${item.key}.note`, vars)}
                </p>
              </div>
            </motion.li>
          )
        })}
      </Stagger>
    </SectionShell>
  )
}
