import { useEffect, useState } from 'react';

/**
 * Tracks whether the window has more content below the current scroll position.
 * Returns true while the user is more than `threshold` pixels away from the bottom.
 */
export function useHasMoreScrollBelow(threshold = 60): boolean {
    const [hasMoreContentBelow, setHasMoreContentBelow] = useState(false);

    useEffect(() => {
        const updateScrollIndicatorVisibility = () => {
            const remainingScrollDistance =
                document.documentElement.scrollHeight
                - window.innerHeight
                - window.scrollY;
            setHasMoreContentBelow(remainingScrollDistance > threshold);
        };

        window.addEventListener('scroll', updateScrollIndicatorVisibility, { passive: true });
        window.addEventListener('resize', updateScrollIndicatorVisibility);

        const documentResizeObserver = new ResizeObserver(updateScrollIndicatorVisibility);
        documentResizeObserver.observe(document.documentElement);

        updateScrollIndicatorVisibility();
        return () => {
            window.removeEventListener('scroll', updateScrollIndicatorVisibility);
            window.removeEventListener('resize', updateScrollIndicatorVisibility);
            documentResizeObserver.disconnect();
        };
    }, [threshold]);

    return hasMoreContentBelow;
}
