import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Consultant override. alert-dialog rather than dialog because this is a
 * consequential act, not a form.
 *
 * The name is required. That is the entire point: the protocol makes stage
 * 4-5 CKD a relative contraindication, so the block must be passable — but
 * only by someone who has put their name to it in the audit trail.
 */
export interface OverrideDialogProps {
  reason: string
  pending?: boolean
  onConfirm: (name: string) => void
}

export function OverrideDialog({ reason, pending, onConfirm }: OverrideDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const trimmed = name.trim()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full border-warning-strong text-warning-strong">
          {t('console.overrideOpen')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('console.overrideTitle')}</AlertDialogTitle>
          <AlertDialogDescription className="text-start">{reason}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="override-name">{t('console.overrideName')}</Label>
          <Input
            id="override-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('console.overrideNamePlaceholder')}
            autoComplete="off"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('console.overrideCancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={!trimmed || pending}
            onClick={() => {
              onConfirm(trimmed)
              setOpen(false)
              setName('')
            }}
          >
            {t('console.overrideConfirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
