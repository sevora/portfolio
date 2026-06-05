import { useHasMoreScrollBelow } from '../hooks/useHasMoreScrollBelow';

interface PageScrollIndicatorProps {
    label?: string;
}

/**
 * A floating indicator pinned to the viewport, shown when the page
 * has more content below the current scroll position.
 */
function PageScrollIndicator({ label = 'Scroll Down For More' }: PageScrollIndicatorProps) {
    const hasMoreContentBelow = useHasMoreScrollBelow();

    return (
        <div aria-hidden className={`fixed bottom-4 right-4 z-50 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] tracking-wide uppercase transition-opacity duration-300 ${hasMoreContentBelow ? 'opacity-100' : 'opacity-0'}`}>
            <span>{label}</span>
        </div>
    );
}

export default PageScrollIndicator;
