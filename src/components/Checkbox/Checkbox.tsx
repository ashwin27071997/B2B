import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
    <path
      d="M1.4 5.2L4.4 8.2 10.6 1.6"
      stroke="#fff"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, className, id, ...props }, ref) => {
    const inputId = id || `checkbox-${label?.toLowerCase().replace(/\s/g, '-')}`;

    return (
      <button
        type="button"
        onClick={() => {
          // Trigger the underlying input's change event
          const input = document.getElementById(inputId) as HTMLInputElement;
          if (input) {
            input.click();
          }
        }}
        className={`${styles.container} ${className || ''}`}
        aria-pressed={checked}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          checked={checked}
          className={styles.input}
          {...props}
        />
        <span className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
          {checked && (
            <span className={styles.checkmark}>
              <CheckIcon />
            </span>
          )}
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </button>
    );
  }
);

Checkbox.displayName = 'Checkbox';
