import { memo } from 'react';
import { colors } from '../../../theme';
import styles from './LoadingSpinner.module.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 16,
  md: 32,
  lg: 48,
};

export const LoadingSpinner = memo(
  ({ size = 'md', text, fullScreen = false }: LoadingSpinnerProps) => {
    const spinnerSize = sizeMap[size];

    const spinner = (
      <div className={styles.container} data-fullscreen={fullScreen}>
        <div
          className={styles.spinner}
          style={{
            width: spinnerSize,
            height: spinnerSize,
            borderWidth: Math.max(2, spinnerSize / 10),
          }}
          role="status"
          aria-label="Loading"
        />
        {text && <p className={styles.text}>{text}</p>}
      </div>
    );

    if (fullScreen) {
      return (
        <div
          className={styles.fullScreen}
          style={{
            background: colors.background.primary,
            color: colors.text.primary,
          }}
        >
          {spinner}
        </div>
      );
    }

    return spinner;
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';
