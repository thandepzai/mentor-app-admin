import { Pagination } from "module/_core/infras/config/type/pagination";
import { UserEndpoint } from "../../infras/config/endpointUrl";
import {
    CreateUserAvatarTemplateDTO,
    GetOneUserAvatarTemplateDTO,
    GetUserAvatarTemplatesDTO,
    UpdateUserAvatarTemplateDTO,
    UserAvatarTemplateDTO,
    UserAvatarTemplateFilterDTO
} from "../dto/userAvatarTemplate";
import { requester } from "@module/_core/infras/config/request";

export class UserAvatarTemplateApi {
    static async getUserAvatarTemplates(filter: UserAvatarTemplateFilterDTO) {
        return await requester.call<{ pagination: Pagination; userAvatarTemplateList: UserAvatarTemplateDTO[] }>({
            handleData: (data: GetUserAvatarTemplatesDTO) => {
                return data.data;
            }
        })(UserEndpoint.getUserAvatarTemplates(filter));
    }

    static async getOneUserAvatarTemplate(avatarId: number) {
        return requester.call<UserAvatarTemplateDTO>({
            handleData: (data: GetOneUserAvatarTemplateDTO) => {
                return data.data.avatar;
            }
        })(UserEndpoint.getOneUserAvatarTemplate(avatarId));
    }

    static async createUserAvatarTemplate(createUserAvatarTemplateDTO: CreateUserAvatarTemplateDTO, template?: File) {
        const formData = new FormData();

        formData.append("data", JSON.stringify(createUserAvatarTemplateDTO));

        if (template) formData.append("template", template);

        return requester.call<UserAvatarTemplateDTO>({
            requestFunc: () =>
                requester.mapServerAxios.post(UserEndpoint.createUserAvatarTemplate(), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }),
            handleData: (data) => data.data.avatar
        })();
    }

    static async updateUserAvatarTemplate(
        avatarId: number,
        updateUserAvatarTemplateDTO: UpdateUserAvatarTemplateDTO,
        template?: File
    ) {
        const formData = new FormData();

        formData.append("data", JSON.stringify(updateUserAvatarTemplateDTO));

        if (template) formData.append("template", template);

        return await requester.call<UserAvatarTemplateDTO>({
            requestFunc: () =>
                requester.mapServerAxios.put(UserEndpoint.updateUserAvatarTemplate(avatarId), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
        })();
    }

    static async deleteUserAvatarTemplate(avatarId: number) {
        return requester.call<boolean>({
            requestFunc: () => requester.mapServerAxios.delete(UserEndpoint.deleteUserAvatarTemplate(avatarId)),
            handleData: () => true
        })();
    }
}
