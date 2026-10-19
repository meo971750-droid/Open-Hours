export interface ScenePalette {
  id: string;
  bg: string;
  bgSolid?: string;
  bgStart?: string;
  bgEnd?: string;
  textPrimary: string;
  textSecondary: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  isDark: boolean;
  [key: string]: any;
}

export interface SceneProps {
  progress: number; // 0 to 1 progress within this scene (scroll-driven)
  stepIndex: number; // current step index (0 to steps.length - 1)
  stepProgress: number; // 0 to 1 progress within current step (first 60% animates, last 40% holds)
  activeHighlight: string; // name of element being narrated
  isActive: boolean;
  isMobile?: boolean;
  palette: ScenePalette;
  onOpenAudit?: (prefillMessage?: string, prefillTrade?: string) => void;
}
