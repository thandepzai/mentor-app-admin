import { useRef } from "react";

// Function run only once before first time component mount

export const useWillMountEffect = (func: () => void) => {
    const willMount = useRef(true);

    if (willMount.current) func();

    willMount.current = false;
};
