type ElementSize = Pick<DOMRectReadOnly, "width" | "height">;

type ElementOffset = Pick<DOMRectReadOnly, "left" | "top">;

export const getBoundingClientRect = (element: HTMLElement): DOMRectReadOnly => {
    return element.getBoundingClientRect();
};

// Return width and height of an element
export const getSize = (element: HTMLElement): ElementSize => {
    const rect = element.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height
    };
};

// Return left and top position of an element
export const getOffset = (element: HTMLElement): ElementOffset => {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top
    };
};
