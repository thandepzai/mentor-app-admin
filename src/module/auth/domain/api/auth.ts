import { UserDTO } from "module/user/domain/dto/user";
import { AuthEndpoint } from "../../infras/config/endpointUrl";
import { LoginDTO } from "../dto/auth";
import { requester } from "module/_core/infras/config/request";

export class AuthApi {
    static async login(loginDto: LoginDTO) {
        return requester.call<{
            user: UserDTO;
            accessToken: string;
        }>({
            requestFunc: () =>
                requester.mapServerAxios.post(AuthEndpoint.login(), loginDto, {
                    withCredentials: true
                }),
            handleData: (data) => data.data
        })();
    }

    static async logout() {
        return requester.call({
            requestFunc: () =>
                requester.mapServerAxios.get(AuthEndpoint.logout(), {
                    withCredentials: true
                })
        })();
    }
}
