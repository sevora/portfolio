import { ReconstructText } from './ReconstructText';
import type { AnimationSettings } from '../types/content';

interface AnimatedParagraphProps {
  content: string;
  settings: Required<AnimationSettings>;
}

export function AnimatedParagraph({ content, settings }: AnimatedParagraphProps) {
  return (
    <ReconstructText
      text={content}
      settings={settings}
      className="text-base md:text-lg leading-relaxed text-stone-700"
      as="p"
    />
  );
}

// Static version for blocks with animate: false
interface StaticParagraphProps {
  content: string;
}

export function StaticParagraph({ content }: StaticParagraphProps) {
  return (
    <p className="text-base md:text-lg leading-relaxed text-stone-700">
      {content}
    </p>
  );
}
