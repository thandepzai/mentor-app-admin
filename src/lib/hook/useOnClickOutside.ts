import { MutableRefObject, useEffect } from "react";

export const useOnClickOutside = (
    ref: MutableRefObject<HTMLElement>,
    handler: (evt: MouseEvent | TouchEvent) => any
) => {
    useEffect(() => {
        const listener = (evt: MouseEvent | TouchEvent) => {
            if (!ref.current || !(evt.target instanceof Node) || ref.current.contains(evt.target)) {
                return;
            }

            handler(evt);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchend", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchend", listener);
        };
        // Add ref and handler to effect dependencies
        // It's worth noting that because passed in handler is a new ...
        // ... function on every render that will cause this effect ...
        // ... callback/cleanup to run every render. It's not a big deal ...
        // ... but to optimize you can wrap handler in useCallback before ...
        // ... passing it into this hook.
    }, [ref, handler]);
};
