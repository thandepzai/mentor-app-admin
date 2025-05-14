import { MutableRefObject } from "react";

export const scrollIntoView = (
    ref: MutableRefObject<HTMLElement>,
    { behavior = "smooth", block = "start", inline = "nearest" }: ScrollIntoViewOptions
): void => {
    ref.current?.scrollIntoView({
        behavior,
        block,
        inline
    });
};
