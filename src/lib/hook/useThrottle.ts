import { throttle } from "lib/util/functions";
import { useRef } from "react";

export const useThrottle = () => {
    const throttleRef = useRef(null);

    return (callback: () => void, delay: number) => throttle(throttleRef, callback, delay);
};

/*
Example use:

const throttle = useThrottle

<ScrollView onScroll={() => throttle(() => {do something}, 100)}/>

It trigger scroll event each 100ms time
*/
