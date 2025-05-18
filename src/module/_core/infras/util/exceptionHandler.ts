import Exception from "lib/exception/Exception";
import { displayErrorNoti } from "./notification";

export const errorHandler = (error: unknown) => {
    if (error instanceof Exception) {
        // Auth already handle in axios
        if (error.code >= 4010 && error.code <= 4019) return true;
        // Check lỗi 403, không có quyền truy cập api
        if (error.code == 403) {
            displayErrorNoti({
                message: "Từ chối hành động",
                description: "Bạn không có đủ quyền thực hiện hành động này, vui lòng liên hệ admin !"
            });
        }
        // Check lỗi 4000, hiển thị message từ server
        else if (error.code == 4000) {
            displayErrorNoti({
                message: "Đã xảy ra lỗi",
                description: error.message
            });
        } else if (false) {
            // Check các lỗi đặc biệt
            // TODO
        } else {
            // Hiển thị lỗi Exception mặc định
            displayErrorNoti({
                message: "Đã xảy ra lỗi",
                description: "Việc này có thể là do lỗi kỹ thuật và chúng tôi đang khắc phục rồi !"
            });
        }

        //
    } else {
        // Check các lỗi tiềm ẩn không được handle trong app
        displayErrorNoti({
            message: "Đã xảy ra lỗi",
            description: "Việc này có thể là do lỗi kỹ thuật và chúng tôi đang khắc phục rồi !"
        });
    }

    return true;
};
