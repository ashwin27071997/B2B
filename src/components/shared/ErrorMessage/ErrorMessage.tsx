import { memo } from 'react';
import styles from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  message: string;
  id?: string;
}

export const ErrorMessage = memo(({ message, id }: ErrorMessageProps) => (
  <div id={id} className={styles.container} role="alert">
    <span className={styles.dot} aria-hidden="true" />
    <span className={styles.message}>{message}</span>
  </div>
));

ErrorMessage.displayName = 'ErrorMessage';
