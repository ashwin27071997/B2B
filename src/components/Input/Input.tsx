import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', showPasswordToggle, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
      <div className={styles.field}>
        {label && (
          <div className={styles.labelRow}>
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={togglePassword}
                className={styles.toggleButton}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            )}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <div id={`${inputId}-error`} className={styles.error} role="alert">
            <span className={styles.errorDot} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
