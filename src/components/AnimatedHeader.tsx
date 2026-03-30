import { ReconstructText } from './ReconstructText';
import type { AnimationSettings } from '../types/content';

interface AnimatedHeaderProps {
  level: 1 | 2 | 3;
  content: string;
  settings: Required<AnimationSettings>;
  id?: string;
}

const headerStyles: Record<1 | 2 | 3, string> = {
  1: 'text-4xl md:text-5xl font-bold leading-tight',
  2: 'text-2xl md:text-3xl font-semibold leading-snug',
  3: 'text-xl md:text-2xl font-medium leading-snug',
};

export function AnimatedHeader({ level, content, settings, id }: AnimatedHeaderProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  
  return (
    <ReconstructText
      text={content}
      settings={settings}
      className={headerStyles[level]}
      as={Tag}
      id={id}
    />
  );
}

// Static version for blocks with animate: false
interface StaticHeaderProps {
  level: 1 | 2 | 3;
  content: string;
  id?: string;
}

export function StaticHeader({ level, content, id }: StaticHeaderProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  
  return <Tag id={id} className={headerStyles[level]}>{content}</Tag>;
}
