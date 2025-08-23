interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export const Button = ({ children, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button className={`button button--${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}
