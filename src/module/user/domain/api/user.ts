import { Pagination } from "module/_core/infras/config/type/pagination";
import { UserEndpoint } from "../../infras/config/endpointUrl";
import { CreateUserDTO, GetOneUserDTO, GetUsersDTO, UpdateOneUserDTO, UserDTO, UserFilterDTO } from "../dto/user";
import { IUser } from "../model/user";
import { requester } from "@module/_core/infras/config/request";

export class UserApi {
    static async getUsers(filter: UserFilterDTO) {
        return await requester.call<{ pagination: Pagination; users: IUser[] }>({
            handleData: (data: GetUsersDTO) => {
                return data.data;
            }
        })(UserEndpoint.getUsers(filter));
    }

    static async getOneUser(userId: number) {
        return requester.call<IUser>({
            handleData: (data: GetOneUserDTO) => {
                return data.data.user;
            }
        })(UserEndpoint.getOneUser(userId));
    }

    static async createUser(createUserDTO: CreateUserDTO, avatarImage?: File) {
        const formData = new FormData();

        formData.append("data", JSON.stringify(createUserDTO));

        if (avatarImage) formData.append("avatarImage", avatarImage);

        return requester.call<UserDTO>({
            requestFunc: () =>
                requester.mapServerAxios.post(UserEndpoint.createUser(), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                    // onUploadProgress: (progressEvent) => {
                    //     const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    // },
                }),
            handleData: (data) => data.data.user
        })();
    }

    static async updateOneUser(userId: number, updateOneUserDTO: UpdateOneUserDTO, avatarImage?: File) {
        const formData = new FormData();

        formData.append("data", JSON.stringify(updateOneUserDTO));

        if (avatarImage) formData.append("avatarImage", avatarImage);

        return await requester.call<UserDTO>({
            requestFunc: () =>
                requester.mapServerAxios.put(UserEndpoint.updateOneUser(userId), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                    // onUploadProgress: (progressEvent) => {
                    //     const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    // },
                })
        })();
    }

    static async deleteOneUser(userId: number) {
        return requester.call<boolean>({
            requestFunc: () => requester.mapServerAxios.delete(UserEndpoint.deleteOneUser(userId)),
            handleData: () => true
        })();
    }
}
