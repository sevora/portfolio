import { ReconstructText } from './ReconstructText';
import type { AnimationSettings } from '../types/content';
import { getHref } from '../utils/linkify';

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
      linkify
    />
  );
}

// Static version for blocks with animate: false
interface StaticParagraphProps {
  content: string;
}

export function StaticParagraph({ content }: StaticParagraphProps) {
  // Split into words and linkify
  const parts = content.split(/(\s+)/);

  return (
    <p className="text-base md:text-lg leading-relaxed text-stone-700">
      {parts.map((part, i) => {
        const href = getHref(part);
        if (href) {
          return (
            <a
              key={i}
              href={href}
              className="underline hover:text-stone-900 transition-colors"
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
