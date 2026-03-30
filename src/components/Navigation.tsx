import { useState, useEffect, useRef } from 'react';
import type { ContentData, HeaderBlock, ParagraphBlock } from '../types/content';
import { slugify } from '../utils/slugify';

interface NavigationProps {
  data: ContentData;
}

interface NavItem {
  level: 2 | 3;
  content: string;
  id: string;
}

export function Navigation({ data }: NavigationProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const lastScrollY = useRef(0);

  // Calculate delay based on first visible animated block
  useEffect(() => {
    const { settings, content } = data;
    const duration = settings.duration ?? 800;
    const staggerDelay = settings.staggerDelay ?? 40;

    // Find first animated text block to estimate when animations finish
    const firstAnimatedBlock = content.find(
      (block): block is HeaderBlock | ParagraphBlock =>
        (block.type === 'header' || block.type === 'paragraph') && 
        block.animate !== false
    );

    if (firstAnimatedBlock) {
      const wordCount = firstAnimatedBlock.content.split(/\s+/).length;
      const totalAnimationTime = duration + (wordCount * staggerDelay);
      
      const timer = setTimeout(() => {
        setIsReady(true);
      }, totalAnimationTime + 200); // +200ms buffer

      return () => clearTimeout(timer);
    } else {
      // No animated blocks, show immediately
      setIsReady(true);
    }
  }, [data]);

  // Extract h2 and h3 headers from content
  const navItems: NavItem[] = data.content
    .filter((block): block is HeaderBlock => 
      block.type === 'header' && (block.level === 2 || block.level === 3)
    )
    .map((block) => ({
      level: block.level as 2 | 3,
      content: block.content,
      id: slugify(block.content),
    }));

  // Track active section on scroll and collapse on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Collapse menu on scroll
      if (Math.abs(window.scrollY - lastScrollY.current) > 50) {
        setIsOpen(false);
        lastScrollY.current = window.scrollY;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (navItems.length === 0) return null;

  // Find active item for collapsed display
  const activeItem = navItems.find((item) => item.id === activeId);

  return (
    <div 
      className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none transition-opacity duration-500"
      style={{ opacity: isReady ? 1 : 0 }}
    >
      <nav 
        className="pointer-events-auto" 
        style={{ fontFamily: "'Merriweather', serif" }}
      >
      {/* Collapsed state - floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2
          bg-stone-100/95 backdrop-blur-sm 
          border border-stone-300 rounded-full
          shadow-sm hover:shadow-md
          transition-all duration-200 cursor-pointer
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
      >
        <span className="text-sm text-stone-600 max-w-32 truncate">
          {activeItem?.content || 'Menu'}
        </span>
        <svg 
          className="w-4 h-4 text-stone-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Expanded state - vertical menu */}
      <div
        className={`
          absolute top-0
          bg-stone-100/95 backdrop-blur-sm 
          border border-stone-300 rounded-2xl
          shadow-lg overflow-hidden
          transition-all duration-300 ease-out
          ${isOpen 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 pointer-events-none'
          }
        `}
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        {/* Close button */}
        <div className="flex justify-end p-2 border-b border-stone-200">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <ul className="py-2 px-2 min-w-48 max-h-80 overflow-y-auto">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg
                  transition-colors duration-150 cursor-pointer
                  ${item.level === 3 ? 'pl-6 text-sm' : 'text-base'}
                  ${activeId === item.id 
                    ? 'bg-stone-200 text-stone-900 font-medium' 
                    : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-800'
                  }
                `}
              >
                {item.content}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
    </div>
  );
}
