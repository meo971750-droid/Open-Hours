export const OH_EASE = [0.2, 0.8, 0.2, 1] as const;

export const OH_EASE_CSS = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

export const OH_DUR = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
} as const;

export const OH_SPRING = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 26,
  mass: 0.6,
};
