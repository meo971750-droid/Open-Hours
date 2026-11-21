import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { OH_SPRING } from '../lib/motion';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxDeg?: number;
  disabled?: boolean;
}

/**
 * Subtle ±4deg 3D pointer tilt on desktop fine-pointer devices only.
 * Disabled automatically on touch devices and when prefers-reduced-motion is active.
 */
export function Tilt3D({
  children,
  className = '',
  maxDeg = 4,
  disabled = false,
}: Tilt3DProps) {
  const [canTilt, setCanTilt] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, OH_SPRING);
  const smoothRotateY = useSpring(rotateY, OH_SPRING);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') {
      setCanTilt(false);
      return;
    }

    const mqFine = window.matchMedia('(pointer: fine)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setCanTilt(mqFine.matches && !mqReduce.matches);
    };

    update();
    mqFine.addEventListener('change', update);
    mqReduce.addEventListener('change', update);

    return () => {
      mqFine.removeEventListener('change', update);
      mqReduce.removeEventListener('change', update);
    };
  }, [disabled]);

  if (!canTilt) {
    return <div className={className}>{children}</div>;
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. +0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 2 * maxDeg);
    rotateY.set(px * 2 * maxDeg);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transformPerspective: 920,
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ShimmerImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

/**
 * Image component with a soft green-tinted shimmer skeleton placeholder while loading.
 */
export function ShimmerImage({
  wrapperClassName = 'relative w-full h-full',
  className = '',
  onLoad,
  onError,
  src,
  alt = '',
  ...rest
}: ShimmerImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <span className={`block overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <span
          aria-hidden="true"
          className="oh-skeleton-shimmer pointer-events-none absolute inset-0"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
        className={`${className} transition-opacity duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </span>
  );
}
