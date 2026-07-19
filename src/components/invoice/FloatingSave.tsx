import { Save } from 'lucide-react'

interface FloatingSaveProps {
  onSave: () => void
}

export function FloatingSave({ onSave }: FloatingSaveProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      className="floating-save"
      title="Save Invoice"
      aria-label="Save Invoice"
    >
      <Save size={20} />
    </button>
  )
}
