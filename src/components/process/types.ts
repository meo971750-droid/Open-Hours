export interface SceneProps {
  progress: number; // 0 to 1 progress within this scene
  isActive: boolean;
  isMobile?: boolean;
  onOpenAudit?: (prefillMessage?: string, prefillTrade?: string) => void;
  onInteract?: () => void;
}
