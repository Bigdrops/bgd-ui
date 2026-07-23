import { Save } from 'lucide-react'
export function FloatingSave({ onSave }: { onSave: () => void }) { return <button type="button" onClick={onSave} className="nr-float-save" title="Save Invoice" aria-label="Save Invoice"><Save size={20} /></button> }
