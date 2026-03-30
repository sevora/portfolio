import { useMemo } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { AnimationSettings } from '../types/content';

interface ReconstructTextProps {
  text: string;
  settings: Required<AnimationSettings>;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  id?: string;
}

interface WordData {
  word: string;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

export function ReconstructText({
  text,
  settings,
  className = '',
  as: Component = 'span',
  id,
}: ReconstructTextProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: settings.threshold,
  });

  // Generate random scatter positions for each word (memoized to stay consistent)
  const words = useMemo<WordData[]>(() => {
    return text.split(/(\s+)/).map((word) => {
      // For whitespace, no animation needed
      if (/^\s+$/.test(word)) {
        return { word, offsetX: 0, offsetY: 0, rotation: 0 };
      }

      // Random angle in radians for scatter direction
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * settings.scatterRadius;

      return {
        word,
        offsetX: Math.cos(angle) * distance,
        offsetY: Math.sin(angle) * distance,
        rotation: (Math.random() - 0.5) * 2 * settings.rotationRange,
      };
    });
  }, [text, settings.scatterRadius, settings.rotationRange]);

  // Count non-whitespace words for stagger delay calculation
  let wordIndex = 0;

  return (
    <Component ref={ref} className={className} id={id}>
      {words.map((wordData, i) => {
        // Whitespace - render as-is
        if (/^\s+$/.test(wordData.word)) {
          return <span key={i}>{wordData.word}</span>;
        }

        const currentIndex = wordIndex++;
        const delay = currentIndex * settings.staggerDelay;

        return (
          <span
            key={i}
            className="inline-block"
            style={{
              transform: isVisible
                ? 'translate(0, 0) rotate(0deg)'
                : `translate(${wordData.offsetX}px, ${wordData.offsetY}px) rotate(${wordData.rotation}deg)`,
              opacity: isVisible ? 1 : 0,
              transition: `transform ${settings.duration}ms ${settings.easing} ${delay}ms, opacity ${settings.duration}ms ${settings.easing} ${delay}ms`,
            }}
          >
            {wordData.word}
          </span>
        );
      })}
    </Component>
  );
}
