import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Patient, Requested } from '@/types/api'

/**
 * The technologist's inputs. Single card with four logical groups:
 * Patient, Renal function, Acquisition, Contrast, matching board Console-A.
 */
export interface RequestFormProps {
  patient: Patient
  requested: Requested
  disabled?: boolean
  breaches?: {
    ctdi?: boolean
    dlp?: boolean
    egfr?: boolean
  }
  onSubmit?: () => void
  onPatientChange: (patch: Partial<Patient>) => void
  onRequestedChange: (patch: Partial<Requested>) => void
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

export function RequestForm({
  patient,
  requested,
  disabled,
  breaches,
  onSubmit,
  onPatientChange,
  onRequestedChange,
}: RequestFormProps) {
  const { t } = useTranslation()
  const num = (value: string) => (value === '' ? null : Number(value))

  return (
    <Card className="p-5 shadow-xs" aria-label={t('console.patient')}>
      {/* Patient */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[13px] leading-5 font-semibold text-foreground">
          {t('console.patient')}
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          <Field label={t('console.age')}>
            <Input
              type="number"
              className="h-[38px] font-mono text-sm"
              value={patient.age}
              disabled={disabled}
              onChange={(e) => onPatientChange({ age: Number(e.target.value) })}
            />
          </Field>
          <Field label={t('console.weight')}>
            <Input
              type="number"
              className="h-[38px] font-mono text-sm"
              value={patient.weight_kg ?? ''}
              disabled={disabled}
              onChange={(e) => onPatientChange({ weight_kg: num(e.target.value) })}
            />
          </Field>
          <Field label={t('console.sex')}>
            <Input
              className="h-[38px] text-sm"
              value={patient.sex}
              disabled={disabled}
              onChange={(e) => onPatientChange({ sex: e.target.value })}
            />
          </Field>
        </div>
        {patient.diagnosis && (
          <p className="text-xs text-foreground/80">{patient.diagnosis}</p>
        )}
        {!!patient.medications?.length && (
          <div className="flex flex-wrap gap-1.5">
            {patient.medications.map((drug) => (
              <span
                key={drug}
                className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-foreground/80"
              >
                {drug}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Renal function */}
      <div className="flex flex-col gap-2.5 pt-3.5 mt-3.5 border-t border-border">
        <p className="text-[13px] leading-5 font-semibold text-foreground">
          {t('console.renal')}
        </p>
        <Field label={`${t('console.creatinine')} (µmol/L)`}>
          <Input
            type="number"
            className="h-[38px] font-mono text-sm"
            value={patient.serum_creatinine_umol_l ?? ''}
            disabled={disabled}
            onChange={(e) =>
              onPatientChange({ serum_creatinine_umol_l: num(e.target.value) })
            }
          />
        </Field>
        <p className="text-xs text-muted-foreground">
          {t('console.egfr')}{' '}
          <span
            dir="ltr"
            className={cn(
              'font-mono font-semibold',
              breaches?.egfr ? 'text-destructive-strong' : 'text-foreground',
            )}
          >
            {patient.egfr != null ? patient.egfr : '—'}
          </span>
          , {t('console.egfrProvenance')}
        </p>
        <div className="flex items-center justify-between gap-3 min-h-8 text-sm">
          <span>{t('console.onMetformin')}</span>
          <Switch
            checked={!!patient.on_metformin}
            disabled={disabled}
            onCheckedChange={(v) => onPatientChange({ on_metformin: v })}
          />
        </div>
      </div>

      {/* Acquisition */}
      <div className="flex flex-col gap-2.5 pt-3.5 mt-3.5 border-t border-border">
        <p className="text-[13px] leading-5 font-semibold text-foreground">
          {t('console.acquisition')}
        </p>
        <Field label={t('console.bodyRegion')}>
          <Input
            className="h-[38px] text-sm"
            value={
              requested.body_region
                ? t(`regions.${requested.body_region}`, { defaultValue: requested.body_region })
                : ''
            }
            disabled={disabled}
            onChange={(e) => onRequestedChange({ body_region: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={`${t('console.ctdivol')} (mGy)`}>
            <Input
              type="number"
              step="0.1"
              className={cn(
                'h-[38px] font-mono text-sm',
                breaches?.ctdi && 'input-breach',
              )}
              value={requested.ctdivol_mgy ?? ''}
              disabled={disabled}
              onChange={(e) => onRequestedChange({ ctdivol_mgy: num(e.target.value) })}
            />
          </Field>
          <Field label={`${t('console.dlp')} (mGy·cm)`}>
            <Input
              type="number"
              className={cn(
                'h-[38px] font-mono text-sm',
                breaches?.dlp && 'input-breach',
              )}
              value={requested.dlp_mgy_cm ?? ''}
              disabled={disabled}
              onChange={(e) => onRequestedChange({ dlp_mgy_cm: num(e.target.value) })}
            />
          </Field>
        </div>
      </div>

      {/* Contrast */}
      <div className="flex flex-col gap-2.5 pt-3.5 mt-3.5 border-t border-border">
        <p className="text-[13px] leading-5 font-semibold text-foreground">
          {t('console.contrast')}
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label={t('console.agent')}>
            <Input
              className="h-[38px] text-sm"
              value={requested.contrast_agent ?? ''}
              disabled={disabled}
              onChange={(e) =>
                onRequestedChange({ contrast_agent: e.target.value || null })
              }
            />
          </Field>
          <Field label={`${t('console.volume')} (mL)`}>
            <Input
              type="number"
              className="h-[38px] font-mono text-sm"
              value={requested.volume_ml ?? ''}
              disabled={disabled}
              onChange={(e) => onRequestedChange({ volume_ml: num(e.target.value) })}
            />
          </Field>
        </div>
        <div className="flex items-center justify-between gap-3 min-h-8 text-sm">
          <span>{t('console.prophylaxisOrdered')}</span>
          <Switch
            checked={!!requested.prophylaxis_ordered}
            disabled={disabled}
            onCheckedChange={(v) => onRequestedChange({ prophylaxis_ordered: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 min-h-8 text-sm">
          <span>{t('console.metforminHeld')}</span>
          <Switch
            checked={!!requested.metformin_held}
            disabled={disabled}
            onCheckedChange={(v) => onRequestedChange({ metformin_held: v })}
          />
        </div>
      </div>

      {onSubmit && (
        <Button
          type="button"
          className="w-full mt-3.5"
          size="lg"
          disabled={disabled}
          onClick={onSubmit}
        >
          {disabled ? t('console.submitting') : t('console.submit')}
        </Button>
      )}
    </Card>
  )
}
