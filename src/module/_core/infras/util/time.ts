export const getRelativeTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const difference = Math.floor(Date.now() / 1000) - Math.floor(date.getTime() / 1000);
    let output = ``;

    if (difference <= 0) {
        output = `Vừa xong`;
    } else if (difference < 60) {
        // Less than a minute has passed:
        output = `${difference} giây trước`;
    } else if (difference < 3600) {
        // Less than an hour has passed:
        output = `${Math.floor(difference / 60)} phút trước`;
    } else if (difference < 86400) {
        // Less than a day has passed:
        output = `${Math.floor(difference / 3600)} giờ trước`;
    } else if (difference < 2620800) {
        // Less than a month has passed:
        output = `${Math.floor(difference / 86400)} ngày trước`;
    } else if (difference < 31449600) {
        // Less than a year has passed:
        output = `${Math.floor(difference / 2620800)} tháng trước`;
    } else {
        // More than a year has passed:
        output = `${Math.floor(difference / 31449600)} năm trước`;
    }

    return output;
};
