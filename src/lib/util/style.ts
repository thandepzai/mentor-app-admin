export const getVarStyle = (varName: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName);
};
