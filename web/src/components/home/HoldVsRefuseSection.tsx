import { useTranslation } from 'react-i18next'

export function HoldVsRefuseSection() {
  const { t } = useTranslation()

  return (
    <section id="paths" className="wrap sec" data-id="paths">
      <h2 className="h-sec max-w-[720px]">{t('home.paths.title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Hold card */}
        <article
          className="card card-pad grid grid-cols-1 sm:grid-cols-2 gap-4 items-center overflow-hidden"
          data-id="paths.hold"
        >
          <div className="flex flex-col gap-2.5">
            <p className="chip chip-warn w-fit">
              <span className="mono font-semibold">{t('home.paths.holdChip')}</span>
            </p>
            <h3 className="text-xl leading-7 font-bold">{t('home.paths.holdTitle')}</h3>
            <p className="small muted leading-relaxed">{t('home.paths.holdDesc')}</p>
          </div>
          <img
            src="/models/ct-scanner.webp"
            alt={t('models.ctScannerAlt')}
            className="w-full object-contain max-h-[220px]"
          />
        </article>

        {/* Refuse card */}
        <article
          className="card card-pad grid grid-cols-1 sm:grid-cols-2 gap-4 items-center overflow-hidden"
          data-id="paths.refuse"
        >
          <div className="flex flex-col gap-2.5">
            <p className="chip chip-err w-fit">
              <span className="mono font-semibold">{t('home.paths.refuseChip')}</span>
            </p>
            <h3 className="text-xl leading-7 font-bold">{t('home.paths.refuseTitle')}</h3>
            <p className="small muted leading-relaxed">{t('home.paths.refuseDesc')}</p>
          </div>
          <img
            src="/models/records.webp"
            alt={t('models.recordsAlt')}
            className="w-full object-contain max-h-[220px]"
          />
        </article>
      </div>
    </section>
  )
}
