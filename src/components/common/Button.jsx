export function Button({ children, className = '', type = 'button', disabled = false, ...buttonProps }) {
  return (
    <button className={`primary-button ${className}`.trim()} type={type} disabled={disabled} {...buttonProps}>
      {children}
    </button>
  );
}
