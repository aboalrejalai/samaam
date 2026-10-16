import { MotionConfig } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { AwardSection } from '@/components/home/AwardSection'
import { Bento } from '@/components/home/Bento'
import { ClosingCta } from '@/components/home/ClosingCta'
import { Hero } from '@/components/home/Hero'
import { HomeFooter } from '@/components/home/HomeFooter'
import { HomeHeader } from '@/components/home/HomeHeader'
import { PipelineSection } from '@/components/home/PipelineSection'
import { ScenarioTabs } from '@/components/home/ScenarioTabs'
import { SourcesRail } from '@/components/home/SourcesRail'
import { Stats } from '@/components/home/Stats'
import { StoryScroll } from '@/components/home/StoryScroll'
import { TeamSection } from '@/components/home/TeamSection'

/**
 * The landing page on `/`. Everything it states comes from
 * `components/home/home-data.ts`; every word from `home.*` in the locales.
 * `reducedMotion="user"` strips transforms for readers who ask for less motion;
 * the pinned sections additionally fall back to plain layouts in CSS.
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
          <AwardSection />
          <StoryScroll />
          <PipelineSection />
          <Bento />
          <Stats />
          <ScenarioTabs />
          <SourcesRail />
          <TeamSection />
          <ClosingCta />
        </main>
        <HomeFooter />
      </div>
    </MotionConfig>
  )
}
