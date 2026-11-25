import React, { useEffect, useRef, useState } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxDeg?: number;
  disabled?: boolean;
}

/**
 * Subtle ±4deg 3D pointer tilt on desktop fine-pointer devices only.
 * Uses rAF + CSS custom properties for zero-runtime-spring compositor performance.
 */
export function Tilt3D({
  children,
  className = '',
  maxDeg = 4,
  disabled = false,
}: Tilt3DProps) {
  const [canTilt, setCanTilt] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

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
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [disabled]);

  if (!canTilt) {
    return <div className={className}>{children}</div>;
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const node = elRef.current;
    if (!node) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty('--rx', `${(-py * 2 * maxDeg).toFixed(2)}deg`);
      node.style.setProperty('--ry', `${(px * 2 * maxDeg).toFixed(2)}deg`);
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    const node = elRef.current;
    if (node) {
      node.style.setProperty('--rx', '0deg');
      node.style.setProperty('--ry', '0deg');
    }
  };

  return (
    <div
      ref={elRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform:
          'perspective(920px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transformStyle: 'preserve-3d',
      }}
      className={`transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${className}`}
    >
      {children}
    </div>
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
  decoding = 'async',
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
        decoding={decoding}
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
