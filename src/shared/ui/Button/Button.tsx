import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'pink'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false }: ButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} disabled={disabled} type={type} onClick={onClick}>
      {children}
    </button>
  )
}
