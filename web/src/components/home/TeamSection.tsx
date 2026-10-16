import { Crown, GraduationCap, Target, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TEAM_LEADER, TEAM_MEMBERS } from './home-data'
import { EASE, Reveal, Stagger, staggerChild } from './motion-kit'
import { initials } from '@/lib/text'

type MemberKey = (typeof TEAM_MEMBERS)[number]['key']

/**
 * First letters of the first and last word of the shown name. A zero-width
 * non-joiner keeps two Arabic letters from joining into one glyph.
 */
/** Shared text for a member, read from `team.members.<key>.*`. */
function useMember(key: MemberKey) {
  const { t } = useTranslation()
  return {
    name: t(`team.members.${key}.name`),
    role: t(`team.members.${key}.role`),
    study: t(`team.members.${key}.study`),
    focus: t(`team.members.${key}.focus`),
  }
}

/** The certificate spelling, shown under the Arabic name only. */
function LatinName({ name }: { name: string }) {
  const { t, i18n } = useTranslation()
  if (i18n.resolvedLanguage !== 'ar') return null
  return (
    <span
      dir="ltr"
      title={t('home.team.asOnCertificate')}
      className="text-xs font-medium text-muted-foreground"
    >
      {name}
    </span>
  )
}

/**
 * Team Samaam, leader first and largest, as on the certificate. Names, roles
 * and universities come from the locales; nothing here is inferred.
 */
export function TeamSection() {
  const { t } = useTranslation()
  const members = TEAM_MEMBERS.filter((m) => !m.leader)

  return (
    <section id="team" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <Reveal className="flex max-w-3xl flex-col gap-3">
          <p className="text-sm font-semibold text-primary">{t('home.team.eyebrow')}</p>
          <h2 className="text-3xl leading-[1.25] font-bold text-balance md:text-4xl">
            {t('team.name')}
          </h2>
          <p className="max-w-[65ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {t('home.team.lead')}
          </p>
          <a
            href="#award"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-500/20 dark:text-amber-300"
          >
            <Trophy aria-hidden className="size-3.5 shrink-0" />
            {t('hackathon.prizeLong')}
          </a>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <LeaderCard />

          <div className="flex flex-col gap-4 lg:col-span-7">
            <p className="text-sm font-semibold text-muted-foreground">
              {t('home.team.members')}
            </p>
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {members.map((m) => (
                <MemberCard key={m.key} memberKey={m.key} latin={m.name} />
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}

function LeaderCard() {
  const { t } = useTranslation()
  const m = useMember(TEAM_LEADER.key)

  return (
    <motion.article
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative isolate flex flex-col gap-6 overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 lg:col-span-5"
    >
      <div
        aria-hidden
        className="absolute -top-20 -end-20 -z-10 size-64 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -start-16 -z-10 size-56 rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-500/10"
      />

      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-amber-950 shadow-md">
        <Crown aria-hidden className="size-3.5 shrink-0" />
        {t('team.leader')}
      </span>

      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center">
        <div className="relative shrink-0">
          <Avatar className="size-24 ring-4 ring-primary/20 ring-offset-4 ring-offset-background md:size-28">
            <AvatarFallback className="bg-gradient-brand text-3xl font-bold text-primary-foreground">
              {initials(m.name)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -end-1 -bottom-1 grid size-9 place-items-center rounded-full border-2 border-background bg-amber-500 text-amber-950 shadow-md">
            <Crown aria-hidden className="size-4" />
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-2xl leading-snug font-bold text-balance md:text-3xl">{m.name}</h3>
          <LatinName name={TEAM_LEADER.name} />
          <p className="text-base font-medium text-primary">{m.role}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-primary/15 pt-5">
        <p className="flex items-start gap-3 text-sm leading-relaxed text-pretty md:text-base">
          <Target aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
          <span>
            <span className="sr-only">{t('home.team.focus')}: </span>
            {m.focus}
          </span>
        </p>
        <p className="flex items-center gap-3 text-sm text-muted-foreground">
          <GraduationCap aria-hidden className="size-4 shrink-0 text-primary" />
          {m.study}
        </p>
      </div>
    </motion.article>
  )
}

function MemberCard({ memberKey, latin }: { memberKey: MemberKey; latin: string }) {
  const { t } = useTranslation()
  const m = useMember(memberKey)

  return (
    <motion.li
      variants={staggerChild}
      className="flex items-start gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <Avatar className="size-14">
        <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
          {initials(m.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base leading-snug font-semibold">{m.name}</h3>
          <LatinName name={latin} />
          <p className="text-sm text-muted-foreground">{m.role}</p>
        </div>
        <p className="inline-flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">
          <GraduationCap aria-hidden className="size-3.5 shrink-0 text-primary" />
          {m.study}
        </p>
        <p className="flex items-start gap-1.5 text-sm leading-relaxed text-pretty">
          <Target aria-hidden className="mt-1 size-3.5 shrink-0 text-primary" />
          <span>
            <span className="sr-only">{t('home.team.focus')}: </span>
            {m.focus}
          </span>
        </p>
      </div>
    </motion.li>
  )
}
