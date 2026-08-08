import { memo, useMemo } from 'react';
import styles from './Cube3D.module.css';

export type CubeVariant = 'primary' | 'secondary';

export interface Cube3DProps {
  size: number;
  variant?: CubeVariant;
  className?: string;
  style?: React.CSSProperties;
}

const CUBE_RADIUS_MULTIPLIER = 0.13;
const MIN_RADIUS = 8;

export const Cube3D = memo(
  ({ size, variant = 'primary', className, style }: Cube3DProps) => {
    const { depth, radius } = useMemo(
      () => ({
        depth: size / 2,
        radius: Math.max(MIN_RADIUS, size * CUBE_RADIUS_MULTIPLIER),
      }),
      [size]
    );

    return (
      <div
        className={`${styles.cube} ${styles[variant]} ${className || ''}`}
        style={{
          width: size,
          height: size,
          ...style,
        }}
        aria-hidden="true"
      >
        <div
          className={styles.face}
          style={{
            borderRadius: radius,
            transform: `translateZ(${depth}px)`,
          }}
        />
        <div
          className={styles.faceSide}
          style={{
            borderRadius: radius,
            transform: `rotateY(90deg) translateZ(${depth}px)`,
          }}
        />
        <div
          className={styles.faceTop}
          style={{
            borderRadius: radius,
            transform: `rotateX(90deg) translateZ(${depth}px)`,
          }}
        />
      </div>
    );
  }
);

Cube3D.displayName = 'Cube3D';
