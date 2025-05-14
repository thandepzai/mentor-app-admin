import { compareArray } from "./array";
import { compareObj } from "./object";

export const compareValue = (val1: any, val2: any): boolean => {
    if (Object.prototype.toString.call(val1) !== Object.prototype.toString.call(val2)) return false;

    if (Array.isArray(val1)) {
        if (compareArray(val1, val2)) return true;
        else return false;
    } else if (Object.prototype.toString.call(val1) === "[object Object]") {
        if (compareObj(val1, val2)) return true;
        else return false;
    } else {
        if (val1 === val2) return true;
        else return false;
    }
};
