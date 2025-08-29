interface ProgressBarProps {
  current: number
  total: number
  unit: string
}

import styles from './ProgressBar.module.css'

export const ProgressBar = ({ current, total, unit }: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100)
  const formattedCurrent = current.toFixed(1)
  const formattedTotal = total.toFixed(1)

  return (
    <div className={styles.container}>
      <div className={styles.labels}>
        <span className={styles.current}>{formattedCurrent}</span>
        <span className={styles.total}>
          / {formattedTotal} {unit}
        </span>
      </div>
      <div className={styles.bar}>
        <div className={styles.progress} style={{ width: `${percentage}%` }} />
      </div>
      <div className={styles.percentage}>{percentage.toFixed(0)}%</div>
    </div>
  )
}
