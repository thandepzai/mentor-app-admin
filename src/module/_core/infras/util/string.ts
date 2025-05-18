type ConvertStringFunc = (s: string) => string;

// capitalizeFirstLetter("word"); --> Word
export const capitalizeFirstLetter: ConvertStringFunc = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

export const removeSpecialCharacters: ConvertStringFunc = (str = "") => str.replace(/[^\w ]+/g, "");

// Remove Vietnamese accents in string
export const removeAccents: ConvertStringFunc = (str = "") => {
    const AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ",
        "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];

    for (let i = 0; i < AccentsMap.length; i++) {
        const re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
        const char = AccentsMap[i][0];
        str = str.replace(re, char);
    }

    return str;
};

// convertToFileName("File Name !"); --> file_name
export const convertToFileName: ConvertStringFunc = (str = "") =>
    removeAccents(removeSpecialCharacters(str)).trim().replace(/ +/g, "_").toLowerCase();

// convertToSlug("String to convert.!?,") --> string-to-convert
export const convertToSlug: ConvertStringFunc = (str = "") =>
    removeAccents(removeSpecialCharacters(str)).trim().replace(/ +/g, "-").toLowerCase();

// customRemoveCharacter("string", "?!.,");
// customRemoveCharacter("string", ["string", "to", "remove"]);
export const customRemoveCharacter = (str = "", searchValue: string | string[]): string => {
    let result = str;

    if (typeof searchValue === "string") {
        const valueList = searchValue.split("");

        valueList.forEach((ele) => {
            result = result.replaceAll(ele, "");
        });
    } else if (Array.isArray(searchValue)) {
        searchValue.forEach((ele) => {
            result = result.replaceAll(ele, "");
        });
    }

    return result;
};

// 5 --> 05
export const convertToTwoDigit = (number: number): string => {
    return number.toLocaleString("en-US", {
        minimumIntegerDigits: 2
    });
};
