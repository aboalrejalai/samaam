import { AlertTriangle, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function WhatGetsLostSection() {
  const { t } = useTranslation()

  return (
    <section className="rule-top" style={{ background: 'var(--card)' }} data-id="lost">
      <div className="wrap sec grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-18 items-center">
        <div className="flex flex-col gap-3">
          <h2 className="h-sec">{t('home.lost.title')}</h2>
          <p className="lead">{t('home.lost.lead')}</p>

          <ul className="flex flex-col mt-3">
            {/* Rule 1: DRL */}
            <li className="flex gap-3 items-center py-3.5 border-t border-border">
              <XCircle className="size-5 ico-fail shrink-0" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="strong block">{t('home.lost.rules.drl.title')}</span>
                <span className="mono small muted block">{t('home.lost.rules.drl.value')}</span>
              </span>
              <span className="basis basis-law">
                {t('home.lost.rules.drl.basis')}
              </span>
            </li>

            {/* Rule 2: Prophylaxis */}
            <li className="flex gap-3 items-center py-3.5 border-t border-border">
              <XCircle className="size-5 ico-fail shrink-0" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="strong block">{t('home.lost.rules.prophylaxis.title')}</span>
                <span className="mono small muted block">
                  {t('home.lost.rules.prophylaxis.value')}
                </span>
              </span>
              <span className="basis basis-protocol">
                {t('home.lost.rules.prophylaxis.basis')}
              </span>
            </li>

            {/* Rule 3: Metformin */}
            <li className="flex gap-3 items-center py-3.5 border-t border-border">
              <XCircle className="size-5 ico-fail shrink-0" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="strong block">{t('home.lost.rules.metformin.title')}</span>
                <span className="small muted block">{t('home.lost.rules.metformin.value')}</span>
              </span>
              <span className="basis basis-protocol">
                {t('home.lost.rules.metformin.basis')}
              </span>
            </li>

            {/* Rule 4: Nephrotoxic */}
            <li className="flex gap-3 items-center py-3.5 border-t border-border">
              <AlertTriangle className="size-5 ico-warn shrink-0" aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="strong block">{t('home.lost.rules.nephrotoxic.title')}</span>
                <span className="small muted block">
                  {t('home.lost.rules.nephrotoxic.value')}
                </span>
              </span>
              <span className="basis basis-protocol">
                {t('home.lost.rules.nephrotoxic.basis')}
              </span>
            </li>
          </ul>
        </div>

        {/* Kidney coronal section figure */}
        <figure className="w-full max-w-[440px] mx-auto" data-id="lost.section">
          <img
            src="/models/kidney-section.webp"
            alt={t('models.kidneySectionAlt')}
            className="w-full object-contain"
          />
        </figure>
      </div>
    </section>
  )
}
