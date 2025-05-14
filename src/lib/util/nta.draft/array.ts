import { compareValue } from ".";
import { generateRandomInt } from "./number";

// Return a copy instance of an array.
export const copyArray = <T>(arr: T[]): T[] => arr.slice();

// Generate an array of int from 0 to ${range - 1}.
export const intArray = (range: number): number[] => Array.from(Array(range).keys());

// Compare 2 array with correct order.
export const compareArray = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (compareValue(arr1[i], arr2[i])) continue;
        else return false;
    }

    return true;
};

// Compare 2 array with any order.
export const compareArrayNoOrder = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length !== arr2.length) return false;

    const t1 = copyArray(arr1);
    const t2 = copyArray(arr2);

    while (t1.length > 0) {
        let isIncluded = false;

        for (let i = 0; i < t2.length; i++) {
            if (compareValue(t1[0], t2[i])) {
                t1.splice(0, 1);
                t2.splice(i, 1);
                isIncluded = true;
                break;
            }
        }

        if (!isIncluded) return false;
    }

    return true;
};

// Return a shuffled array of an array.
export const shuffleArray = <T>(arr: T[]): T[] => {
    const result = copyArray(arr);

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }

    return result;
};

// Return an array of ${amount} random elements from the input array.
export const pickRandomFromArray = <T>(arr: T[], amount: number): T[] => {
    const result: T[] = [];
    const arr1 = copyArray(arr);

    while (amount > 0) {
        const randomElement = arr1[generateRandomInt(arr1.length)];
        arr1.splice(arr1.indexOf(randomElement), 1);

        result.push(randomElement);

        amount--;
    }

    return result;
};
