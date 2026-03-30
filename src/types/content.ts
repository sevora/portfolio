// Animation settings that can be configured globally or per-block
export interface AnimationSettings {
  threshold?: number;       // Intersection ratio to trigger (0-1), default 0.2
  scatterRadius?: number;   // Max px distance words scatter from, default 300
  rotationRange?: number;   // Max degrees rotation (±), default 180
  duration?: number;        // Animation duration in ms, default 800
  staggerDelay?: number;    // Delay between each word in ms, default 40
  easing?: string;          // CSS easing function
}

// Default animation settings
export const DEFAULT_ANIMATION_SETTINGS: Required<AnimationSettings> = {
  threshold: 0.2,
  scatterRadius: 300,
  rotationRange: 180,
  duration: 800,
  staggerDelay: 40,
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// Base block interface with optional animation controls
interface BaseBlock {
  animate?: boolean;              // Set to false to disable animation for this block
  animation?: AnimationSettings;  // Per-block animation overrides
}

// Header block (h1, h2, h3)
export interface HeaderBlock extends BaseBlock {
  type: 'header';
  level: 1 | 2 | 3;
  content: string;
}

// Paragraph block
export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

// Spacer block for vertical spacing
export interface SpacerBlock {
  type: 'spacer';
  space: number;  // Pixels
}

// Union type for all content blocks
export type ContentBlock = HeaderBlock | ParagraphBlock | SpacerBlock;

// Root content data structure
export interface ContentData {
  settings: AnimationSettings;
  content: ContentBlock[];
}

// Helper to merge animation settings (global + per-block overrides)
export function mergeAnimationSettings(
  global: AnimationSettings,
  block?: AnimationSettings
): Required<AnimationSettings> {
  return {
    ...DEFAULT_ANIMATION_SETTINGS,
    ...global,
    ...block,
  };
}
