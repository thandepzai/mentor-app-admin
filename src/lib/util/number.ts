// tranform a value to Integer
export const Int = (value: any) => {
    if (Number.isInteger(value)) return value;
    // const intValue = parseInt(String(value));
    // if (intValue != Number(value)) {
    //     throw new Exe(400, "Cast to Int fail !");
    // }
    return Math.round(Float(value));
};

// tranform a value to Float
export const Float = (value: any) => {
    const floatValue = parseFloat(value);
    // if (floatValue != Number(value)) {
    //     throw new HttpException(400, "Cast to Float fail !");
    // }
    return floatValue;
};

// Tranform a value to string with format xxx,yyy,zzz. Character determine which charater is used in format
// For example numberWithCommas("81928323", ",") => 8,192,323
export function numberWithCommas(x: any, character = ".") {
    return Int(x)
        ?.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, character);
}

// round a number
export function round(x: number) {
    return Math.round(x);
}

// round2(100,123) = 100,12
// round2(28,31911) = 28,32
export function round2(x: number) {
    return Math.round(x * 100) / 100;
}
