type OS = "Mac OS" | "iOS" | "Windows" | "Android" | "Linux" | "Unknown" | undefined;

export const detectOS = (): OS => {
    if (typeof navigator === "undefined") return undefined;

    const userAgent = navigator.userAgent,
        platform = navigator?.userAgentData?.platform || navigator.platform,
        macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
        windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
        iosPlatforms = ["iPhone", "iPad", "iPod"];

    if (macosPlatforms.indexOf(platform) !== -1) {
        return "Mac OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        return "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        return "Windows";
    } else if (/Android/.test(userAgent)) {
        return "Android";
    } else if (/Linux/.test(platform)) {
        return "Linux";
    } else {
        return "Unknown";
    }
};

type Brower = "Chrome" | "Firefox" | "Safari" | "Opera" | "Edge" | "Android" | "iPhone" | "Unknown" | undefined;

export const detectBrowser = (): Brower => {
    if (typeof navigator === "undefined") return undefined;

    const userAgent = navigator.userAgent;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        return "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        return "Firefox";
    } else if (userAgent.match(/safari/i)) {
        return "Safari";
    } else if (userAgent.match(/opr\//i)) {
        return "Opera";
    } else if (userAgent.match(/edg/i)) {
        return "Edge";
    } else if (userAgent.match(/android/i)) {
        return "Android";
    } else if (userAgent.match(/iphone/i)) {
        return "iPhone";
    } else {
        return "Unknown";
    }
};
