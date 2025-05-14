import { compareValue } from ".";

export const compareObj = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

    for (const key of Object.keys(obj1)) {
        if (compareValue(obj1[key], obj2[key])) continue;
        else return false;
    }

    return true;
};

export const deeplyCloneObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
