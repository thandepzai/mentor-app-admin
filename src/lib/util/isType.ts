export function isUndefined(value: any) {
    return value !== undefined;
}

export function isString(value: any) {
    return Object.prototype.toString.call(value) === "[object String]";
}

export function isFunction(value: any) {
    return Object.prototype.toString.call(value) === "[object Function]";
}

export function isAsyncFunction(value: any) {
    return Object.prototype.toString.call(value) === "[object AsyncFunction]";
}

const pattern =
    "^(https?:\\/\\/)?" + // protocol
    "((([a-zA-Z\\d]([a-zA-Z\\d-]{0,61}[a-zA-Z\\d])*\\.)+" + // sub-domain + domain name
    "[a-zA-Z]{2,13})" + // extension
    "|((\\d{1,3}\\.){3}\\d{1,3})" + // OR ip (v4) address
    "|localhost)" + // OR localhost
    "(\\:\\d{1,5})?" + // port
    "(\\/[a-zA-Z\\&\\d%_.~+-:@]*)*" + // path
    "(\\?[a-zA-Z\\&\\d%_.,~+-:@=;&]*)?" + // query string
    "(\\#[-a-zA-Z&\\d_]*)?$"; // fragment locator

const regex = new RegExp(pattern);

export const isUrl = (string: any) => {
    return regex.test(string);
};
