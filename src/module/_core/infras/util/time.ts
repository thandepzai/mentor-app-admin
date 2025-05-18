import { convertToTwoDigit } from "./string";

export const formatTableTimeString = (timestamp?: string) => {
    return timestamp ? formatTimeString(timestamp, "H:M DD-MM-YYYY") : "";
};

export const formatTimeString = (timestamp: string | number | Date, form?: string): string => {
    const dateObject = new Date(timestamp);

    if (form === undefined) return dateObject.toLocaleString();

    let result = form;

    // const formatObject = {
    //     DD: convertToTwoDigit(dateObject.getDate()),
    //     MM: convertToTwoDigit(dateObject.getMonth() + 1),
    //     YYYY: dateObject.getFullYear()
    //     H: dateObject.getHours(),
    //     M: convertToTwoDigit(dateObject.getMinutes()),
    //     S: convertToTwoDigit(dateObject.getSeconds()),
    // };

    // for (const [key, value] of Object.entries(formatObject)) {
    //     result = result.replace(key, value.toString());
    // }

    if (result.includes("DD")) {
        result = result.replace("DD", convertToTwoDigit(dateObject.getDate()));
    }
    if (result.includes("MM")) {
        result = result.replace("MM", convertToTwoDigit(dateObject.getMonth() + 1));
    }
    if (result.includes("YYYY")) {
        result = result.replace("YYYY", dateObject.getFullYear().toString());
    }
    if (result.includes("H")) {
        result = result.replace("H", convertToTwoDigit(dateObject.getHours()));
    }
    if (result.includes("M")) {
        result = result.replace("M", convertToTwoDigit(dateObject.getMinutes()));
    }
    if (result.includes("S")) {
        result = result.replace("S", convertToTwoDigit(dateObject.getSeconds()));
    }

    return result;
};
