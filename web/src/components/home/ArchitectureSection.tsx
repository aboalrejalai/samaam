import { useTranslation } from 'react-i18next'

export function ArchitectureSection() {
  const { t } = useTranslation()

  return (
    <section id="arch" className="rule-top" style={{ background: 'var(--card)' }} data-id="arch">
      <div className="wrap sec">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-18 items-end">
          <h2 className="h-sec">{t('home.arch.title')}</h2>
          <p className="lead">{t('home.arch.lead')}</p>
        </div>

        <ol
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-8"
          data-id="arch.rail"
        >
          {/* SRC */}
          <li className="node flex flex-col gap-1 p-3.5 min-w-0">
            <span className="sym">{t('home.arch.nodes.src.sym')}</span>
            <span className="what whitespace-normal break-words">{t('home.arch.nodes.src.what')}</span>
          </li>

          {/* C */}
          <li className="node flex flex-col gap-1 p-3.5 min-w-0">
            <span className="sym">{t('home.arch.nodes.c.sym')}</span>
            <span className="what whitespace-normal break-words">{t('home.arch.nodes.c.what')}</span>
          </li>

          {/* PP */}
          <li className="node flex flex-col gap-1 p-3.5 min-w-0">
            <span className="sym">{t('home.arch.nodes.pp.sym')}</span>
            <span className="what whitespace-normal break-words">{t('home.arch.nodes.pp.what')}</span>
          </li>

          {/* M - explains only, dimmed */}
          <li className="node flex flex-col gap-1 p-3.5 min-w-0 opacity-60">
            <span className="sym">{t('home.arch.nodes.m.sym')}</span>
            <span className="what whitespace-normal break-words">{t('home.arch.nodes.m.what')}</span>
          </li>

          {/* P - filled in primary */}
          <li
            className="node flex flex-col gap-1 p-3.5 min-w-0 shadow-xs"
            style={{
              background: 'var(--primary)',
            }}
          >
            <span className="sym" style={{ color: 'var(--primary-foreground)' }}>
              {t('home.arch.nodes.p.sym')}
            </span>
            <span className="what whitespace-normal break-words font-medium" style={{ color: 'var(--primary-foreground)' }}>
              {t('home.arch.nodes.p.what')}
            </span>
          </li>

          {/* D */}
          <li className="node flex flex-col gap-1 p-3.5 min-w-0">
            <span className="sym">{t('home.arch.nodes.d.sym')}</span>
            <span className="what whitespace-normal break-words">{t('home.arch.nodes.d.what')}</span>
          </li>

          {/* SINK */}
          <li className="node flex flex-col gap-1 p-3.5 min-w-0">
            <span className="sym">{t('home.arch.nodes.sink.sym')}</span>
            <span className="what whitespace-normal break-words">{t('home.arch.nodes.sink.what')}</span>
          </li>
        </ol>
      </div>
    </section>
  )
}
