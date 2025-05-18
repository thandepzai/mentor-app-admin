import strings from "module/_core/infras/constant/strings";
import { notification } from "antd";

interface NotificationProps {
    description?: string;
    message?: string;
    duration?: number;
}

export const displaySuccessNoti = ({
    description = "Thành công!",
    message = strings.success,
    duration = 4
}: NotificationProps) => {
    notification.success({
        message,
        description,
        duration
    });
};

export const displayErrorNoti = ({
    description = "Có lỗi xảy ra.",
    message = strings.error,
    duration = 4
}: NotificationProps) => {
    notification.error({
        message,
        description,
        duration
    });
};

export const displayWarningNoti = ({
    description = "Cảnh báo!",
    message = strings.warning,
    duration = 4
}: NotificationProps) => {
    notification.warning({
        message,
        description,
        duration
    });
};
