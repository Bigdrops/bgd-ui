import { TopBar } from '../../components/TopBar/TopBar'
import styles from './Settings.module.css'

interface SettingsProps {
  workspaceCount: number
  onBack: () => void
}

export function Settings({ workspaceCount, onBack }: SettingsProps) {
  return (
    <>
      <TopBar showBack onBack={onBack} />
      <main className={styles.page}>
        <h2 className="shell-heading" style={{ marginBottom: 'var(--shell-spacing-2xl)' }}>
          SETTINGS
        </h2>

        <div className={styles.list}>
          <div className={styles.row}>
            <span className={styles.label}>Workspaces</span>
            <span className={styles.value}>{workspaceCount}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Version</span>
            <span className={styles.value}>0.1.0</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Product</span>
            <span className={styles.value}>BGD UI</span>
          </div>
        </div>

        <p className={styles.footer}>BGD UI | Offline-first mobile UI library</p>
      </main>
    </>
  )
}
