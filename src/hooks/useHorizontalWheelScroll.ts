import { useEffect, useRef } from 'react';

export function useHorizontalWheelScroll<T extends HTMLElement>(mediaQuery?: string) {
    const reference = useRef<T>(null);
    useEffect(() => {
        const element = reference.current;
        if (!element) return;

        const mq = mediaQuery ? window.matchMedia(mediaQuery) : null;
        let detach: (() => void) | null = null;

        const attach = () => {
            let target = element.scrollLeft;
            let raf: number | null = null;

            const tick = () => {
                const difference = target - element.scrollLeft;
                if (Math.abs(difference) < 0.5) {
                    element.scrollLeft = target;
                    raf = null;
                    return;
                }
                element.scrollLeft += difference * 0.18;
                raf = requestAnimationFrame(tick);
            };

            const onWheel = (event: WheelEvent) => {
                if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
                const max = element.scrollWidth - element.clientWidth;
                if (max <= 0) return;
                if (raf === null) target = element.scrollLeft;
                const next = Math.max(0, Math.min(max, target + event.deltaY));
                if (next === target) return;
                event.preventDefault();
                target = next;
                if (raf === null) raf = requestAnimationFrame(tick);
            };

            const onPointerDown = () => {
                if (raf !== null) {
                    cancelAnimationFrame(raf);
                    raf = null;
                }
                target = element.scrollLeft;
            };

            element.addEventListener('wheel', onWheel, { passive: false });
            element.addEventListener('pointerdown', onPointerDown);
            element.addEventListener('touchstart', onPointerDown, { passive: true });

            return () => {
                element.removeEventListener('wheel', onWheel);
                element.removeEventListener('pointerdown', onPointerDown);
                element.removeEventListener('touchstart', onPointerDown);
                if (raf !== null) cancelAnimationFrame(raf);
            };
        };

        const sync = () => {
            detach?.();
            detach = !mq || mq.matches ? attach() : null;
        };

        sync();
        mq?.addEventListener('change', sync);

        return () => {
            detach?.();
            mq?.removeEventListener('change', sync);
        };
    }, [mediaQuery]);
    return reference;
}
