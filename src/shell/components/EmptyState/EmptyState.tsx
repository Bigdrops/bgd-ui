import styles from './EmptyState.module.css'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'No workspaces available.' }: EmptyStateProps) {
  return (
    <div className={styles.empty} role="status" aria-live="polite">
      <p className={styles.text}>{message}</p>
    </div>
  )
}
