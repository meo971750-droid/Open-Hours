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
  [key: string]: unknown;
}

export interface SceneProps {
  isActive: boolean;
  animate?: boolean;
  isMobile?: boolean;
  caption?: string;
  palette?: ScenePalette;
  onOpenAudit?: (prefillMessage?: string, prefillTrade?: string) => void;
}
