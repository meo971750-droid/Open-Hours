import React, { useEffect, useRef, useState } from 'react';
import {
  Home,
  CookingPot,
  Ruler,
  DoorOpen,
  Trees,
  Flame,
  PaintRoller,
  Bath,
  Layers,
  Warehouse,
  Route,
  Building2,
  Phone,
  FileText,
  MessageCircle,
  PhoneMissed,
  Moon,
  MapPin,
  Navigation,
  Star,
  BarChart3,
  Smartphone,
  Images,
  FileBarChart,
} from 'lucide-react';

export interface TickerItem {
  text: string;
  icon: string;
}

interface SideTickerProps {
  items: TickerItem[];
  direction: 'up' | 'down';
  label: string;
  side: 'left' | 'right';
  className?: string;
}

const TILE_BACKGROUNDS = ['#DCE9EC', '#F6E6D8', '#EEF3F4'];

export function renderTickerIcon(iconName: string, className = 'w-4 h-4 text-[#1E4A5C]') {
  switch (iconName) {
    case 'Home':
      return <Home className={className} />;
    case 'CookingPot':
      return <CookingPot className={className} />;
    case 'Ruler':
      return <Ruler className={className} />;
    case 'DoorOpen':
      return <DoorOpen className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'PaintRoller':
      return <PaintRoller className={className} />;
    case 'Bath':
      return <Bath className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Warehouse':
      return <Warehouse className={className} />;
    case 'Route':
      return <Route className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Phone':
      return <Phone className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'MessageCircle':
      return <MessageCircle className={className} />;
    case 'PhoneMissed':
      return <PhoneMissed className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    case 'Navigation':
      return <Navigation className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Images':
      return <Images className={className} />;
    case 'FileBarChart':
      return <FileBarChart className={className} />;
    default:
      return <Home className={className} />;
  }
}

export default function SideTicker({
  items,
  direction,
  label,
  side,
  className = '',
}: SideTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Duplicated list for seamless infinite loop
  const duplicatedItems = [...items, ...items];
  const CHIP_HEIGHT = 44;
  const CHIP_GAP = 12;
  const ITEM_STRIDE = CHIP_HEIGHT + CHIP_GAP; // 56px
  const SINGLE_LIST_HEIGHT = items.length * ITEM_STRIDE;
  const COLUMN_HEIGHT = 560;
  const COLUMN_CENTER_Y = COLUMN_HEIGHT / 2; // 280px
  const SPEED = 26; // pixels per second

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let animFrameId: number;
    let lastTime = performance.now();
    let isVisible = true;
    let isTabVisible = !document.hidden;

    // Phase offset so left and right columns don't align horizontally
    const phaseOffset = side === 'left' ? 0 : ITEM_STRIDE / 2;
    let currentOffset = phaseOffset;
    let elapsedTime = 0;

    // Intersection observer to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const track = trackRef.current;
    if (!track) return;
    const chipElements = track.children as HTMLCollectionOf<HTMLElement>;

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isVisible && isTabVisible && delta < 0.2) {
        elapsedTime += delta;
        currentOffset += SPEED * delta;
        if (currentOffset >= SINGLE_LIST_HEIGHT) {
          currentOffset %= SINGLE_LIST_HEIGHT;
        }

        const width = window.innerWidth;
        // Wave amplitude: 12px at >= 1440px and 10px at 1280-1439px
        const waveAmp = width >= 1440 ? 12 : 10;

        // Base translateY based on direction
        const baseTrackY =
          direction === 'up'
            ? -currentOffset
            : -(SINGLE_LIST_HEIGHT - currentOffset);

        // Find closest chip to center for focus effect
        let closestIndex = -1;
        let closestDist = Infinity;

        for (let i = 0; i < chipElements.length; i++) {
          const chipCenterInTrack = i * ITEM_STRIDE + CHIP_HEIGHT / 2;
          const chipCenterInCol = chipCenterInTrack + baseTrackY;
          const distToCenter = Math.abs(chipCenterInCol - COLUMN_CENTER_Y);
          if (distToCenter < closestDist) {
            closestDist = distToCenter;
            closestIndex = i;
          }
        }

        for (let i = 0; i < chipElements.length; i++) {
          const chip = chipElements[i];
          const chipCenterInTrack = i * ITEM_STRIDE + CHIP_HEIGHT / 2;
          const chipCenterInCol = chipCenterInTrack + baseTrackY;
          const dist = Math.abs(chipCenterInCol - COLUMN_CENTER_Y);

          // Wave sway: clamped to [-waveAmp, +waveAmp]
          const rawWave = Math.sin((chipCenterInCol + elapsedTime * 36) / 120);
          const rawOffset = (side === 'left' ? -rawWave : rawWave) * waveAmp;
          const waveX = Math.max(-waveAmp, Math.min(waveAmp, rawOffset));

          // Smooth cosine falloff for opacity (1 at center down to 0.35 at edges)
          const normDist = Math.min(1, dist / COLUMN_CENTER_Y);
          const opacity =
            0.35 + 0.65 * Math.max(0, Math.cos(normDist * (Math.PI / 2)));

          // Scale: 1.05 at center down to 0.95 at edges
          const scale = 0.95 + 0.10 * Math.max(0, 1 - normDist);

          // Focus highlight when within ~36px of center
          const isFocused = i === closestIndex && dist <= 36;

          chip.style.transform =
            'translate3d(' + waveX.toFixed(1) + 'px, 0, 0) scale(' + scale.toFixed(3) + ')';
          chip.style.opacity = opacity.toFixed(3);

          if (isFocused) {
            chip.setAttribute('data-focused', 'true');
          } else {
            chip.removeAttribute('data-focused');
          }
        }

        track.style.transform = 'translate3d(0, ' + baseTrackY.toFixed(1) + 'px, 0)';
      }

      animFrameId = requestAnimationFrame(step);
    };

    animFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reducedMotion, direction, items.length, side, SINGLE_LIST_HEIGHT]);

  const labelAlignment = side === 'left' ? 'text-left' : 'text-right';

  return (
    <div
      ref={containerRef}
      className={
        'pointer-events-none select-none z-10 hidden lg:flex flex-col relative w-full h-[600px] ' +
        className
      }
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* Column Uppercase Label */}
      <div
        className={
          'text-[12px] font-semibold text-[#5E6F77] mb-3 tracking-[0.14em] uppercase px-1 ' +
          labelAlignment
        }
      >
        {label}
      </div>

      {/* Outer .ticker:
          - position: absolute
          - NO overflow (overflow: visible)
          - NO mask
          - -left-[40px] and -right-[40px] to accommodate 40px inner viewport padding */}
      <div
        className="ticker absolute top-[28px] -left-[40px] -right-[40px] pointer-events-none select-none z-10"
        style={{
          overflow: 'visible',
          mask: 'none',
          WebkitMask: 'none',
        }}
      >
        {/* Inner viewport:
            - padding-inline: 40px on both sides (px-[40px])
            - ONLY vertical mask-image
            - NO overflow hidden or clip (overflow: visible) */}
        <div
          className="w-full h-[560px] px-[40px] relative no-scrollbar"
          style={{
            overflow: 'visible',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)',
          }}
        >
          {/* Track container */}
          <div
            ref={trackRef}
            className="flex flex-col gap-[12px] will-change-transform items-center no-scrollbar"
            style={{ overflow: 'visible' }}
          >
            {(reducedMotion ? items.slice(0, 7) : duplicatedItems).map((item, idx) => {
              const tileBg = TILE_BACKGROUNDS[idx % TILE_BACKGROUNDS.length];
              return (
                <div
                  key={idx}
                  className={
                    'h-[44px] w-full max-w-[216px] min-[1440px]:max-w-[240px] rounded-full bg-white border border-[rgba(15,42,53,0.08)] ' +
                    'py-[6px] pl-[6px] pr-[12px] min-[1440px]:pr-[14px] flex items-center gap-[8px] min-[1440px]:gap-[10px] ' +
                    'shadow-[0_6px_18px_rgba(15,42,53,0.07)] transition-[box-shadow,border-color] duration-200 shrink-0 ' +
                    '[&[data-focused=true]]:border-[rgba(30,74,92,0.4)] ' +
                    '[&[data-focused=true]]:shadow-[0_0_0_6px_rgba(227,184,150,0.28),0_12px_28px_rgba(30,74,92,0.14)] ' +
                    '[&[data-focused=true]_.icon-tile]:!bg-[#E3B896]'
                  }
                >
                  <div
                    className="icon-tile w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 transition-colors duration-200"
                    style={{ backgroundColor: tileBg }}
                  >
                    {renderTickerIcon(item.icon, 'w-4 h-4 text-[#1E4A5C]')}
                  </div>
                  <span className="text-[12.5px] min-[1440px]:text-[13.5px] font-semibold text-[#0F2A35] whitespace-nowrap leading-none tracking-tight">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Horizontal Ticker for Mobile & Tablet screens (< 1024px)
 * Mixed items from both lists scrolling seamlessly left-to-right
 */
export function HorizontalTicker({ items }: { items: TickerItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const duplicated = [...items, ...items];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let animId: number;
    let lastTime = performance.now();
    let currentOffset = 0;
    const speed = 24; // px per second
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (delta < 0.2 && totalWidth > 0) {
        currentOffset += speed * delta;
        if (currentOffset >= totalWidth) {
          currentOffset %= totalWidth;
        }
        track.style.transform = 'translate3d(' + (-currentOffset).toFixed(1) + 'px, 0, 0)';
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="lg:hidden w-full overflow-hidden my-6 py-2 select-none pointer-events-none no-scrollbar"
      style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        maskImage:
          'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex items-center gap-3 w-max will-change-transform">
        {(reducedMotion ? items.slice(0, 5) : duplicated).map((item, idx) => {
          const tileBg = TILE_BACKGROUNDS[idx % TILE_BACKGROUNDS.length];
          return (
            <div
              key={idx}
              className="h-[42px] rounded-full bg-white border border-[rgba(15,42,53,0.08)] py-[5px] pl-[5px] pr-[14px] flex items-center gap-[8px] shadow-[0_4px_12px_rgba(15,42,53,0.06)] shrink-0"
            >
              <div
                className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: tileBg }}
              >
                {renderTickerIcon(item.icon, 'w-3.5 h-3.5 text-[#1E4A5C]')}
              </div>
              <span className="text-[13px] font-semibold text-[#0F2A35] whitespace-nowrap">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
