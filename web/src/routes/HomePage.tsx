import { MotionConfig } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ArchitectureSection } from '@/components/home/ArchitectureSection'
import { AwardAndTeam } from '@/components/home/AwardAndTeam'
import { CaseSection } from '@/components/home/CaseSection'
import { ClosingCta } from '@/components/home/ClosingCta'
import { Hero } from '@/components/home/Hero'
import { HoldVsRefuseSection } from '@/components/home/HoldVsRefuseSection'
import { HomeFooter } from '@/components/home/HomeFooter'
import { HomeHeader } from '@/components/home/HomeHeader'
import { SourcesSection } from '@/components/home/SourcesSection'
import { WhatGetsLostSection } from '@/components/home/WhatGetsLostSection'

/**
 * Port of the approved landing page from `design/001-samaam-redesign/boards/Main.dc.html`.
 * Section order:
 *  1. notice bar (HomeHeader)
 *  2. header (HomeHeader)
 *  3. hero (Hero)
 *  4. award and team (AwardAndTeam)
 *  5. the SC-02 case (CaseSection)
 *  6. what gets lost in a busy shift (WhatGetsLostSection)
 *  7. hold versus refuse (HoldVsRefuseSection)
 *  8. architecture (ArchitectureSection)
 *  9. sources (SourcesSection)
 * 10. closing call to action (ClosingCta)
 * 11. footer (HomeFooter)
 */
export default function HomePage() {
  const { t } = useTranslation()

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t('home.skip')}
      </a>
      <div className="min-h-dvh overflow-x-clip bg-background">
        <HomeHeader />
        <main id="main">
          <Hero />
          <AwardAndTeam />
          <CaseSection />
          <WhatGetsLostSection />
          <HoldVsRefuseSection />
          <ArchitectureSection />
          <SourcesSection />
          <ClosingCta />
        </main>
        <HomeFooter />
      </div>
    </MotionConfig>
  )
}
