import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'pink'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  size = 'medium'
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
      type={type}
      onClick={onClick}>
      {children}
    </button>
  )
}
