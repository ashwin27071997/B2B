import { useEffect, useRef, useCallback } from 'react';

interface TiltConfig {
  maxTilt?: number;
  speed?: number;
  perspective?: number;
}

export const useTiltEffect = <T extends HTMLElement>({
  maxTilt = 7,
  speed = 300,
  perspective = 1600,
}: TiltConfig = {}) => {
  const elementRef = useRef<T>(null);
  const frameRef = useRef<number | undefined>(undefined);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const element = elementRef.current;
      if (!element) return;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 1.5)));
        const dy = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 1.5)));

        const rotateY = dx * maxTilt;
        const rotateX = -dy * maxTilt;

        element.style.transform = `perspective(${perspective}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    },
    [maxTilt, perspective]
  );

  const handleMouseLeave = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.transition = `transform ${speed}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    element.style.transform = `perspective(${perspective}px) rotateY(0deg) rotateX(0deg)`;
  }, [speed, perspective]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => handleMouseMove(e);
    const handleLeave = () => handleMouseLeave();

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave]);

  return elementRef;
};
