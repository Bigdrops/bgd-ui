import styles from './WorkspaceCard.module.css'

interface WorkspaceCardProps {
  name: string
  description: string
  onClick: () => void
}

export function WorkspaceCard({ name, description, onClick }: WorkspaceCardProps) {
  return (
    <button type="button" className={styles.item} onClick={onClick} aria-label={`${name} workspace`}>
      <div className={styles.name}>{name}</div>
      <div className={styles.description}>{description}</div>
    </button>
  )
}
