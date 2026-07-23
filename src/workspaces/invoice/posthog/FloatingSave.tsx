import { Save } from 'lucide-react'
export function FloatingSave({ onSave }: { onSave: () => void }) { return <button type="button" onClick={onSave} className="ph-float-save" title="Save Invoice" aria-label="Save Invoice"><Save size={20} /></button> }
