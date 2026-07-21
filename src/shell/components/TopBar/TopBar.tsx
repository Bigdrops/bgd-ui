import { Sun, Moon } from '@phosphor-icons/react'
import styles from './TopBar.module.css'

interface TopBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  showThemeToggle?: boolean
  themeIsDark?: boolean
  onToggleTheme?: () => void
}

export function TopBar({ title, showBack, onBack, showThemeToggle, themeIsDark, onToggleTheme }: TopBarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {showBack && (
          <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Go back">
            {'< Back'}
          </button>
        )}
      </div>
      <div className={styles.right}>
        {showThemeToggle && onToggleTheme && (
          <button
            type="button"
            className={styles.themeBtn}
            onClick={onToggleTheme}
            aria-label={themeIsDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {themeIsDark ? <Sun size={18} weight="regular" /> : <Moon size={18} weight="regular" />}
          </button>
        )}
      </div>
    </header>
  )
}
