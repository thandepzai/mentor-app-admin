import { useLayoutEffect, useRef } from "react";

/*
Disable scrollbar
*/

export const useLockBodyScroll = (isLock = false, timeoutHideScrollBar = 0) => {
    // Get original body overflow
    const originalStyle = useRef<any>(null);

    useLayoutEffect(() => {
        if (originalStyle.current === null) {
            originalStyle.current = window.getComputedStyle(document.body);
        }

        const { overflowY, marginRight } = originalStyle.current;

        const bodyStyleOverflowY = document.body.style.overflowY;

        if (isLock && bodyStyleOverflowY != "hidden") {
            // Prevent scrolling on mount
            setTimeout(() => {
                const scrollBarWidth = window.innerWidth - document.body.clientWidth + "px";
                document.body.style.cssText = `margin-right: ${scrollBarWidth}; overflow-y: hidden`;
            }, timeoutHideScrollBar);
        }

        if (!isLock && bodyStyleOverflowY != overflowY) {
            document.body.style.overflowY = overflowY;
            document.body.style.marginRight = marginRight;
        }

        // Re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflowY = overflowY;
            document.body.style.marginRight = marginRight;
        };
    }, [isLock]);
};
