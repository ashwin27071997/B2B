import styles from './Cube3D.module.css';

export type CubeVariant = 'primary' | 'secondary';

export interface Cube3DProps {
  size: number;
  variant?: CubeVariant;
  className?: string;
  style?: React.CSSProperties;
}

export const Cube3D = ({ size, variant = 'primary', className, style }: Cube3DProps) => {
  const depth = size / 2;
  const radius = Math.max(8, size * 0.13);

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
};
