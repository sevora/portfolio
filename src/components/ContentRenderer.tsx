import type {
  ContentBlock,
  ContentData,
  AnimationSettings,
  HeaderBlock,
  ParagraphBlock,
} from '../types/content';
import { mergeAnimationSettings } from '../types/content';
import { AnimatedHeader, StaticHeader } from './AnimatedHeader';
import { AnimatedParagraph, StaticParagraph } from './AnimatedParagraph';
import { Spacer } from './Spacer';
import { slugify } from '../utils/slugify';

interface ContentRendererProps {
  data: ContentData;
}

export function ContentRenderer({ data }: ContentRendererProps) {
  const globalSettings = data.settings;

  return (
    <div>
      {data.content.map((block, index) => (
        <ContentBlockRenderer
          key={index}
          block={block}
          globalSettings={globalSettings}
        />
      ))}
    </div>
  );
}

interface ContentBlockRendererProps {
  block: ContentBlock;
  globalSettings: AnimationSettings;
}

function ContentBlockRenderer({ block, globalSettings }: ContentBlockRendererProps) {
  switch (block.type) {
    case 'header':
      return <HeaderBlockRenderer block={block} globalSettings={globalSettings} />;
    case 'paragraph':
      return <ParagraphBlockRenderer block={block} globalSettings={globalSettings} />;
    case 'spacer':
      return <Spacer space={block.space} />;
    default:
      return null;
  }
}

interface HeaderBlockRendererProps {
  block: HeaderBlock;
  globalSettings: AnimationSettings;
}

function HeaderBlockRenderer({ block, globalSettings }: HeaderBlockRendererProps) {
  // Generate id for h2 and h3 headers (for navigation)
  const id = block.level === 2 || block.level === 3 
    ? slugify(block.content) 
    : undefined;

  // Check if animation is disabled for this block
  if (block.animate === false) {
    return <StaticHeader level={block.level} content={block.content} id={id} />;
  }

  // Merge global settings with per-block overrides
  const settings = mergeAnimationSettings(globalSettings, block.animation);

  return (
    <AnimatedHeader
      level={block.level}
      content={block.content}
      settings={settings}
      id={id}
    />
  );
}

interface ParagraphBlockRendererProps {
  block: ParagraphBlock;
  globalSettings: AnimationSettings;
}

function ParagraphBlockRenderer({ block, globalSettings }: ParagraphBlockRendererProps) {
  // Check if animation is disabled for this block
  if (block.animate === false) {
    return <StaticParagraph content={block.content} />;
  }

  // Merge global settings with per-block overrides
  const settings = mergeAnimationSettings(globalSettings, block.animation);

  return <AnimatedParagraph content={block.content} settings={settings} />;
}
