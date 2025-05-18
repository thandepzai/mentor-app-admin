import { UserFilterDTO } from "module/user/domain/dto/user";
import { MentorAppEndpoint } from "module/_core/infras/config/endpointUrl/mentorApp";
import { CoursesOfUserFilterDTO } from "@module/user/domain/dto/courseOfUser";
import { UserAvatarTemplateFilterDTO } from "@module/user/domain/dto/userAvatarTemplate";

export class UserEndpoint extends MentorAppEndpoint {
    static getUsers = (filter: UserFilterDTO) => `${this.baseAdmin}/v1/user?${this.extractQuery(filter)}`;
    static createUser = () => `${this.baseAdmin}/v1/user`;
    static getOneUser = (userId: number) => `${this.baseAdmin}/v1/user/${userId}`;
    static updateOneUser = (userId: number) => `${this.baseAdmin}/v1/user/${userId}`;
    static deleteOneUser = (userId: number) => `${this.baseAdmin}/v1/user/${userId}`;

    // Courses of user
    static getCoursesOfUser = (userId: number, filter: CoursesOfUserFilterDTO) =>
        `${this.baseAdmin}/v1/enroll/courses-of-user/${userId}?${this.extractQuery(filter)}`;
    static addCoursesToUser = (userId: number) => `${this.baseAdmin}/v1/enroll/${userId}/course/add-to-user`;
    static deleteCoursesOfUser = (userId: number) => `${this.baseAdmin}/v1/enroll/${userId}/course/remove-from-user`;

    // UserAvatarTemplate
    static getUserAvatarTemplates = (filter: UserAvatarTemplateFilterDTO) =>
        `${this.baseAdmin}/v1/user-avatar-template?${this.extractQuery(filter)}`;
    static createUserAvatarTemplate = () => `${this.baseAdmin}/v1/user-avatar-template`;
    static getOneUserAvatarTemplate = (avatarId: number) => `${this.baseAdmin}/v1/user-avatar-template/${avatarId}`;
    static updateUserAvatarTemplate = (avatarId: number) => `${this.baseAdmin}/v1/user-avatar-template/${avatarId}`;
    static deleteUserAvatarTemplate = (avatarId: number) => `${this.baseAdmin}/v1/user-avatar-template/${avatarId}`;
}
