export function Input({ label, id, className = '', ...inputProps }) {
  return (
    <div className={`input-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} />
    </div>
  );
}
