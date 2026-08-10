import styles from './Divider.module.css';

export interface DividerProps {
  text?: string;
}

export const Divider = ({ text = 'OR' }: DividerProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.lineLeft} />
      <span className={styles.text}>{text}</span>
      <div className={styles.lineRight} />
    </div>
  );
};
