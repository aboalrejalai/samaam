import { Crown, Trophy, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AWARD, HACKATHON, TEAM_MEMBERS } from './home-data'

export function AwardAndTeam() {
  const { t } = useTranslation()

  return (
    <section
      id="award"
      className="rule-top mt-12"
      style={{ background: 'var(--warning-bg)' }}
      data-id="award"
    >
      <div className="wrap sec" style={{ paddingBlock: '72px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          {/* Certificate with full-size dialog */}
          <figure className="m-0" data-id="award.certificate">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label={t('hackathon.certificate')}
                  className="block w-full text-start p-2.5 rounded-2xl border transition-shadow cursor-zoom-in hover:shadow-e4 focus-visible:outline-2 focus-visible:outline-primary"
                  style={{
                    background: '#ffffff',
                    borderColor: 'var(--warning-line)',
                    boxShadow: 'var(--shadow-e2)',
                  }}
                >
                  <img
                    src={AWARD.certificate}
                    alt={t('hackathon.certificateAlt')}
                    className="w-full rounded-sm object-contain"
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-2 bg-card border-border">
                <DialogTitle className="sr-only">{t('hackathon.certificate')}</DialogTitle>
                <DialogDescription className="sr-only">
                  {t('hackathon.certificateAlt')}
                </DialogDescription>
                <div className="relative">
                  <img
                    src={AWARD.certificate}
                    alt={t('hackathon.certificateAlt')}
                    className="w-full rounded-md object-contain"
                  />
                  <DialogClose className="absolute top-2 end-2 p-1.5 rounded-md bg-black/60 text-white hover:bg-black/80 transition-colors">
                    <X className="size-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </figure>

          {/* Award text */}
          <div className="flex flex-col gap-4" data-id="award.text">
            <p className="chip chip-gold w-fit" style={{ background: '#ffffff' }}>
              <Trophy className="size-3.5 text-warning-strong" aria-hidden />
              {t('home.award.chip')}
            </p>
            <h2
              className="h-sec"
              style={{
                fontSize: 'clamp(36px,4vw,52px)',
                color: 'var(--warning-strong)',
              }}
            >
              {t('hackathon.prize')}
            </h2>
            <p className="text-xl leading-7 font-semibold">
              {HACKATHON.name}, {HACKATHON.host}
            </p>
            <blockquote
              className="lead text-[17px] text-foreground leading-relaxed"
              data-id="award.citation"
            >
              “{t('hackathon.citation')}”
            </blockquote>
            <p className="small muted">{t('hackathon.signedBy')}</p>

            <dl
              className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-3.5 border-t"
              style={{ borderColor: 'var(--warning-line)' }}
              data-id="award.facts"
            >
              <div>
                <dt className="micro muted">{t('home.award.date')}</dt>
                <dd className="small strong">{t('hackathon.date')}</dd>
              </div>
              <div>
                <dt className="micro muted">{t('home.award.track')}</dt>
                <dd className="small strong">{t('hackathon.track')}</dd>
              </div>
              <div>
                <dt className="micro muted">{t('home.award.programme')}</dt>
                <dd className="small strong">{t('hackathon.programme')}</dd>
              </div>
              <div>
                <dt className="micro muted">{t('home.award.partners')}</dt>
                <dd className="small strong">{t('hackathon.partners')}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Team Samaam */}
        <div className="mt-14" data-id="team">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
            <h3 className="text-2xl leading-8 font-bold">{t('team.name')}</h3>
            <Link to="/app/about" className="small strong text-primary hover:underline">
              {t('home.award.teamPageLink')}
            </Link>
          </div>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            data-id="team.list"
          >
            {TEAM_MEMBERS.map((member) => (
              <li
                key={member.key}
                className="card card-pad flex flex-col gap-2.5"
                style={member.leader ? { borderColor: 'var(--warning-line)' } : undefined}
                data-id={`team.${member.key}`}
              >
                <div className="flex items-center gap-3">
                  <span className={member.leader ? 'avatar avatar-gold' : 'avatar'}>
                    {member.key === 'mohammed'
                      ? 'MA'
                      : member.key === 'badour'
                        ? 'BA'
                        : member.key === 'haneen'
                          ? 'HA'
                          : 'NA'}
                  </span>
                  {member.leader && (
                    <span className="chip chip-gold">
                      <Crown className="size-3.5" aria-hidden />
                      {t('team.leader')}
                    </span>
                  )}
                </div>
                <p className="strong text-base leading-snug">
                  {t(`team.members.${member.key}.name`)}
                </p>
                <p className="small muted">
                  {t(`team.members.${member.key}.role`)} · {t(`team.members.${member.key}.study`)}
                </p>
                <p className="small">{t(`team.members.${member.key}.focus`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
