import { requester } from "@module/_core/infras/config/request";
import {
    CourseOfUserDTO,
    CoursesOfUserFilterDTO,
    GetCoursesOfUserDTO,
    RemoveCoursesOfUserDTO,
    AddCoursesToUserDTO
} from "../dto/courseOfUser";
import { UserEndpoint } from "@module/user/infras/config/endpointUrl";

export class CourseOfUserApi {
    static async getCoursesOfUser(userID: number, filter: CoursesOfUserFilterDTO) {
        return await requester.call<{ courses: CourseOfUserDTO[] }>({
            handleData: (data: GetCoursesOfUserDTO) => data.data
        })(UserEndpoint.getCoursesOfUser(userID, filter));
    }

    static async addCoursesToUser({ userId, body }: { userId: number; body: AddCoursesToUserDTO }) {
        return requester.call({
            requestFunc: () => requester.mapServerAxios.put(UserEndpoint.addCoursesToUser(userId), body),
            boundedTime: 500
        })();
    }

    static async removeCoursesOfUser({ userId, body }: { userId: number; body: RemoveCoursesOfUserDTO }) {
        return requester.call<boolean>({
            requestFunc: () => requester.mapServerAxios.put(UserEndpoint.deleteCoursesOfUser(userId), body),
            boundedTime: 300
        })();
    }
}
