import { useState } from 'react';

export function Input({ label, id, className = '', ...inputProps }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = inputProps.type === 'password';

  return (
    <div className={`input-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <div className={isPassword ? 'input-control input-control-password' : 'input-control'}>
        <input id={id} {...inputProps} type={isPassword && isPasswordVisible ? 'text' : inputProps.type} />
        {isPassword && (
          <button
            className="password-visibility-toggle"
            type="button"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
          >
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
}
