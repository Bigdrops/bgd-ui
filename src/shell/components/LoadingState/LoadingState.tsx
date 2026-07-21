import styles from './LoadingState.module.css'

export function LoadingState() {
  return (
    <div className={styles.list} role="status" aria-live="polite" aria-label="Loading workspaces">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles.row} aria-hidden="true">
          <div className={styles.lineWide} />
          <div className={styles.lineShort} />
        </div>
      ))}
    </div>
  )
}
