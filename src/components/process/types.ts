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
  progress: number; // 0 to 1 progress within this scene (autoplay timeline)
  isActive: boolean;
  isMobile?: boolean;
  palette: ScenePalette;
  onOpenAudit?: (prefillMessage?: string, prefillTrade?: string) => void;
}
